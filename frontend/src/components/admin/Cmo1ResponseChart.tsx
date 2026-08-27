import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { Icon } from "@iconify/react";
import type { FeedbackRecord } from "../../types/cmoTypes";

// Register Chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

interface Cmo1ResponseChartProps {
  scopedRecords: FeedbackRecord[];
}

export const Cmo1ResponseChart: React.FC<Cmo1ResponseChartProps> = ({
  scopedRecords,
}) => {
  const [chartType, setChartType] = useState<"bar" | "doughnut">("bar");

  // Total counts for Text, Voice, and Uploaded Image responses
  const totalTextResponses = scopedRecords.filter(
    (r) =>
      r.doctor?.comments ||
      r.pharmacy?.comments ||
      r.cleanliness?.comments ||
      r.suggestions?.text,
  ).length;

  const totalVoiceResponses = scopedRecords.filter(
    (r) =>
      r.doctor?.audioUrl ||
      r.pharmacy?.audioUrl ||
      r.cleanliness?.audioUrl ||
      r.suggestions?.audioUrl,
  ).length;

  const totalImageResponses = scopedRecords.filter(
    (r) =>
      r.registration?.imageUrl ||
      r.doctor?.imageUrl ||
      r.pharmacy?.imageUrl ||
      r.cleanliness?.imageUrl ||
      r.suggestions?.imageUrl,
  ).length;

  // Breakdown by department section for detailed bar chart
  const doctorText = scopedRecords.filter((r) => !!r.doctor?.comments).length;
  const doctorVoice = scopedRecords.filter((r) => !!r.doctor?.audioUrl).length;
  const doctorImage = scopedRecords.filter((r) => !!r.doctor?.imageUrl).length;

  const pharmacyText = scopedRecords.filter(
    (r) => !!r.pharmacy?.comments,
  ).length;
  const pharmacyVoice = scopedRecords.filter(
    (r) => !!r.pharmacy?.audioUrl,
  ).length;
  const pharmacyImage = scopedRecords.filter(
    (r) => !!r.pharmacy?.imageUrl,
  ).length;

  const cleanlinessText = scopedRecords.filter(
    (r) => !!r.cleanliness?.comments,
  ).length;
  const cleanlinessVoice = scopedRecords.filter(
    (r) => !!r.cleanliness?.audioUrl,
  ).length;
  const cleanlinessImage = scopedRecords.filter(
    (r) => !!r.cleanliness?.imageUrl,
  ).length;

  const suggestionText = scopedRecords.filter(
    (r) => !!r.suggestions?.text,
  ).length;
  const suggestionVoice = scopedRecords.filter(
    (r) => !!r.suggestions?.audioUrl,
  ).length;
  const suggestionImage = scopedRecords.filter(
    (r) => !!r.suggestions?.imageUrl,
  ).length;

  const totalMediaVolume =
    totalTextResponses + totalVoiceResponses + totalImageResponses;

  // Data for Overall Text vs Voice vs Image Doughnut Chart
  const doughnutData = {
    labels: ["Text Responses", "Voice Responses", "Uploaded Image Responses"],
    datasets: [
      {
        label: "Responses Count",
        data: [totalTextResponses, totalVoiceResponses, totalImageResponses],
        backgroundColor: ["#5B8DEF", "#22C55E", "#F59E0B"],
        borderColor: ["#1A1D24", "#1A1D24", "#1A1D24"],
        borderWidth: 3,
        hoverBackgroundColor: ["#4A7CDD", "#16A34A", "#D97706"],
        hoverOffset: 6,
      },
    ],
  };

  // Data for Breakdown Bar Chart (Doctor, Pharmacy, Cleanliness, Suggestions)
  const barData = {
    labels: [
      "Doctor Section",
      "Pharmacy Section",
      "Cleanliness Section",
      "Suggestions",
    ],
    datasets: [
      {
        label: "Text Responses",
        data: [doctorText, pharmacyText, cleanlinessText, suggestionText],
        backgroundColor: "#5B8DEF",
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: "Voice Responses",
        data: [doctorVoice, pharmacyVoice, cleanlinessVoice, suggestionVoice],
        backgroundColor: "#22C55E",
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: "Uploaded Image Responses",
        data: [doctorImage, pharmacyImage, cleanlinessImage, suggestionImage],
        backgroundColor: "#F59E0B",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#9AA0AC",
          font: {
            family: "Inter, sans-serif",
            size: 10,
            weight: 500 as const,
          },
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "#20232B",
        titleColor: "#F5F6FA",
        bodyColor: "#9AA0AC",
        borderColor: "#2A2E38",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      },
    },
    scales:
      chartType === "bar"
        ? {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: "#9AA0AC",
                font: {
                  family: "Inter, sans-serif",
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
                stepSize: 1,
                precision: 0,
              },
            },
          }
        : undefined,
  };

  return (
    <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2E38] pb-4">
        <div>
          <h3 className="text-sm font-bold text-[#F5F6FA] uppercase tracking-wider flex items-center gap-2">
            <Icon icon="ph:chart-bar-bold" className="w-5 h-5 text-[#5B8DEF]" />
            <span>CMO_1 Response Distribution Analytics</span>
          </h3>
          <p className="text-xs text-[#9AA0AC] mt-1">
            Visualizing Text, Voice & Uploaded Image response metrics
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-[#20232B] p-1 rounded-xl border border-[#2A2E38]">
          <button
            type="button"
            onClick={() => setChartType("bar")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              chartType === "bar"
                ? "bg-[#5B8DEF] text-white shadow-md"
                : "text-[#9AA0AC] hover:text-[#F5F6FA]"
            }`}
          >
            <Icon icon="ph:chart-bar-horizontal-bold" className="w-4 h-4" />
            <span>By Department</span>
          </button>
          <button
            type="button"
            onClick={() => setChartType("doughnut")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              chartType === "doughnut"
                ? "bg-[#5B8DEF] text-white shadow-md"
                : "text-[#9AA0AC] hover:text-[#F5F6FA]"
            }`}
          >
            <Icon icon="ph:chart-pie-bold" className="w-4 h-4" />
            <span>Overall Ratio</span>
          </button>
        </div>
      </div>

      {/* 3 Summary Cards: Text, Voice, Image */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Text Responses Card */}
        <div className="p-4 rounded-xl bg-[#20232B] border border-[#2A2E38] flex items-center justify-between">
          <div>
            <div className="text-xs text-[#9AA0AC] uppercase font-semibold">
              Total Text Responses
            </div>
            <div className="text-2xl font-extrabold text-[#5B8DEF] font-sans mt-1">
              {totalTextResponses}
            </div>
            <div className="text-[11px] text-[#9AA0AC] font-sans mt-0.5">
              {totalMediaVolume > 0
                ? `${((totalTextResponses / totalMediaVolume) * 100).toFixed(1)}% of total`
                : "0% of total"}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#5B8DEF]/10 text-[#5B8DEF] flex items-center justify-center">
            <Icon icon="bi:chat-right-text" className="w-5 h-5" />
          </div>
        </div>

        {/* Total Voice Responses Card */}
        <div className="p-4 rounded-xl bg-[#20232B] border border-[#2A2E38] flex items-center justify-between">
          <div>
            <div className="text-xs text-[#9AA0AC] uppercase font-semibold">
              Total Voice Responses
            </div>
            <div className="text-2xl font-extrabold text-[#22C55E] font-sans mt-1">
              {totalVoiceResponses}
            </div>
            <div className="text-[11px] text-[#9AA0AC] font-sans mt-0.5">
              {totalMediaVolume > 0
                ? `${((totalVoiceResponses / totalMediaVolume) * 100).toFixed(1)}% of total`
                : "0% of total"}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 text-[#22C55E] flex items-center justify-center">
            <Icon icon="fluent:person-voice-32-regular" className="w-5 h-5" />
          </div>
        </div>

        {/* Total Image Responses Card */}
        <div className="p-4 rounded-xl bg-[#20232B] border border-[#2A2E38] flex items-center justify-between">
          <div>
            <div className="text-xs text-[#9AA0AC] uppercase font-semibold">
              Total Image Responses
            </div>
            <div className="text-2xl font-extrabold text-[#F59E0B] font-sans mt-1">
              {totalImageResponses}
            </div>
            <div className="text-[11px] text-[#9AA0AC] font-sans mt-0.5">
              {totalMediaVolume > 0
                ? `${((totalImageResponses / totalMediaVolume) * 100).toFixed(1)}% of total`
                : "0% of total"}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center">
            <Icon icon="arcticons:image-combiner" className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-64 sm:h-72 w-full pt-2">
        {chartType === "bar" ? (
          <Bar data={barData} options={chartOptions} />
        ) : (
          <Doughnut data={doughnutData} options={chartOptions} />
        )}
      </div>
    </div>
  );
};
