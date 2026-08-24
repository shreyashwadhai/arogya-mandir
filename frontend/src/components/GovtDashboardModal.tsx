import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { toggleGovtDashboard } from '../redux/features/accessibilitySlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

export const GovtDashboardModal: React.FC = () => {
  const dispatch = useDispatch();
  const showGovtDashboard = useSelector((state: RootState) => state.accessibility.showGovtDashboard);
  const trackedFeedbacks = useSelector((state: RootState) => state.journey.trackedFeedbacks);

  if (!showGovtDashboard) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-5xl bg-[#091225] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] text-left relative"
        >
          {/* Close Button */}
          <button
            onClick={() => dispatch(toggleGovtDashboard())}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <Icon icon="ph:x-bold" className="w-5 h-5" />
          </button>

          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                <Icon icon="ph:chart-line-up-bold" className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-widest">STATE HEALTHCARE MONITORING</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    Live Sync
                  </span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-white">Chief Medical Officer (CMO) Dashboard</h2>
              </div>
            </div>

            <div className="text-xs text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <div>Health Directorate • Govt. of Delhi</div>
              <div className="text-teal-400 font-mono font-semibold">20 Aug 2026 Live Telemetry</div>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <div className="text-xs font-bold text-slate-400 uppercase">Total Feedbacks Today</div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">1,482</div>
              <div className="text-[11px] text-teal-400 font-semibold mt-1">↑ +14% vs yesterday</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <div className="text-xs font-bold text-slate-400 uppercase">Avg Satisfaction</div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 flex items-center gap-1">
                <span>4.8</span>
                <span className="text-sm text-slate-400">/ 5.0</span>
              </div>
              <div className="text-[11px] text-amber-400 font-semibold mt-1">★★★★★ 94% Positive</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <div className="text-xs font-bold text-slate-400 uppercase">48-Hr SLA Compliance</div>
              <div className="text-2xl sm:text-3xl font-black text-teal-300 mt-1">96.4%</div>
              <div className="text-[11px] text-teal-400 font-semibold mt-1">Target: &gt;95.0%</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <div className="text-xs font-bold text-slate-400 uppercase">Active Grievances</div>
              <div className="text-2xl sm:text-3xl font-black text-yellow-400 mt-1">28</div>
              <div className="text-[11px] text-yellow-400 font-semibold mt-1">Assigned to Officers</div>
            </div>
          </div>

          {/* Live Feedback Stream */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 mb-6">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Icon icon="ph:list-bullets-bold" className="w-4 h-4 text-amber-400" />
                Live Patient Feedback & Grievance Stream
              </span>
              <span className="text-xs font-normal text-slate-400">Showing recent verified logs</span>
            </h3>

            <div className="space-y-3">
              {trackedFeedbacks.map((item, i) => (
                <div
                  key={i}
                  className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-amber-400">{item.trackingId}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-bold text-white">{item.patientName}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-semibold">
                        {item.urgency}
                      </span>
                    </div>
                    <div className="text-slate-300">{item.facilityName}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.timestamp}</div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold text-[11px]">
                      {item.status}
                    </span>
                    <button className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px]">
                      Inspect Log
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Close Footer */}
          <div className="flex justify-end">
            <button
              onClick={() => dispatch(toggleGovtDashboard())}
              className="py-3 px-6 rounded-xl gold-btn text-xs font-extrabold"
            >
              Close CMO Dashboard Preview
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
