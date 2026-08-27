import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { logoutAdmin, openDetailModal } from "../../redux/features/adminSlice";
import {
  AdminCharts,
  OverallScoreBifurcation,
  SolvedVsUnsolvedDonutChart,
  WeekOnWeekAreaChart,
  ActiveMandirsBarChart,
  FeedbackScoreMeter,
} from "./AdminCharts";
import { Cmo1ResponseChart } from "./Cmo1ResponseChart";
import { UserFeedbackDetailModal } from "./UserFeedbackDetailModal";
import { KeyInsightsTab } from "./KeyInsightsTab";
import { PerformanceSummaryView } from "./PerformanceSummaryView";
import { SuperAdminDashboard } from "./SuperAdminDashboard";
import { CmoAnalysisView } from "./CmoAnalysisView";
import { exportToCSV, exportToPDF } from "./exportUtils";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  FeedbackRecord,
  CmoUser,
  ArogyaCentre,
  NotificationItem,
} from "../../types/cmoTypes";
import { StorageService } from "../../services/storageService";
import { AuthService } from "../../services/authService";

interface AdminDashboardPageProps {
  onBackToPatientForm: () => void;
}

type TabType =
  | "overview"
  | "insights"
  | "analysis"
  | "feedbacks"
  | "admin_panel";

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onBackToPatientForm,
}) => {
  const dispatch = useDispatch();

  // Active User Session & Data Layer
  const [activeUser, setActiveUser] = useState<CmoUser | null>(null);
  const [cmos, setCmos] = useState<CmoUser[]>([]);
  const [centres, setCentres] = useState<ArogyaCentre[]>([]);
  const [records, setRecords] = useState<FeedbackRecord[]>([]);

  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [selectedPerformanceCentre, setSelectedPerformanceCentre] =
    useState<ArogyaCentre | null>(null);

  // Notification Panel Dropdown State
  const [showNotificationsDropdown, setShowNotificationsDropdown] =
    useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Filter Bar State for Feedback Tab
  const [selectedCmo2Filter, setSelectedCmo2Filter] = useState<string>("ALL");
  const [selectedCmo1Filter, setSelectedCmo1Filter] = useState<string>("ALL");
  const [selectedResponseFilter, setSelectedResponseFilter] =
    useState<string>("ALL");
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>("ALL");
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>("ALL");

  // Pagination for Feedback Tab
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [manualPageInput, setManualPageInput] = useState<string>("");
  const itemsPerPage = 7;

  // Toast Notice State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = () => {
    const user = AuthService.getActiveUser();
    setActiveUser(user);

    const allCmos = StorageService.getCmos();
    setCmos(allCmos);

    const allCentres = StorageService.getCentres();
    setCentres(allCentres);

    const allFbs = StorageService.getFeedbacks();
    setRecords(allFbs);

    if (user) {
      const userNotifs = StorageService.getNotifications(user.id);
      setNotifications(userNotifs);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Scoped records according to CMO hierarchy access model
  const scopedRecords = useMemo(() => {
    if (!activeUser) return [];

    if (activeUser.role === "SUPER_ADMIN" || activeUser.role === "CMO_3") {
      return records;
    }

    if (activeUser.role === "CMO_2") {
      // CMO_2 sees feedback of facilities in their zone or assigned CMO_1s
      const lowerCmoIds = cmos
        .filter(
          (c) =>
            c.id === activeUser.id ||
            c.parentCmoId === activeUser.id ||
            c.zone === activeUser.zone,
        )
        .map((c) => c.id);
      return records.filter(
        (r) =>
          lowerCmoIds.includes(r.assignedCmoId) || r.zone === activeUser.zone,
      );
    }

    // CMO_1 sees feedback assigned to their facility / CMO_1 ID
    return records.filter(
      (r) =>
        r.assignedCmoId === activeUser.id ||
        (activeUser.assignedCentreIds &&
          activeUser.assignedCentreIds.includes(r.centreId)),
    );
  }, [activeUser, records, cmos]);

  // Filtered records for Feedback Tab
  const filteredFeedbackTabRecords = useMemo(() => {
    return scopedRecords.filter((r) => {
      if (selectedCmo2Filter !== "ALL") {
        const cmo2 = cmos.find((c) => c.id === selectedCmo2Filter);
        if (cmo2 && r.zone !== cmo2.zone) return false;
      }
      if (
        selectedCmo1Filter !== "ALL" &&
        r.assignedCmoId !== selectedCmo1Filter
      ) {
        return false;
      }
      if (
        selectedResponseFilter !== "ALL" &&
        r.overallRating !== selectedResponseFilter &&
        r.responseType !== selectedResponseFilter
      ) {
        return false;
      }
      if (selectedMonthFilter !== "ALL" && r.month !== selectedMonthFilter) {
        return false;
      }
      if (selectedYearFilter !== "ALL" && r.year !== selectedYearFilter) {
        return false;
      }
      return true;
    });
  }, [
    scopedRecords,
    selectedCmo2Filter,
    selectedCmo1Filter,
    selectedResponseFilter,
    selectedMonthFilter,
    selectedYearFilter,
    cmos,
  ]);

  // Pagination for Feedback Tab
  const totalPages = Math.max(
    1,
    Math.ceil(filteredFeedbackTabRecords.length / itemsPerPage),
  );
  const displayedFeedbackTabRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredFeedbackTabRecords.slice(start, start + itemsPerPage);
  }, [filteredFeedbackTabRecords, currentPage, itemsPerPage]);

  const handleManualPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(manualPageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setManualPageInput("");
    }
  };

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#F5F6FA] flex flex-col font-sans selection:bg-[#5B8DEF] selection:text-white">
      {/* User Detail Modal */}
      <UserFeedbackDetailModal />
      <div className="z-30 sticky top-0">
        {/* GLOBAL HEADER */}
        <header className="w-full bg-[#1A1D24] border-b border-[#2A2E38] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-lg">
          {/* Left: Logo & Role Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#5B8DEF]/15 border border-[#5B8DEF]/30 flex items-center justify-center text-[#5B8DEF]">
              <Icon
                icon="healthicons:health-vulnerability-through-social-determinants-outline"
                className="w-8 h-8"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-md font-bold text-[#F5F6FA] tracking-wide">
                  Arogya Mandir
                </span>
              </div>
              <div className="text-[11px] text-[#9AA0AC] font-sans">
                CMO Dashboard
              </div>
            </div>
          </div>

          {/* Right: Notifications Bell & Role Switcher & Logout */}
          <div className="flex items-center gap-3">
            {/* Profile Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-[#20232B] transition cursor-pointer"
              >
                {/* Profile Image */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  className="w-8 h-8 rounded-full object-cover border border-[#2A2E38]"
                >
                  <path d="M0 0h16v16H0z" fill="none" />
                  <g fill="currentColor">
                    <path d="M11 6a3 3 0 1 1-6 0a3 3 0 0 1 6 0" />
                    <path
                      fill-rule="evenodd"
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                    />
                  </g>
                </svg>

                {/* Name + Role */}
                <div className="hidden sm:block text-left leading-tight">
                  <div className="text-xs font-bold text-[#F5F6FA]">
                    {activeUser?.name || "CMO User"}
                  </div>

                  <span
                    className={`px-2 py-px rounded-md text-[10px] font-medium font-sans  ${
                      activeUser?.role === "SUPER_ADMIN"
                        ? "bg-[#7C5CFC]/20 text-[#7C5CFC] border border-[#7C5CFC]/30"
                        : activeUser?.role === "CMO_3"
                          ? "bg-[#5B8DEF]/20 text-[#5B8DEF] border border-[#5B8DEF]/30"
                          : activeUser?.role === "CMO_2"
                            ? "bg-[#F5B700]/20 text-[#F5B700] border border-[#F5B700]/30"
                            : "bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30"
                    }`}
                  >
                    {activeUser?.role} ({activeUser?.zone || "All Zones"})
                  </span>
                </div>

                <Icon
                  icon="ph:caret-down-bold"
                  className={`w-3.5 h-3.5 text-[#9AA0AC] transition-transform ${
                    showProfileMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[#1A1D24] border border-[#2A2E38] rounded-2xl shadow-2xl p-2 z-50">
                  {/* Profile Header */}
                  <div className="px-3 py-3 border-b border-[#2A2E38]">
                    <div className="flex items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        className="w-10 h-10 rounded-full object-cover border border-[#2A2E38]"
                      >
                        <path d="M0 0h16v16H0z" fill="none" />
                        <g fill="currentColor">
                          <path d="M11 6a3 3 0 1 1-6 0a3 3 0 0 1 6 0" />
                          <path
                            fill-rule="evenodd"
                            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                          />
                        </g>
                      </svg>

                      <div className="min-w-0">
                        <div className="text-sm font-bold text-[#F5F6FA] truncate">
                          {activeUser?.name || "CMO User"}
                        </div>

                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold font-sans  ${
                            activeUser?.role === "SUPER_ADMIN"
                              ? "bg-[#7C5CFC]/20 text-[#7C5CFC] border border-[#7C5CFC]/30"
                              : activeUser?.role === "CMO_3"
                                ? "bg-[#5B8DEF]/20 text-[#5B8DEF] border border-[#5B8DEF]/30"
                                : activeUser?.role === "CMO_2"
                                  ? "bg-[#F5B700]/20 text-[#F5B700] border border-[#F5B700]/30"
                                  : "bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30"
                          }`}
                        >
                          {activeUser?.role} ({activeUser?.zone || "All Zones"})
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex mt-1 px-2 py-0.5 rounded-md bg-[#5B8DEF]/20 text-[#7aa2f0] border border-[#5B8DEF]/30 text-[9px] font-medium tracking-wide">
                    {activeUser?.designation}
                  </span>

                  {/* View Profile */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl text-xs font-semibold text-[#F5F6FA] hover:bg-[#20232B] transition cursor-pointer"
                  >
                    <Icon
                      icon="ph:user-circle-bold"
                      className="w-4 h-4 text-[#5B8DEF]"
                    />
                    <span>View Profile</span>
                  </button>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={() => {
                      AuthService.logout();
                      dispatch(logoutAdmin());
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#F87171] hover:bg-[#EF4444]/10 transition cursor-pointer"
                  >
                    <Icon icon="ph:sign-out-bold" className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Bell Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setShowNotificationsDropdown(!showNotificationsDropdown)
                }
                className="p-2 rounded-xl bg-[#20232B] hover:bg-[#2A2E38] text-[#F5F6FA] border border-[#2A2E38] transition cursor-pointer relative"
              >
                <Icon icon="ph:bell-bold" className="w-5 h-5 text-[#9AA0AC]" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center font-sans">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {/* Notifications Panel */}
              {showNotificationsDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#1A1D24] border border-[#2A2E38] rounded-2xl shadow-2xl p-4 z-40 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#2A2E38] pb-2">
                    <div className="text-xs font-bold text-[#F5F6FA] uppercase tracking-wider flex items-center gap-1.5">
                      <Icon
                        icon="ph:bell-ringing-bold"
                        className="w-4 h-4 text-[#5B8DEF]"
                      />
                      <span>Role Notifications</span>
                    </div>
                    <span className="text-[10px] font-sans text-[#5B8DEF]">
                      {notifications.length} Total
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto space-y-2 text-xs">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-[#9AA0AC]">
                        No notifications found.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            StorageService.markNotificationRead(n.id);
                            const relatedRecord = records.find(
                              (f) => f.id === n.feedbackId,
                            );
                            if (relatedRecord)
                              dispatch(openDetailModal(relatedRecord as any));
                            setShowNotificationsDropdown(false);
                          }}
                          className={`p-3 rounded-xl border transition cursor-pointer space-y-1 ${
                            n.isRead
                              ? "bg-[#20232B]/50 border-[#2A2E38] text-[#9AA0AC]"
                              : "bg-[#20232B] border-[#5B8DEF]/40 text-[#F5F6FA]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-sans ${
                                n.type === "escalation"
                                  ? "bg-[#F97316]/20 text-[#F97316]"
                                  : n.type === "revert"
                                    ? "bg-[#F5B700]/20 text-[#F5B700]"
                                    : n.type === "resolution"
                                      ? "bg-[#22C55E]/20 text-[#22C55E]"
                                      : "bg-[#5B8DEF]/20 text-[#5B8DEF]"
                              }`}
                            >
                              {n.type}
                            </span>
                            <span className="text-[10px] text-[#9AA0AC] font-sans">
                              {n.timestamp}
                            </span>
                          </div>
                          <p className="text-xs">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={() => {
                AuthService.logout();
                dispatch(logoutAdmin());
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#20232B] hover:bg-[#EF4444]/20 hover:text-[#EF4444] text-[#9AA0AC] text-xs font-semibold border border-[#2A2E38] transition cursor-pointer flex items-center gap-1.5"
            >
              <Icon icon="ph:sign-out-bold" className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* NAVIGATION TAB BAR (§1, §8.2) */}
        <div className="bg-[#1A1D24]/72 backdrop-blur-md shadow-lg shadow-black/20 border-b border-[#2A2E38] px-4 sm:px-8 py-2.5 flex items-center justify-between overflow-x-auto ">
          <div className="flex items-center gap-2 w-full px-72 ">
            {/* Executive Overview */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("overview");
                setSelectedPerformanceCentre(null);
              }}
              className={`w-1/3 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "overview" && !selectedPerformanceCentre
                  ? "bg-[#5B8DEF] text-white shadow-lg shadow-[#5B8DEF]/20"
                  : "text-[#9AA0AC] hover:text-[#F5F6FA] hover:bg-[#20232B]"
              }`}
            >
              <Icon icon="ph:chart-pie-bold" className="w-4 h-4" />
              <span>Executive Overview</span>
            </button>

            {/* Key Insights (CMO_3 & SuperAdmin only - §8.2) */}
            {(activeUser?.role === "CMO_3" ||
              activeUser?.role === "SUPER_ADMIN") && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab("insights");
                  setSelectedPerformanceCentre(null);
                }}
                className={`w-1/3 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "insights"
                    ? "bg-[#5B8DEF] text-white shadow-lg shadow-[#5B8DEF]/20"
                    : "text-[#9AA0AC] hover:text-[#F5F6FA] hover:bg-[#20232B]"
                }`}
              >
                <Icon
                  icon="ph:sparkle-bold"
                  className="w-4 h-4 text-[#F5B700]"
                />
                <span>Key Insights</span>
              </button>
            )}

            {/* Analysis Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("analysis");
                setSelectedPerformanceCentre(null);
              }}
              className={`w-1/3 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "analysis" || selectedPerformanceCentre
                  ? "bg-[#5B8DEF] text-white shadow-lg shadow-[#5B8DEF]/20"
                  : "text-[#9AA0AC] hover:text-[#F5F6FA] hover:bg-[#20232B]"
              }`}
            >
              <Icon icon="ph:chart-line-up-bold" className="w-4 h-4" />
              <span>Analysis</span>
            </button>

            {/* Feedback Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("feedbacks");
                setSelectedPerformanceCentre(null);
              }}
              className={`w-1/3 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "feedbacks"
                  ? "bg-[#5B8DEF] text-white shadow-lg shadow-[#5B8DEF]/20"
                  : "text-[#9AA0AC] hover:text-[#F5F6FA] hover:bg-[#20232B]"
              }`}
            >
              <Icon icon="ph:chat-teardrop-text-bold" className="w-4 h-4" />
              <span>Feedback ({scopedRecords.length})</span>
            </button>

            {/* SuperAdmin Management Panel Tab */}
            {activeUser?.role === "SUPER_ADMIN" && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab("admin_panel");
                  setSelectedPerformanceCentre(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === "admin_panel"
                    ? "bg-[#7C5CFC] text-white shadow-lg shadow-[#7C5CFC]/20"
                    : "text-[#9AA0AC] hover:text-[#F5F6FA] hover:bg-[#20232B]"
                }`}
              >
                <Icon
                  icon="ph:gear-six-bold"
                  className="w-4 h-4 text-[#7C5CFC]"
                />
                <span>SuperAdmin Controls</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MAIN BODY AREA */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Toast Notice */}
        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-[#5B8DEF]/15 border border-[#5B8DEF]/30 text-[#5B8DEF] text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon icon="ph:info-bold" className="w-4 h-4" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* 1. EXECUTIVE OVERVIEW TAB (§6.1, §8.1) */}
        {activeTab === "overview" && !selectedPerformanceCentre && (
          <div className="space-y-6">
            {/* Stat Summary & ChartJS Visualization Block for CMO_1 */}
            {activeUser?.role === "CMO_1" && (
              <Cmo1ResponseChart scopedRecords={scopedRecords} />
            )}

            {/* Standard Dashboard Charts */}
            <AdminCharts
              filteredRecords={scopedRecords}
              currentRole={activeUser?.role}
            />

            {/* Bottom Summary Table with Totals Row (§8.1) */}
            {(activeUser?.role === "CMO_3" ||
              activeUser?.role === "SUPER_ADMIN") && (
              <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#2A2E38] pb-3">
                  <h3 className="text-sm font-bold text-[#F5F6FA] uppercase tracking-wider flex items-center gap-2">
                    <Icon
                      icon="ph:table-bold"
                      className="w-4 h-4 text-[#5B8DEF]"
                    />
                    <span>
                      State-Wide Mandir Performance & Ticket Metrics Breakdown
                    </span>
                  </h3>
                  <span className="text-xs font-sans text-[#9AA0AC]">
                    Totals Row Enforced
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#F5F6FA]">
                    <thead className="bg-[#20232B] border-b border-[#2A2E38] text-[#9AA0AC] font-semibold uppercase text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Mandir / Facility Name</th>
                        <th className="py-3 px-4 text-center">
                          Total Feedbacks
                        </th>
                        <th className="py-3 px-4 text-center">
                          Concerns Raised
                        </th>
                        <th className="py-3 px-4 text-center">Open Concerns</th>
                        <th className="py-3 px-4 text-center">Resolved</th>
                        <th className="py-3 px-4 text-center">Unresolved</th>
                        <th className="py-3 px-4 text-center">Escalated</th>
                        <th className="py-3 px-4 text-center">
                          Closed Tickets
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2E38]">
                      {centres.map((c) => {
                        const mandirFbs = records.filter(
                          (r) =>
                            r.centreId === c.id || r.facilityName === c.name,
                        );
                        const tot = mandirFbs.length;
                        const concerns = mandirFbs.filter(
                          (r) =>
                            r.overallRating === "Could Be Better" ||
                            r.responseType === "Could Be Better",
                        ).length;
                        const openConcerns = mandirFbs.filter(
                          (r) =>
                            r.overallRating === "Could Be Better" &&
                            r.status !== "Closed" &&
                            r.status !== "Resolved",
                        ).length;
                        const res = mandirFbs.filter(
                          (r) => r.status === "Resolved",
                        ).length;
                        const unres = tot - res;
                        const esc = mandirFbs.filter(
                          (r) => r.status === "Escalated",
                        ).length;
                        const cls = mandirFbs.filter(
                          (r) => r.status === "Closed",
                        ).length;

                        return (
                          <tr
                            key={c.id}
                            className="hover:bg-[#20232B]/50 transition"
                          >
                            <td className="py-3.5 px-4 font-bold text-[#F5F6FA]">
                              {c.name}
                              <span className="block text-[10px] text-[#9AA0AC] font-sans">
                                {c.zone} Zone • {c.code}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center font-sans font-bold text-[#5B8DEF]">
                              {tot}
                            </td>
                            <td className="py-3.5 px-4 text-center font-sans font-bold text-[#EF4444]">
                              {concerns}
                            </td>
                            <td className="py-3.5 px-4 text-center font-sans font-bold text-[#F5B700]">
                              {openConcerns}
                            </td>
                            <td className="py-3.5 px-4 text-center font-sans font-bold text-[#22C55E]">
                              {res}
                            </td>
                            <td className="py-3.5 px-4 text-center font-sans text-[#9AA0AC]">
                              {unres}
                            </td>
                            <td className="py-3.5 px-4 text-center font-sans font-bold text-[#F97316]">
                              {esc}
                            </td>
                            <td className="py-3.5 px-4 text-center font-sans font-bold text-slate-400">
                              {cls}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>

                    {/* Totals Row Enforced (§8.1) */}
                    <tfoot className="bg-[#20232B] font-extrabold border-t-2 border-[#2A2E38]">
                      <tr>
                        <td className="py-4 px-4 text-[#F5F6FA] uppercase tracking-wider text-xs">
                          Total Aggregate State Metrics
                        </td>
                        <td className="py-4 px-4 text-center font-sans text-[#5B8DEF] text-sm">
                          {records.length}
                        </td>
                        <td className="py-4 px-4 text-center font-sans text-[#EF4444] text-sm">
                          {
                            records.filter(
                              (r) =>
                                r.overallRating === "Could Be Better" ||
                                r.responseType === "Could Be Better",
                            ).length
                          }
                        </td>
                        <td className="py-4 px-4 text-center font-sans text-[#F5B700] text-sm">
                          {
                            records.filter(
                              (r) =>
                                r.overallRating === "Could Be Better" &&
                                r.status !== "Closed" &&
                                r.status !== "Resolved",
                            ).length
                          }
                        </td>
                        <td className="py-4 px-4 text-center font-sans text-[#22C55E] text-sm">
                          {
                            records.filter((r) => r.status === "Resolved")
                              .length
                          }
                        </td>
                        <td className="py-4 px-4 text-center font-sans text-[#9AA0AC] text-sm">
                          {records.length -
                            records.filter((r) => r.status === "Resolved")
                              .length}
                        </td>
                        <td className="py-4 px-4 text-center font-sans text-[#F97316] text-sm">
                          {
                            records.filter((r) => r.status === "Escalated")
                              .length
                          }
                        </td>
                        <td className="py-4 px-4 text-center font-sans text-slate-300 text-sm">
                          {records.filter((r) => r.status === "Closed").length}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. KEY INSIGHTS TAB (CMO_3 & SuperAdmin only - §8.2) */}
        {activeTab === "insights" &&
          (activeUser?.role === "CMO_3" ||
            activeUser?.role === "SUPER_ADMIN") && (
            <KeyInsightsTab
              records={scopedRecords}
              cmos={cmos}
              centres={centres}
              onSelectFeedback={(rec) => dispatch(openDetailModal(rec as any))}
            />
          )}

        {/* 3. ANALYSIS TAB (§7.1, §8.3) */}
        {activeTab === "analysis" &&
          (selectedPerformanceCentre ? (
            <PerformanceSummaryView
              centre={selectedPerformanceCentre}
              cmo={cmos.find((c) => c.id === selectedPerformanceCentre.cmoId)}
              allRecords={records}
              onBack={() => setSelectedPerformanceCentre(null)}
              onSelectFeedback={(rec) => dispatch(openDetailModal(rec as any))}
            />
          ) : (
            <div className="space-y-6">
              {/* For CMO_1 & CMO_2: Render CmoAnalysisView with values, percentages, escalation/revert metrics & analysis box */}
              {activeUser?.role === "CMO_1" || activeUser?.role === "CMO_2" ? (
                <CmoAnalysisView records={scopedRecords} role={activeUser?.role} />
              ) : (
                /* For CMO_3 & SuperAdmin: Render standard trend & resolution charts */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <WeekOnWeekAreaChart filteredRecords={scopedRecords} />
                  <SolvedVsUnsolvedDonutChart filteredRecords={scopedRecords} />
                </div>
              )}

              {/* Mandir / CMO_1 Performance Summaries List (§7.1) */}
              <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#2A2E38] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#F5F6FA] uppercase tracking-wider flex items-center gap-2">
                      <Icon
                        icon="ph:buildings-bold"
                        className="w-4 h-4 text-[#5B8DEF]"
                      />
                      <span>Facilities & CMO_1 Performance Summaries</span>
                    </h3>
                    <p className="text-xs text-[#9AA0AC]">
                      Click "View Details" to open dedicated Performance Summary
                      page.
                    </p>
                  </div>
                  <span className="text-xs font-sans text-[#5B8DEF]">
                    {centres.length} Mandirs
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#F5F6FA]">
                    <thead className="bg-[#20232B] border-b border-[#2A2E38] text-[#9AA0AC] font-semibold uppercase text-[11px]">
                      <tr>
                        <th className="py-3 px-4 whitespace-nowrap">
                          Mandir / Facility Name
                        </th>
                        <th className="py-3 px-4 whitespace-nowrap">
                          Zone & Locality
                        </th>
                        <th className="py-3 px-4 whitespace-nowrap">
                          Assigned CMO_1
                        </th>
                        <th className="py-3 px-4 text-center whitespace-nowrap">
                          Submissions
                        </th>
                        <th className="py-3 px-4 text-center whitespace-nowrap">
                          Could Be Better (Unescalated)
                        </th>
                        <th className="py-3 px-4 text-center whitespace-nowrap">
                          Satisfaction Score
                        </th>
                        <th className="py-3 px-4 text-center whitespace-nowrap">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2E38]">
                      {centres.map((c) => {
                        const cmoObj = cmos.find(
                          (user) =>
                            user.id === c.cmoId ||
                            user.assignedCentreIds?.includes(c.id),
                        );
                        const mandirFbs = records.filter(
                          (r) =>
                            r.centreId === c.id || r.facilityName === c.name,
                        );
                        const tot = mandirFbs.length;
                        const pos = mandirFbs.filter(
                          (r) =>
                            r.overallRating === "Excellent" ||
                            r.responseType === "Excellent Service",
                        ).length;
                        const unescalatedBetter = mandirFbs.filter(
                          (r) =>
                            (r.overallRating === "Could Be Better" ||
                              r.responseType === "Could Be Better") &&
                            r.status !== "Escalated",
                        ).length;
                        const scorePct =
                          tot > 0 ? Math.round((pos / tot) * 100) : 88;

                        return (
                          <tr
                            key={c.id}
                            className="hover:bg-[#20232B]/50 transition"
                          >
                            <td className="py-3.5 px-4 font-bold text-[#F5F6FA] whitespace-nowrap">
                              {c.name}
                              <span className="block font-sans text-[10px] text-[#5B8DEF]">
                                {c.code}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-[#9AA0AC] font-sans whitespace-nowrap">
                              {c.locality}
                              <span className="block text-[10px] text-[#9AA0AC]">
                                Zone: {c.zone}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-[#F5F6FA] whitespace-nowrap">
                              {cmoObj ? cmoObj.name : "Unassigned"}
                              <span className="block text-[10px] text-[#9AA0AC] font-sans">
                                {cmoObj?.phone || ""}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center font-sans font-bold text-[#5B8DEF] whitespace-nowrap">
                              {tot}
                            </td>
                            <td className="py-3.5 px-4 text-center font-sans font-bold text-[#EF4444] whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444]">
                                {unescalatedBetter}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center font-sans font-bold text-[#22C55E] whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E]">
                                {scorePct}%
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => setSelectedPerformanceCentre(c)}
                                className="px-3 py-1.5 rounded-xl bg-[#5B8DEF] hover:bg-[#4A7CE4] text-white text-xs font-bold transition cursor-pointer inline-flex items-center gap-1"
                              >
                                <span>View Details</span>
                                <Icon
                                  icon="ph:arrow-right-bold"
                                  className="w-3.5 h-3.5"
                                />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}

        {/* 4. FEEDBACK TAB (§6.3, §7.2, §8.4) */}
        {activeTab === "feedbacks" && (
          <div className="space-y-6">
            {/* Active Mandirs Bar Chart (§6.3) */}
            {/* <ActiveMandirsBarChart /> */}

            {/* Filter Bar & Feedback List */}
            <div className="bg-[#1A1D24] border border-[#2A2E38] rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#2A2E38] pb-4">
                <h3 className="text-sm font-bold text-[#F5F6FA] uppercase tracking-wider flex items-center gap-2">
                  <Icon
                    icon="ph:funnel-bold"
                    className="w-4 h-4 text-[#5B8DEF]"
                  />
                  <span>Feedback Escalation & Action Table</span>
                </h3>

                {/* Role Specific Filter Bar */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Select CMO_2 filter (CMO_3 & SuperAdmin only - §8.4) */}
                  {(activeUser?.role === "CMO_3" ||
                    activeUser?.role === "SUPER_ADMIN") && (
                    <select
                      value={selectedCmo2Filter}
                      onChange={(e) => {
                        setSelectedCmo2Filter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="bg-[#20232B] border border-[#2A2E38] rounded-xl px-3 py-1.5 text-xs text-[#F5F6FA] focus:outline-none focus:border-[#5B8DEF]"
                    >
                      <option value="ALL">Select CMO_2 (All Zones)</option>
                      {cmos
                        .filter((c) => c.role === "CMO_2")
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.zone} Zone)
                          </option>
                        ))}
                    </select>
                  )}

                  {/* Select CMO_1 filter (CMO_2, CMO_3, SuperAdmin - §7.2) */}
                  {activeUser?.role !== "CMO_1" && (
                    <select
                      value={selectedCmo1Filter}
                      onChange={(e) => {
                        setSelectedCmo1Filter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="bg-[#20232B] border border-[#2A2E38] rounded-xl px-3 py-1.5 text-xs text-[#F5F6FA] focus:outline-none focus:border-[#5B8DEF]"
                    >
                      <option value="ALL">Select CMO_1 (All Facilities)</option>
                      {cmos
                        .filter((c) => c.role === "CMO_1")
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                    </select>
                  )}

                  {/* Select Response Filter */}
                  <select
                    value={selectedResponseFilter}
                    onChange={(e) => {
                      setSelectedResponseFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-[#20232B] border border-[#2A2E38] rounded-xl px-3 py-1.5 text-xs text-[#F5F6FA] focus:outline-none focus:border-[#5B8DEF]"
                  >
                    <option value="ALL">Select Response (All)</option>
                    <option value="Could Be Better">Could Be Better</option>
                    <option value="Acceptable">Acceptable Standard</option>
                    <option value="Excellent">Excellent Service</option>
                  </select>

                  <select
                    value={selectedMonthFilter}
                    onChange={(e) => {
                      setSelectedMonthFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-[#20232B] border border-[#2A2E38] rounded-xl px-3 py-1.5 text-xs text-[#F5F6FA] focus:outline-none focus:border-[#5B8DEF]"
                  >
                    <option value="ALL">Month (All)</option>
                    <option value="Aug">August</option>
                    <option value="Jul">July</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCmo2Filter("ALL");
                      setSelectedCmo1Filter("ALL");
                      setSelectedResponseFilter("ALL");
                      setSelectedMonthFilter("ALL");
                      setSelectedYearFilter("ALL");
                      setCurrentPage(1);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#20232B] hover:bg-[#2A2E38] text-[#9AA0AC] hover:text-[#F5F6FA] text-xs font-semibold border border-[#2A2E38] transition cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              {/* Feedback List Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#F5F6FA]">
                  <thead className="bg-[#20232B] border-b border-[#2A2E38] text-[#9AA0AC] font-semibold uppercase text-[11px] table-auto">
                    <tr>
                      <th className="py-3 px-4">Sr. No.</th>
                      <th className="py-3 px-4">Tracking ID</th>
                      <th className="py-3 px-4">Patient Name</th>
                      <th className="py-3 px-4">Facility / Mandir</th>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Rating</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2E38]">
                    {displayedFeedbackTabRecords.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="py-8 text-center text-[#9AA0AC] font-medium"
                        >
                          No feedback submissions match your criteria.
                        </td>
                      </tr>
                    ) : (
                      displayedFeedbackTabRecords.map((r, idx) => (
                        <tr
                          key={r.id}
                          className="hover:bg-[#20232B]/50 transition"
                        >
                          <td className="py-3.5 px-4 font-sans text-[#9AA0AC]">
                            {(currentPage - 1) * itemsPerPage + idx + 1}
                          </td>
                          <td className="py-3.5 px-4 font-sans font-bold text-[#5B8DEF]">
                            {r.trackingId}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-[#F5F6FA]">
                            {r.patientName}
                            <span className="block text-[10px] text-[#9AA0AC] font-sans">
                              {r.visitorType}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-[#F5F6FA]">
                            {r.facilityName}
                          </td>
                          <td className="py-3.5 px-4 font-sans text-[#9AA0AC] text-[11px]">
                            {r.timestamp}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap min-w-[160px]">
                            {r.overallRating === "Could Be Better" ||
                            r.responseType === "Could Be Better" ? (
                              <span className="inline-flex items-center whitespace-nowrap px-2.5 py-1 rounded-full bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 text-[11px] font-bold">
                                Could Be Better
                              </span>
                            ) : r.overallRating === "Acceptable" ||
                              r.responseType === "Acceptable standard" ? (
                              <span className="inline-flex items-center whitespace-nowrap px-2.5 py-1 rounded-full bg-[#F5B700]/15 text-[#F5B700] border border-[#F5B700]/30 text-[11px] font-bold">
                                Acceptable
                              </span>
                            ) : (
                              <span className="inline-flex items-center whitespace-nowrap px-2.5 py-1 rounded-full bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 text-[11px] font-bold">
                                Excellent
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap min-w-[160px]">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                r.status === "Resolved"
                                  ? "bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/30"
                                  : r.status === "Escalated"
                                    ? "bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/30"
                                    : r.status === "Reverted"
                                      ? "bg-[#F5B700]/20 text-[#F5B700] border border-[#F5B700]/30"
                                      : r.status === "Closed"
                                        ? "bg-[#6B7280]/20 text-slate-300 border border-[#6B7280]/30"
                                        : "bg-[#5B8DEF]/20 text-[#5B8DEF] border border-[#5B8DEF]/30"
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                dispatch(openDetailModal(r as any))
                              }
                              className="px-3.5 py-1.5 rounded-lg bg-[#5B8DEF] hover:bg-[#4A7CE4] text-white text-xs font-bold transition cursor-pointer"
                            >
                              View Feedback
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination with manual "Go to page [__]" input field (§6.3) */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#2A2E38]">
                <div className="text-xs text-[#9AA0AC]">
                  Page{" "}
                  <strong className="text-[#F5F6FA] font-sans">
                    {currentPage}
                  </strong>{" "}
                  of{" "}
                  <strong className="text-[#F5F6FA] font-sans">
                    {totalPages}
                  </strong>{" "}
                  ({filteredFeedbackTabRecords.length} records)
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-lg bg-[#20232B] disabled:opacity-40 hover:bg-[#2A2E38] text-[#F5F6FA] text-xs font-semibold border border-[#2A2E38] transition cursor-pointer"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setCurrentPage(p)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold font-sans transition ${
                            currentPage === p
                              ? "bg-[#5B8DEF] text-white"
                              : "bg-[#20232B] text-[#9AA0AC] hover:bg-[#2A2E38]"
                          }`}
                        >
                          {p}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#20232B] disabled:opacity-40 hover:bg-[#2A2E38] text-[#F5F6FA] text-xs font-semibold border border-[#2A2E38] transition cursor-pointer"
                  >
                    Next
                  </button>

                  {/* Manual Go to page input field */}
                  <form
                    onSubmit={handleManualPageSubmit}
                    className="flex items-center gap-1 ml-2"
                  >
                    <span className="text-xs text-[#9AA0AC]">Go to page:</span>
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={manualPageInput}
                      onChange={(e) => setManualPageInput(e.target.value)}
                      placeholder="#"
                      className="w-12 bg-[#20232B] border border-[#2A2E38] rounded-lg px-2 py-1 text-xs text-center text-[#F5F6FA] font-sans focus:outline-none focus:border-[#5B8DEF]"
                    />
                    <button
                      type="submit"
                      className="px-2.5 py-1 rounded-lg bg-[#5B8DEF] text-white text-xs font-bold hover:bg-[#4A7CE4] transition cursor-pointer"
                    >
                      Go
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. SUPERADMIN CONTROLS TAB (§9) */}
        {activeTab === "admin_panel" && activeUser?.role === "SUPER_ADMIN" && (
          <SuperAdminDashboard
            onSelectFeedback={(rec) => dispatch(openDetailModal(rec as any))}
          />
        )}
      </main>
    </div>
  );
};
