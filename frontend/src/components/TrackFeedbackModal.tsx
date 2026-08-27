import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import {
  closeTrackModal,
  setActiveTrackIdInput,
} from "../redux/features/accessibilitySlice";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

export const TrackFeedbackModal: React.FC = () => {
  const dispatch = useDispatch();
  const { showTrackModal, activeTrackIdInput } = useSelector(
    (state: RootState) => state.accessibility,
  );
  const trackedFeedbacks = useSelector(
    (state: RootState) => state.journey.trackedFeedbacks,
  );

  const [searchId, setSearchId] = useState(
    activeTrackIdInput || "AM-FB-2026-42342",
  );
  const [selectedRecord, setSelectedRecord] = useState(
    trackedFeedbacks[0] || null,
  );

  if (!showTrackModal) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = trackedFeedbacks.find(
      (f) => f.trackingId.toLowerCase() === searchId.trim().toLowerCase(),
    );
    if (found) {
      setSelectedRecord(found);
    } else {
      // Mock found record
      setSelectedRecord({
        trackingId: searchId.toUpperCase(),
        patientName: "Aadhaar Verified Citizen",
        facilityName: "District Hospital, Central Delhi",
        status: "Assigned to CMO",
        timestamp: "Today, 02:10 PM",
        commentsCount: 1,
        urgency: "High SLA Priority",
      });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl bg-[#091225] border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden relative text-left"
        >
          {/* Close button */}
          <button
            onClick={() => dispatch(closeTrackModal())}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <Icon icon="ph:x-bold" className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center">
              <Icon
                icon="ph:magnifying-glass-bold"
                className="w-6 h-6 text-teal-400"
              />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                OFFICIAL GOVERNMENT TRACKING
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Track Grievance Status
              </h2>
            </div>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mb-6 flex items-center gap-2"
          >
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Tracking ID e.g. AM-FB-2026-42342"
              className="flex-1 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-3 px-4 text-white text-sm font-sans font-bold focus:outline-none transition"
            />
            <button
              type="submit"
              className="py-3 px-5 rounded-xl gold-btn text-xs font-extrabold transition shrink-0"
            >
              Search Status
            </button>
          </form>

          {/* Record Timeline View */}
          {selectedRecord && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-6">
              {/* Record Summary */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="text-base font-black text-amber-400 font-sans">
                    {selectedRecord.trackingId}
                  </div>
                  <div className="text-xs text-slate-300 font-bold">
                    {selectedRecord.patientName} • {selectedRecord.facilityName}
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-extrabold">
                  ● {selectedRecord.status}
                </span>
              </div>

              {/* Timeline Steps */}
              <div className="space-y-4 relative pl-4 border-l-2 border-slate-800">
                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute -left-[23px] top-0 w-4 h-4 rounded-full bg-teal-400 ring-4 ring-slate-950" />
                  <div className="text-xs font-bold text-white">
                    1. Feedback Logged & Authenticated
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Validated via Aadhaar OTP & OPD Token.
                  </div>
                  <div className="text-[10px] font-sans text-teal-400 mt-0.5">
                    {selectedRecord.timestamp}
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="absolute -left-[23px] top-0 w-4 h-4 rounded-full bg-amber-400 ring-4 ring-slate-950" />
                  <div className="text-xs font-bold text-white">
                    2. Routed to Chief Medical Officer (CMO)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Escalated for 48-Hour SLA review at Central Delhi
                    Directorate.
                  </div>
                  <div className="text-[10px] font-sans text-amber-400 mt-0.5">
                    Assigned to: Dr. R.K. Sharma (CMO)
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="absolute -left-[23px] top-0 w-4 h-4 rounded-full bg-slate-700 ring-4 ring-slate-950" />
                  <div className="text-xs font-bold text-slate-400">
                    3. Action Taken & Inspection
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Inspection & facility improvement in progress.
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <div className="absolute -left-[23px] top-0 w-4 h-4 rounded-full bg-slate-700 ring-4 ring-slate-950" />
                  <div className="text-xs font-bold text-slate-400">
                    4. Resolution Confirmation
                  </div>
                  <div className="text-[11px] text-slate-500">
                    SMS notification will be dispatched upon closure.
                  </div>
                </div>
              </div>

              {/* CMO Helpline Footer */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">
                    Direct CMO Grievance Helpline
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Toll-Free: 1800-11-2026 (Mon-Sat 9AM - 6PM)
                  </div>
                </div>
                <button
                  onClick={() => dispatch(closeTrackModal())}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
