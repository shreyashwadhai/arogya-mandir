import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type {
  FeedbackRecord,
  ArogyaCentre,
  CmoUser,
} from "../../types/cmoTypes";

// Register Chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface PerformanceSummaryViewProps {
  centre: ArogyaCentre;
  cmo?: CmoUser | null;
  allRecords: FeedbackRecord[];
  onBack: () => void;
  onSelectFeedback: (record: FeedbackRecord) => void;
}

export const PerformanceSummaryView: React.FC<PerformanceSummaryViewProps> = ({
  centre,
  cmo,
  allRecords,
  onBack,
  onSelectFeedback,
}) => {
  // Scoped records for this CMO_1 / Mandir only
  const scopedRecords = useMemo(() => {
    return allRecords.filter(
      (r) =>
        r.centreId === centre.id ||
        r.facilityName === centre.name ||
        (cmo && r.assignedCmoId === cmo.id),
    );
  }, [allRecords, centre, cmo]);

  // Filters state
  const [selectedResponse, setSelectedResponse] = useState<string>("ALL");
  const [selectedMonth, setSelectedMonth] = useState<string>("ALL");
  const [selectedYear, setSelectedYear] = useState<string>("ALL");

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [manualPageInput, setManualPageInput] = useState<string>("");
  const itemsPerPage = 6;

  // Filter logic
  const filteredRecords = useMemo(() => {
    return scopedRecords.filter((r) => {
      if (selectedResponse === "UNESCALATED_BETTER") {
        const isBetter =
          r.overallRating === "Could Be Better" ||
          r.responseType === "Could Be Better";
        if (!isBetter || r.status === "Escalated") {
          return false;
        }
      } else if (
        selectedResponse !== "ALL" &&
        r.overallRating !== selectedResponse &&
        r.responseType !== selectedResponse
      ) {
        return false;
      }
      if (selectedMonth !== "ALL" && r.month !== selectedMonth) {
        return false;
      }
      if (selectedYear !== "ALL" && r.year !== selectedYear) {
        return false;
      }
      return true;
    });
  }, [scopedRecords, selectedResponse, selectedMonth, selectedYear]);

  // Paginated list calculation
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredRecords, currentPage]);

  // Stats calculation
  const totalCount = scopedRecords.length;
  const excellentCount = scopedRecords.filter(
    (r) =>
      r.overallRating === "Excellent" || r.responseType === "Excellent Service",
  ).length;
  const acceptableCount = scopedRecords.filter(
    (r) =>
      r.overallRating === "Acceptable" ||
      r.responseType === "Acceptable standard",
  ).length;
  const couldBeBetterCount = scopedRecords.filter(
    (r) =>
      r.overallRating === "Could Be Better" ||
      r.responseType === "Could Be Better",
  ).length;
  const unescalatedBetterCount = scopedRecords.filter(
    (r) =>
      (r.overallRating === "Could Be Better" ||
        r.responseType === "Could Be Better") &&
      r.status !== "Escalated",
  ).length;

  const scorePct =
    totalCount > 0 ? Math.round((excellentCount / totalCount) * 100) : 92;

  // Trend Chart Data
  const trendPoints = [
    { week: "Week 01", val: 88 },
    { week: "Week 02", val: 94 },
    { week: "Week 03", val: 82 },
    { week: "Week 04", val: 96 },
  ];

  const trendData = {
    labels: trendPoints.map((t) => t.week),
    datasets: [
      {
        label: "Satisfaction Score (%)",
        data: trendPoints.map((t) => t.val),
        backgroundColor: ["#5B8DEF", "#22C55E", "#F5B700", "#7C5CFC"],
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const trendOptions = {
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
          label: (context: any) => ` ${context.raw}% Satisfaction Index`,
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
          min: 0,
          max: 100,
          stepSize: 20,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-[#20232B] hover:bg-[#2A2E38] text-[#F5F6FA] flex items-center justify-center border border-[#2A2E38] transition cursor-pointer"
          >
            <Icon icon="ph:arrow-left-bold" className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-xs font-bold text-[#5B8DEF] bg-[#5B8DEF]/10 px-2.5 py-0.5 rounded border border-[#5B8DEF]/30">
                {centre.code}
              </span>
              <span className="text-xs text-[#9AA0AC] font-sans">
                Zone: {centre.zone}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-[#F5F6FA] mt-1 flex items-center gap-2">
              <span>{centre.name}</span>
              <span className="text-xs font-normal text-[#9AA0AC]">
                ({centre.locality})
              </span>
            </h1>
          </div>
        </div>

        {/* Satisfaction Score Badge */}
        <div className="flex items-center gap-4 self-start md:self-auto">
          <div className="p-3 rounded-2xl bg-[#20232B] border border-[#2A2E38] text-right">
            <div className="text-[10px] text-[#9AA0AC] uppercase font-semibold">
              Satisfaction Index
            </div>
            <div className="text-2xl font-extrabold text-[#22C55E] font-sans mt-0.5">
              {scorePct}%
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards & Trend Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stat Badges Grid */}
        <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#2A2E38] pb-3">
            <h3 className="text-xs font-bold text-[#5B8DEF] uppercase tracking-wider flex items-center gap-2">
              <Icon icon="ph:chart-pie-slice-bold" className="w-4 h-4" />
              <span>Facility Performance Summary</span>
            </h3>
            {cmo && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-[#9AA0AC]">Assigned CMO_1:</span>
                <span className="text-xs font-bold text-[#5B8DEF] bg-[#5B8DEF]/10 px-2.5 py-0.5 rounded border border-[#5B8DEF]/30">
                  {cmo.name}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="bg-[#20232B] border border-[#2A2E38] rounded-xl p-3">
              <div className="text-[10px] text-[#9AA0AC] uppercase font-semibold">
                Total
              </div>
              <div className="text-xl font-extrabold text-[#F5F6FA] font-sans mt-0.5">
                {totalCount}
              </div>
            </div>
            <div className="bg-[#20232B] border border-[#2A2E38] rounded-xl p-3">
              <div className="text-[10px] text-[#22C55E] uppercase font-semibold">
                Excellent
              </div>
              <div className="text-xl font-extrabold text-[#22C55E] font-sans mt-0.5">
                {excellentCount}
              </div>
            </div>
            <div className="bg-[#20232B] border border-[#2A2E38] rounded-xl p-3">
              <div className="text-[10px] text-[#F5B700] uppercase font-semibold">
                Acceptable
              </div>
              <div className="text-xl font-extrabold text-[#F5B700] font-sans mt-0.5">
                {acceptableCount}
              </div>
            </div>
            <div className="bg-[#20232B] border border-[#2A2E38] rounded-xl p-3">
              <div className="text-[10px] text-[#EF4444] uppercase font-semibold">
                Could Be Better
              </div>
              <div className="text-xl font-extrabold text-[#EF4444] font-sans mt-0.5">
                {couldBeBetterCount}
              </div>
            </div>
            <div className="bg-[#20232B] border border-[#EF4444]/40 bg-[#EF4444]/5 rounded-xl p-3">
              <div className="text-[10px] text-[#EF4444] uppercase font-bold">
                Unescalated Better
              </div>
              <div className="text-xl font-extrabold text-[#EF4444] font-sans mt-0.5">
                {unescalatedBetterCount}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Performance Index Trend Chart */}
        <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#2A2E38] pb-3">
            <h3 className="text-xs font-bold text-[#5B8DEF] uppercase tracking-wider flex items-center gap-2">
              <Icon
                icon="ph:chart-line-up-bold"
                className="w-4 h-4 text-[#5B8DEF]"
              />
              <span>Weekly Performance Index Trend</span>
            </h3>
            <span className="text-xs text-[#9AA0AC] font-sans">
              4-Week Analysis
            </span>
          </div>

          <div className="h-44 w-full pt-1">
            <Bar data={trendData} options={trendOptions} />
          </div>
        </div>
      </div>

      {/* Scoped Feedback List & Filter Bar */}
      <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2E38] pb-4">
          <h3 className="text-sm font-bold text-[#F5F6FA] uppercase tracking-wider flex items-center gap-2">
            <Icon
              icon="ph:list-bullets-bold"
              className="w-4 h-4 text-[#5B8DEF]"
            />
            <span>Scoped Feedback Submissions for {centre.name}</span>
          </h3>

          {/* Filter controls */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedResponse}
              onChange={(e) => {
                setSelectedResponse(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#20232B] border border-[#2A2E38] rounded-xl px-3 py-1.5 text-xs text-[#F5F6FA] focus:outline-none focus:border-[#5B8DEF]"
            >
              <option value="ALL">All Responses</option>
              <option value="Could Be Better">Could Be Better</option>
              <option value="UNESCALATED_BETTER">
                Could Be Better (Unescalated)
              </option>
              <option value="Acceptable">Acceptable Standard</option>
              <option value="Excellent">Excellent Service</option>
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#20232B] border border-[#2A2E38] rounded-xl px-3 py-1.5 text-xs text-[#F5F6FA] focus:outline-none focus:border-[#5B8DEF]"
            >
              <option value="ALL">All Months</option>
              <option value="Aug">August</option>
              <option value="Jul">July</option>
              <option value="Jun">June</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setSelectedResponse("ALL");
                setSelectedMonth("ALL");
                setSelectedYear("ALL");
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-[#20232B] hover:bg-[#2A2E38] text-[#9AA0AC] text-xs font-semibold transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#F5F6FA]">
            <thead className="bg-[#20232B] border-b border-[#2A2E38] text-[#9AA0AC] font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">Tracking ID</th>
                <th className="py-3 px-4 whitespace-nowrap">Patient Name</th>
                <th className="py-3 px-4 whitespace-nowrap">Visitor Type</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">
                  Sentiment Rating
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap">
                  Status
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2E38]">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-[#20232B]/50 transition">
                    <td className="py-3.5 px-4 font-sans font-bold text-[#5B8DEF] whitespace-nowrap">
                      {r.trackingId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#F5F6FA] whitespace-nowrap">
                      {r.patientName}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-[#9AA0AC] whitespace-nowrap">
                      {r.visitorType}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {r.overallRating === "Could Be Better" ||
                      r.responseType === "Could Be Better" ? (
                        <span className="px-2.5 py-1 rounded-full bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 text-[11px] font-bold">
                          Could Be Better
                        </span>
                      ) : r.overallRating === "Acceptable" ||
                        r.responseType === "Acceptable standard" ? (
                        <span className="px-2.5 py-1 rounded-full bg-[#F5B700]/15 text-[#F5B700] border border-[#F5B700]/30 text-[11px] font-bold">
                          Acceptable Standard
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 text-[11px] font-bold">
                          Excellent Service
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full bg-[#20232B] text-[#F5F6FA] border border-[#2A2E38] text-[11px] font-semibold">
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onSelectFeedback(r)}
                        className="px-3 py-1.5 rounded-xl bg-[#5B8DEF] hover:bg-[#4A7CE4] text-white text-xs font-bold transition cursor-pointer"
                      >
                        Inspect Record
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-[#9AA0AC] font-sans"
                  >
                    No matching feedback records found for current filter
                    selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#2A2E38]">
          <span className="text-xs text-[#9AA0AC] font-sans">
            Showing Page {currentPage} of {totalPages} ({filteredRecords.length}{" "}
            records)
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-xl bg-[#20232B] disabled:opacity-40 text-[#F5F6FA] border border-[#2A2E38] text-xs font-bold transition cursor-pointer"
            >
              Prev
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-xl bg-[#20232B] disabled:opacity-40 text-[#F5F6FA] border border-[#2A2E38] text-xs font-bold transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
