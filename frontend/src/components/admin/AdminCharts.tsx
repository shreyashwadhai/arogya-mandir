import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

// ==========================================
// 1. VISITS SPARKLINE (Smooth Animated Area Chart with Live Pulsing Indicator)
// ==========================================
export const VisitsSparkline: React.FC = () => {
  // Smooth wave SVG path coordinates (viewBox 0 0 180 60)
  const lineD = "M 0 38 C 20 22, 40 48, 60 18 C 80 6, 100 52, 120 26 C 140 12, 160 32, 180 14";
  const pathD = `${lineD} L 180 60 L 0 60 Z`;

  return (
    <div className="w-full h-12 relative overflow-hidden select-none">
      <svg className="w-full h-full" viewBox="0 0 180 60" preserveAspectRatio="none">
        <defs>
          <linearGradient id="visitsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Shaded Area under the curve */}
        <motion.path
          d={pathD}
          fill="url(#visitsGrad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Animated Stroke Line */}
        <motion.path
          d={lineD}
          fill="none"
          stroke="#06b6d4"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />

        {/* Live Pulsing Dot at the end of the line (coordinates 180, 14) */}
        <circle cx="178" cy="14" r="3.5" fill="#06b6d4" />
        <motion.circle
          cx="178"
          cy="14"
          r="7"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="1.5"
          animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
};

// ==========================================
// 2. PAYMENTS SPARKLINE (Gradient Rounded Capsules)
// ==========================================
export const PaymentsSparkline: React.FC = () => {
  const bars = [25, 45, 20, 55, 30, 60, 40, 50, 35, 58];

  return (
    <div className="w-full h-12 flex items-end justify-between gap-1.5 select-none px-1">
      {bars.map((val, idx) => (
        <div key={idx} className="flex-1 bg-slate-50 dark:bg-slate-800/40 rounded-full h-full flex items-end">
          <motion.div
            className="w-full rounded-full bg-gradient-to-t from-blue-600 to-blue-400"
            style={{ originY: 'bottom' }}
            initial={{ height: 0 }}
            animate={{ height: `${val}%` }}
            transition={{ duration: 0.6, delay: idx * 0.04, ease: "easeOut" }}
          />
        </div>
      ))}
    </div>
  );
};

// ==========================================
// 3. OPERATION EFFECT RING (Glow-gradient Circular Progress)
// ==========================================
export const OperationEffectRing: React.FC<{ percentage?: number }> = ({ percentage = 88 }) => {
  const radius = 18;
  const strokeWidth = 3.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-16 h-16 select-none shrink-0">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1890ff" />
            <stop offset="100%" stopColor="#13c2c2" />
          </linearGradient>
          <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Track Circle */}
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="transparent"
          stroke="rgba(24, 144, 255, 0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Animated Active circle with gradient and glow */}
        <motion.circle
          cx="22"
          cy="22"
          r={radius}
          fill="transparent"
          stroke="url(#ringGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          filter="url(#ringGlow)"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: strokeDashoffset }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </svg>
      {/* Centered text percentage */}
      <div className="absolute text-xs font-black text-slate-800 font-mono">
        {percentage}%
      </div>
    </div>
  );
};

