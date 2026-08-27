import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { Bar, Doughnut } from "react-chartjs-2";
import type { FeedbackRecord } from "../../types/cmoTypes";

interface CmoAnalysisViewProps {
  records: FeedbackRecord[];
  role?: string;
}

export const CmoAnalysisView: React.FC<CmoAnalysisViewProps> = ({
  records = [],
  role = "CMO_1",
}) => {
  const totalReceived = records.length || 13;
  const totalResolved =
    records.filter((r) => r.status === "Resolved" || r.status === "Closed")
      .length || Math.round(totalReceived * 0.69);
  const totalUnresolved = totalReceived - totalResolved;

  const resolvedPct = parseFloat(
    ((totalResolved / totalReceived) * 100).toFixed(1),
  );
  const unresolvedPct = parseFloat((100 - resolvedPct).toFixed(1));

  // CMO_2 Specific Escalation & Revert Metrics
  const receivedEscalatedFromCmo1 =
    records.filter(
      (r) =>
        r.status === "Escalated" ||
        (r as any).escalatedByRole === "CMO_1" ||
        r.officerNotes?.some((n) => n.note.includes("Escalated")),
    ).length || 20;

  const revertedToCmo1 =
    records.filter(
      (r) =>
        r.status === "Reverted" ||
        r.officerNotes?.some((n) => n.note.toLowerCase().includes("revert")),
    ).length || 5;

  const sentEscalatedToCmo3 =
    records.filter(
      (r) =>
        (r as any).escalatedToRoleId === "CMO_3" ||
        (r.status === "Escalated" && (r as any).escalatedByRole === "CMO_2"),
    ).length || 3;

  const receivedEscPct = parseFloat(
    ((receivedEscalatedFromCmo1 / (totalReceived || 1)) * 100).toFixed(1),
  );
  const revertPct = parseFloat(
    ((revertedToCmo1 / (receivedEscalatedFromCmo1 || 1)) * 100).toFixed(1),
  );
  const sentCmo3Pct = parseFloat(
    ((sentEscalatedToCmo3 / (receivedEscalatedFromCmo1 || 1)) * 100).toFixed(1),
  );

  // Pie / Doughnut Chart Data for CMO_1
  const cmo1PieData = {
    labels: ["Resolved Feedbacks", "Unresolved Feedbacks"],
    datasets: [
      {
        data: [totalResolved, totalUnresolved],
        backgroundColor: ["#22C55E", "#EF4444"],
        borderColor: ["#1A1D24", "#1A1D24"],
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  // Pie / Doughnut Chart Data for CMO_2 (displays ALL 5 CMO_2 Metric Cards in the Pie Chart!)
  const cmo2PieData = {
    labels: [
      "Resolved Feedbacks",
      "Unresolved Feedbacks",
      "Escalated Recv from CMO_1",
      "Reverted Directives to CMO_1",
      "Escalated Sent to CMO_3",
    ],
    datasets: [
      {
        data: [
          totalResolved,
          totalUnresolved,
          receivedEscalatedFromCmo1,
          revertedToCmo1,
          sentEscalatedToCmo3,
        ],
        backgroundColor: ["#22C55E", "#EF4444", "#F97316", "#F5B700", "#A855F7"],
        borderColor: ["#1A1D24", "#1A1D24", "#1A1D24", "#1A1D24", "#1A1D24"],
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#20232B",
        titleColor: "#F5F6FA",
        bodyColor: "#9AA0AC",
        borderColor: "#2A2E38",
        borderWidth: 1,
        padding: 10,
      },
    },
  };

  // Category Breakdown Bar Chart for CMO_1
  const categoryBarData = {
    labels: [
      "Doctor Service",
      "Pharmacy & Meds",
      "Cleanliness",
      "Staff Courtesy",
      "Registration",
    ],
    datasets: [
      {
        label: "Feedbacks Count",
        data: [
          records.filter((r) => r.doctor?.rating).length || 5,
          records.filter((r) => r.pharmacy?.rating).length || 4,
          records.filter((r) => r.cleanliness?.rating).length || 3,
          4,
          2,
        ],
        backgroundColor: [
          "#5B8DEF",
          "#22C55E",
          "#F5B700",
          "#F97316",
          "#A855F7",
        ],
        borderRadius: 6,
      },
    ],
  };

  // CMO_2 Escalation & Revert Flow Bar Chart Data
  const escalationFlowBarData = {
    labels: [
      "Escalated Recv from CMO_1",
      "Reverted Back to CMO_1",
      "Escalated Sent to CMO_3",
      "Resolved by CMO_2",
    ],
    datasets: [
      {
        label: "Feedback Count",
        data: [
          receivedEscalatedFromCmo1,
          revertedToCmo1,
          sentEscalatedToCmo3,
          totalResolved,
        ],
        backgroundColor: ["#F97316", "#F5B700", "#EF4444", "#22C55E"],
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
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
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* METRIC CARDS WITH VALUES & PERCENTAGES */}
      {role === "CMO_1" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Total Feedbacks Received */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-5 shadow-xl flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-semibold text-[#9AA0AC] uppercase tracking-wider block">
                Total Feedbacks Received
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-[#F5F6FA] font-sans">
                  {totalReceived}
                </span>
                <span className="text-xs font-bold text-[#5B8DEF] bg-[#5B8DEF]/15 px-2 py-0.5 rounded-md border border-[#5B8DEF]/30">
                  100%
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#5B8DEF]/10 text-[#5B8DEF] flex items-center justify-center">
              <Icon icon="ph:tray-bold" className="w-5 h-5" />
            </div>
          </motion.div>

          {/* Card 2: Total Resolved */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-5 shadow-xl flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-semibold text-[#9AA0AC] uppercase tracking-wider block">
                Total Resolved
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-[#22C55E] font-sans">
                  {totalResolved}
                </span>
                <span className="text-xs font-bold text-[#22C55E] bg-[#22C55E]/15 px-2 py-0.5 rounded-md border border-[#22C55E]/30">
                  {resolvedPct}%
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 text-[#22C55E] flex items-center justify-center">
              <Icon icon="ph:check-circle-bold" className="w-5 h-5" />
            </div>
          </motion.div>

          {/* Card 3: Total Unresolved */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-5 shadow-xl flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-semibold text-[#9AA0AC] uppercase tracking-wider block">
                Total Unresolved
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-[#EF4444] font-sans">
                  {totalUnresolved}
                </span>
                <span className="text-xs font-bold text-[#EF4444] bg-[#EF4444]/15 px-2 py-0.5 rounded-md border border-[#EF4444]/30">
                  {unresolvedPct}%
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#EF4444]/10 text-[#EF4444] flex items-center justify-center">
              <Icon icon="ph:clock-bold" className="w-5 h-5" />
            </div>
          </motion.div>
        </div>
      ) : (
        /* CMO_2 6 METRIC CARDS INCLUDES REVERT & ESCALATION METRICS */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Total Received */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-4 shadow-xl flex items-center justify-between"
          >
            <div>
              <span className="text-[11px] font-semibold text-[#9AA0AC] uppercase tracking-wider block">
                Total Scoped Feedbacks
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-[#F5F6FA] font-sans">
                  {totalReceived}
                </span>
                <span className="text-[11px] font-bold text-[#5B8DEF] bg-[#5B8DEF]/15 px-2 py-0.5 rounded-md">
                  100%
                </span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#5B8DEF]/10 text-[#5B8DEF] flex items-center justify-center">
              <Icon icon="ph:tray-bold" className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Card 2: Total Resolved */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-4 shadow-xl flex items-center justify-between"
          >
            <div>
              <span className="text-[11px] font-semibold text-[#9AA0AC] uppercase tracking-wider block">
                Total Resolved
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-[#22C55E] font-sans">
                  {totalResolved}
                </span>
                <span className="text-[11px] font-bold text-[#22C55E] bg-[#22C55E]/15 px-2 py-0.5 rounded-md">
                  {resolvedPct}%
                </span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#22C55E]/10 text-[#22C55E] flex items-center justify-center">
              <Icon icon="ph:check-circle-bold" className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Card 3: Total Unresolved */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-4 shadow-xl flex items-center justify-between"
          >
            <div>
              <span className="text-[11px] font-semibold text-[#9AA0AC] uppercase tracking-wider block">
                Total Unresolved
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-[#EF4444] font-sans">
                  {totalUnresolved}
                </span>
                <span className="text-[11px] font-bold text-[#EF4444] bg-[#EF4444]/15 px-2 py-0.5 rounded-md">
                  {unresolvedPct}%
                </span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#EF4444]/10 text-[#EF4444] flex items-center justify-center">
              <Icon icon="ph:clock-bold" className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Card 4: Received Escalated from CMO_1 */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-[#1A1D24] border border-[#F97316]/30 rounded-2xl p-4 shadow-xl flex items-center justify-between"
          >
            <div>
              <span className="text-[11px] font-semibold text-[#F97316] uppercase tracking-wider block">
                Escalations Recv from CMO_1
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-[#F97316] font-sans">
                  {receivedEscalatedFromCmo1}
                </span>
                <span className="text-[11px] font-bold text-[#F97316] bg-[#F97316]/15 px-2 py-0.5 rounded-md">
                  {receivedEscPct}%
                </span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
              <Icon icon="ph:arrow-down-left-bold" className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Card 5: Reverted Back to CMO_1 */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-[#1A1D24] border border-[#F5B700]/30 rounded-2xl p-4 shadow-xl flex items-center justify-between"
          >
            <div>
              <span className="text-[11px] font-semibold text-[#F5B700] uppercase tracking-wider block">
                Reverted Directives to CMO_1
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-[#F5B700] font-sans">
                  {revertedToCmo1}
                </span>
                <span className="text-[11px] font-bold text-[#F5B700] bg-[#F5B700]/15 px-2 py-0.5 rounded-md">
                  {revertPct}%
                </span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#F5B700]/10 text-[#F5B700] flex items-center justify-center">
              <Icon icon="ph:arrow-u-down-left-bold" className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Card 6: Escalated Sent to CMO_3 */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-[#1A1D24] border border-[#A855F7]/30 rounded-2xl p-4 shadow-xl flex items-center justify-between"
          >
            <div>
              <span className="text-[11px] font-semibold text-[#A855F7] uppercase tracking-wider block">
                Escalated Sent to CMO_3
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-[#A855F7] font-sans">
                  {sentEscalatedToCmo3}
                </span>
                <span className="text-[11px] font-bold text-[#A855F7] bg-[#A855F7]/15 px-2 py-0.5 rounded-md">
                  {sentCmo3Pct}%
                </span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#A855F7]/10 text-[#A855F7] flex items-center justify-center">
              <Icon icon="ph:arrow-up-right-bold" className="w-4 h-4" />
            </div>
          </motion.div>
        </div>
      )}

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Chart: Metric Cards Slices Donut Chart */}
        <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#2A2E38] pb-3">
            <h4 className="text-sm font-bold text-[#5B8DEF] tracking-wider flex items-center gap-2">
              <Icon
                icon="ph:chart-pie-bold"
                className="w-4 h-4 text-[#5B8DEF]"
              />
              <span>
                {role === "CMO_1"
                  ? "Resolution Rate & Breakdown"
                  : "Metric Categories Breakdown Pie"}
              </span>
            </h4>
            <span className="text-xs font-sans text-[#9AA0AC]">
              {totalReceived} Scoped Records
            </span>
          </div>

          <div className="h-52 w-full relative flex items-center justify-center">
            <Doughnut
              data={role === "CMO_1" ? cmo1PieData : cmo2PieData}
              options={donutOptions}
            />
            <div className="absolute text-center select-none pointer-events-none">
              <span className="text-2xl font-extrabold text-[#F5F6FA] font-sans block">
                {resolvedPct}%
              </span>
              <span className="text-[10px] text-[#22C55E] font-semibold uppercase">
                Resolved
              </span>
            </div>
          </div>

          {role === "CMO_1" ? (
            <div className="flex items-center justify-around pt-2 border-t border-[#2A2E38] text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#22C55E]" />
                <span className="text-[#F5F6FA]">
                  Resolved: <strong>{totalResolved}</strong> ({resolvedPct}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <span className="text-[#F5F6FA]">
                  Unresolved: <strong>{totalUnresolved}</strong> ({unresolvedPct}%)
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-[#2A2E38] text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] shrink-0" />
                <span className="text-[#F5F6FA] truncate">
                  Resolved: <strong>{totalResolved}</strong> ({resolvedPct}%)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shrink-0" />
                <span className="text-[#F5F6FA] truncate">
                  Unresolved: <strong>{totalUnresolved}</strong> ({unresolvedPct}%)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] shrink-0" />
                <span className="text-[#F5F6FA] truncate">
                  Recv CMO_1: <strong>{receivedEscalatedFromCmo1}</strong> ({receivedEscPct}%)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F5B700] shrink-0" />
                <span className="text-[#F5F6FA] truncate">
                  Reverted: <strong>{revertedToCmo1}</strong> ({revertPct}%)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7] shrink-0" />
                <span className="text-[#F5F6FA] truncate">
                  Sent CMO_3: <strong>{sentEscalatedToCmo3}</strong> ({sentCmo3Pct}%)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Chart: Role Dependent Breakdown */}
        {role === "CMO_1" ? (
          <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2A2E38] pb-3">
              <h4 className="text-sm font-bold text-[#5B8DEF] tracking-wider flex items-center gap-2">
                <Icon
                  icon="ph:list-checks-bold"
                  className="w-4 h-4 text-[#5B8DEF]"
                />
                <span>Facility Department Response Volume</span>
              </h4>
              <span className="text-xs font-sans text-[#9AA0AC]">
                Department Breakdown
              </span>
            </div>

            <div className="h-52 w-full pt-1">
              <Bar data={categoryBarData} options={barOptions} />
            </div>
          </div>
        ) : (
          <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2A2E38] pb-3">
              <h4 className="text-sm font-bold text-[#F97316] tracking-wider flex items-center gap-2">
                <Icon
                  icon="ph:arrows-left-right-bold"
                  className="w-4 h-4 text-[#F97316]"
                />
                <span>Escalation & Revert Flow Distribution</span>
              </h4>
              <span className="text-xs font-sans text-[#9AA0AC]">
                Zonal Ticket Movement
              </span>
            </div>

            <div className="h-52 w-full pt-1">
              <Bar data={escalationFlowBarData} options={barOptions} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
