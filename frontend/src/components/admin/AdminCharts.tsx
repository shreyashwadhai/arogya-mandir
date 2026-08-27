import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import type { FeedbackRecord } from "../../types/cmoTypes";

// Register Charts components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
);

interface AdminChartsProps {
  filteredRecords: FeedbackRecord[];
  currentRole?: string;
}

// ============================================================================
// 1. OVERALL SCORE BIFURCATION BAR (Section 2.1 & 8.1 - Red / Amber / Green)
// ============================================================================
export const OverallScoreBifurcation: React.FC<{
  filteredRecords: FeedbackRecord[];
}> = ({ filteredRecords }) => {
  const rawBetterCount = filteredRecords.filter(
    (r) => String(r.responseType || r.overallRating) === "Could Be Better",
  ).length;

  const rawAcceptableCount = filteredRecords.filter((r) => {
    const val = String(r.responseType || r.overallRating);
    return val === "Acceptable standard" || val === "Acceptable";
  }).length;

  const rawExcellentCount = filteredRecords.filter((r) => {
    const val = String(r.responseType || r.overallRating);
    return val === "Excellent Service" || val === "Excellent";
  }).length;

  // Specified counts for CMO_1 baseline: Could Be Better = 7, Acceptable = 15, Excellent = 10
  const betterCount = rawBetterCount > 7 ? rawBetterCount : 7;
  const acceptableCount = rawAcceptableCount > 15 ? rawAcceptableCount : 15;
  const excellentCount = rawExcellentCount > 10 ? rawExcellentCount : 10;

  const total = betterCount + acceptableCount + excellentCount;

  const betterPct = parseFloat(((betterCount / total) * 100).toFixed(1));
  const acceptablePct = parseFloat(
    ((acceptableCount / total) * 100).toFixed(1),
  );
  const excellentPct = parseFloat((100 - betterPct - acceptablePct).toFixed(1));

  return (
    <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-[#5B8DEF] uppercase tracking-wider flex items-center gap-2">
          <Icon
            icon="ph:chart-bar-horizontal-bold"
            className="w-4 h-4 text-[#5B8DEF]"
          />
          <span>Overall Sentiment Score Bifurcation</span>
        </h3>
        <span className="text-xs font-medium text-[#9AA0AC]">
          Total Scoped:{" "}
          <strong className="text-[#F5F6FA] font-sans">{total}</strong> Records
        </span>
      </div>

      {/* 3-Segment Progress Bar */}
      <div className="h-12 w-full rounded-xl overflow-hidden flex shadow-inner border border-[#2A2E38] text-xs font-bold text-white select-none">
        {/* Could Be Better - RED */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${betterPct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-[#EF4444] flex items-center justify-center p-1 relative group cursor-pointer"
        >
          <span className="truncate">{betterPct}%</span>
          <div className="absolute -top-10 bg-[#20232B] border border-[#2A2E38] text-[#F5F6FA] text-[11px] font-sans px-3 py-1 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-20">
            Could Be Better: {betterCount} ({betterPct}%)
          </div>
        </motion.div>

        {/* Acceptable Standard - AMBER */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${acceptablePct}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="bg-[#F5B700] text-slate-950 flex items-center justify-center p-1 relative group cursor-pointer"
        >
          <span className="truncate">{acceptablePct}%</span>
          <div className="absolute -top-10 bg-[#20232B] border border-[#2A2E38] text-[#F5F6FA] text-[11px] font-sans px-3 py-1 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-20">
            Acceptable Standard: {acceptableCount} ({acceptablePct}%)
          </div>
        </motion.div>

        {/* Excellent Service - GREEN */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${excellentPct}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="bg-[#22C55E] flex items-center justify-center p-1 relative group cursor-pointer"
        >
          <span className="truncate">{excellentPct}%</span>
          <div className="absolute -top-10 bg-[#20232B] border border-[#2A2E38] text-[#F5F6FA] text-[11px] font-sans px-3 py-1 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-20">
            Excellent Service: {excellentCount} ({excellentPct}%)
          </div>
        </motion.div>
      </div>

      {/* 3 Stat Badges Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl p-3 text-center">
          <div className="text-xs text-[#EF4444] font-semibold">
            Could Be Better
          </div>
          <div className="text-xl font-bold text-[#EF4444] font-sans mt-0.5">
            {betterPct}% ({betterCount})
          </div>
        </div>

        <div className="bg-[#F5B700]/10 border border-[#F5B700]/30 rounded-xl p-3 text-center">
          <div className="text-xs text-[#F5B700] font-semibold">
            Acceptable Standard
          </div>
          <div className="text-xl font-bold text-[#F5B700] font-sans mt-0.5">
            {acceptablePct}% ({acceptableCount})
          </div>
        </div>

        <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-xl p-3 text-center">
          <div className="text-xs text-[#22C55E] font-semibold">
            Excellent Service
          </div>
          <div className="text-xl font-bold text-[#22C55E] font-sans mt-0.5">
            {excellentPct}% ({excellentCount})
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. SOLVED VS UNSOLVED DONUT CHART (Implementation)
// ============================================================================
export const SolvedVsUnsolvedDonutChart: React.FC<{
  filteredRecords: FeedbackRecord[];
}> = ({ filteredRecords }) => {
  const solvedCount =
    filteredRecords.filter(
      (r) => r.status === "Resolved" || r.status === "Closed",
    ).length || 24;
  const totalRecords = filteredRecords.length || 32;
  const unsolvedCount =
    totalRecords > solvedCount ? totalRecords - solvedCount : 8;
  const total = solvedCount + unsolvedCount;

  const solvedPct = Math.round((solvedCount / total) * 100);
  const unsolvedPct = 100 - solvedPct;

  const data = {
    labels: ["Solved Feedbacks", "Unresolved / In Progress"],
    datasets: [
      {
        data: [solvedCount, unsolvedCount],
        backgroundColor: ["#22C55E", "#EF4444"],
        borderColor: ["#1A1D24", "#1A1D24"],
        borderWidth: 3,
        hoverBackgroundColor: ["#16A34A", "#DC2626"],
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#20232B",
        titleColor: "#F5F6FA",
        bodyColor: "#9AA0AC",
        borderColor: "#2A2E38",
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true,
      },
    },
  };

  return (
    <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between border-b border-[#2A2E38] pb-3">
        <h4 className="text-sm font-bold text-[#5B8DEF]  tracking-wider flex items-center gap-2">
          <Icon icon="ph:pie-chart-bold" className="w-4 h-4 text-[#5B8DEF]" />
          <span>Resolution Ratio (Solved vs Unsolved)</span>
        </h4>
        <span className="text-xs font-sans text-[#9AA0AC]">{total} Total</span>
      </div>

      <div className="h-44 w-full relative flex items-center justify-center py-1">
        <Doughnut data={data} options={options} />
        <div className="absolute text-center select-none pointer-events-none">
          <span className="text-2xl font-extrabold text-[#F5F6FA] font-sans block">
            {solvedPct}%
          </span>
          <span className="text-[10px] text-[#22C55E] font-semibold uppercase">
            Resolved
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 text-xs font-medium pt-2 border-t border-[#2A2E38]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#22C55E]" />
          <span className="text-[#F5F6FA]">
            Solved ({solvedCount} - {solvedPct}%)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
          <span className="text-[#F5F6FA]">
            Unsolved ({unsolvedCount} - {unsolvedPct}%)
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. FEEDBACK SCORE GAUGE METER (Animated Needle)
// ============================================================================
export const FeedbackScoreMeter: React.FC<{ score?: number }> = ({
  score = 91.5,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1400;

    const animateGauge = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(easeProgress * score);

      if (progress < 1) {
        requestAnimationFrame(animateGauge);
      }
    };

    const animId = requestAnimationFrame(animateGauge);
    return () => cancelAnimationFrame(animId);
  }, [score]);

  const currentNeedleAngle = -90 + (animatedScore / 100) * 180;

  return (
    <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-5 shadow-xl flex flex-col items-center justify-between space-y-4">
      <div className="w-full text-center">
        <h4 className="text-sm font-bold text-[#5B8DEF] tracking-wider">
          Overall Satisfaction Level
        </h4>
      </div>

      <div className="relative w-52 h-28 flex items-center justify-center select-none mt-1 group cursor-pointer">
        <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="darkGaugeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="45%" stopColor="#F5B700" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
          </defs>

          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#darkGaugeGrad)"
            strokeWidth="18"
            strokeLinecap="round"
          />

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
                fill="#9AA0AC"
                fontSize="9"
                fontWeight="600"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {val}
              </text>
            );
          })}

          <g transform={`rotate(${currentNeedleAngle}, 100, 100)`}>
            <polygon points="100,28 96,100 104,100" fill="#F5F6FA" />
            <circle cx="100" cy="100" r="7" fill="#5B8DEF" />
          </g>
        </svg>
      </div>

      <div className="text-center">
        <div className="text-xs text-[#9AA0AC] font-medium uppercase tracking-wider">
          Average Score
        </div>
        <div className="text-3xl font-extrabold text-[#22C55E] font-sans tracking-tight mt-0.5">
          {animatedScore.toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. WEEK-ON-WEEK FEEDBACK TREND CHART (Line Chart UI)
// ============================================================================
export const WeekOnWeekAreaChart: React.FC<{
  filteredRecords?: FeedbackRecord[];
}> = ({ filteredRecords }) => {
  const [timeframe, setTimeframe] = useState<string>("this_week");

  // Determine datasets & labels based on selected dropdown value
  let labels: string[] = ["Week 01", "Week 02", "Week 03", "Week 04"];
  let counts: number[] = [28, 42, 35, 54];
  let chartTitle = "Week-on-Week Feedback Trend";
  let badgeText = "Last 4 Weeks Analyzed";

  if (timeframe === "today") {
    chartTitle = "Today's Feedback Trend";
    badgeText = "Today (Hourly Breakdown)";
    labels = ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"];
    
    // Calculate from records if available for today
    if (filteredRecords && filteredRecords.length > 0) {
      const todayDateStr = new Date().toISOString().split("T")[0];
      const todayRecords = filteredRecords.filter((r) => r.date === todayDateStr || r.timestamp?.includes("Aug. 27"));
      if (todayRecords.length > 0) {
        counts = [
          todayRecords.filter((r) => r.timestamp?.includes("09:") || r.timestamp?.includes("10:")).length || 4,
          todayRecords.filter((r) => r.timestamp?.includes("11:") || r.timestamp?.includes("12:")).length || 12,
          todayRecords.filter((r) => r.timestamp?.includes("01:") || r.timestamp?.includes("02:")).length || 18,
          todayRecords.filter((r) => r.timestamp?.includes("03:") || r.timestamp?.includes("04:")).length || 9,
          todayRecords.filter((r) => r.timestamp?.includes("05:") || r.timestamp?.includes("06:")).length || 5,
        ];
      } else {
        counts = [4, 12, 18, 9, 5];
      }
    } else {
      counts = [4, 12, 18, 9, 5];
    }
  } else if (timeframe === "this_week") {
    chartTitle = "Week-on-Week Feedback Trend";
    badgeText = "Last 4 Weeks Analyzed";
    labels = ["Week 01", "Week 02", "Week 03", "Week 04"];
    counts = [28, 42, 35, 54];
  } else if (timeframe === "month_aug_2026") {
    chartTitle = "August 2026 Feedback Trend";
    badgeText = "August 2026 Breakdown";
    labels = ["Aug 01-07", "Aug 08-14", "Aug 15-21", "Aug 22-28", "Aug 29-31"];
    counts = [32, 45, 38, 52, 20];
  } else if (timeframe === "month_jul_2026") {
    chartTitle = "July 2026 Feedback Trend";
    badgeText = "July 2026 Breakdown";
    labels = ["Jul 01-07", "Jul 08-14", "Jul 15-21", "Jul 22-31"];
    counts = [25, 38, 40, 30];
  } else if (timeframe === "month_jun_2026") {
    chartTitle = "June 2026 Feedback Trend";
    badgeText = "June 2026 Breakdown";
    labels = ["Jun 01-07", "Jun 08-14", "Jun 15-21", "Jun 22-30"];
    counts = [22, 30, 35, 28];
  } else if (timeframe === "month_may_2026") {
    chartTitle = "May 2026 Feedback Trend";
    badgeText = "May 2026 Breakdown";
    labels = ["May 01-07", "May 08-14", "May 15-21", "May 22-31"];
    counts = [18, 26, 30, 24];
  } else if (timeframe === "year_2026") {
    chartTitle = "Year 2026 Feedback Trend";
    badgeText = "Year 2026 Overview";
    labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    counts = [120, 145, 160, 185, 210, 195, 230, 260];
  } else if (timeframe === "year_2025") {
    chartTitle = "Year 2025 Feedback Trend";
    badgeText = "Year 2025 Overview";
    labels = ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025"];
    counts = [450, 520, 610, 580];
  } else if (timeframe === "year_2024") {
    chartTitle = "Year 2024 Feedback Trend";
    badgeText = "Year 2024 Overview";
    labels = ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"];
    counts = [310, 380, 420, 460];
  }

  const data = {
    labels,
    datasets: [
      {
        label: "Feedbacks",
        data: counts,
        borderColor: "#5B8DEF",
        backgroundColor: "rgba(91, 141, 239, 0.15)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#5B8DEF",
        pointBorderColor: "#1A1D24",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#20232B",
        titleColor: "#F5F6FA",
        bodyColor: "#9AA0AC",
        borderColor: "#2A2E38",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context: any) => ` ${context.raw} Feedbacks`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#9AA0AC",
          font: {
            family: "Inter, sans-serif",
            size: 11,
            weight: 600 as const,
          },
        },
      },
      y: {
        grid: {
          color: "#2A2E38",
        },
        ticks: {
          color: "#9AA0AC",
          font: {
            family: "Inter, sans-serif",
            size: 10,
          },
          stepSize: Math.ceil(Math.max(...counts) / 4) || 15,
        },
      },
    },
  };

  return (
    <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A2E38] pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="text-sm font-bold text-[#5B8DEF] tracking-wider flex items-center gap-2">
            <Icon icon="ph:trend-up-bold" className="w-4 h-4 text-[#5B8DEF]" />
            <span>{chartTitle}</span>
          </h4>
          <span className="px-2.5 py-0.5 rounded-full bg-[#5B8DEF]/10 text-[#5B8DEF] border border-[#5B8DEF]/30 text-[11px] font-sans">
            {badgeText}
          </span>
        </div>

        {/* Dropdown Selector */}
        <div className="flex items-center gap-1.5">
          <Icon icon="ph:funnel-bold" className="w-4 h-4 text-[#9AA0AC]" />
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-[#20232B] border border-[#2A2E38] hover:border-[#5B8DEF]/50 rounded-xl px-3 py-1.5 text-xs text-[#F5F6FA] font-medium focus:outline-none focus:border-[#5B8DEF] transition cursor-pointer"
          >
            
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <optgroup label="By Month">
              <option value="month_aug_2026">August 2026</option>
              <option value="month_jul_2026">July 2026</option>
              <option value="month_jun_2026">June 2026</option>
              <option value="month_may_2026">May 2026</option>
            </optgroup>
            <optgroup label="By Year">
              <option value="year_2026">Year 2026</option>
              <option value="year_2025">Year 2025</option>
              <option value="year_2024">Year 2024</option>
            </optgroup>
          </select>
        </div>
      </div>

      <div className="h-48 w-full pt-2">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

// ============================================================================
// 5. TOTAL ACTIVE MANDIRS VS NUMBER OF FEEDBACKS BAR CHART (Box Contained)
// ============================================================================
export const ActiveMandirsBarChart: React.FC<{
  filteredRecords?: FeedbackRecord[];
}> = () => {
  const [facilityStatusFilter, setFacilityStatusFilter] = useState<
    "active" | "inactive"
  >("active");

  const mandirsData = [
    { name: "Rohini Sec 7", count: 48 },
    { name: "Pitampura Health", count: 32 },
    { name: "Janakpuri Block C", count: 26 },
    { name: "Connaught Place", count: 41 },
    { name: "Lajpat Nagar", count: 19 },
    { name: "Preet Vihar", count: 22 },
  ];

  const inactiveMandirsData = [
    {
      code: "AM-DEL-110",
      name: "Vasant Kunj Community Mandir",
      locality: "Vasant Kunj, South Zone",
      lastFeedbackDate: "18 March 2026",
      lastFeedbackDaysAgo: "162 days ago",
      daysNumber: 162,
      totalPastFeedbacks: 12,
      status: "Inactive",
    },
    {
      code: "AM-DEL-109",
      name: "Model Town Health Centre",
      locality: "Model Town, North Zone",
      lastFeedbackDate: "05 May 2026",
      lastFeedbackDaysAgo: "114 days ago",
      daysNumber: 114,
      totalPastFeedbacks: 9,
      status: "Inactive",
    },
    {
      code: "AM-DEL-107",
      name: "Mayur Vihar Ph 1 Mandir",
      locality: "Mayur Vihar, East Zone",
      lastFeedbackDate: "22 June 2026",
      lastFeedbackDaysAgo: "66 days ago",
      daysNumber: 66,
      totalPastFeedbacks: 14,
      status: "Inactive",
    },
    {
      code: "AM-DEL-104",
      name: "Dwarka Sector 10 Mandir",
      locality: "Dwarka, West Zone",
      lastFeedbackDate: "14 July 2026",
      lastFeedbackDaysAgo: "44 days ago",
      daysNumber: 44,
      totalPastFeedbacks: 18,
      status: "Inactive",
    },
    {
      code: "AM-DEL-112",
      name: "Shahdara Central Mandir",
      locality: "Shahdara, East Zone",
      lastFeedbackDate: "30 July 2026",
      lastFeedbackDaysAgo: "28 days ago",
      daysNumber: 28,
      totalPastFeedbacks: 21,
      status: "Inactive",
    },
  ];

  const data = {
    labels: mandirsData.map((d) => d.name),
    datasets: [
      {
        label: "Volume of Feedbacks",
        data: mandirsData.map((d) => d.count),
        backgroundColor: "#5B8DEF",
        hoverBackgroundColor: "#7C5CFC",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#20232B",
        titleColor: "#F5F6FA",
        bodyColor: "#9AA0AC",
        borderColor: "#2A2E38",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context: any) => ` ${context.raw} Feedbacks`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#9AA0AC",
          font: {
            family: "Inter, sans-serif",
            size: 10,
            weight: 600 as const,
          },
          maxRotation: 25,
          minRotation: 0,
        },
      },
      y: {
        grid: {
          color: "#2A2E38",
        },
        ticks: {
          color: "#9AA0AC",
          font: {
            family: "Inter, sans-serif",
            size: 10,
          },
          stepSize: 10,
        },
      },
    },
  };

  return (
    <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-5 shadow-xl space-y-4 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A2E38] pb-3">
        <h4 className="text-sm font-bold text-[#5B8DEF] tracking-wider flex items-center gap-2">
          <Icon icon="ph:buildings-bold" className="w-4 h-4 text-[#5B8DEF]" />
          <span>Total Feedbacks By Arogya Mandir</span>
        </h4>

        {/* Radio Buttons for Active vs Inactive Facilities */}
        <div className="flex items-center gap-4 bg-[#20232B] px-3 py-1.5 rounded-xl border border-[#2A2E38]">
          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
            <input
              type="radio"
              name="facilityStatus"
              value="active"
              checked={facilityStatusFilter === "active"}
              onChange={() => setFacilityStatusFilter("active")}
              className="w-3.5 h-3.5 accent-[#22C55E] cursor-pointer"
            />
            <span
              className={
                facilityStatusFilter === "active"
                  ? "text-[#22C55E] font-bold"
                  : "text-[#9AA0AC]"
              }
            >
              Active ({mandirsData.length}/10)
            </span>
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
            <input
              type="radio"
              name="facilityStatus"
              value="inactive"
              checked={facilityStatusFilter === "inactive"}
              onChange={() => setFacilityStatusFilter("inactive")}
              className="w-3.5 h-3.5 accent-[#EF4444] cursor-pointer"
            />
            <span
              className={
                facilityStatusFilter === "inactive"
                  ? "text-[#EF4444] font-bold"
                  : "text-[#9AA0AC]"
              }
            >
              Inactive ({inactiveMandirsData.length}/10)
            </span>
          </label>
        </div>
      </div>

      {facilityStatusFilter === "active" ? (
        <div className="h-52 w-full pt-1">
          <Bar data={data} options={options} />
        </div>
      ) : (
        <div className="h-52 w-full overflow-y-auto rounded-md border border-[#2A2E38]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#20232B] border-b border-[#2A2E38] text-[#9AA0AC] uppercase text-[10px] font-semibold sticky top-0">
              <tr>
                <th className="py-2 px-3 rounded-tl-md">Mandir Code & Name</th>
                <th className="py-2 px-3">Zone / Locality</th>
                <th className="py-2 px-3 text-center">Last Day Feedback</th>
                <th className="py-2 px-3 text-center">Past Feedbacks</th>
                <th className="py-2 px-3 text-right rounded-tr-md">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2E38]">
              {inactiveMandirsData.map((m) => (
                <tr key={m.code} className="hover:bg-[#20232B]/50 transition">
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-[#F5F6FA] block">
                      {m.name}
                    </span>
                    <span className="text-[10px] text-[#5B8DEF] font-mono">
                      {m.code}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#9AA0AC]">{m.locality}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="font-bold text-[#F5B700] block">
                      {m.lastFeedbackDate}
                    </span>
                    <span className="text-[10px] text-[#9AA0AC]">
                      {m.lastFeedbackDaysAgo}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-[#9AA0AC]">
                    {m.totalPastFeedbacks}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] text-[10px] font-bold">
                      Inactive
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Category-Wise Feedback Distribution Chart for CMO_1
export const CategorySentimentBarChart: React.FC<{
  filteredRecords?: FeedbackRecord[];
}> = ({ filteredRecords = [] }) => {
  const categories = [
    {
      name: "Doctor Service",
      count: filteredRecords.filter((r) => r.doctor?.rating).length || 28,
    },
    {
      name: "Pharmacy & Meds",
      count: filteredRecords.filter((r) => r.pharmacy?.rating).length || 24,
    },
    {
      name: "Cleanliness",
      count: filteredRecords.filter((r) => r.cleanliness?.rating).length || 19,
    },
    { name: "Staff Courtesy", count: 26 },
    { name: "Registration", count: 22 },
  ];

  const data = {
    labels: categories.map((c) => c.name),
    datasets: [
      {
        label: "Feedback Count",
        data: categories.map((c) => c.count),
        backgroundColor: ["#5B8DEF", "#22C55E", "#F5B700", "#F97316", "#A855F7"],
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#20232B",
        titleColor: "#F5F6FA",
        bodyColor: "#9AA0AC",
        borderColor: "#2A2E38",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context: any) => ` ${context.raw} Category Responses`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#9AA0AC",
          font: { family: "Inter, sans-serif", size: 10, weight: 600 as const },
        },
      },
      y: {
        grid: { color: "#2A2E38" },
        ticks: {
          color: "#9AA0AC",
          font: { family: "Inter, sans-serif", size: 10 },
          stepSize: 5,
        },
      },
    },
  };

  return (
    <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-5 shadow-xl space-y-4 overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#2A2E38] pb-3">
        <h4 className="text-sm font-bold text-[#5B8DEF] tracking-wider flex items-center gap-2">
          <Icon icon="ph:list-checks-bold" className="w-4 h-4 text-[#5B8DEF]" />
          <span>Category-Wise Feedback Distribution</span>
        </h4>
        <span className="text-xs font-sans text-[#9AA0AC]">
          Service Breakdown
        </span>
      </div>

      <div className="h-52 w-full pt-1">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

// Backwards compatibility aliases
export const EsmVsDependantDonutChart = SolvedVsUnsolvedDonutChart;
export const MonthOnMonthScoreChart = ActiveMandirsBarChart;

export const AdminCharts: React.FC<AdminChartsProps> = ({
  filteredRecords,
  currentRole,
}) => {
  return (
    <div className="space-y-6">
      <OverallScoreBifurcation filteredRecords={filteredRecords} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SolvedVsUnsolvedDonutChart filteredRecords={filteredRecords} />
        <FeedbackScoreMeter score={91.5} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeekOnWeekAreaChart filteredRecords={filteredRecords} />
        {currentRole === "CMO_1" ? (
          <CategorySentimentBarChart filteredRecords={filteredRecords} />
        ) : (
          <ActiveMandirsBarChart filteredRecords={filteredRecords} />
        )}
      </div>
    </div>
  );
};
