import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import type { FeedbackRecord } from './dummyData';

interface AdminChartsProps {
  filteredRecords: FeedbackRecord[];
}

// ============================================================================
// 1. OVERALL SCORE BIFURCATION BAR (Image 1)
// ============================================================================
export const OverallScoreBifurcation: React.FC<{ filteredRecords: FeedbackRecord[] }> = ({ filteredRecords }) => {
  const total = filteredRecords.length;

  const betterCount = filteredRecords.filter(r => String(r.responseType || r.overallRating) === 'Could Be Better').length;
  const acceptableCount = filteredRecords.filter(r => {
    const val = String(r.responseType || r.overallRating);
    return val === 'Acceptable standard' || val === 'Acceptable';
  }).length;
  const excellentCount = filteredRecords.filter(r => {
    const val = String(r.responseType || r.overallRating);
    return val === 'Excellent Service' || val === 'Excellent';
  }).length;

  const betterPct = total > 0 ? parseFloat(((betterCount / total) * 100).toFixed(2)) : 9.14;
  const acceptablePct = total > 0 ? parseFloat(((acceptableCount / total) * 100).toFixed(2)) : 29.44;
  const excellentPct = total > 0 ? parseFloat((100 - betterPct - acceptablePct).toFixed(2)) : 61.42;

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <Icon icon="carbon:skill-level" className="w-4 h-4 text-amber-400" />
          <span>Overall Score Bifurcation</span>
        </h3>
        <span className="text-xs font-medium text-slate-400">
          Total: <strong className="text-slate-200">{total || 394}</strong> Submissions
        </span>
      </div>

      {/* Modern 3-Segment Progress Bar */}
      <div className="h-14 w-full rounded-lg overflow-hidden flex shadow-inner border border-slate-900 text-xs font-bold text-white select-none">
        {/* Could Be Better - RED */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${betterPct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="bg-red-600 flex items-center justify-center p-1 relative group cursor-pointer"
        >
          <span className="truncate">{betterPct}%</span>
          <div className="absolute -top-9 bg-slate-900 text-white text-[11px] px-2.5 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
            Could Be Better: {betterCount} ({betterPct}%)
          </div>
        </motion.div>

        {/* Acceptable Standard - AMBER */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${acceptablePct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className="bg-amber-500 text-slate-950 flex items-center justify-center p-1 relative group cursor-pointer"
        >
          <span className="truncate">{acceptablePct}%</span>
          <div className="absolute -top-9 bg-slate-900 text-white text-[11px] px-2.5 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
            Acceptable standard: {acceptableCount} ({acceptablePct}%)
          </div>
        </motion.div>

        {/* Excellent Service - EMERALD */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${excellentPct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="bg-emerald-600 flex items-center justify-center p-1 relative group cursor-pointer"
        >
          <span className="truncate">{excellentPct}%</span>
          <div className="absolute -top-9 bg-slate-900 text-white text-[11px] px-2.5 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
            Excellent Service: {excellentCount} ({excellentPct}%)
          </div>
        </motion.div>
      </div>

      {/* 3 Stat Badges Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-center">
          <div className="text-xs text-red-400 font-semibold">Could Be Better</div>
          <div className="text-xl font-bold text-red-400 mt-0.5">{betterPct}%</div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-center">
          <div className="text-xs text-amber-400 font-semibold">Acceptable Standard</div>
          <div className="text-xl font-bold text-amber-400 mt-0.5">{acceptablePct}%</div>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-center">
          <div className="text-xs text-emerald-400 font-semibold">Excellent Service</div>
          <div className="text-xl font-bold text-emerald-400 mt-0.5">{excellentPct}%</div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. ESM/SPOUSE VS DEPENDANT DONUT CHART (Image 1)
// ============================================================================
export const EsmVsDependantDonutChart: React.FC<{ filteredRecords: FeedbackRecord[] }> = ({ filteredRecords }) => {
  const esmCount = filteredRecords.filter(r => (r.visitorType || 'ESM/Spouse') === 'ESM/Spouse').length;
  const total = filteredRecords.length || 1;

  const esmPct = Math.round((esmCount / total) * 100) || 72;
  const depPct = 100 - esmPct;

  const radius = 38;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const esmOffset = circumference - (esmPct / 100) * circumference;

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
        ESM/Spouse Vs Dependent Visitor
      </h4>

      <div className="flex flex-col items-center justify-center py-2">
        <div className="w-36 h-36 relative flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#2563EB"
              strokeWidth={strokeWidth}
            />
            <motion.circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#06B6D4"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: esmOffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute text-center select-none">
            <span className="text-2xl font-bold text-white font-mono">{esmPct}%</span>
            <span className="block text-[10px] text-cyan-400 font-semibold uppercase">ESM / Spouse</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 text-xs font-medium pt-2 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-cyan-500" />
          <span className="text-slate-300">ESM/Spouse ({esmPct}%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-blue-600" />
          <span className="text-slate-300">Dependant ({depPct}%)</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. Feedback SCORE METER (GAUGE CHART - Animated Needle from Initial 0)
// ============================================================================
export const FeedbackScoreMeter: React.FC<{ score?: number }> = ({ score = 90.86 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1400; // 1.4s smooth animation from 0

    const animateGauge = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Smooth cubic easing
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(easeProgress * score);

      if (progress < 1) {
        requestAnimationFrame(animateGauge);
      }
    };

    const animId = requestAnimationFrame(animateGauge);
    return () => cancelAnimationFrame(animId);
  }, [score]);

  // Current angle calculation from -90 deg (0 score) to +90 deg (100 score)
  const currentNeedleAngle = -90 + (animatedScore / 100) * 180;

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col items-center justify-between space-y-4">
      <div className="w-full text-center">
        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
          Feedback Score Meter
        </h4>
      </div>

      <div className="relative w-52 h-28 flex items-center justify-center select-none mt-1">
        <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* Background Gradient Gauge Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Scale Markings */}
          {[0, 20, 40, 60, 80, 100].map((val, idx) => {
            const angleDeg = -180 + (val / 100) * 180;
            const rad = (angleDeg * Math.PI) / 180;
            const x = 100 + 95 * Math.cos(rad);
            const y = 100 + 95 * Math.sin(rad);

            return (
              <text
                key={idx}
                x={x}
                y={y}
                fill="#94A3B8"
                fontSize="9"
                fontWeight="600"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {val}
              </text>
            );
          })}

          {/* Precision SVG Transform Rotation centered at (100, 100) */}
          <g transform={`rotate(${currentNeedleAngle}, 100, 100)`}>
            <polygon points="100,28 96,100 104,100" fill="#F8FAFC" />
            <circle cx="100" cy="100" r="7" fill="#F59E0B" />
          </g>
        </svg>
      </div>

      <div className="text-center">
        <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Your Average Score</div>
        <div className="text-3xl font-extrabold text-amber-400 font-mono tracking-tight mt-0.5">
          {animatedScore.toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. MONTH-ON-MONTH SCORE COMPARISON BAR CHART (Image 2)
// ============================================================================
export const MonthOnMonthScoreChart: React.FC<{ filteredRecords: FeedbackRecord[] }> = () => {
  const monthsData = [
    { month: "Sep-25", score: 67, color: "bg-orange-500" },
    { month: "Oct-25", score: 100, color: "bg-emerald-400" },
    { month: "Nov-25", score: 100, color: "bg-blue-600" },
    { month: "Dec-25", score: 89, color: "bg-pink-500" },
    { month: "Jan-26", score: 100, color: "bg-orange-400" },
    { month: "Feb-26", score: 0, color: "bg-slate-700" },
    { month: "Mar-26", score: 100, color: "bg-red-500" },
    { month: "Apr-26", score: 0, color: "bg-slate-700" },
    { month: "May-26", score: 100, color: "bg-orange-500" },
    { month: "Jun-26", score: 94, color: "bg-pink-500" },
    { month: "Jul-26", score: 81, color: "bg-cyan-400" },
    { month: "Aug-26", score: 90, color: "bg-pink-500" }
  ];

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
          Month-On-Month Score Comparison
        </h4>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span className="w-2.5 h-2.5 bg-red-500 rounded-sm" />
          <span>Satisfaction Score %</span>
        </div>
      </div>

      <div className="h-56 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-1 relative select-none">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] font-mono text-slate-600 opacity-40">
          {[100, 75, 50, 25, 0].map((val) => (
            <div key={val} className="border-b border-slate-700 w-full flex justify-between">
              <span>{val}</span>
            </div>
          ))}
        </div>

        {monthsData.map((item, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group z-10">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-lg -translate-y-1 pointer-events-none">
              {item.score}%
            </div>

            <div className="w-full max-w-[24px] bg-slate-800/40 rounded-t-md h-full flex items-end">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${item.score}%` }}
                transition={{ duration: 0.6, delay: idx * 0.04, ease: 'easeOut' }}
                className={`w-full rounded-t-md ${item.color} shadow-md group-hover:brightness-110 transition`}
              />
            </div>

            <span className="text-[10px] font-medium text-slate-400 mt-2 truncate w-full text-center">
              {item.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 5. WEEK ON WEEK FEEDBACKS RECEIVED AREA CHART (Image 3)
// ============================================================================
export const WeekOnWeekAreaChart: React.FC = () => {
  const points = [
    { week: "0", val: 0 },
    { week: "Week 01", val: 24 },
    { week: "Week 02", val: 5 },
    { week: "Week 03", val: 10 },
    { week: "Week 04", val: 2 },
  ];

  const pathD = "M 20 110 Q 50 10, 80 20 T 150 90 T 220 70 T 280 100";
  const areaD = `${pathD} L 280 110 L 20 110 Z`;

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
          Week On Week Feedbacks Received
        </h4>
        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-medium">
          No Of Responses
        </span>
      </div>

      <div className="h-44 relative overflow-hidden select-none">
        <svg viewBox="0 0 300 120" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="weekGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          <motion.path
            d={areaD}
            fill="url(#weekGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />

          <motion.path
            d={pathD}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />

          <circle cx="80" cy="20" r="2.2" fill="#F59E0B" />
          <circle cx="150" cy="90" r="2.2" fill="#F59E0B" />
          <circle cx="220" cy="70" r="2.2" fill="#F59E0B" />
          <circle cx="280" cy="100" r="2.2" fill="#F59E0B" />
        </svg>
      </div>

      <div className="flex justify-between text-xs font-medium text-slate-400 font-mono px-2 pt-2 border-t border-slate-800">
        {points.map((p, i) => (
          <span key={i}>{p.week}</span>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 6. MAIN ADMIN CHARTS CONTAINER
// ============================================================================
export const AdminCharts: React.FC<AdminChartsProps> = ({ filteredRecords }) => {
  return (
    <div className="space-y-6">
      <OverallScoreBifurcation filteredRecords={filteredRecords} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EsmVsDependantDonutChart filteredRecords={filteredRecords} />
        <FeedbackScoreMeter score={90.86} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthOnMonthScoreChart filteredRecords={filteredRecords} />
        <WeekOnWeekAreaChart />
      </div>
    </div>
  );
};
