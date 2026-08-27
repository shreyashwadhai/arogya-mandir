import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import type { FeedbackRecord, CmoUser } from "../../types/cmoTypes";
import { StorageService } from "../../services/storageService";
import { AuthService } from "../../services/authService";

interface EscalationModalProps {
  isOpen: boolean;
  feedback: FeedbackRecord | null;
  currentCmo: CmoUser;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const EscalationModal: React.FC<EscalationModalProps> = ({
  isOpen,
  feedback,
  currentCmo,
  onClose,
  onSuccess,
}) => {
  const [upperCmos, setUpperCmos] = useState<CmoUser[]>([]);
  const [selectedUpperCmoId, setSelectedUpperCmoId] = useState<string>("");
  const [reasonText, setReasonText] = useState<string>("");

  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [hasVoiceNote, setHasVoiceNote] = useState(false);

  useEffect(() => {
    if (isOpen && currentCmo) {
      const valids = AuthService.getValidUpperCmos(currentCmo);
      setUpperCmos(valids);
      if (valids.length > 0) {
        setSelectedUpperCmoId(valids[0].id);
      }
      setReasonText("");
      setHasVoiceNote(false);
      setIsRecording(false);
      setRecordingSeconds(0);
    }
  }, [isOpen, currentCmo]);

  // Voice Recording Timer Simulation
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

  const handleEscalateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUpperCmoId) {
      alert("Please select an Upper CMO for escalation.");
      return;
    }

    const voiceNoteUrl = hasVoiceNote
      ? "https://actions.google.com/sounds/v1/speech/human_voice_sample.ogg"
      : undefined;

    const updated = StorageService.escalateFeedback(
      feedback.id,
      selectedUpperCmoId,
      currentCmo,
      reasonText.trim() || "No explicit reason provided.",
      voiceNoteUrl,
    );

    if (updated) {
      const targetCmo = upperCmos.find((c) => c.id === selectedUpperCmoId);
      const targetName = targetCmo ? targetCmo.name : "Upper CMO";
      onSuccess(
        `Feedback ${feedback.trackingId} escalated successfully to ${targetName}.`,
      );
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
                <Icon icon="ph:arrow-up-bold" className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">
                  Escalate Feedback
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
          <form onSubmit={handleEscalateSubmit} className="p-6 space-y-5">
            {/* Feedback Info Box */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Current Assignee:</span>
                <span className="font-bold text-amber-400">
                  {currentCmo.name} ({currentCmo.role})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Patient:</span>
                <span className="font-medium text-slate-200">
                  {feedback.patientName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Centre:</span>
                <span className="font-medium text-slate-200">
                  {feedback.facilityName}
                </span>
              </div>
            </div>

            {/* Select Upper CMO Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Select Upper CMO for Escalation{" "}
                <span className="text-red-400">*</span>
              </label>
              {upperCmos.length > 0 ? (
                <select
                  value={selectedUpperCmoId}
                  onChange={(e) => setSelectedUpperCmoId(e.target.value)}
                  className="w-full bg-slate-900 border border-amber-500/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                  required
                >
                  {upperCmos.map((cmo) => (
                    <option key={cmo.id} value={cmo.id}>
                      {cmo.name} — {cmo.designation} ({cmo.role})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
                  No upper CMO available in hierarchy.
                </div>
              )}
            </div>

            {/* Reason Text */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Escalation Reason / Remarks{" "}
                <span className="text-slate-500">(Optional)</span>
              </label>
              <textarea
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder="Detail why this issue is being escalated to upper CMO..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500/50 rounded-xl p-3 text-sm text-slate-200 focus:outline-none transition resize-none placeholder:text-slate-600"
              />
            </div>

            {/* Voice Note Recording Section */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Escalation Voice Note{" "}
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
                          ? "Voice note attached (0:15)"
                          : "Record voice note for upper CMO"}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {isRecording
                        ? "Click stop to attach"
                        : "Click mic to start recording"}
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
                disabled={upperCmos.length === 0}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <Icon icon="ph:arrow-up-bold" className="w-4 h-4" />
                <span>Confirm Escalation</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
