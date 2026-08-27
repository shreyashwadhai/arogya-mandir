import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import type {
  FeedbackRecord,
  CmoUser,
  ArogyaCentre,
  FeedbackQuestion,
} from "../../types/cmoTypes";
import { StorageService } from "../../services/storageService";
import {
  OverallScoreBifurcation,
  SolvedVsUnsolvedDonutChart,
  WeekOnWeekAreaChart,
  ActiveMandirsBarChart,
} from "./AdminCharts";
import { Bar } from "react-chartjs-2";

interface SuperAdminDashboardProps {
  onSelectFeedback: (record: FeedbackRecord) => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  onSelectFeedback,
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "cmos" | "centres" | "questions"
  >("overview");
  const [cmos, setCmos] = useState<CmoUser[]>([]);
  const [centres, setCentres] = useState<ArogyaCentre[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>([]);
  const [questions, setQuestions] = useState<FeedbackQuestion[]>([]);

  // CMO Form Modal State
  const [showCmoModal, setShowCmoModal] = useState(false);
  const [editingCmo, setEditingCmo] = useState<CmoUser | null>(null);
  const [cmoForm, setCmoForm] = useState({
    name: "",
    designation: "",
    email: "",
    role: "CMO_1",
    parentCmoId: "cmo-2-north",
    zone: "North",
    district: "North Delhi",
    phone: "",
  });

  // Question Form Modal State
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] =
    useState<FeedbackQuestion | null>(null);
  const [questionForm, setQuestionForm] = useState({
    key: "",
    category: "",
    text: "",
    hindiText: "",
    slaHours: 24,
  });