// ==========================================
// 4. MAIN ANALYTICS AND PERFORMANCE TAB PANEL
// ==========================================
export const AdminCharts: React.FC = () => {
  const [activeChartTab, setActiveChartTab] = useState<'sales' | 'visits'>('sales');
  const [activeRange, setActiveRange] = useState<'day' | 'week' | 'month' | 'year'>('year');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Sales Trend Data (representing Satisfaction Score vs Volume Index)
  const salesData = [
    { label: "2023", value1: 39, value2: 25 },
    { label: "2024", value1: 48, value2: 35 },
    { label: "2025", value1: 30, value2: 32 },
    { label: "2026", value1: 35, value2: 25 }
  ];

  // Volume Trend Data (representing Submissions count vs Escalated grievances)
  const visitsData = [
    { label: "2023", value1: 25, value2: 42 },
    { label: "2024", value1: 42, value2: 45 },
    { label: "2025", value1: 20, value2: 30 },
    { label: "2026", value1: 32, value2: 38 }
  ];

  const currentChartData = activeChartTab === 'sales' ? salesData : visitsData;

  // Leaderboard data with ratings metrics
  const leaderBoard = [
    { name: "Dwarka Sector 7 Polyclinic", score: "98.4%", active: true, value: 98 },
    { name: "Delhi Cantonment Wellness Clinic", score: "96.8%", active: true, value: 96 },
    { name: "Rohini Health Centre #108", score: "95.1%", active: true, value: 95 },
    { name: "Laxmi Nagar Hub Centre #204", score: "92.4%", active: false, value: 92 },
    { name: "Central Delhi District Hospital", score: "89.2%", active: false, value: 89 },
    { name: "Vasant Kunj Civil Hospital", score: "88.5%", active: false, value: 88 },
    { name: "Okhla Urban Health Centre", score: "84.1%", active: false, value: 84 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT & CENTER PANEL: Trend Chart Panel */}
      <div className="lg:col-span-2 bg-white rounded-[24px] p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between space-y-5">
        {/* Panel Header: Tabs & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center gap-6 relative select-none">
            {/* Sliding Pill Tab header */}
            <div className="flex items-center gap-6 relative">
              <button
                onClick={() => setActiveChartTab('sales')}
                className={`text-sm font-bold pb-2 relative z-10 cursor-pointer transition-all duration-200 ${
                  activeChartTab === 'sales' ? 'text-blue-600 font-extrabold' : 'text-slate-400 hover:text-slate-650'
                }`}
              >
                Satisfaction Trend
                {activeChartTab === 'sales' && (
                  <motion.div
                    layoutId="activeChartUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
              <button
                onClick={() => setActiveChartTab('visits')}
                className={`text-sm font-bold pb-2 relative z-10 cursor-pointer transition-all duration-200 ${
                  activeChartTab === 'visits' ? 'text-blue-600 font-extrabold' : 'text-slate-400 hover:text-slate-650'
                }`}
              >
                Feedback Volume
                {activeChartTab === 'visits' && (
                  <motion.div
                    layoutId="activeChartUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            </div>
          </div>

          {/* Time range buttons and Mock Datepicker */}
          <div className="flex items-center gap-3 self-end sm:self-auto flex-wrap select-none">
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 text-[11px] font-bold text-slate-500 relative">
              {[
                { key: 'day', label: 'All day' },
                { key: 'week', label: 'All week' },
                { key: 'month', label: 'All month' },
                { key: 'year', label: 'All year' }
              ].map((range) => (
                <button
                  key={range.key}
                  onClick={() => setActiveRange(range.key as any)}
                  className={`px-3 py-1 rounded-lg relative z-10 cursor-pointer transition-all ${
                    activeRange === range.key ? 'text-blue-600 font-extrabold' : 'hover:text-slate-800'
                  }`}
                >
                  {range.label}
                  {activeRange === range.key && (
                    <motion.div
                      layoutId="activeRangePill"
                      className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/40 z-[-1]"
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Datepicker Picker styling */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-[11px] font-bold text-slate-600 flex items-center gap-1.5 shadow-sm hover:shadow transition select-none">
              <span>2026-08-01</span>
              <span className="text-slate-300 font-normal">~</span>
              <span>2026-08-24</span>
              <Icon icon="ph:calendar-bold" className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </div>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="relative h-64 flex flex-col justify-end pt-6">
          <div className="text-[12px] font-black text-slate-800 absolute top-0 left-0 tracking-wide select-none">
            {activeChartTab === 'sales' ? 'Store Sales Trend (Satisfaction)' : 'Store Traffic Trend (Volume)'}
          </div>

          {/* Y Axis lines and labels */}
          <div className="absolute inset-x-0 bottom-6 top-8 flex flex-col justify-between pointer-events-none">
            {[60, 45, 30, 15, 0].map((label, idx) => (
              <div key={idx} className="w-full flex items-center justify-between border-b border-dashed border-slate-100 text-[10px] text-slate-400 pb-0.5 font-mono">
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* Interactive Bars Render */}
          <div className="relative z-10 flex items-end justify-around h-48 px-2 md:px-6">
            {currentChartData.map((data, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center justify-end h-full gap-2 relative group"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Custom Tooltip */}
                <AnimatePresence>
                  {hoveredIdx === idx && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute -top-14 z-20 bg-slate-900 text-white border border-slate-850 rounded-xl p-2.5 text-[10px] shadow-xl flex flex-col gap-1 font-sans pointer-events-none shrink-0"
                    >
                      <div className="font-extrabold border-b border-slate-800 pb-1 mb-1 text-slate-350">
                        Category Index: {data.label}
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>Satisfaction: <span className="font-black font-mono text-white">{data.value1}%</span></span>
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                        <span>Volume index: <span className="font-black font-mono text-white">{data.value2}%</span></span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Double Bar Pillars */}
                <div className="flex items-end justify-center gap-2 w-full h-full max-w-[70px] relative">
                  {/* Subtle Background Track pillars */}
                  <div className="absolute inset-x-0 bottom-0 top-0 bg-slate-50/50 dark:bg-slate-800/10 rounded-t-lg z-[-1] border border-transparent group-hover:bg-slate-100/50 transition-all pointer-events-none" />

                  {/* Bar 1: Royal Blue Gradient */}
                  <div className="w-6 h-full flex items-end">
                    <motion.div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md shadow-sm"
                      style={{ originY: 'bottom' }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.value1 / 60) * 100}%` }}
                      transition={{ type: "spring", stiffness: 100, damping: 18, delay: idx * 0.08 }}
                    />
                  </div>

                  {/* Bar 2: Light Blue Gradient */}
                  <div className="w-6 h-full flex items-end">
                    <motion.div
                      className="w-full bg-gradient-to-t from-blue-300 to-blue-100 rounded-t-md shadow-sm"
                      style={{ originY: 'bottom' }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.value2 / 60) * 100}%` }}
                      transition={{ type: "spring", stiffness: 100, damping: 18, delay: idx * 0.08 + 0.04 }}
                    />
                  </div>
                </div>

                <div className="text-[11px] font-extrabold text-slate-500 text-center font-sans tracking-tight mt-1.5 select-none group-hover:text-blue-600 transition">
                  {data.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend Indicators */}
        <div className="flex items-center gap-6 pt-3 border-t border-slate-100 text-xs font-bold text-slate-550 justify-center sm:justify-start select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-blue-500" />
            <span>Satisfaction Rate (Target)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-blue-200" />
            <span>Submission Volume Index</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Leaderboard */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between space-y-4">
        <div>
          <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
            Leaderboard
          </div>
          <h3 className="text-base font-black text-slate-800 mt-1">
            Top Performing Facilities
          </h3>
          <p className="text-[11px] text-slate-400 font-bold mt-0.5 leading-tight">
            Based on average satisfaction rating & SLA audits speed.
          </p>
        </div>

        {/* List of items */}
        <div className="space-y-4 flex-1 py-1.5 overflow-y-auto no-scrollbar">
          {leaderBoard.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.01, x: 2 }}
              className="flex flex-col gap-1.5 text-xs font-sans p-2 hover:bg-slate-50 rounded-xl transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Badge matching image */}
                  {idx < 3 ? (
                    <div className="w-5.5 h-5.5 rounded-full bg-[#001529] text-white flex items-center justify-center font-black text-[10px] select-none shadow-sm shrink-0">
                      {idx + 1}
                    </div>
                  ) : (
                    <div className="w-5.5 h-5.5 rounded-full bg-transparent text-slate-400 flex items-center justify-center font-bold text-[11px] select-none shrink-0">
                      {idx + 1}
                    </div>
                  )}
                  <span className={`font-bold truncate max-w-[150px] sm:max-w-[170px] ${item.active ? 'text-slate-850' : 'text-slate-500'}`}>
                    {item.name}
                  </span>
                </div>
                <span className={`font-mono font-black text-slate-800 flex items-center gap-0.5`}>
                  {item.score}
                  {idx === 0 && <Icon icon="ph:crown-fill" className="w-3.5 h-3.5 text-amber-500 ml-1" />}
                </span>
              </div>
              
              {/* Mini Satisfaction progress line indicator */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden ml-8.5 max-w-[80%]">
                <motion.div
                  className="bg-blue-500 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 1, delay: idx * 0.08 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer info box */}
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-2 text-[10px] text-slate-500 font-bold leading-normal select-none">
          <Icon icon="ph:info-bold" className="w-4 h-4 text-blue-500 shrink-0" />
          <span>Scores are recalculated daily at 00:00 IST based on district audits.</span>
        </div>
      </div>
    </div>
  );
};
