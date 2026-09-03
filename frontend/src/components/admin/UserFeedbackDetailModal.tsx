import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { closeDetailModal } from "../../redux/features/adminSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { AuthService } from "../../services/authService";
import { StorageService } from "../../services/storageService";
import type { FeedbackRecord, CmoUser } from "../../types/cmoTypes";
import { exportSingleRecordPDF } from "./exportUtils";

// 5 Fixed Questions in exact project order (§5)
const PROJECT_QUESTIONS = [
  {
    srNo: 1,
    category: "Medical Care & Doctors",
    text: "How was your Doctor Consultation Experience?",
    key: "doctor",
  },
  {
    srNo: 2,
    category: "Pharmacy Dispensary",
    text: "How was your Pharmacy / Medicine Counter Experience?",
    key: "pharmacy",
  },
  {
    srNo: 3,
    category: "Medicine Availability",
    text: "Were all your Prescribed Medicines available free of cost?",
    key: "medicineAvailability",
  },
  {
    srNo: 4,
    category: "Hospital Cleanliness",
    text: "How was the Cleanliness & Sanitation of the Facility?",
    key: "cleanliness",
  },
  {
    srNo: 5,
    category: "Feedback & Grievance",
    text: "Any Suggestions, Grievance or Additional Comments?",
    key: "suggestions",
  },
];