  const loadData = () => {
    setCmos(StorageService.getCmos());
    setCentres(StorageService.getCentres());
    setFeedbacks(StorageService.getFeedbacks());
    setQuestions(StorageService.getQuestions());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Aggregated Analytics calculations
  const totalFeedbacks = feedbacks.length;
  const resolvedFeedbacks = feedbacks.filter(
    (f) => f.status === "Resolved" || f.status === "Closed",
  ).length;
  const unresolvedFeedbacks = totalFeedbacks - resolvedFeedbacks;
  const escalatedFeedbacks = feedbacks.filter(
    (f) =>
      f.status === "Escalated" ||
      (f.escalationHistory && f.escalationHistory.length > 0),
  ).length;

  const resolvedPct =
    totalFeedbacks > 0
      ? ((resolvedFeedbacks / totalFeedbacks) * 100).toFixed(1)
      : "72.0";
  const unresolvedPct =
    totalFeedbacks > 0
      ? ((unresolvedFeedbacks / totalFeedbacks) * 100).toFixed(1)
      : "28.0";

  const activeCmoCount = cmos.filter(
    (c) => c.status === "active" && c.role !== "SUPER_ADMIN",
  ).length;
  const inactiveCmoCount = cmos.filter(
    (c) => c.status === "inactive" && c.role !== "SUPER_ADMIN",
  ).length;
  const totalCentresCount = centres.length;

  // Save / Edit CMO
  const handleSaveCmo = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCmo) {
      const updated: CmoUser = {
        ...editingCmo,
        name: cmoForm.name,
        designation: cmoForm.designation,
        email: cmoForm.email,
        role: cmoForm.role as any,
        level: cmoForm.role as any,
        parentCmoId: cmoForm.parentCmoId || null,
        zone: cmoForm.zone as any,
        district: cmoForm.district,
        phone: cmoForm.phone,
      };
      StorageService.updateCmo(updated);
    } else {
      const newCmo: CmoUser = {
        id: `cmo-${Date.now()}`,
        name: cmoForm.name,
        designation: cmoForm.designation,
        email: cmoForm.email,
        role: cmoForm.role as any,
        level: cmoForm.role as any,
        parentCmoId: cmoForm.parentCmoId || null,
        zone: cmoForm.zone as any,
        district: cmoForm.district,
        assignedCentreIds: [],
        status: "active",
        phone: cmoForm.phone,
      };
      StorageService.addCmo(newCmo);
    }
    setShowCmoModal(false);
    setEditingCmo(null);
    loadData();
  };

  const toggleCmoStatus = (cmo: CmoUser) => {
    const updated: CmoUser = {
      ...cmo,
      status: cmo.status === "active" ? "inactive" : "active",
    };
    StorageService.updateCmo(updated);
    loadData();
  };

  // Save / Edit Question
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const currentList = StorageService.getQuestions();
    if (editingQuestion) {
      const updated = currentList.map((q) =>
        q.id === editingQuestion.id
          ? {
              ...q,
              key: questionForm.key,
              category: questionForm.category,
              text: questionForm.text,
              hindiText: questionForm.hindiText,
              slaHours: questionForm.slaHours,
            }
          : q,
      );
      StorageService.saveQuestions(updated);
    } else {
      const newQ: FeedbackQuestion = {
        id: `q-${Date.now()}`,
        key: questionForm.key.toLowerCase().replace(/\s+/g, "_"),
        category: questionForm.category,
        text: questionForm.text,
        hindiText: questionForm.hindiText,
        slaHours: questionForm.slaHours,
        isActive: true,
        order: currentList.length + 1,
      };
      currentList.push(newQ);
      StorageService.saveQuestions(currentList);
    }
    setShowQuestionModal(false);
    setEditingQuestion(null);
    loadData();
  };

  const toggleQuestionStatus = (qId: string) => {
    const list = StorageService.getQuestions();
    const updated = list.map((q) =>
      q.id === qId ? { ...q, isActive: !q.isActive } : q,
    );
    StorageService.saveQuestions(updated);
    loadData();
  };

  // CMO Tier Resolution Performance Data for Chart.js
  const tierPerformanceData = {
    labels: [
      "CMO_1 (Primary)",
      "CMO_2 (District Nodal)",
      "CMO_3 (State Officer)",
    ],
    datasets: [
      {
        label: "Resolved within SLA (%)",
        data: [94, 88, 96],
        backgroundColor: "#22C55E",
        borderRadius: 8,
      },
      {
        label: "SLA Breached / Pending (%)",
        data: [6, 12, 4],
        backgroundColor: "#EF4444",
        borderRadius: 8,
      },
    ],
  };

  const tierPerformanceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#9AA0AC",
          font: { family: "Inter, sans-serif", size: 11, weight: 600 as const },
        },
      },
      tooltip: {
        backgroundColor: "#20232B",
        titleColor: "#F5F6FA",
        bodyColor: "#9AA0AC",
        borderColor: "#2A2E38",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#9AA0AC",
          font: { family: "Inter, sans-serif", size: 11 },
        },
      },
      y: {
        grid: { color: "#2A2E38" },
        ticks: { color: "#9AA0AC", stepSize: 20 },
        max: 100,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Banner - Theme Matched */}
      <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-[#7C5CFC]/20 text-[#7C5CFC] border border-[#7C5CFC]/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Icon
                icon="ph:shield-check-bold"
                className="w-4 h-4 text-[#7C5CFC]"
              />
              Super Admin State Oversight Desk
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#5B8DEF]/10 text-[#5B8DEF] border border-[#5B8DEF]/30 text-[11px] font-sans">
              Delhi State Health Mission
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#F5F6FA] mt-2">
            State-Wide CMO Escalation & Governance Dashboard
          </h1>
          <p className="text-xs text-[#9AA0AC] mt-1">
            Complete hierarchy oversight: SuperAdmin → CMO_3 (State) → CMO_2
            (District Nodal) → CMO_1 (Primary).
          </p>
        </div>

        {/* Tab Buttons - Theme Matched */}
        <div className="flex flex-wrap items-center gap-2 bg-[#20232B] p-1.5 rounded-xl border border-[#2A2E38]">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "overview"
                ? "bg-[#7C5CFC] text-white shadow-lg shadow-[#7C5CFC]/20"
                : "text-[#9AA0AC] hover:text-[#F5F6FA] hover:bg-[#1A1D24]"
            }`}
          >
            <Icon icon="ph:chart-bar-bold" className="w-4 h-4" />
            <span>Oversight Analytics</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("cmos")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "cmos"
                ? "bg-[#7C5CFC] text-white shadow-lg shadow-[#7C5CFC]/20"
                : "text-[#9AA0AC] hover:text-[#F5F6FA] hover:bg-[#1A1D24]"
            }`}
          >
            <Icon icon="ph:tree-structure-bold" className="w-4 h-4" />
            <span>
              CMO Hierarchy (
              {cmos.filter((c) => c.role !== "SUPER_ADMIN").length})
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("centres")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "centres"
                ? "bg-[#7C5CFC] text-white shadow-lg shadow-[#7C5CFC]/20"
                : "text-[#9AA0AC] hover:text-[#F5F6FA] hover:bg-[#1A1D24]"
            }`}
          >
            <Icon icon="ph:buildings-bold" className="w-4 h-4" />
            <span>Centre Governance ({centres.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("questions")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "questions"
                ? "bg-[#7C5CFC] text-white shadow-lg shadow-[#7C5CFC]/20"
                : "text-[#9AA0AC] hover:text-[#F5F6FA] hover:bg-[#1A1D24]"
            }`}
          >
            <Icon icon="ph:gear-six-bold" className="w-4 h-4" />
            <span>Question Management ({questions.length})</span>
          </button>
        </div>
      </div>

      {/* DUAL NUMERIC & PERCENTAGE KPI CARDS - Theme Matched */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-5 shadow-xl relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-bold text-[#9AA0AC] uppercase tracking-wider">
                Total Feedbacks
              </div>
              <div className="text-3xl font-extrabold text-[#F5F6FA] font-sans mt-1">
                {totalFeedbacks}
              </div>
              <div className="text-[11px] text-[#5B8DEF] font-semibold mt-1">
                Across 4 Delhi Zones
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 text-[#5B8DEF] flex items-center justify-center font-bold">
              <Icon icon="ph:clipboard-text-bold" className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        {/* Resolved Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-[#1A1D24] border border-[#22C55E]/30 rounded-2xl p-5 shadow-xl relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">
                Resolved Feedbacks
              </div>
              <div className="text-3xl font-extrabold text-[#22C55E] font-sans mt-1">
                {resolvedPct}% ({resolvedFeedbacks})
              </div>
              <div className="text-[11px] text-[#22C55E]/80 font-semibold mt-1">
                Resolved: {resolvedPct}% ({resolvedFeedbacks})
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] flex items-center justify-center font-bold">
              <Icon icon="ph:check-circle-bold" className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        {/* Unresolved Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-[#1A1D24] border border-[#EF4444]/30 rounded-2xl p-5 shadow-xl relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-bold text-[#EF4444] uppercase tracking-wider">
                Unresolved Feedbacks
              </div>
              <div className="text-3xl font-extrabold text-[#EF4444] font-sans mt-1">
                {unresolvedPct}% ({unresolvedFeedbacks})
              </div>
              <div className="text-[11px] text-[#EF4444]/80 font-semibold mt-1">
                Unresolved: {unresolvedPct}% ({unresolvedFeedbacks})
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] flex items-center justify-center font-bold">
              <Icon icon="ph:warning-circle-bold" className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        {/* Escalations Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-[#1A1D24] border border-[#F5B700]/30 rounded-2xl p-5 shadow-xl relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-bold text-[#F5B700] uppercase tracking-wider">
                Escalated Feedbacks
              </div>
              <div className="text-3xl font-extrabold text-[#F5B700] font-sans mt-1">
                {escalatedFeedbacks}
              </div>
              <div className="text-[11px] text-[#F5B700]/80 font-semibold mt-1">
                Avg SLA Resolution:{" "}
                <span className="text-[#F5F6FA] font-sans font-bold">
                  18.4 Hrs
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#F5B700]/10 border border-[#F5B700]/30 text-[#F5B700] flex items-center justify-center font-bold">
              <Icon icon="ph:arrow-up-bold" className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* SECONDARY METRICS: CMO COUNTS & CENTRES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7C5CFC]/10 text-[#7C5CFC] border border-[#7C5CFC]/30 flex items-center justify-center font-bold">
            <Icon icon="ph:users-three-bold" className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[#9AA0AC] font-bold uppercase">
              Active CMO Officers
            </div>
            <div className="text-base font-extrabold text-[#F5F6FA] font-sans">
              {activeCmoCount} Active / {inactiveCmoCount} Inactive
            </div>
          </div>
        </div>

        <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#5B8DEF]/10 text-[#5B8DEF] border border-[#5B8DEF]/30 flex items-center justify-center font-bold">
            <Icon icon="ph:first-aid-kit-bold" className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[#9AA0AC] font-bold uppercase">
              Arogya Mandir Centres
            </div>
            <div className="text-base font-extrabold text-[#F5F6FA] font-sans">
              {totalCentresCount} Facilities Active
            </div>
          </div>
        </div>

        <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 flex items-center justify-center font-bold">
            <Icon icon="ph:clock-afternoon-bold" className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[#9AA0AC] font-bold uppercase">
              Average Resolution Time
            </div>
            <div className="text-base font-extrabold text-[#22C55E] font-sans">
              18 Hours 24 Mins
            </div>
          </div>
        </div>
      </div>

      {/* ANIMATED TAB CONTENTS */}
      <AnimatePresence mode="wait">
        {/* TAB CONTENT 1: OVERVIEW ANALYTICS */}
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <OverallScoreBifurcation filteredRecords={feedbacks as any} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SolvedVsUnsolvedDonutChart filteredRecords={feedbacks as any} />

              {/* CMO Tier SLA Performance Bar Chart */}
              <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-[#2A2E38] pb-3">
                  <h4 className="text-xs font-bold text-[#7C5CFC] uppercase tracking-wider flex items-center gap-2">
                    <Icon
                      icon="ph:chart-bar-bold"
                      className="w-4 h-4 text-[#7C5CFC]"
                    />
                    <span>CMO Tier SLA Performance Index</span>
                  </h4>
                  <span className="text-xs font-sans text-[#9AA0AC]">
                    Tier 1 → Tier 3
                  </span>
                </div>

                <div className="h-52 w-full pt-1">
                  <Bar
                    data={tierPerformanceData}
                    options={tierPerformanceOptions}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeekOnWeekAreaChart filteredRecords={feedbacks as any} />
              <ActiveMandirsBarChart />
            </div>

            {/* CMO-Wise Performance & Resolution Matrix */}
            <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#2A2E38] pb-3">
                <h3 className="text-sm font-bold text-[#7C5CFC] uppercase tracking-wider flex items-center gap-2">
                  <Icon
                    icon="ph:buildings-bold"
                    className="w-4 h-4 text-[#7C5CFC]"
                  />
                  <span>
                    CMO Officer Performance & Escalation Governance Matrix
                  </span>
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#F5F6FA]">
                  <thead className="bg-[#20232B] border-b border-[#2A2E38] text-[#9AA0AC] font-semibold uppercase text-[11px]">
                    <tr>
                      <th className="py-3 px-4 whitespace-nowrap">
                        CMO Officer & Role
                      </th>
                      <th className="py-3 px-4 whitespace-nowrap">
                        Zone & District
                      </th>
                      <th className="py-3 px-4 whitespace-nowrap text-center">
                        Assigned Feedbacks
                      </th>
                      <th className="py-3 px-4 whitespace-nowrap text-center">
                        Resolved: % (Count)
                      </th>
                      <th className="py-3 px-4 whitespace-nowrap text-center">
                        Unresolved: % (Count)
                      </th>
                      <th className="py-3 px-4 whitespace-nowrap text-center">
                        Escalations Received
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2E38]">
                    {cmos
                      .filter((c) => c.role !== "SUPER_ADMIN")
                      .map((cmo) => {
                        const assignedFbs = feedbacks.filter(
                          (f) => f.assignedCmoId === cmo.id,
                        );
                        const resFbs = assignedFbs.filter(
                          (f) =>
                            f.status === "Resolved" || f.status === "Closed",
                        ).length;
                        const unresFbs = assignedFbs.length - resFbs;
                        const resP =
                          assignedFbs.length > 0
                            ? Math.round((resFbs / assignedFbs.length) * 100)
                            : 85;
                        const unresP = 100 - resP;
                        const escRec = feedbacks.filter((f) =>
                          f.escalationHistory?.some(
                            (e) => e.escalatedToCmoId === cmo.id,
                          ),
                        ).length;

                        return (
                          <tr
                            key={cmo.id}
                            className="hover:bg-[#20232B]/50 transition"
                          >
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="font-bold text-[#F5F6FA] text-sm">
                                {cmo.name}
                              </div>
                              <div className="text-[11px] text-[#7C5CFC] font-sans">
                                {cmo.role} — {cmo.designation}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-[#9AA0AC] whitespace-nowrap">
                              <div>{cmo.district}</div>
                              <div className="text-[10px] text-[#5B8DEF] font-bold uppercase">
                                {cmo.zone} Zone
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-center font-sans font-bold text-[#F5F6FA] whitespace-nowrap">
                              {assignedFbs.length} Records
                            </td>
                            <td className="py-3.5 px-4 text-center font-sans font-bold text-[#22C55E] whitespace-nowrap">
                              Resolved: {resP}% ({resFbs})
                            </td>
                            <td className="py-3.5 px-4 text-center font-sans font-bold text-[#EF4444] whitespace-nowrap">
                              Unresolved: {unresP}% ({unresFbs})
                            </td>
                            <td className="py-3.5 px-4 text-center font-sans font-bold text-[#F5B700] whitespace-nowrap">
                              {escRec} Escalations
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB CONTENT 2: CMO HIERARCHY MANAGEMENT */}
        {activeTab === "cmos" && (
          <motion.div
            key="cmos"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-5 shadow-xl space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2A2E38] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#7C5CFC] uppercase tracking-wider flex items-center gap-2">
                  <Icon
                    icon="ph:tree-structure-bold"
                    className="w-4 h-4 text-[#7C5CFC]"
                  />
                  <span>CMO Hierarchy & Role Governance Management</span>
                </h3>
                <p className="text-xs text-[#9AA0AC]">
                  Manage CMO officers across Tier 1 (CMO_1 Primary) → Tier 2
                  (CMO_2 District) → Tier 3 (CMO_3 State).
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingCmo(null);
                  setCmoForm({
                    name: "",
                    designation: "",
                    email: "",
                    role: "CMO_1",
                    parentCmoId: "cmo-2-north",
                    zone: "North",
                    district: "North Delhi",
                    phone: "",
                  });
                  setShowCmoModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6B4CE0] text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-[#7C5CFC]/20"
              >
                <Icon icon="ph:plus-bold" className="w-4 h-4" />
                <span>Create New CMO Officer</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cmos
                .filter((c) => c.role !== "SUPER_ADMIN")
                .map((cmo) => {
                  const parentCmo = cmos.find((p) => p.id === cmo.parentCmoId);

                  return (
                    <motion.div
                      key={cmo.id}
                      whileHover={{ scale: 1.01 }}
                      className={`bg-[#20232B] border rounded-2xl p-5 space-y-3 relative transition ${
                        cmo.status === "active"
                          ? "border-[#2A2E38]"
                          : "border-[#EF4444]/40 opacity-60"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#7C5CFC]/15 text-[#7C5CFC] border border-[#7C5CFC]/30 text-[10px] font-bold uppercase">
                            {cmo.role}
                          </span>
                          <h4 className="font-bold text-[#F5F6FA] text-base mt-1.5">
                            {cmo.name}
                          </h4>
                          <div className="text-xs text-[#9AA0AC]">
                            {cmo.designation}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleCmoStatus(cmo)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition cursor-pointer ${
                            cmo.status === "active"
                              ? "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30"
                              : "bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30"
                          }`}
                        >
                          {cmo.status}
                        </button>
                      </div>

                      <div className="text-xs text-[#F5F6FA] space-y-1.5 pt-3 border-t border-[#2A2E38] font-sans">
                        <div className="flex items-center justify-between">
                          <span className="text-[#9AA0AC]">Zone:</span>
                          <strong className="text-[#5B8DEF]">
                            {cmo.zone} Zone
                          </strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#9AA0AC]">District:</span>
                          <strong className="text-[#F5F6FA]">
                            {cmo.district}
                          </strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#9AA0AC]">Parent CMO:</span>
                          <strong className="text-[#7C5CFC]">
                            {parentCmo ? parentCmo.name : "SuperAdmin State"}
                          </strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#9AA0AC]">Email:</span>
                          <span className="text-[#9AA0AC] truncate max-w-[150px]">
                            {cmo.email}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end gap-2 border-t border-[#2A2E38]">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCmo(cmo);
                            setCmoForm({
                              name: cmo.name,
                              designation: cmo.designation,
                              email: cmo.email,
                              role: cmo.role,
                              parentCmoId: cmo.parentCmoId || "",
                              zone: cmo.zone,
                              district: cmo.district,
                              phone: cmo.phone,
                            });
                            setShowCmoModal(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#1A1D24] hover:bg-[#2A2E38] text-[#F5F6FA] border border-[#2A2E38] text-xs font-bold transition cursor-pointer flex items-center gap-1"
                        >
                          <Icon
                            icon="ph:pencil-bold"
                            className="w-3.5 h-3.5 text-[#5B8DEF]"
                          />
                          <span>Edit CMO</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </motion.div>
        )}

        {/* TAB CONTENT 3: CENTRE GOVERNANCE */}
        {activeTab === "centres" && (
          <motion.div
            key="centres"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-5 shadow-xl space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2A2E38] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#5B8DEF] uppercase tracking-wider flex items-center gap-2">
                  <Icon
                    icon="ph:buildings-bold"
                    className="w-4 h-4 text-[#5B8DEF]"
                  />
                  <span>Arogya Mandir Facility Governance</span>
                </h3>
                <p className="text-xs text-[#9AA0AC]">
                  Overview of all active state health facilities, assigned CMO
                  officers, and patient footfall.
                </p>
              </div>
              <span className="text-xs font-sans text-[#5B8DEF]">
                {centres.length} Mandir Centres
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#F5F6FA]">
                <thead className="bg-[#20232B] border-b border-[#2A2E38] text-[#9AA0AC] font-semibold uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4 whitespace-nowrap">
                      Facility Name & Code
                    </th>
                    <th className="py-3 px-4 whitespace-nowrap">
                      Zone & Locality
                    </th>
                    <th className="py-3 px-4 whitespace-nowrap">
                      Assigned CMO_1
                    </th>
                    <th className="py-3 px-4 whitespace-nowrap text-center">
                      Active Patient Footfall
                    </th>
                    <th className="py-3 px-4 whitespace-nowrap text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2E38]">
                  {centres.map((c) => {
                    const cmoObj = cmos.find(
                      (u) =>
                        u.id === c.cmoId || u.assignedCentreIds?.includes(c.id),
                    );

                    return (
                      <tr
                        key={c.id}
                        className="hover:bg-[#20232B]/50 transition"
                      >
                        <td className="py-3.5 px-4 whitespace-nowrap font-bold text-[#F5F6FA]">
                          {c.name}
                          <span className="block font-sans text-[10px] text-[#5B8DEF]">
                            {c.code}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-[#9AA0AC] font-sans">
                          {c.locality}
                          <span className="block text-[10px] text-[#9AA0AC]">
                            Zone: {c.zone}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-[#F5F6FA]">
                          {cmoObj ? cmoObj.name : "Dr. Amit Kumar (CMO_1)"}
                          <span className="block text-[10px] text-[#9AA0AC] font-sans">
                            {cmoObj?.phone || "+91 98101 22334"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-center font-sans font-bold text-[#22C55E]">
                          {c.activePatientsCount || 2450} Patients
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-center">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 text-[11px] font-bold">
                            Fully Operational
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB CONTENT 4: QUESTION MANAGEMENT */}
        {activeTab === "questions" && (
          <motion.div
            key="questions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-5 shadow-xl space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2A2E38] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#7C5CFC] uppercase tracking-wider flex items-center gap-2">
                  <Icon
                    icon="ph:gear-six-bold"
                    className="w-4 h-4 text-[#7C5CFC]"
                  />
                  <span>
                    Feedback Survey Questions & Response SLA Configuration
                  </span>
                </h3>
                <p className="text-xs text-[#9AA0AC]">
                  Configure questions, response parameters, and target SLA
                  resolution timeframes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingQuestion(null);
                  setQuestionForm({
                    key: "",
                    category: "",
                    text: "",
                    hindiText: "",
                    slaHours: 24,
                  });
                  setShowQuestionModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6B4CE0] text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-[#7C5CFC]/20"
              >
                <Icon icon="ph:plus-bold" className="w-4 h-4" />
                <span>Add New Survey Question</span>
              </button>
            </div>

            <div className="space-y-3">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="bg-[#20232B] border border-[#2A2E38] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#7C5CFC]/15 text-[#7C5CFC] border border-[#7C5CFC]/30 text-[10px] font-sans font-bold uppercase">
                        Category: {q.category}
                      </span>
                      <span className="text-xs text-[#9AA0AC] font-sans">
                        Target SLA: {q.slaHours} Hours
                      </span>
                    </div>
                    <h4 className="font-bold text-[#F5F6FA] text-sm">
                      {q.text}
                    </h4>
                    <p className="text-xs text-[#9AA0AC] italic">
                      {q.hindiText}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleQuestionStatus(q.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                        q.isActive
                          ? "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30"
                          : "bg-[#20232B] text-[#9AA0AC] border border-[#2A2E38]"
                      }`}
                    >
                      {q.isActive ? "Active" : "Disabled"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingQuestion(q);
                        setQuestionForm({
                          key: q.key,
                          category: q.category,
                          text: q.text,
                          hindiText: q.hindiText,
                          slaHours: q.slaHours,
                        });
                        setShowQuestionModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#1A1D24] hover:bg-[#2A2E38] text-[#F5F6FA] border border-[#2A2E38] text-xs font-bold transition cursor-pointer flex items-center gap-1"
                    >
                      <Icon
                        icon="ph:pencil-bold"
                        className="w-3.5 h-3.5 text-[#5B8DEF]"
                      />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CMO FORM MODAL - Theme Matched */}
      {showCmoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 text-[#F5F6FA]"
          >
            <h3 className="font-bold text-base text-[#F5F6FA] border-b border-[#2A2E38] pb-3 flex items-center justify-between">
              <span>
                {editingCmo ? "Edit CMO Officer" : "Create New CMO Officer"}
              </span>
              <button
                type="button"
                onClick={() => setShowCmoModal(false)}
                className="text-[#9AA0AC] hover:text-[#F5F6FA]"
              >
                <Icon icon="ph:x-bold" className="w-4 h-4" />
              </button>
            </h3>

            <form onSubmit={handleSaveCmo} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#9AA0AC] font-bold mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={cmoForm.name}
                  onChange={(e) =>
                    setCmoForm({ ...cmoForm, name: e.target.value })
                  }
                  placeholder="Dr. Full Name"
                  className="w-full bg-[#20232B] border border-[#2A2E38] rounded-xl p-2.5 text-[#F5F6FA] focus:outline-none focus:border-[#7C5CFC]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#9AA0AC] font-bold mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  value={cmoForm.designation}
                  onChange={(e) =>
                    setCmoForm({ ...cmoForm, designation: e.target.value })
                  }
                  placeholder="e.g. District Nodal Officer"
                  className="w-full bg-[#20232B] border border-[#2A2E38] rounded-xl p-2.5 text-[#F5F6FA] focus:outline-none focus:border-[#7C5CFC]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#9AA0AC] font-bold mb-1">
                    Role Level
                  </label>
                  <select
                    value={cmoForm.role}
                    onChange={(e) =>
                      setCmoForm({ ...cmoForm, role: e.target.value })
                    }
                    className="w-full bg-[#20232B] border border-[#2A2E38] rounded-xl p-2.5 text-[#7C5CFC] font-bold focus:outline-none"
                  >
                    <option value="CMO_1">CMO_1 (Primary)</option>
                    <option value="CMO_2">CMO_2 (District)</option>
                    <option value="CMO_3">CMO_3 (Upper State)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9AA0AC] font-bold mb-1">
                    Parent Upper CMO
                  </label>
                  <select
                    value={cmoForm.parentCmoId}
                    onChange={(e) =>
                      setCmoForm({ ...cmoForm, parentCmoId: e.target.value })
                    }
                    className="w-full bg-[#20232B] border border-[#2A2E38] rounded-xl p-2.5 text-[#F5F6FA] focus:outline-none"
                  >
                    <option value="super-admin">SuperAdmin (State)</option>
                    {cmos.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#9AA0AC] font-bold mb-1">
                    Geographic Zone
                  </label>
                  <select
                    value={cmoForm.zone}
                    onChange={(e) =>
                      setCmoForm({ ...cmoForm, zone: e.target.value })
                    }
                    className="w-full bg-[#20232B] border border-[#2A2E38] rounded-xl p-2.5 text-[#F5F6FA] focus:outline-none"
                  >
                    <option value="North">North Zone</option>
                    <option value="South">South Zone</option>
                    <option value="East">East Zone</option>
                    <option value="West">West Zone</option>
                    <option value="Central">Central Zone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9AA0AC] font-bold mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={cmoForm.district}
                    onChange={(e) =>
                      setCmoForm({ ...cmoForm, district: e.target.value })
                    }
                    placeholder="e.g. North Delhi"
                    className="w-full bg-[#20232B] border border-[#2A2E38] rounded-xl p-2.5 text-[#F5F6FA] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#9AA0AC] font-bold mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={cmoForm.email}
                  onChange={(e) =>
                    setCmoForm({ ...cmoForm, email: e.target.value })
                  }
                  placeholder="Enter official email"
                  className="w-full bg-[#20232B] border border-[#2A2E38] rounded-xl p-2.5 text-[#F5F6FA] focus:outline-none"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#2A2E38]">
                <button
                  type="button"
                  onClick={() => setShowCmoModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#20232B] text-[#9AA0AC] border border-[#2A2E38] text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#7C5CFC] text-white text-xs font-black cursor-pointer shadow-lg shadow-[#7C5CFC]/20"
                >
                  Save Officer
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* QUESTION MODAL - Theme Matched */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 text-[#F5F6FA]"
          >
            <h3 className="font-bold text-base text-[#F5F6FA] border-b border-[#2A2E38] pb-3 flex items-center justify-between">
              <span>
                {editingQuestion
                  ? "Edit Survey Question"
                  : "Add New Survey Question"}
              </span>
              <button
                type="button"
                onClick={() => setShowQuestionModal(false)}
                className="text-[#9AA0AC] hover:text-[#F5F6FA]"
              >
                <Icon icon="ph:x-bold" className="w-4 h-4" />
              </button>
            </h3>

            <form onSubmit={handleSaveQuestion} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#9AA0AC] font-bold mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={questionForm.category}
                  onChange={(e) =>
                    setQuestionForm({
                      ...questionForm,
                      category: e.target.value,
                    })
                  }
                  placeholder="e.g. Medical Care & Consultation"
                  className="w-full bg-[#20232B] border border-[#2A2E38] rounded-xl p-2.5 text-[#F5F6FA] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#9AA0AC] font-bold mb-1">
                  English Question Text
                </label>
                <input
                  type="text"
                  value={questionForm.text}
                  onChange={(e) =>
                    setQuestionForm({ ...questionForm, text: e.target.value })
                  }
                  placeholder="Question text in English..."
                  className="w-full bg-[#20232B] border border-[#2A2E38] rounded-xl p-2.5 text-[#F5F6FA] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#9AA0AC] font-bold mb-1">
                  Hindi Translation Text
                </label>
                <input
                  type="text"
                  value={questionForm.hindiText}
                  onChange={(e) =>
                    setQuestionForm({
                      ...questionForm,
                      hindiText: e.target.value,
                    })
                  }
                  placeholder="प्रश्न हिंदी में..."
                  className="w-full bg-[#20232B] border border-[#2A2E38] rounded-xl p-2.5 text-[#F5F6FA] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#9AA0AC] font-bold mb-1">
                  Resolution SLA Target (Hours)
                </label>
                <input
                  type="number"
                  value={questionForm.slaHours}
                  onChange={(e) =>
                    setQuestionForm({
                      ...questionForm,
                      slaHours: Number(e.target.value),
                    })
                  }
                  className="w-full bg-[#20232B] border border-[#2A2E38] rounded-xl p-2.5 text-[#7C5CFC] font-sans font-bold focus:outline-none"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#2A2E38]">
                <button
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#20232B] text-[#9AA0AC] border border-[#2A2E38] text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#7C5CFC] text-white text-xs font-black cursor-pointer shadow-lg shadow-[#7C5CFC]/20"
                >
                  Save Question
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
