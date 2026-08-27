import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import type {
  FeedbackRecord,
  CmoUser,
  FeedbackReplyItem,
} from "../../types/cmoTypes";
import { StorageService } from "../../services/storageService";

interface ReplyModalProps {
  isOpen: boolean;
  feedback: FeedbackRecord | null;
  questionKey: string;
  questionText: string;
  patientComment: string;
  currentCmo: CmoUser;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const ReplyModal: React.FC<ReplyModalProps> = ({
  isOpen,
  feedback,
  questionKey,
  questionText,
  patientComment,
  currentCmo,
  onClose,
  onSuccess,
}) => {
  const [replyText, setReplyText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [hasVoiceNote, setHasVoiceNote] = useState(false);

  useEffect(() => {
    if (isOpen && feedback) {
      const existingReply = feedback.replies?.[questionKey];
      if (existingReply) {
        setReplyText(existingReply.replyText);
        setHasVoiceNote(!!existingReply.audioUrl);
      } else {
        setReplyText("");
        setHasVoiceNote(false);
      }
      setIsRecording(false);
      setRecordingSeconds(0);
    }
  }, [isOpen, feedback, questionKey]);

  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  if (!isOpen || !feedback) return null;

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingSeconds(0);
      setHasVoiceNote(false);
    } else {
      setIsRecording(false);
      setHasVoiceNote(true);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) {
      alert("Please enter a reply message.");
      return;
    }

    const replyItem: FeedbackReplyItem = {
      questionKey,
      questionText,
      patientComment,
      replyText: replyText.trim(),
      audioUrl: hasVoiceNote
        ? "https://actions.google.com/sounds/v1/speech/human_voice_sample.ogg"
        : undefined,
      repliedBy: currentCmo.name,
      repliedByRole: currentCmo.role,
      repliedAt: new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updated = StorageService.addReply(feedback.id, replyItem);
    if (updated) {
      onSuccess(`Reply submitted successfully by ${currentCmo.name}.`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-[#111827] border border-amber-500/30 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 px-6 py-4 border-b border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Icon icon="ph:arrow-u-up-left-bold" className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">
                  CMO Response Reply
                </h3>
                <p className="text-xs text-amber-400/80 font-sans font-medium">
                  {feedback.trackingId}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <Icon icon="ph:x-bold" className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmitReply} className="p-6 space-y-5">
            {/* Question & Patient Feedback Box */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Question: {questionText}
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 italic">
                "{patientComment || "No detailed comment provided by patient."}"
              </div>
            </div>

            {/* Reply Textarea */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Your Official Reply / Action Plan{" "}
                <span className="text-red-400">*</span>
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Enter response, corrective measures, or action taken..."
                rows={4}
                className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500/50 rounded-xl p-3 text-sm text-slate-200 focus:outline-none transition resize-none placeholder:text-slate-600"
                required
              />
            </div>

            {/* Optional Voice Note Recording */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Attach Audio Voice Response{" "}
                <span className="text-slate-500">(Optional)</span>
              </label>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer ${
                      isRecording
                        ? "bg-red-500 text-white animate-pulse"
                        : hasVoiceNote
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30"
                    }`}
                  >
                    <Icon
                      icon={
                        isRecording
                          ? "ph:stop-fill"
                          : hasVoiceNote
                            ? "ph:check-bold"
                            : "ph:microphone-bold"
                      }
                      className="w-5 h-5"
                    />
                  </button>
                  <div>
                    <div className="text-xs font-bold text-slate-200">
                      {isRecording
                        ? `Recording... ${formatSeconds(recordingSeconds)}`
                        : hasVoiceNote
                          ? "Audio note attached (0:20)"
                          : "Record audio reply note"}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {isRecording
                        ? "Click stop to finish"
                        : "Click mic to record voice note"}
                    </div>
                  </div>
                </div>

                {hasVoiceNote && !isRecording && (
                  <button
                    type="button"
                    onClick={() => {
                      setHasVoiceNote(false);
                      setRecordingSeconds(0);
                    }}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
              >
                <Icon icon="ph:paper-plane-tilt-bold" className="w-4 h-4" />
                <span>Submit Reply</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