export const UserFeedbackDetailModal: React.FC = () => {
  const dispatch = useDispatch();
  const showDetailModal = useSelector(
    (state: RootState) => state.admin.showDetailModal,
  );
  const rawRecord = useSelector(
    (state: RootState) => state.admin.selectedRecord,
  );

  const currentCmo = AuthService.getActiveUser();
  const [record, setRecord] = useState<FeedbackRecord | null>(null);

  // Lightbox Modal state
  const [activeImagePreview, setActiveImagePreview] = useState<string | null>(
    null,
  );

  // Hover Popover Tooltip state for comments
  const [hoveredCommentKey, setHoveredCommentKey] = useState<string | null>(
    null,
  );

  // Nested Reply Modal State (Yellow Reply -> Green Replied)
  const [activeReplyQuestion, setActiveReplyQuestion] = useState<{
    key: string;
    text: string;
    comment: string;
  } | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyAudioRecorded, setReplyAudioRecorded] = useState(false);

  // Pop-up Reply Modal Voice Recording & Audio Player State
  const [isRecordingReplyAudio, setIsRecordingReplyAudio] = useState(false);
  const [replyAudioTimer, setReplyAudioTimer] = useState(0);
  const [hasReplyAudioRecorded, setHasReplyAudioRecorded] = useState(false);
  const [isPlayingReplyAudio, setIsPlayingReplyAudio] = useState(false);
  const [replyAudioRef, setReplyAudioRef] = useState<HTMLAudioElement | null>(
    null,
  );

  // Bottom Reply Composer State (Dual State Button: Escalate / Submit)
  const [composerText, setComposerText] = useState("");
  const [isRecordingComposerAudio, setIsRecordingComposerAudio] =
    useState(false);
  const [composerAudioTimer, setComposerAudioTimer] = useState(0);
  const [hasComposerRecordedAudio, setHasComposerRecordedAudio] =
    useState(false);
  const [isPlayingComposerAudio, setIsPlayingComposerAudio] = useState(false);
  const [composerAudioRef, setComposerAudioRef] =
    useState<HTMLAudioElement | null>(null);

  // Escalation Target State
  const [escalateTargetCmoId, setEscalateTargetCmoId] = useState("");

  // Revert Note State (for CMO_3 / SuperAdmin)
  const [revertNoteText, setRevertNoteText] = useState("");
  const [showRevertComposer, setShowRevertComposer] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Row audio playback state for question reply previews
  const [playingRowAudioKey, setPlayingRowAudioKey] = useState<string | null>(null);
  const [rowAudioRef, setRowAudioRef] = useState<HTMLAudioElement | null>(null);

  const togglePlayRowAudio = (key: string) => {
    if (playingRowAudioKey === key) {
      if (rowAudioRef) rowAudioRef.pause();
      setPlayingRowAudioKey(null);
    } else {
      if (rowAudioRef) rowAudioRef.pause();
      const sample = new Audio('https://actions.google.com/sounds/v1/speech/human_voice_sample.ogg');
      sample.play();
      setRowAudioRef(sample);
      setPlayingRowAudioKey(key);
      sample.onended = () => setPlayingRowAudioKey(null);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    if (rawRecord) {
      const latestFeedbacks = StorageService.getFeedbacks();
      const fresh =
        latestFeedbacks.find((f) => f.id === rawRecord.id) ||
        (rawRecord as any);
      setRecord(fresh);

      // Auto-set escalation target
      if (currentCmo) {
        const validUpper = AuthService.getValidUpperCmos(currentCmo);
        if (validUpper.length > 0) {
          setEscalateTargetCmoId(validUpper[0].id);
        }
      }
    }
  }, [rawRecord, showDetailModal]);

  // Recording timer simulator
  useEffect(() => {
    let interval: any;
    if (isRecordingComposerAudio) {
      interval = setInterval(() => {
        setComposerAudioTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecordingComposerAudio]);

  // Question Reply voice recording timer simulator
  useEffect(() => {
    let interval: any;
    if (isRecordingReplyAudio) {
      interval = setInterval(() => {
        setReplyAudioTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecordingReplyAudio]);

  const resetReplyModalAudioState = () => {
    if (replyAudioRef) {
      replyAudioRef.pause();
    }
    setIsRecordingReplyAudio(false);
    setReplyAudioTimer(0);
    setHasReplyAudioRecorded(false);
    setIsPlayingReplyAudio(false);
    setReplyAudioRef(null);
  };

  const resetComposerAudioState = () => {
    if (composerAudioRef) {
      composerAudioRef.pause();
    }
    setIsRecordingComposerAudio(false);
    setComposerAudioTimer(0);
    setHasComposerRecordedAudio(false);
    setIsPlayingComposerAudio(false);
    setComposerAudioRef(null);
  };

  if (!showDetailModal || !record) return null;

  // Rating cell helper
  const renderRatingCell = (qKey: string) => {
    let ratingVal: "Could Be Better" | "Acceptable" | "Excellent" | undefined;
    let commentVal: string = "";
    let audioUrlVal: string | null | undefined = null;
    let imageUrlVal: string | null | undefined = null;

    if (qKey === "doctor") {
      ratingVal = record.doctor?.rating;
      commentVal = record.doctor?.comments || "";
      audioUrlVal = record.doctor?.audioUrl;
      imageUrlVal = record.doctor?.imageUrl;
    } else if (qKey === "pharmacy") {
      ratingVal = record.pharmacy?.rating;
      commentVal = record.pharmacy?.comments || "";
      audioUrlVal = record.pharmacy?.audioUrl;
      imageUrlVal = record.pharmacy?.imageUrl;
    } else if (qKey === "cleanliness") {
      ratingVal = record.cleanliness?.rating;
      commentVal = record.cleanliness?.comments || "";
      audioUrlVal = record.cleanliness?.audioUrl;
      imageUrlVal = record.cleanliness?.imageUrl;
    } else if (qKey === "registration") {
      ratingVal = record.registration?.rating;
      commentVal = record.registration?.comments || "";
    } else if (qKey === "suggestions") {
      commentVal = record.suggestions?.text || "";
      audioUrlVal = record.suggestions?.audioUrl;
      imageUrlVal = record.suggestions?.imageUrl;
    } else if (qKey === "medicineAvailability") {
      ratingVal =
        record.pharmacy?.rating === "Could Be Better"
          ? "Could Be Better"
          : "Acceptable";
      commentVal = "Prescribed medicines provided at dispensary.";
    }

    return (
      <div className="space-y-2 relative">
        {/* Rating Badge */}
        {qKey === "suggestions" ? (
          <div className="flex items-center gap-1 text-amber-400 font-bold text-xs bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg w-fit">
            <span className="text-[10px] text-amber-300 uppercase font-semibold mr-1">5 Star Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon
                key={star}
                icon="ph:star-fill"
                className={`w-3.5 h-3.5 ${
                  star <= (record.overallStarRating || (record.overallRating === "Excellent" ? 5 : record.overallRating === "Acceptable" ? 4 : 2))
                    ? "text-amber-400"
                    : "text-slate-600"
                }`}
              />
            ))}
            <span className="ml-1 text-[11px] font-mono text-amber-300">
              ({record.overallStarRating || (record.overallRating === "Excellent" ? 5 : record.overallRating === "Acceptable" ? 4 : 2)}/5)
            </span>
          </div>
        ) : ratingVal ? (
          ratingVal === "Could Be Better" ? (
            <span className="px-2.5 py-1 rounded-full bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 text-xs font-bold inline-flex items-center gap-1">
              Could Be Better
            </span>
          ) : ratingVal === "Acceptable" ? (
            <span className="px-2.5 py-1 rounded-full bg-[#F5B700]/15 text-[#F5B700] border border-[#F5B700]/30 text-xs font-bold inline-flex items-center gap-1">
              Acceptable Standard
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 text-xs font-bold inline-flex items-center gap-1">
              Excellent Service
            </span>
          )
        ) : (
          <span className="text-[#9AA0AC] font-sans text-sm">–</span>
        )}

        {/* Text Comment (2 lines max with hover popover) */}
        {commentVal && (
          <div
            onMouseEnter={() => setHoveredCommentKey(qKey)}
            onMouseLeave={() => setHoveredCommentKey(null)}
            className="relative cursor-pointer"
          >
            <p className="text-xs text-[#F5F6FA] line-clamp-2 bg-[#20232B] border border-[#2A2E38] p-2 rounded-lg">
              "{commentVal}"
            </p>

            {/* Hover Tooltip Popover */}
            {hoveredCommentKey === qKey && (
              <div className="absolute left-0 bottom-full mb-2 w-72 p-3 bg-[#1A1D24] border border-[#5B8DEF] rounded-xl shadow-2xl z-30 pointer-events-none text-xs text-[#F5F6FA] space-y-1">
                <div className="font-bold text-[#5B8DEF] text-[11px] uppercase tracking-wider">
                  Full Feedback Comment
                </div>
                <div>"{commentVal}"</div>
              </div>
            )}
          </div>
        )}

        {/* Voice Note Inline Compact Player */}
        {audioUrlVal && (
          <div className="p-2 rounded-lg bg-[#20232B] border border-[#2A2E38] flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const audio = new Audio(audioUrlVal!);
                audio.play();
                showToast("Playing voice feedback audio sample...");
              }}
              className="w-7 h-7 rounded-full bg-[#5B8DEF] text-white flex items-center justify-center hover:bg-[#4A7CE4] transition cursor-pointer"
            >
              <Icon icon="ph:play-fill" className="w-3.5 h-3.5" />
            </button>
            <div className="flex-1">
              <div className="text-[10px] font-sans text-[#9AA0AC]">
                Patient Voice Recording
              </div>
              <div className="h-1 bg-[#2A2E38] rounded-full w-full mt-1 overflow-hidden">
                <div className="h-full bg-[#5B8DEF] w-2/3" />
              </div>
            </div>
            <span className="text-[10px] font-sans text-[#5B8DEF]">0:42</span>
          </div>
        )}

        {/* Uploaded Photo Preview Button */}
        {imageUrlVal && (
          <div>
            <button
              type="button"
              onClick={() => setActiveImagePreview(imageUrlVal!)}
              className="px-3 py-1 rounded-lg bg-[#20232B] hover:bg-[#2A2E38] text-[#5B8DEF] border border-[#5B8DEF]/30 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Icon icon="ph:image-bold" className="w-3.5 h-3.5" />
              <span>Preview Uploaded Photo</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  // Submit nested question reply (Yellow Reply -> Green Replied)
  const handleSaveQuestionReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !activeReplyQuestion ||
      (!replyText.trim() && !replyAudioRecorded && !hasReplyAudioRecorded)
    )
      return;

    const isVoice = replyAudioRecorded || hasReplyAudioRecorded;
    const replyItem = {
      questionKey: activeReplyQuestion.key,
      questionText: activeReplyQuestion.text,
      patientComment: activeReplyQuestion.comment,
      replyText: replyText.trim(),
      hasVoiceNote: isVoice,
      repliedBy: currentCmo?.name || "Assigned CMO",
      repliedByRole: currentCmo?.role || "CMO_1",
      repliedAt: new Date().toLocaleString("en-IN"),
    };

    const updated = StorageService.addReply(record.id, replyItem);
    if (updated) setRecord(updated);

    resetReplyModalAudioState();
    setActiveReplyQuestion(null);
    setReplyText("");
    setReplyAudioRecorded(false);
    showToast("Reply saved successfully!");
  };

  // Dual-State Button Handler: Escalate vs Submit
  const isComposerActive =
    composerText.trim().length > 0 || hasComposerRecordedAudio;

  const handleDualStateAction = () => {
    if (!currentCmo) return;

    if (isComposerActive) {
      // SUBMIT -> Mark Resolved
      const noteContent = hasComposerRecordedAudio
        ? `🎙️ Voice Resolution (${composerAudioTimer}s): ${composerText || "Directive audio recorded"}`
        : composerText;

      const updatedRecord: FeedbackRecord = {
        ...record,
        status: "Resolved",
        officerNotes: [
          ...(record.officerNotes || []),
          {
            date: new Date().toLocaleString("en-IN"),
            officer: currentCmo.name,
            note: `Resolved by ${currentCmo.role}: ${noteContent}`,
          },
        ],
      };

      StorageService.updateFeedback(updatedRecord);
      setRecord(updatedRecord);
      setComposerText("");
      resetComposerAudioState();
      showToast("Feedback marked as RESOLVED! Visible to upper CMOs.");
    } else {
      // ESCALATE -> Send to upper CMO
      if (!escalateTargetCmoId) {
        showToast("Please select a target CMO to escalate to.");
        return;
      }
      const updated = StorageService.escalateFeedback(
        record.id,
        escalateTargetCmoId,
        currentCmo,
        "Escalated due to facility level SLA bounds.",
      );
      if (updated) setRecord(updated);
      resetComposerAudioState();
      showToast("Feedback successfully ESCALATED to upper CMO!");
    }
  };

  // Revert action (CMO_3 / SuperAdmin)
  const handleRevertAction = () => {
    if (!currentCmo) return;
    if (!revertNoteText.trim()) {
      showToast(
        "Please enter a note describing why the ticket is being reverted.",
      );
      return;
    }

    const updated = StorageService.revertFeedback(
      record.id,
      currentCmo,
      revertNoteText,
    );
    if (updated) setRecord(updated);
    setShowRevertComposer(false);
    setRevertNoteText("");
    showToast("Feedback successfully REVERTED back to CMO_1!");
  };

  // Close ticket permanently action (CMO_3 / SuperAdmin only)
  const handleCloseTicketAction = () => {
    if (!currentCmo) return;
    const updated = StorageService.closeFeedback(
      record.id,
      currentCmo,
      "Permanently closed after verifying resolution.",
    );
    if (updated) setRecord(updated);
    showToast("Ticket PERMANENTLY CLOSED!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImagePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4"
          >
            <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-[#2A2E38] bg-[#1A1D24]">
              <button
                type="button"
                onClick={() => setActiveImagePreview(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition cursor-pointer z-10"
              >
                <Icon icon="ph:x-bold" className="w-5 h-5" />
              </button>
              <img
                src={activeImagePreview}
                alt="Uploaded Evidence"
                className="w-full h-full object-contain max-h-[85vh]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dedicated Reply to Question Pop-up Modal */}
      <AnimatePresence>
        {activeReplyQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#1A1D24] border border-[#F5B700]/50 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#2A2E38] pb-3">
                <h4 className="font-bold text-[#F5B700] text-xs uppercase tracking-wider flex items-center gap-2">
                  <Icon icon="ph:arrow-bend-up-left-bold" className="w-4 h-4" />
                  <span>Reply to Question: {activeReplyQuestion.text}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    resetReplyModalAudioState();
                    setActiveReplyQuestion(null);
                  }}
                  className="p-1 rounded-lg bg-[#20232B] hover:bg-[#2A2E38] text-[#9AA0AC] hover:text-white transition cursor-pointer"
                >
                  <Icon icon="ph:x-bold" className="w-4 h-4" />
                </button>
              </div>

              {activeReplyQuestion.comment && (
                <div className="p-3 rounded-xl bg-[#20232B] border border-[#2A2E38] text-xs text-[#9AA0AC]">
                  <span className="text-[10px] font-bold text-[#5B8DEF] uppercase block mb-1">
                    Patient Feedback Comment
                  </span>
                  "{activeReplyQuestion.comment}"
                </div>
              )}

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your official CMO reply or directive here..."
                rows={4}
                className="w-full bg-[#20232B] border border-[#2A2E38] rounded-xl p-3.5 text-xs text-[#F5F6FA] focus:outline-none focus:border-[#F5B700] resize-none"
              />

              {/* Soundwaves Voice Recording & Playback Preview Panel */}
              {isRecordingReplyAudio ? (
                <div className="p-3.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/40 flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#EF4444] animate-ping" />
                    <span className="text-xs font-bold text-[#EF4444]">
                      Recording Voice Reply...
                    </span>

                    {/* Soundwaves equalizer animation */}
                    <div className="flex items-center gap-1 h-5">
                      <span
                        className="w-1 bg-[#EF4444] rounded-full animate-bounce [animation-delay:0.1s]"
                        style={{ height: "60%" }}
                      />
                      <span
                        className="w-1 bg-[#EF4444] rounded-full animate-bounce [animation-delay:0.3s]"
                        style={{ height: "100%" }}
                      />
                      <span
                        className="w-1 bg-[#EF4444] rounded-full animate-bounce [animation-delay:0.2s]"
                        style={{ height: "40%" }}
                      />
                      <span
                        className="w-1 bg-[#EF4444] rounded-full animate-bounce [animation-delay:0.4s]"
                        style={{ height: "80%" }}
                      />
                      <span
                        className="w-1 bg-[#EF4444] rounded-full animate-bounce [animation-delay:0.1s]"
                        style={{ height: "50%" }}
                      />
                      <span
                        className="w-1 bg-[#EF4444] rounded-full animate-bounce [animation-delay:0.3s]"
                        style={{ height: "90%" }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-sans text-xs font-bold text-white bg-black/40 px-2.5 py-1 rounded-md border border-[#EF4444]/30">
                      00:{replyAudioTimer.toString().padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsRecordingReplyAudio(false);
                        setHasReplyAudioRecorded(true);
                        setReplyAudioRecorded(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-md"
                    >
                      <Icon icon="ph:square-fill" className="w-3 h-3" />
                      <span>Stop Recording</span>
                    </button>
                  </div>
                </div>
              ) : hasReplyAudioRecorded ? (
                <div className="p-3.5 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/40 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (!isPlayingReplyAudio) {
                          const sample = new Audio(
                            "https://actions.google.com/sounds/v1/speech/human_voice_sample.ogg",
                          );
                          sample.play();
                          setReplyAudioRef(sample);
                          setIsPlayingReplyAudio(true);
                          sample.onended = () => setIsPlayingReplyAudio(false);
                        } else {
                          if (replyAudioRef) replyAudioRef.pause();
                          setIsPlayingReplyAudio(false);
                        }
                      }}
                      className="w-9 h-9 rounded-full bg-[#22C55E] text-slate-950 flex items-center justify-center hover:bg-[#16A34A] transition cursor-pointer shadow-md"
                    >
                      <Icon
                        icon={
                          isPlayingReplyAudio ? "ph:pause-fill" : "ph:play-fill"
                        }
                        className="w-4 h-4"
                      />
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-[#22C55E]">
                          Voice Reply Audio Preview
                        </span>
                        <span className="text-[10px] font-sans text-[#9AA0AC]">
                          {isPlayingReplyAudio
                            ? "Playing..."
                            : `00:${replyAudioTimer.toString().padStart(2, "0")}`}
                        </span>
                      </div>

                      {/* Soundwave Waveform Animation Bar */}
                      <div className="flex items-center gap-0.5 h-4 w-full bg-[#1A1D24] p-1 rounded-md border border-[#2A2E38] overflow-hidden">
                        {[
                          40, 70, 25, 90, 50, 80, 30, 60, 100, 45, 75, 35, 85,
                          55, 65, 30, 90, 40, 70, 20, 80,
                        ].map((h, idx) => (
                          <div
                            key={idx}
                            className={`flex-1 rounded-full transition-all duration-300 ${
                              isPlayingReplyAudio
                                ? "bg-[#22C55E] animate-pulse"
                                : "bg-[#22C55E]/40"
                            }`}
                            style={{
                              height: `${isPlayingReplyAudio ? Math.min(100, h * (idx % 2 === 0 ? 1.2 : 0.8)) : h}%`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={resetReplyModalAudioState}
                    className="ml-3 p-1.5 rounded-lg bg-[#1A1D24] hover:bg-[#2A2E38] text-[#9AA0AC] hover:text-[#EF4444] transition cursor-pointer border border-[#2A2E38]"
                    title="Delete / Re-record Voice Note"
                  >
                    <Icon icon="ph:trash-bold" className="w-4 h-4" />
                  </button>
                </div>
              ) : null}

              <div className="flex items-center justify-between pt-2">
                {!isRecordingReplyAudio && !hasReplyAudioRecorded && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsRecordingReplyAudio(true);
                      setReplyAudioTimer(0);
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-2 bg-[#20232B] border-[#2A2E38] text-[#9AA0AC] hover:text-white hover:border-[#F5B700]/50"
                  >
                    <Icon
                      icon="ph:microphone-bold"
                      className="w-4 h-4 text-[#F5B700]"
                    />
                    <span>Record Voice Reply</span>
                  </button>
                )}

                {(isRecordingReplyAudio || hasReplyAudioRecorded) && <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetReplyModalAudioState();
                      setActiveReplyQuestion(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#20232B] hover:bg-[#2A2E38] text-[#9AA0AC] font-semibold text-xs border border-[#2A2E38] cursor-pointer transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveQuestionReply}
                    className="px-5 py-2 rounded-xl bg-[#F5B700] hover:bg-[#E5AA00] text-slate-950 font-bold text-xs cursor-pointer shadow-lg transition"
                  >
                    Submit Reply
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1A1D24] border border-[#2A2E38] rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-[#20232B] border-b border-[#2A2E38] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-sans text-sm font-bold text-[#5B8DEF] bg-[#5B8DEF]/10 px-3 py-1 rounded-xl border border-[#5B8DEF]/30">
              {record.trackingId}
            </span>
            <div>
              <h2 className="text-base font-bold text-[#F5F6FA]">
                {record.patientName} ({record.visitorType})
              </h2>
              <p className="text-xs text-[#9AA0AC]">
                {record.facilityName} • {record.timestamp}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                record.status === "Resolved"
                  ? "bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/30"
                  : record.status === "Escalated"
                    ? "bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/30"
                    : record.status === "Reverted"
                      ? "bg-[#F5B700]/20 text-[#F5B700] border border-[#F5B700]/30"
                      : record.status === "Closed"
                        ? "bg-[#6B7280]/20 text-slate-300 border border-[#6B7280]/30"
                        : "bg-[#5B8DEF]/20 text-[#5B8DEF] border border-[#5B8DEF]/30"
              }`}
            >
              {record.status}
            </span>

            <button
              type="button"
              onClick={() => exportSingleRecordPDF(record)}
              className="p-2 rounded-xl bg-[#1A1D24] hover:bg-[#2A2E38] text-[#9AA0AC] hover:text-white border border-[#2A2E38] transition cursor-pointer"
              title="Export Record PDF"
            >
              <Icon
                icon="ph:file-pdf-bold"
                className="w-4 h-4 text-[#EF4444]"
              />
            </button>

            <button
              type="button"
              onClick={() => dispatch(closeDetailModal())}
              className="p-2 rounded-xl bg-[#1A1D24] hover:bg-[#2A2E38] text-[#9AA0AC] hover:text-white border border-[#2A2E38] transition cursor-pointer"
            >
              <Icon icon="ph:x-bold" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Toast Notice */}
          {toastMessage && (
            <div className="p-3 rounded-xl bg-[#5B8DEF]/15 border border-[#5B8DEF]/30 text-[#5B8DEF] text-xs font-semibold flex items-center gap-2">
              <Icon icon="ph:info-bold" className="w-4 h-4" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* 5 Fixed Questions Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#5B8DEF] uppercase tracking-wider flex items-center gap-2">
              <Icon icon="ph:table-bold" className="w-4 h-4" />
              <span>Feedback Response Schema (5 Standard Questions)</span>
            </h3>

            <div className="overflow-x-auto border border-[#2A2E38] rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#20232B] border-b border-[#2A2E38] text-[#9AA0AC] font-semibold uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4 w-16">Sr. No.</th>
                    <th className="py-3 px-4 w-64">Feedback Question</th>
                    <th className="py-3 px-4">Response & Details</th>
                    <th className="py-3 px-4 min-w-[240px] text-right">
                      {currentCmo?.role === "CMO_2" ? "Reply from CMO_1" : "Action / Reply from CMO_1"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2E38]">
                  {PROJECT_QUESTIONS.map((q) => {
                    const isCouldBeBetter =
                      (q.key === "doctor" &&
                        record.doctor?.rating === "Could Be Better") ||
                      (q.key === "pharmacy" &&
                        record.pharmacy?.rating === "Could Be Better") ||
                      (q.key === "cleanliness" &&
                        record.cleanliness?.rating === "Could Be Better");

                    const existingReply =
                      record.replies && record.replies[q.key];

                    const cleanText = existingReply?.replyText
                      ? existingReply.replyText.replace(/^🎙️ Voice Reply:\s*/, "")
                      : "";
                    const hasVoice = Boolean(
                      existingReply?.hasVoiceNote ||
                        existingReply?.replyText?.includes("🎙️ Voice Reply") ||
                        existingReply?.replyText?.includes("Recorded audio"),
                    );

                    return (
                      <tr
                        key={q.key}
                        className="hover:bg-[#20232B]/40 transition"
                      >
                        <td className="py-3.5 px-4 font-sans text-[#9AA0AC] font-bold">
                          {q.srNo}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-[10px] text-[#5B8DEF] font-bold block uppercase tracking-wider">
                            {q.category}
                          </span>
                          <span className="font-semibold text-[#F5F6FA]">
                            {q.text}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {renderRatingCell(q.key)}
                        </td>
                        <td className="py-3.5 px-4 text-right min-w-[240px]">
                          {isCouldBeBetter &&
                            (existingReply ? (
                              <div className="p-2.5 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-left space-y-2">
                                <div className="flex items-center justify-between border-b border-[#22C55E]/20 pb-1">
                                  <span className="text-[10px] font-bold text-[#22C55E] uppercase tracking-wider flex items-center gap-1">
                                    <Icon
                                      icon="ph:check-circle-bold"
                                      className="w-3.5 h-3.5"
                                    />
                                    <span>
                                      {currentCmo?.role === "CMO_2"
                                        ? "Reply from CMO_1"
                                        : "Reply"}
                                    </span>
                                  </span>
                                  <span className="text-[9px] text-[#9AA0AC] font-sans">
                                    {existingReply.repliedAt || "Replied"}
                                  </span>
                                </div>

                                {/* Text Reply if text provided */}
                                {cleanText && cleanText !== "Recorded audio" && (
                                  <div>
                                    <span className="text-[9px] font-bold text-[#5B8DEF] uppercase block mb-0.5">
                                      Text Reply:
                                    </span>
                                    <p className="text-xs text-[#F5F6FA] font-medium leading-snug">
                                      "{cleanText}"
                                    </p>
                                  </div>
                                )}

                                {/* Voice Reply Audio Player if voice note recorded */}
                                {hasVoice && (
                                  <div>
                                    <span className="text-[9px] font-bold text-[#22C55E] uppercase block mb-0.5">
                                      Voice Reply:
                                    </span>
                                    <div className="flex items-center gap-2 bg-[#1A1D24] p-1.5 rounded-lg border border-[#2A2E38]">
                                      <button
                                        type="button"
                                        onClick={() => togglePlayRowAudio(q.key)}
                                        className="w-7 h-7 rounded-full bg-[#22C55E] text-slate-950 flex items-center justify-center hover:bg-[#16A34A] transition cursor-pointer shadow-md shrink-0"
                                        title="Play CMO_1 Voice Reply"
                                      >
                                        <Icon
                                          icon={
                                            playingRowAudioKey === q.key
                                              ? "ph:pause-fill"
                                              : "ph:play-fill"
                                          }
                                          className="w-3.5 h-3.5"
                                        />
                                      </button>

                                      <div className="flex-1 flex items-center gap-1.5 overflow-hidden">
                                        {/* Soundwaves Waveform Bar */}
                                        <div className="flex items-center gap-0.5 h-3.5 flex-1 bg-[#20232B] p-0.5 rounded border border-[#2A2E38] overflow-hidden">
                                          {[40, 70, 30, 90, 50, 80, 40, 60, 100, 45, 75, 35].map(
                                            (h, idx) => (
                                              <div
                                                key={idx}
                                                className={`flex-1 rounded-full transition-all duration-300 ${
                                                  playingRowAudioKey === q.key
                                                    ? "bg-[#22C55E] animate-pulse"
                                                    : "bg-[#22C55E]/40"
                                                }`}
                                                style={{
                                                  height: `${
                                                    playingRowAudioKey === q.key
                                                      ? Math.min(100, h * 1.1)
                                                      : h
                                                  }%`,
                                                }}
                                              />
                                            ),
                                          )}
                                        </div>

                                        <span className="text-[10px] font-mono text-[#9AA0AC] shrink-0">
                                          {playingRowAudioKey === q.key
                                            ? "Playing"
                                            : "00:08"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : currentCmo?.role === "CMO_1" ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveReplyQuestion({
                                    key: q.key,
                                    text: q.text,
                                    comment:
                                      q.key === "doctor"
                                        ? record.doctor?.comments || ""
                                        : record.pharmacy?.comments || "",
                                  })
                                }
                                className="px-3 py-1.5 rounded-lg bg-[#F5B700] hover:bg-[#E5AA00] text-slate-950 font-bold text-xs transition cursor-pointer shadow-md"
                              >
                                Reply
                              </button>
                            ) : (
                              <span className="text-[11px] text-[#9AA0AC] italic">
                                Pending CMO_1 Reply
                              </span>
                            ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Escalation / Revert Audit Log Section */}
          {record.escalationHistory && record.escalationHistory.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#F97316] uppercase tracking-wider flex items-center gap-2">
                <Icon icon="ph:tree-structure-bold" className="w-4 h-4" />
                <span>Escalation & Revert Trail</span>
              </h4>
              <div className="space-y-2">
                {record.escalationHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#20232B] border border-[#2A2E38] space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#5B8DEF]">
                        {item.actionType === "revert"
                          ? "↩️ REVERTED"
                          : "⬆️ ESCALATED"}
                        : {item.escalatedByCmoName} → {item.escalatedToCmoName}
                      </span>
                      <span className="text-[#9AA0AC] font-sans">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-[#F5F6FA]">
                      "{item.reasonText}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Reply Composer with Dual-State Button (Escalate vs Submit) - Only displayed for 'Could Be Better' ratings */}
          {(record.overallRating === "Could Be Better" ||
            record.responseType === "Could Be Better" ||
            record.isGrievance) && (
            <div className="p-5 rounded-2xl bg-[#20232B] border border-[#2A2E38] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#F5F6FA] uppercase tracking-wider flex items-center gap-2">
                  <Icon
                    icon="ph:paper-plane-tilt-bold"
                    className="w-4 h-4 text-[#5B8DEF]"
                  />
                  <span>CMO Resolution & Action Desk</span>
                </h4>

                {/* Roles Escalation / Revert / Close Controls */}
                <div className="flex items-center gap-2">
                  {(currentCmo?.role === "CMO_3" ||
                    currentCmo?.role === "SUPER_ADMIN") && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setShowRevertComposer(!showRevertComposer)
                        }
                        className="px-3 py-1.5 rounded-xl bg-[#F5B700]/15 hover:bg-[#F5B700]/25 text-[#F5B700] border border-[#F5B700]/30 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Icon
                          icon="ph:arrow-u-down-left-bold"
                          className="w-3.5 h-3.5"
                        />
                        <span>Revert to CMO_1</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCloseTicketAction}
                        className="px-3 py-1.5 rounded-xl bg-[#6B7280]/20 hover:bg-[#6B7280]/30 text-slate-200 border border-[#6B7280]/30 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Icon
                          icon="ph:lock-key-bold"
                          className="w-3.5 h-3.5 text-[#22C55E]"
                        />
                        <span>Close Ticket Permanently</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Revert Composer if toggled */}
              {showRevertComposer && (
                <div className="p-3 rounded-xl bg-[#F5B700]/10 border border-[#F5B700]/30 space-y-2">
                  <label className="text-[11px] font-bold text-[#F5B700] uppercase">
                    Revert Instruction Directive for CMO_1
                  </label>
                  <textarea
                    value={revertNoteText}
                    onChange={(e) => setRevertNoteText(e.target.value)}
                    placeholder="Specify why this ticket is being reverted back to CMO_1 for re-investigation..."
                    rows={2}
                    className="w-full bg-[#1A1D24] border border-[#2A2E38] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#F5B700]"
                  />
                  <button
                    type="button"
                    onClick={handleRevertAction}
                    className="px-4 py-1.5 rounded-xl bg-[#F5B700] text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    Confirm Revert to CMO_1
                  </button>
                </div>
              )}

              {/* Action Composer Form */}
              <div className="space-y-3">
                <textarea
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  placeholder="Type resolution directive or notes here..."
                  rows={2}
                  className="w-full bg-[#1A1D24] border border-[#2A2E38] rounded-xl p-3 text-xs text-[#F5F6FA] focus:outline-none focus:border-[#5B8DEF]"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Inline Voice Note Recorder & Playback Control (Compact, same button position) */}
                  {isRecordingComposerAudio ? (
                    <div className="px-3 py-1.5 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/40 flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-ping" />
                      <span className="text-xs font-bold text-[#EF4444]">
                        Recording...
                      </span>

                      {/* Live Soundwaves equalizer animation */}
                      <div className="flex items-center gap-0.5 h-3.5">
                        <span
                          className="w-0.5 bg-[#EF4444] rounded-full animate-bounce [animation-delay:0.1s]"
                          style={{ height: "60%" }}
                        />
                        <span
                          className="w-0.5 bg-[#EF4444] rounded-full animate-bounce [animation-delay:0.3s]"
                          style={{ height: "100%" }}
                        />
                        <span
                          className="w-0.5 bg-[#EF4444] rounded-full animate-bounce [animation-delay:0.2s]"
                          style={{ height: "40%" }}
                        />
                        <span
                          className="w-0.5 bg-[#EF4444] rounded-full animate-bounce [animation-delay:0.4s]"
                          style={{ height: "80%" }}
                        />
                      </div>

                      <span className="font-sans text-xs font-bold text-white bg-black/40 px-1.5 py-0.5 rounded border border-[#EF4444]/30">
                        00:{composerAudioTimer.toString().padStart(2, "0")}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setIsRecordingComposerAudio(false);
                          setHasComposerRecordedAudio(true);
                        }}
                        className="px-2 py-1 rounded-md bg-[#EF4444] hover:bg-[#DC2626] text-white text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Icon icon="ph:square-fill" className="w-2.5 h-2.5" />
                        <span>Stop</span>
                      </button>
                    </div>
                  ) : hasComposerRecordedAudio ? (
                    <div className="px-3 py-1.5 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/40 flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (!isPlayingComposerAudio) {
                            const sample = new Audio(
                              "https://actions.google.com/sounds/v1/speech/human_voice_sample.ogg",
                            );
                            sample.play();
                            setComposerAudioRef(sample);
                            setIsPlayingComposerAudio(true);
                            sample.onended = () =>
                              setIsPlayingComposerAudio(false);
                          } else {
                            if (composerAudioRef) composerAudioRef.pause();
                            setIsPlayingComposerAudio(false);
                          }
                        }}
                        className="w-7 h-7 rounded-full bg-[#22C55E] text-slate-950 flex items-center justify-center hover:bg-[#16A34A] transition cursor-pointer shadow-md"
                      >
                        <Icon
                          icon={
                            isPlayingComposerAudio
                              ? "ph:pause-fill"
                              : "ph:play-fill"
                          }
                          className="w-3.5 h-3.5"
                        />
                      </button>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-[#22C55E]">
                          Voice Note
                        </span>

                        {/* Soundwave Waveform Bar */}
                        <div className="flex items-center gap-0.5 h-3.5 w-16 bg-[#1A1D24] p-0.5 rounded border border-[#2A2E38] overflow-hidden">
                          {[
                            40, 70, 25, 90, 50, 80, 30, 60, 100, 45, 75, 35, 85,
                          ].map((h, idx) => (
                            <div
                              key={idx}
                              className={`flex-1 rounded-full transition-all duration-300 ${
                                isPlayingComposerAudio
                                  ? "bg-[#22C55E] animate-pulse"
                                  : "bg-[#22C55E]/40"
                              }`}
                              style={{
                                height: `${isPlayingComposerAudio ? Math.min(100, h * (idx % 2 === 0 ? 1.2 : 0.8)) : h}%`,
                              }}
                            />
                          ))}
                        </div>

                        <span className="text-[10px] font-sans text-[#9AA0AC]">
                          00:{composerAudioTimer.toString().padStart(2, "0")}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={resetComposerAudioState}
                        className="p-1 rounded bg-[#1A1D24] hover:bg-[#2A2E38] text-[#9AA0AC] hover:text-[#EF4444] transition cursor-pointer border border-[#2A2E38]"
                        title="Delete / Re-record Voice Note"
                      >
                        <Icon icon="ph:trash-bold" className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsRecordingComposerAudio(true);
                        setComposerAudioTimer(0);
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-2 bg-[#1A1D24] border-[#2A2E38] text-[#9AA0AC] hover:text-white hover:border-[#5B8DEF]/50"
                    >
                      <Icon
                        icon="ph:microphone-bold"
                        className="w-4 h-4 text-[#5B8DEF]"
                      />
                      <span>Record Voice Note</span>
                    </button>
                  )}

                  <div className="flex items-center gap-3">
                    {/* Target CMO selector when empty */}
                    {!isComposerActive && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#9AA0AC]">
                          Escalate To:
                        </span>
                        <select
                          value={escalateTargetCmoId}
                          onChange={(e) =>
                            setEscalateTargetCmoId(e.target.value)
                          }
                          className="bg-[#1A1D24] border border-[#2A2E38] rounded-xl px-3 py-1.5 text-xs text-[#F5F6FA] focus:outline-none focus:border-[#5B8DEF]"
                        >
                          {currentCmo &&
                            AuthService.getValidUpperCmos(currentCmo).map(
                              (c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name} ({c.role})
                                </option>
                              ),
                            )}
                        </select>
                      </div>
                    )}

                    {/* MORPHING DUAL-STATE BUTTON */}
                    <button
                      type="button"
                      onClick={handleDualStateAction}
                      className={`px-6 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer shadow-lg flex items-center gap-2 ${
                        isComposerActive
                          ? "bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 shadow-[#22C55E]/20"
                          : "bg-[#F97316] hover:bg-[#EA580C] text-white shadow-[#F97316]/20"
                      }`}
                    >
                      <Icon
                        icon={
                          isComposerActive
                            ? "ph:check-circle-bold"
                            : "ph:arrow-up-right-bold"
                        }
                        className="w-4 h-4"
                      />
                      <span>
                        {isComposerActive
                          ? "Submit & Resolve"
                          : "Escalate Ticket"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
