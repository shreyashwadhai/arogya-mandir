import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import type {
  FeedbackRecord,
  CmoUser,
  ArogyaCentre,
} from "../../types/cmoTypes";

interface KeyInsightsTabProps {
  records: FeedbackRecord[];
  cmos: CmoUser[];
  centres: ArogyaCentre[];
  onSelectFeedback: (record: FeedbackRecord) => void;
}

export const KeyInsightsTab: React.FC<KeyInsightsTabProps> = ({
  records,
  centres,
  onSelectFeedback,
}) => {
  const totalFeedbacks = records.length;
  const couldBeBetterCount = records.filter(
    (r) =>
      r.overallRating === "Could Be Better" ||
      r.responseType === "Could Be Better",
  ).length;
  const acceptableCount = records.filter(
    (r) =>
      r.overallRating === "Acceptable" ||
      r.responseType === "Acceptable standard",
  ).length;
  const excellentCount = records.filter(
    (r) =>
      r.overallRating === "Excellent" || r.responseType === "Excellent Service",
  ).length;

  const escalatedCount = records.filter(
    (r) =>
      r.status === "Escalated" ||
      (r.escalationHistory && r.escalationHistory.length > 0),
  ).length;

  const revertedCount = records.filter((r) => r.status === "Reverted").length;

  // Calculate top & underperforming Mandirs
  const mandirStats = centres.map((centre) => {
    const centreFbs = records.filter(
      (r) => r.centreId === centre.id || r.facilityName === centre.name,
    );
    const total = centreFbs.length;
    const negative = centreFbs.filter(
      (r) =>
        r.overallRating === "Could Be Better" ||
        r.responseType === "Could Be Better",
    ).length;
    const positive = centreFbs.filter(
      (r) =>
        r.overallRating === "Excellent" ||
        r.responseType === "Excellent Service",
    ).length;
    const score = total > 0 ? Math.round((positive / total) * 100) : 85;

    return {
      centre,
      total,
      negative,
      positive,
      score,
    };
  });

  const sortedMandirs = [...mandirStats].sort((a, b) => b.score - a.score);
  const topMandirs = sortedMandirs.slice(0, 3);
  const underperformingMandirs = [...mandirStats]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  // Critical escalated or unresolved items for immediate action
  const criticalItems = records
    .filter(
      (r) => r.overallRating === "Could Be Better" && r.status !== "Closed",
    )
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 text-xs font-semibold">
              Live State Sync
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#F5F6FA] mt-2 flex items-center gap-2">
            <Icon icon="ph:sparkle-bold" className="w-5 h-5 text-[#5B8DEF]" />
            <span>Cross-Zone Operational Key Insights</span>
          </h2>
          <p className="text-xs text-[#9AA0AC] mt-1">
            Real-time synthesis of patient sentiment across North, South, East,
            and West Delhi Arogya Mandir zones.
          </p>
        </div>

        {/* SLA Compliance */}
        {/* <div className="flex items-center gap-3">
          <div className="bg-[#20232B] border border-[#2A2E38] rounded-xl px-4 py-2 text-right">
            <div className="text-[10px] text-[#9AA0AC] font-semibold uppercase tracking-wider">
              State SLA Compliance
            </div>
            <div className="text-lg font-extrabold text-[#22C55E] font-sans">
              94.2%
            </div>
          </div>
          <div className="bg-[#20232B] border border-[#2A2E38] rounded-xl px-4 py-2 text-right">
            <div className="text-[10px] text-[#9AA0AC] font-semibold uppercase tracking-wider">
              Avg Resolution Time
            </div>
            <div className="text-lg font-extrabold text-[#5B8DEF] font-sans">
              18.4 Hrs
            </div>
          </div>
        </div> */}
      </div>

      {/* KPI Insight Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-5 shadow-lg space-y-3 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9AA0AC] uppercase tracking-wider">
              Total Feedbacks
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#5B8DEF]/10 text-[#5B8DEF] flex items-center justify-center">
              <Icon icon="ph:tray-bold" className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#F5F6FA] font-sans">
            {totalFeedbacks}
          </div>
          <div className="text-xs text-[#22C55E] font-medium flex items-center gap-1">
            <Icon icon="ph:trend-up-bold" className="w-3.5 h-3.5" />
            <span>+14.2% week-on-week growth</span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#5B8DEF]/5 rounded-full blur-2xl pointer-events-none" />
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-5 shadow-lg space-y-3 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9AA0AC] uppercase tracking-wider">
              Concerns / Grievances
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#EF4444]/10 text-[#EF4444] flex items-center justify-center">
              <Icon icon="ph:warning-circle-bold" className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#EF4444] font-sans">
            {couldBeBetterCount}
          </div>
          <div className="text-xs text-[#9AA0AC] font-medium">
            Requires active CMO action
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#EF4444]/5 rounded-full blur-2xl pointer-events-none" />
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-5 shadow-lg space-y-3 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9AA0AC] uppercase tracking-wider">
              Escalated Tickets
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
              <Icon icon="ph:arrow-up-right-bold" className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#F97316] font-sans">
            {escalatedCount}
          </div>
          <div className="text-xs text-[#F97316] font-medium">
            Escalated from CMO_1 / CMO_2
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#F97316]/5 rounded-full blur-2xl pointer-events-none" />
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-5 shadow-lg space-y-3 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9AA0AC] uppercase tracking-wider">
              Reverted Tickets
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#F5B700]/10 text-[#F5B700] flex items-center justify-center">
              <Icon icon="ph:arrow-u-down-left-bold" className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#F5B700] font-sans">
            {revertedCount}
          </div>
          <div className="text-xs text-[#9AA0AC] font-medium">
            Reverted to CMO_1 for re-investigation
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#F5B700]/5 rounded-full blur-2xl pointer-events-none" />
        </motion.div>
      </div>

      {/* Grid: Top Performing vs Underperforming Facilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Mandirs */}
        <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#2A2E38] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#22C55E]/10 text-[#22C55E] flex items-center justify-center">
                <Icon icon="ph:trophy-bold" className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#F5F6FA] uppercase tracking-wider">
                Top Performing Facilities
              </h3>
            </div>
            <span className="text-xs font-sans text-[#22C55E]">
              High Patient Rating
            </span>
          </div>

          <div className="space-y-3">
            {topMandirs.map((item, idx) => (
              <div
                key={item.centre.id}
                className="bg-[#20232B] border border-[#2A2E38] rounded-xl p-4 flex items-center justify-between gap-4 hover:border-[#22C55E]/40 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#22C55E]/20 text-[#22C55E] text-xs font-bold font-sans flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-[#F5F6FA]">
                      {item.centre.name}
                    </div>
                    <div className="text-[10px] text-[#9AA0AC] font-sans">
                      {item.centre.zone} Zone • {item.centre.code}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-extrabold text-[#22C55E] font-sans">
                    {item.score}%
                  </div>
                  <div className="text-[10px] text-[#9AA0AC] font-sans">
                    {item.positive} Positive Feedbacks
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Underperforming Mandirs / SLA Bottlenecks */}
        <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#2A2E38] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#EF4444]/10 text-[#EF4444] flex items-center justify-center">
                <Icon icon="ph:warning-bold" className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#F5F6FA] uppercase tracking-wider">
                Facilities Requiring Operational Intervention
              </h3>
            </div>
            <span className="text-xs font-sans text-[#EF4444]">Focus Area</span>
          </div>

          <div className="space-y-3">
            {underperformingMandirs.map((item, idx) => (
              <div
                key={item.centre.id}
                className="bg-[#20232B] border border-[#2A2E38] rounded-xl p-4 flex items-center justify-between gap-4 hover:border-[#EF4444]/40 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#EF4444]/20 text-[#EF4444] text-xs font-bold font-sans flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-[#F5F6FA]">
                      {item.centre.name}
                    </div>
                    <div className="text-[10px] text-[#9AA0AC] font-sans">
                      {item.centre.zone} Zone • {item.negative} Concerns Raised
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-extrabold text-[#EF4444] font-sans">
                    {item.score}%
                  </div>
                  <div className="text-[10px] text-[#9AA0AC] font-sans">
                    Satisfaction Index
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical SLA Queue List */}
      <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#2A2E38] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#F5F6FA] uppercase tracking-wider flex items-center gap-2">
              <Icon icon="ph:clock-bold" className="w-4 h-4 text-[#F5B700]" />
              <span>High SLA Priority Escalations & Grievances</span>
            </h3>
            <p className="text-xs text-[#9AA0AC] mt-0.5">
              Items flagged for immediate CMO_3 / SuperAdmin review and
              resolution directive.
            </p>
          </div>
          <span className="text-xs font-sans text-[#F5B700] bg-[#F5B700]/10 px-2.5 py-1 rounded-full border border-[#F5B700]/30">
            {criticalItems.length} Pending Actions
          </span>
        </div>

        <div className="space-y-3">
          {criticalItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectFeedback(item)}
              className="p-4 rounded-xl bg-[#20232B] border border-[#2A2E38] hover:border-[#5B8DEF] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-sans font-bold text-xs text-[#5B8DEF]">
                    {item.trackingId}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30">
                    Could Be Better
                  </span>
                  <span className="text-[11px] text-[#9AA0AC] font-sans">
                    • {item.facilityName}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#F5F6FA] group-hover:text-[#5B8DEF] transition">
                  Patient: {item.patientName} ({item.visitorType})
                </div>
                <div className="text-xs text-[#9AA0AC] line-clamp-1">
                  Doctor: "{item.doctor.comments}" | Pharmacy: "
                  {item.pharmacy.comments}"
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-[11px] text-[#9AA0AC] font-sans">
                  {item.timestamp}
                </span>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-[#5B8DEF] text-white text-xs font-bold transition group-hover:bg-[#4A7CE4] flex items-center gap-1 cursor-pointer"
                >
                  <span>Review Item</span>
                  <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
