import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import {
  logoutAdmin,
  setSearchQuery,
  setRatingFilter,
  setMediaFilter,
  setStatusFilter,
  openDetailModal,
  updateRecordStatus,
} from "../../redux/features/adminSlice";
import {
  AdminCharts,
  MonthOnMonthScoreChart,
  WeekOnWeekAreaChart,
} from "./AdminCharts";
import { UserFeedbackDetailModal } from "./UserFeedbackDetailModal";
import { exportToCSV, exportToPDF } from "./exportUtils";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import cmoAvatar from "../../assets/cmo_avatar.jpg";
import { DUMMY_FEEDBACK_RECORDS, type FeedbackRecord } from "./dummyData";

interface AdminDashboardPageProps {
  onBackToPatientForm: () => void;
}

type MainNavTab = "dashboard" | "feedbacks" | "reports" | "notifications";
type DashboardSubTab = "overview" | "analysis";

interface NotificationItem {
  id: string;
  srNo: number;
  message: string;
  record: FeedbackRecord;
  checked: boolean;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onBackToPatientForm,
}) => {
  const dispatch = useDispatch();
  const records = useSelector((state: RootState) => state.admin.records);
  const searchQuery = useSelector(
    (state: RootState) => state.admin.searchQuery,
  );
  const ratingFilter = useSelector(
    (state: RootState) => state.admin.ratingFilter,
  );
  const statusFilter = useSelector(
    (state: RootState) => state.admin.statusFilter,
  );
  const mediaFilter = useSelector(
    (state: RootState) => state.admin.mediaFilter,
  );

  // Navigation state
  const [activeTab, setActiveTab] = useState<MainNavTab>("dashboard");
  const [dashSubTab, setDashSubTab] = useState<DashboardSubTab>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Logout Modal State
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Grievance Toggle State
  const [showGrievancesOnly, setShowGrievancesOnly] = useState<boolean>(false);

  // Filters State
  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [selectedMonth, setSelectedMonth] = useState<string>("ALL");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedClinic, setSelectedClinic] = useState<string>("ALL");
  const [selectedStationHq, setSelectedStationHq] = useState<string>("ALL");
  const [selectedResponseType, setSelectedResponseType] =
    useState<string>("ALL");

  // Notifications State (Matching Image 1)
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      srNo: 1,
      message:
        "The Feedback from qeqweeqw with concerns No. COK/PC/KNM/2026/8/25-01 is unsatisfactory from Kunnamkulam Polyclinic on date 2026-08-25 Please go through the detailed feedback.",
      record: DUMMY_FEEDBACK_RECORDS[0],
      checked: false,
    },
    {
      id: "notif-2",
      srNo: 2,
      message:
        "The Feedback from Hav Subhash Kumar with concerns No. JAM/PC/RAJ/2026/8/24-03 is unsatisfactory from Rajkot Polyclinic on date 2026-08-24 Please go through the detailed feedback.",
      record: DUMMY_FEEDBACK_RECORDS[1],
      checked: false,
    },
    {
      id: "notif-3",
      srNo: 3,
      message:
        "The Feedback from Smt. Manjula Patel with concerns No. JAM/PC/RAJ/2026/8/22-08 is unsatisfactory from Rajkot Polyclinic on date 2026-08-22 Please go through the detailed feedback.",
      record: DUMMY_FEEDBACK_RECORDS[2],
      checked: false,
    },
  ]);

  // Notifications & Toast State
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination for Feedbacks Table
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle Grievance Filter button handler
  const handleToggleGrievances = () => {
    if (showGrievancesOnly) {
      setShowGrievancesOnly(false);
      setSelectedResponseType("ALL");
      showToast("Showing All Feedbacks");
    } else {
      setShowGrievancesOnly(true);
      setSelectedResponseType("Could Be Better");
      showToast("Showing Grievances Only");
    }
  };

  // Mark Selected / All Notifications as Seen
  const handleMarkAsSeen = () => {
    const checkedItems = notifications.filter((n) => n.checked);
    if (checkedItems.length > 0) {
      setNotifications(notifications.filter((n) => !n.checked));
      showToast(`${checkedItems.length} Notification(s) marked as seen`);
    } else {
      setNotifications([]);
      showToast("All Notifications marked as seen");
    }
  };

  // Filter Logic
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Search
      const matchesSearch =
        !searchQuery ||
        r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.mobileNumber.includes(searchQuery) ||
        (r.clinicName &&
          r.clinicName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.facilityName &&
          r.facilityName.toLowerCase().includes(searchQuery.toLowerCase()));

      // Year
      const matchesYear = selectedYear === "ALL" || r.year === selectedYear;

      // Month
      const matchesMonth = selectedMonth === "ALL" || r.month === selectedMonth;

      // Date Exact
      const matchesDate =
        !selectedDate || (r.date && r.date.includes(selectedDate));

      // Clinic Name
      const matchesClinic =
        selectedClinic === "ALL" ||
        (r.clinicName && r.clinicName === selectedClinic) ||
        (r.facilityName && r.facilityName.includes(selectedClinic));

      // Station HQ
      const matchesStation =
        selectedStationHq === "ALL" || r.stationHq === selectedStationHq;

      // Response Type / Overall Rating
      const ratingVal = String(r.responseType || r.overallRating);
      const matchesResponse =
        selectedResponseType === "ALL" ||
        ratingVal === selectedResponseType ||
        (selectedResponseType === "Could Be Better" &&
          (ratingVal === "Could Be Better" || r.isGrievance)) ||
        (selectedResponseType === "Excellent Service" &&
          (ratingVal === "Excellent Service" || ratingVal === "Excellent")) ||
        (selectedResponseType === "Acceptable standard" &&
          (ratingVal === "Acceptable standard" || ratingVal === "Acceptable"));

      // Status
      const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;

      // Media
      let matchesMedia = true;
      const hasAudio = !!(
        r.registration?.audioUrl ||
        r.doctor?.audioUrl ||
        r.pharmacy?.audioUrl ||
        r.cleanliness?.audioUrl ||
        r.suggestions?.audioUrl
      );
      const hasImage = !!(
        r.registration?.imageUrl ||
        r.doctor?.imageUrl ||
        r.pharmacy?.imageUrl ||
        r.cleanliness?.imageUrl ||
        r.suggestions?.imageUrl
      );

      if (mediaFilter === "AUDIO") matchesMedia = hasAudio;
      if (mediaFilter === "IMAGE") matchesMedia = hasImage;
      if (mediaFilter === "BOTH") matchesMedia = hasAudio && hasImage;

      return (
        matchesSearch &&
        matchesYear &&
        matchesMonth &&
        matchesDate &&
        matchesClinic &&
        matchesStation &&
        matchesResponse &&
        matchesStatus &&
        matchesMedia
      );
    });
  }, [
    records,
    searchQuery,
    selectedYear,
    selectedMonth,
    selectedDate,
    selectedClinic,
    selectedStationHq,
    selectedResponseType,
    statusFilter,
    mediaFilter,
  ]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage]);

  const resetFilters = () => {
    setSelectedYear("ALL");
    setSelectedMonth("ALL");
    setSelectedDate("");
    setSelectedClinic("ALL");
    setSelectedStationHq("ALL");
    setSelectedResponseType("ALL");
    setShowGrievancesOnly(false);
    dispatch(setSearchQuery(""));
    dispatch(setRatingFilter("ALL"));
    dispatch(setStatusFilter("ALL"));
    dispatch(setMediaFilter("ALL"));
    setCurrentPage(1);
    showToast("Filters reset successfully");
  };

  const handleEscalateCMO = (recordId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(
      updateRecordStatus({
        id: recordId,
        status: "Assigned to CMO",
        note: "Escalated by CMO Rajkot to CMO for priority review",
        officerName: "CMO Rajkot",
      }),
    );
    showToast("Escalated to CMO successfully!");
  };

  const handleLogout = () => {
    dispatch(logoutAdmin());
    if (window.location.pathname.toLowerCase().includes("/admin")) {
      window.history.pushState({}, "", "/");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0F1D] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 flex flex-col relative overflow-x-hidden">
      {/* ------------------------------------------------------------------- */}
      {/* STREAMLINED CLEAN & EASY TOP HEADER BAR */}
      {/* ------------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 px-6 py-3 flex items-center justify-between shadow-lg h-16">
        {/* Left: Brand Emblem & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 border border-[#1b357b7e] rounded-full text-[#0A0F1D] flex items-center justify-center shrink-0 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-6 h-6"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              >
                <path d="M9.349 3.434a2.684 2.684 0 1 0 5.368 0a2.684 2.684 0 0 0-5.368 0m5.881 9.191a1.888 1.888 0 0 1 1.807 2.523m-5.004-9.03V23.25" />
                <path d="M14.494 4.5h7.889c2.677 0-1.2 6.453-6.772 4.3M9.569 4.5H1.682c-2.676 0 1.2 6.453 6.772 4.3m.381 3.825A1.9 1.9 0 0 0 6.916 14.5a1.975 1.975 0 0 0 1.919 1.964h5.116a1.92 1.92 0 0 1 0 3.838h-3.517a1.64 1.64 0 0 0-1.6 1.675a1.7 1.7 0 0 0 .531 1.247" />
              </g>
            </svg>
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className="text-xl font-bold tracking-wide text-white">
              Arogya Mandir
            </span>
            <span className="px-2 py-0.1 rounded-full bg-slate-800 text-amber-400 text-[10px] font-semibold border border-slate-700">
              Dashboard
            </span>
          </div>
        </div>

        {/* Center: Primary Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          {[
            {
              id: "dashboard",
              label: "Dashboard",
              icon: "ant-design:dashboard-outlined",
            },
            {
              id: "feedbacks",
              label: "Feedbacks",
              icon: "fluent:person-feedback-48-regular",
            },
            {
              id: "reports",
              label: "Reports & Export",
              icon: "oui:nav-reports",
            },
            {
              id: "notifications",
              label: "Notifications",
              icon: "clarity:notification-outline-badged",
              badge: notifications.length,
            },
            {
              id: "logout",
              label: "Logout",
              icon: "ph:sign-out-bold",
            },
          ].map((nav) => {
            const isActive = activeTab === nav.id;
            return (
              <button
                key={nav.id}
                onClick={() => {
                  if (nav.id === "logout") {
                    setShowLogoutModal(true);
                  } else {
                    setActiveTab(nav.id as MainNavTab);
                  }
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-2 relative ${
                  isActive
                    ? "text-amber-400 font-bold bg-slate-800/90 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon icon={nav.icon} className="w-4 h-4" />
                <span>{nav.label}</span>
                {nav.badge && nav.badge > 0 ? (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold flex items-center justify-center">
                    {nav.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Right: Clean User Pill & Quick Actions */}
        <div className="flex items-center gap-3">
          {/* User Profile Pill */}
          <div className="hidden sm:flex items-center gap-2.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1">
            <img
              src={cmoAvatar}
              alt="Profile"
              className="w-7 h-7 rounded-full object-cover border border-amber-500/50"
            />
            <span className="text-xs font-semibold text-slate-200">
              CMO Rajkot
            </span>
          </div>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Icon icon="ph:download-simple-bold" className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-44 bg-[#111827] border border-slate-800 rounded-xl shadow-xl p-1.5 z-20 space-y-1 text-xs font-semibold">
                  <button
                    onClick={() => {
                      exportToCSV(filteredRecords);
                      setShowExportMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800 rounded-lg text-emerald-400 flex items-center gap-2 cursor-pointer"
                  >
                    <Icon icon="ph:file-xls-bold" className="w-4 h-4" />
                    <span>Download CSV</span>
                  </button>
                  <button
                    onClick={() => {
                      exportToPDF(filteredRecords);
                      setShowExportMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800 rounded-lg text-red-400 flex items-center gap-2 cursor-pointer"
                  >
                    <Icon icon="ph:file-pdf-bold" className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Nav Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-300 md:hidden cursor-pointer"
          >
            <Icon
              icon={mobileMenuOpen ? "ph:x-bold" : "ph:list-bold"}
              className="w-5 h-5"
            />
          </button>
        </div>
      </header>

      {/* MOBILE MENU NAV DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#0F172A] border-b border-slate-800 p-3 space-y-1 md:hidden z-30"
          >
            {[
              {
                id: "dashboard",
                label: "Dashboard",
                icon: "ph:grid-four-bold",
              },
              {
                id: "feedbacks",
                label: "Feedbacks",
                icon: "ph:list-bullets-bold",
              },
              {
                id: "reports",
                label: "Reports & Export",
                icon: "ph:file-text-bold",
              },
              {
                id: "notifications",
                label: "Notifications",
                icon: "clarity:notification-outline-badged",
              },
              {
                id: "logout",
                label: "Logout",
                icon: "ph:sign-out-bold",
              },
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (nav.id === "logout") {
                    setShowLogoutModal(true);
                  } else {
                    setActiveTab(nav.id as MainNavTab);
                  }
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition ${
                  activeTab === nav.id
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon icon={nav.icon} className="w-4 h-4" />
                <span>{nav.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOGOUT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-[#111827] border border-slate-800 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl z-50"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto">
                <Icon icon="ph:sign-out-bold" className="w-6 h-6 text-red-400" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  Are you sure to logout?
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  You will be logged out of your admin session and redirected to login.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowLogoutModal(false);
                    handleLogout();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-18 right-6 z-50 bg-amber-500 text-slate-950 px-4 py-2 rounded-xl shadow-xl font-bold text-xs flex items-center gap-2"
          >
            <Icon icon="ph:check-circle-fill" className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------- */}
      {/* FILTER TOOLBAR - ONLY DISPLAYED ON FEEDBACKS TAB PAGE */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "feedbacks" && (
        <div className="bg-[#0F172A]/80 border-b border-slate-800/80 px-6 py-3 z-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            {/* Search Input */}
            <div className="relative w-full md:w-72 shrink-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                placeholder="Search patient, mobile, clinic..."
                className="w-full bg-[#111827] border border-slate-700/70 rounded-xl py-2 pl-9 pr-7 text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-500 transition"
              />
              <Icon
                icon="ph:magnifying-glass-bold"
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
              />
              {searchQuery && (
                <button
                  onClick={() => dispatch(setSearchQuery(""))}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <Icon icon="ph:x-bold" className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Clean Dropdown Filter Group */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-[#111827] border border-slate-700/70 rounded-xl py-1.5 px-3 text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="ALL">All Years</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-[#111827] border border-slate-700/70 rounded-xl py-1.5 px-3 text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="ALL">All Months</option>
                <option value="Aug">August</option>
                <option value="Jul">July</option>
                <option value="Jun">June</option>
              </select>

              <select
                value={selectedClinic}
                onChange={(e) => setSelectedClinic(e.target.value)}
                className="bg-[#111827] border border-slate-700/70 rounded-xl py-1.5 px-3 text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="ALL">All Feedbacks</option>
                <option value="Rajkot">Rajkot</option>
                <option value="Jamnagar">Jamnagar</option>
                <option value="Dwarka">Dwarka</option>
                <option value="Delhi Cantt">Delhi Cantt</option>
                <option value="Rohini">Rohini</option>
              </select>

              <select
                value={selectedResponseType}
                onChange={(e) => {
                  setSelectedResponseType(e.target.value);
                  if (e.target.value === "Could Be Better")
                    setShowGrievancesOnly(true);
                  else setShowGrievancesOnly(false);
                }}
                className="bg-[#111827] border border-slate-700/70 rounded-xl py-1.5 px-3 text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="ALL">All Ratings</option>
                <option value="Excellent Service">Excellent Service</option>
                <option value="Acceptable standard">Acceptable Standard</option>
                <option value="Could Be Better">Could Be Better</option>
              </select>

              <button
                onClick={resetFilters}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
              >
                <Icon icon="ph:arrow-clockwise-bold" className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MAIN DISPLAY PORT BODY */}
      {/* ------------------------------------------------------------------- */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* =================================================================== */}
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {/* =================================================================== */}
        {activeTab === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* CLEAN PAGE HEADER & SUB TABS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Executive Analytics Overview
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time patient satisfaction telemetry and Feedback response
                  metrics
                </p>
              </div>

              {/* Overview vs Analysis Toggle */}
              <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                <button
                  onClick={() => setDashSubTab("overview")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    dashSubTab === "overview"
                      ? "bg-amber-500 text-slate-950 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Executive Overview
                </button>
                <button
                  onClick={() => setDashSubTab("analysis")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    dashSubTab === "analysis"
                      ? "bg-amber-500 text-slate-950 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Analysis
                </button>
              </div>
            </div>

            {/* DASHBOARD CHARTS CONTENT */}
            {dashSubTab === "overview" ? (
              <AdminCharts filteredRecords={filteredRecords} />
            ) : (
              <div className="space-y-6">
                {/* 3 Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Total Submissions
                      </div>
                      <div className="text-3xl font-bold text-white mt-1">
                        {filteredRecords.length || 394}
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Icon icon="ph:clipboard-text-bold" className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Grievances Detected
                      </div>
                      <div className="text-3xl font-bold text-red-400 mt-1">
                        {
                          filteredRecords.filter(
                            (r) =>
                              String(r.responseType || r.overallRating) ===
                                "Could Be Better" || r.isGrievance,
                          ).length
                        }
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                      <Icon icon="ph:warning-circle-bold" className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        SLA Resolution Rate
                      </div>
                      <div className="text-3xl font-bold text-emerald-400 mt-1">
                        {filteredRecords.length > 0
                          ? Math.round(
                              (filteredRecords.filter(
                                (r) => r.status === "Resolved",
                              ).length /
                                filteredRecords.length) *
                                100,
                            )
                          : 88}
                        %
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Icon icon="ph:shield-check-bold" className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <WeekOnWeekAreaChart />
                  <MonthOnMonthScoreChart filteredRecords={filteredRecords} />
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: FEEDBACKS MANAGEMENT TAB */}
        {/* =================================================================== */}
        {activeTab === "feedbacks" && (
          <motion.div
            key="feedbacks"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Header Title with Dynamic Toggle Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Patient Feedback Records
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Detailed listing of patient ratings, clinic responses and
                  grievance actions
                </p>
              </div>

              {/* Dynamic Toggle Button: Show Grievances Only <-> Show All Feedbacks */}
              <button
                onClick={handleToggleGrievances}
                className={`px-4 py-2 rounded-xl border font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-sm ${
                  showGrievancesOnly
                    ? "bg-amber-500 text-slate-950 border-amber-400 hover:bg-amber-400"
                    : "border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
                }`}
              >
                <Icon
                  icon={
                    showGrievancesOnly
                      ? "ph:list-bullets-bold"
                      : "ph:warning-circle-bold"
                  }
                  className="w-4 h-4"
                />
                <span>
                  {showGrievancesOnly
                    ? "Show All Feedbacks"
                    : "Show Grievances Only"}
                </span>
              </button>
            </div>

            {/* TWO COLUMN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left Column: Current Monthly Cycle Details with Attractive Mini Chart */}
              <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-lg p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                    Current Monthly Cycle
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                    <div className="text-xs text-slate-400 font-medium">
                      Active Clinics
                    </div>
                    <div className="text-2xl font-bold text-white mt-1">1</div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                    <div className="text-xs text-slate-400 font-medium">
                      Feedbacks
                    </div>
                    <div className="text-2xl font-bold text-amber-400 mt-1">
                      {filteredRecords.length || 42}
                    </div>
                  </div>
                </div>

                {/* ATTRACTIVE MINI CHART FOR CURRENT MONTHLY CYCLE */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-300 font-bold">
                      Weekly Cycle Trend
                    </div>
                    <span className="text-[10px] text-amber-400 font-mono font-bold">
                      +14% Growth
                    </span>
                  </div>
                  <div className="h-28 relative">
                    <svg viewBox="0 0 100 45" className="w-full h-full">
                      <defs>
                        <linearGradient
                          id="miniMonthGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#F59E0B"
                            stopOpacity="0.4"
                          />
                          <stop
                            offset="100%"
                            stopColor="#F59E0B"
                            stopOpacity="0.0"
                          />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0 35 Q 25 5, 50 12 T 75 10 T 100 8 L 100 45 L 0 45 Z"
                        fill="url(#miniMonthGrad)"
                      />
                      <motion.path
                        d="M 0 35 Q 25 5, 50 12 T 75 10 T 100 8"
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="0.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1 }}
                      />
                      <circle cx="25" cy="14" r="1.5" fill="#F59E0B" />
                      <circle cx="50" cy="12" r="1.5" fill="#F59E0B" />
                      <circle cx="75" cy="10" r="1.5" fill="#F59E0B" />
                      <circle cx="100" cy="8" r="1.5" fill="#F59E0B" />
                    </svg>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>W1</span>
                    <span>W2</span>
                    <span>W3</span>
                    <span>W4</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Feedbacks Data Table */}
              <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Feedback Records ({filteredRecords.length})
                  </span>

                  {/* Pagination Pills */}
                  <div className="flex items-center gap-1 font-mono text-xs">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          className={`w-6 h-6 rounded-md flex items-center justify-center transition cursor-pointer ${
                            currentPage === p
                              ? "bg-amber-500 text-slate-950 font-bold"
                              : "bg-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          {p}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900/60 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider">
                        <th className="py-3 px-4 w-12">Sr. No</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Clinic Name</th>
                        <th className="py-3 px-4">Station HQ</th>
                        <th className="py-3 px-4">Response</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {paginatedRecords.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-10 text-center text-slate-400"
                          >
                            No matching feedback records found.
                          </td>
                        </tr>
                      ) : (
                        paginatedRecords.map((r, idx) => {
                          const rating = String(
                            r.responseType || r.overallRating,
                          );
                          let responseClass = "text-emerald-400";
                          if (rating === "Could Be Better")
                            responseClass = "text-red-400";
                          if (
                            rating === "Acceptable standard" ||
                            rating === "Acceptable"
                          )
                            responseClass = "text-amber-400";

                          return (
                            <tr
                              key={r.id}
                              className="hover:bg-slate-800/40 transition"
                            >
                              <td className="py-3 px-4 font-medium text-slate-400">
                                {(currentPage - 1) * itemsPerPage + idx + 1}
                              </td>
                              <td className="py-3 px-4 text-slate-300 font-medium">
                                {r.date || r.timestamp}
                              </td>
                              <td className="py-3 px-4 font-medium text-white">
                                {r.clinicName || r.facilityName}
                              </td>
                              <td className="py-3 px-4 text-slate-300 font-medium">
                                {r.stationHq || "Jamnagar"}
                              </td>
                              <td
                                className={`py-3 px-4 font-medium ${responseClass}`}
                              >
                                {rating}
                              </td>

                              <td className="py-3 px-4 text-center space-x-2">
                                {/* View Button */}
                                <button
                                  onClick={() => dispatch(openDetailModal(r))}
                                  className="relative group px-3 py-1 rounded-lg border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 text-xs font-semibold transition cursor-pointer inline-flex items-center gap-1"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M0 0h24v24H0z" fill="none" />
                                    <g
                                      fill="none"
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                    >
                                      <path d="M21.257 10.962c.474.62.474 1.457 0 2.076C19.764 14.987 16.182 19 12 19s-7.764-4.013-9.257-5.962a1.69 1.69 0 0 1 0-2.076C4.236 9.013 7.818 5 12 5s7.764 4.013 9.257 5.962" />
                                      <circle cx="12" cy="12" r="3" />
                                    </g>
                                  </svg>

                                  {/* Tooltip */}
                                  <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 hidden group-hover:block whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg border border-gray-700">
                                    View
                                  </span>
                                </button>

                                {/* Escalate Button */}
                                {r.status !== "Assigned to CMO" && (
                                  <button
                                    onClick={(e) => handleEscalateCMO(r.id, e)}
                                    className="relative group px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition cursor-pointer inline-flex items-center gap-1"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="1em"
                                      height="1em"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M0 0h24v24H0z" fill="none" />
                                      <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m22 11l-7-9v5C3.047 7 1.668 16.678 2 22c.502-2.685.735-7 13-7v5z"
                                      />
                                    </svg>

                                    {/* Tooltip */}
                                    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 hidden group-hover:block whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg border border-gray-700">
                                      Escalate
                                    </span>
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: REPORTS TAB */}
        {/* =================================================================== */}
        {activeTab === "reports" && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#111827] border border-slate-800 rounded-2xl p-8 text-center space-y-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
              <Icon icon="ph:file-text-bold" className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Feedback Reports & Data Export
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Download complete telemetry reports for Feedback, grievances, and
              patient feedback.
            </p>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() =>
                  exportToCSV(
                    filteredRecords,
                    "Arogya_Mandir_Feedback_Report.csv",
                  )
                }
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-2"
              >
                <Icon icon="ph:file-xls-bold" className="w-4 h-4" />
                <span>Export CSV File</span>
              </button>
              <button
                onClick={() =>
                  exportToPDF(
                    filteredRecords,
                    "Arogya Mandir Governance Summary",
                  )
                }
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-2"
              >
                <Icon icon="ph:file-pdf-bold" className="w-4 h-4" />
                <span>Export PDF Report</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: NOTIFICATIONS TAB (MATCHING IMAGE 1) */}
        {/* =================================================================== */}
        {activeTab === "notifications" && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Top Breadcrumb & Header Box */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <span>Dashboard</span>
                  <Icon icon="ph:caret-right-bold" className="w-3 h-3 text-slate-600" />
                  <span className="text-amber-400 font-semibold">Notifications</span>
                </div>

                <div className="mt-3 bg-[#111827]/90 border border-slate-800 rounded-2xl px-6 py-4 shadow-lg inline-block">
                  <h2 className="text-2xl font-bold text-amber-400">
                    Notifications List
                  </h2>
                </div>
              </div>

              {/* Action Button: Make Marked as Seen */}
              <button
                onClick={handleMarkAsSeen}
                className="self-end sm:self-auto px-4 py-2 rounded-lg border border-amber-400 text-amber-400 font-bold text-xs hover:bg-amber-400/10 transition cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <span>Make Marked as Seen</span>
              </button>
            </div>

            {/* NOTIFICATIONS TABLE CARD CONTAINER */}
            <div className="bg-[#181F2F] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              {/* Yellow Banner Header */}
              <div className="bg-amber-400 text-slate-950 px-5 py-3 font-bold text-sm tracking-wide flex items-center justify-between shadow-md">
                <span>List of Notifications</span>
              </div>

              {/* Table Column Header Row */}
              <div className="bg-[#1f293d] border-b border-slate-700/80 px-5 py-3 grid grid-cols-12 gap-3 text-xs font-semibold text-slate-300 uppercase tracking-wider items-center">
                <div className="col-span-1">Sr. No</div>
                <div className="col-span-8 sm:col-span-9">Name</div>
                <div className="col-span-2 sm:col-span-1 text-center">Action</div>
                <div className="col-span-1 text-right">
                  <input
                    type="checkbox"
                    checked={notifications.length > 0 && notifications.every((n) => n.checked)}
                    onChange={(e) => {
                      const checkedAll = e.target.checked;
                      setNotifications(notifications.map((n) => ({ ...n, checked: checkedAll })));
                    }}
                    className="w-4 h-4 rounded border-slate-700 accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Notification Table Rows */}
              <div className="divide-y divide-slate-800/80">
                {notifications.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-sm font-medium">
                    No unread notifications available. All items marked as seen.
                  </div>
                ) : (
                  notifications.map((notif, idx) => (
                    <div
                      key={notif.id}
                      className={`px-5 py-4 grid grid-cols-12 gap-3 text-xs items-center transition ${
                        notif.checked ? "bg-amber-500/5" : "hover:bg-slate-800/50"
                      }`}
                    >
                      {/* Sr. No */}
                      <div className="col-span-1 font-mono font-bold text-slate-300">
                        {idx + 1}
                      </div>

                      {/* Notification Message */}
                      <div className="col-span-8 sm:col-span-9 text-slate-200 font-normal leading-relaxed">
                        {notif.message}
                      </div>

                      {/* Action: View Details */}
                      <div className="col-span-2 sm:col-span-1 text-center">
                        <button
                          onClick={() => {
                            dispatch(openDetailModal(notif.record));
                            // Mark as seen / remove from notification list
                            setNotifications(notifications.filter((n) => n.id !== notif.id));
                          }}
                          className="px-3.5 py-1.5 rounded-lg border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-slate-950 font-bold text-xs transition cursor-pointer whitespace-nowrap shadow-sm"
                        >
                          View Details
                        </button>
                      </div>

                      {/* Selection Checkbox */}
                      <div className="col-span-1 text-right">
                        <input
                          type="checkbox"
                          checked={notif.checked}
                          onChange={(e) => {
                            const checkedVal = e.target.checked;
                            setNotifications(
                              notifications.map((n) =>
                                n.id === notif.id ? { ...n, checked: checkedVal } : n
                              )
                            );
                          }}
                          className="w-4 h-4 rounded border-slate-700 accent-amber-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bottom Copyright & Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-6 text-[11px] text-slate-500 border-t border-slate-800/60">
              <div className="flex items-center gap-1.5 font-bold text-white tracking-wider">
                <span className="text-red-500 text-sm">ViTRIC</span>
              </div>
              <div>
                © Insight is a Copyright to Vitric Business Solutions Pvt. Ltd. 2016 - Present. All rights reserved.
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* DETAIL MODAL */}
      <UserFeedbackDetailModal />
    </div>
  );
};
