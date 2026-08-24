import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import {
  closeAdminModal,
  logoutAdmin,
  setSearchQuery,
  setRatingFilter,
  setMediaFilter,
  setStatusFilter,
  openDetailModal,
} from "../../redux/features/adminSlice";
import {
  AdminCharts,
  VisitsSparkline,
  PaymentsSparkline,
  OperationEffectRing,
} from "./AdminCharts";
import { UserFeedbackDetailModal } from "./UserFeedbackDetailModal";
import { AudioPlayerWidget } from "./AudioPlayerWidget";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import cmoAvatar from "../../assets/cmo_avatar.jpg";

interface AdminDashboardPageProps {
  onBackToPatientForm: () => void;
}

type MenuTab =
  | "dashboard"
  | "list"
  | "profile"
  | "result"
  | "exception"
  | "account";

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onBackToPatientForm,
}) => {
  const dispatch = useDispatch();
  const adminEmail = useSelector((state: RootState) => state.admin.adminEmail);
  const searchQuery = useSelector(
    (state: RootState) => state.admin.searchQuery,
  );
  const ratingFilter = useSelector(
    (state: RootState) => state.admin.ratingFilter,
  );
  const mediaFilter = useSelector(
    (state: RootState) => state.admin.mediaFilter,
  );
  const statusFilter = useSelector(
    (state: RootState) => state.admin.statusFilter,
  );
  const records = useSelector((state: RootState) => state.admin.records);

  // Local navigation & responsive states
  const [activeMenu, setActiveMenu] = useState<MenuTab>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Search query filter
      const matchesSearch =
        !searchQuery ||
        r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.mobileNumber.includes(searchQuery) ||
        r.facilityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.aadhaarMasked.includes(searchQuery);

      // Rating filter
      const matchesRating =
        ratingFilter === "ALL" || r.overallRating === ratingFilter;

      // Status filter
      const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;

      // Media filter
      let matchesMedia = true;
      const hasAudio =
        !!r.registration.audioUrl ||
        !!r.doctor.audioUrl ||
        !!r.pharmacy.audioUrl ||
        !!r.cleanliness.audioUrl ||
        !!r.suggestions.audioUrl;
      const hasImage =
        !!r.registration.imageUrl ||
        !!r.doctor.imageUrl ||
        !!r.pharmacy.imageUrl ||
        !!r.cleanliness.imageUrl ||
        !!r.suggestions.imageUrl;

      if (mediaFilter === "AUDIO") matchesMedia = hasAudio;
      if (mediaFilter === "IMAGE") matchesMedia = hasImage;
      if (mediaFilter === "BOTH") matchesMedia = hasAudio && hasImage;

      return matchesSearch && matchesRating && matchesStatus && matchesMedia;
    });
  }, [records, searchQuery, ratingFilter, statusFilter, mediaFilter]);

  // Filtering for exceptions/grievances specifically
  const grievanceRecords = useMemo(() => {
    return records.filter(
      (r) => r.isGrievance || r.overallRating === "Could Be Better",
    );
  }, [records]);

  const handleLogout = () => {
    dispatch(logoutAdmin());
    if (window.location.pathname.toLowerCase().includes("/admin")) {
      window.history.pushState({}, "", "/");
    }
  };

  const handleExitAdmin = () => {
    dispatch(closeAdminModal());
    onBackToPatientForm();
  };

  // Analytics Metrics computation
  const totalCount = records.length;
  const grievanceCount = grievanceRecords.length;
  const resolvedCount = records.filter((r) => r.status === "Resolved").length;
  const audioNotesCount = records.filter(
    (r) =>
      r.registration.audioUrl ||
      r.doctor.audioUrl ||
      r.pharmacy.audioUrl ||
      r.cleanliness.audioUrl ||
      r.suggestions.audioUrl,
  ).length;
  const imagesCount = records.filter(
    (r) =>
      r.registration.imageUrl ||
      r.doctor.imageUrl ||
      r.pharmacy.imageUrl ||
      r.cleanliness.imageUrl ||
      r.suggestions.imageUrl,
  ).length;

  const activeGrievanceRate =
    totalCount > 0 ? Math.round((grievanceCount / totalCount) * 100) : 0;
  const slaResolutionRate =
    totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  // Sidebar Menu Config
  const sidebarItems: Array<{ key: string; label: string; icon: string; action?: () => void }> = [
    { key: "dashboard", label: "Dashboard", icon: "ph:grid-four-bold" },
    { key: "list", label: "List", icon: "ph:list-bullets-bold" },
    { key: "result", label: "Result", icon: "ph:check-circle-bold" },
    { key: "exception", label: "Exception", icon: "ph:warning-bold" },
    { key: "account", label: "Account", icon: "ph:gear-six-bold" },
    // {
    //   key: "form",
    //   label: "Form",
    //   icon: "ph:note-pencil-bold",
    //   action: handleExitAdmin,
    // },
    // { key: "profile", label: "Profile", icon: "ph:user-circle-bold" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F0F2F5] text-slate-800 flex font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden">
      {/* ------------------------------------------------------------- */}
      {/* MOBILE DRAWER DRAWER SIDEBAR & OVERLAY */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            {/* Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
            />
            {/* Slide-in sidebar container */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 bg-[#001529] text-white flex flex-col p-5 shadow-2xl lg:hidden"
            >
              {/* Brand Logo Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-5 mb-5 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className=" rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                    <div className="w-10 h-10 border border-white rounded-full text-white flex items-center justify-center shrink-0 shadow-sm">
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
                  </div>
                  <span className="text-base tracking-wider font-medium">
                    Arogya Mandir
                  </span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/65 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <Icon icon="ph:x-bold" className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Menu */}
              <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar">
                {sidebarItems.map((item) => {
                  const isActive = activeMenu === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        setMobileSidebarOpen(false);
                        if (item.action) {
                          item.action();
                        } else {
                          setActiveMenu(item.key as MenuTab);
                        }
                      }}
                      className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                          : "text-slate-400 hover:bg-slate-850 hover:text-slate-200"
                      }`}
                    >
                      <Icon icon={item.icon} className="w-5 h-5 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Mobile Footer Logged-in admin and exit */}
              <div className="border-t border-slate-800/85 pt-4 mt-4 shrink-0 space-y-3.5 text-xs text-slate-400">
                <div className="flex items-center gap-2.5 px-2">
                  <img
                    src={cmoAvatar}
                    alt="CMO Avatar"
                    className="w-8 h-8 rounded-full object-cover border border-slate-700"
                  />
                  <div className="truncate">
                    <div className="font-extrabold text-slate-250 text-[11px] leading-tight">
                      John Varma
                    </div>
                    <div className="text-[10px] text-slate-500">
                      cmo@arogyamandir.in
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-lg border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-400 font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Icon icon="ph:sign-out-bold" className="w-4 h-4" />
                  <span>Logout Node</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* DESKTOP SIDEBAR PANEL */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`hidden lg:flex flex-col bg-[#001529] text-white p-5 border-r border-slate-800/50 shadow-xl shrink-0 transition-all duration-300 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 border-b border-slate-800/80 pb-5 mb-5 shrink-0">
          <div className=" rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
            <div className="w-10 h-10 border border-white rounded-full text-white flex items-center justify-center shrink-0 shadow-sm">
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
          </div>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg  font-medium"
            >
              Arogya Mandir
            </motion.span>
          )}
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar">
          {sidebarItems.map((item) => {
            const isActive = activeMenu === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    setActiveMenu(item.key as MenuTab);
                  }
                }}
                className={`w-full flex items-center rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  sidebarCollapsed
                    ? "justify-center p-3.5"
                    : "gap-3.5 px-4 py-3.5"
                } ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                    : "text-slate-400 hover:bg-slate-850 hover:text-slate-250"
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon icon={item.icon} className="w-5 h-5 shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Desktop Sidebar Footer */}
        <div className="border-t border-slate-800/85 pt-4 mt-4 shrink-0 space-y-3">
          <div
            className={`flex items-center gap-2.5 ${sidebarCollapsed ? "justify-center" : "px-1"}`}
          >
            <img
              src={cmoAvatar}
              alt="CMO Avatar"
              className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
            />
            {!sidebarCollapsed && (
              <div className="truncate">
                <div className="font-extrabold text-slate-200 text-[11px] leading-tight">
                  John Varma
                </div>
                <div className="text-[9px] text-slate-500">
                  cmo@arogyamandir.in
                </div>
              </div>
            )}
          </div>
          {!sidebarCollapsed ? (
            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Icon icon="ph:sign-out-bold" className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition cursor-pointer flex justify-center"
              title="Log Out"
            >
              <Icon icon="ph:sign-out-bold" className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTAINER LAYOUT */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* TOP HEADER BAR */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-4">
            {/* Hamburger Toggle menu */}
            <button
              onClick={() => {
                setMobileSidebarOpen(true);
                setSidebarCollapsed(!sidebarCollapsed);
              }}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer flex items-center justify-center"
            >
              <Icon icon="ph:list-bold" className="w-5 h-5" />
            </button>

            {/* Path/Breadcrumbs */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-semibold select-none">
              <span>Admin</span>
              <Icon icon="ph:caret-right-bold" className="w-3 h-3" />
              <span className="text-slate-700 font-bold capitalize">
                {activeMenu}
              </span>
            </div>
          </div>

          {/* Right Header Navigation Panel */}
          <div className="flex items-center gap-4">
            {/* Search Trigger icon */}
            <button
              onClick={() => setActiveMenu("list")}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer flex items-center justify-center"
              title="Global Search"
            >
              <Icon icon="ph:magnifying-glass-bold" className="w-4.5 h-4.5" />
            </button>

            {/* Help Dropdown Option */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowHelpDropdown(!showHelpDropdown);
                  setShowNotifications(false);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer flex items-center justify-center"
                title="Documentation & Guides"
              >
                <Icon icon="ph:question-bold" className="w-4.5 h-4.5" />
              </button>
              {showHelpDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowHelpDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-30 flex flex-col gap-1 text-[11px] font-bold text-slate-650">
                    <div className="px-2.5 py-1.5 border-b border-slate-100 font-black text-slate-900 text-xs">
                      Help & Guides
                    </div>
                    <button className="px-2.5 py-2 hover:bg-slate-50 rounded-lg text-left flex items-center gap-2 transition cursor-pointer">
                      <Icon
                        icon="ph:book-open-bold"
                        className="w-4 h-4 text-blue-500"
                      />{" "}
                      Standard Operations SOP
                    </button>
                    <button className="px-2.5 py-2 hover:bg-slate-50 rounded-lg text-left flex items-center gap-2 transition cursor-pointer">
                      <Icon
                        icon="ph:shield-warning-bold"
                        className="w-4 h-4 text-amber-500"
                      />{" "}
                      Escalation Matrices
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Notifications Alert Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowHelpDropdown(false);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer flex items-center justify-center relative"
                title="Telemetry Alerts"
              >
                <Icon icon="ph:bell-bold" className="w-4.5 h-4.5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              </button>
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-3.5 z-30 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-1 shrink-0">
                      <span className="text-xs font-black text-slate-900 uppercase">
                        Alert Logs
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-750 text-[10px] font-bold">
                        1 New Alert
                      </span>
                    </div>
                    <div className="text-[11px] font-medium text-slate-600 space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                      <div className="p-2 bg-red-50/70 border border-red-100 rounded-xl space-y-1">
                        <div className="font-bold text-red-900 flex items-center gap-1">
                          <Icon
                            icon="ph:warning-circle-fill"
                            className="w-3.5 h-3.5 text-red-600"
                          />
                          Grievance Escalation
                        </div>
                        <p className="leading-tight text-slate-650">
                          Grievance AM-FB-2026-98124 requires urgent medicine
                          restocking audit.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="h-6 w-[1px] bg-slate-200" />

            {/* Profile Avatar John */}
            <div className="flex items-center gap-2 select-none">
              <img
                src={cmoAvatar}
                alt="CMO Avatar"
                className="w-8.5 h-8.5 rounded-full object-cover border border-slate-200"
              />
              <span className="hidden sm:inline text-xs font-bold text-slate-750 font-sans">
                John
              </span>
            </div>
          </div>
        </header>

        {/* MAIN DISPLAY PORT BODY */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#F0F2F5] space-y-6">
          <AnimatePresence mode="wait">
            {/* ------------------------------------------------------------- */}
            {/* TAB: DASHBOARD / ANALYTICS */}
            {/* ------------------------------------------------------------- */}
            {activeMenu === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* 1. TOP CARDS GRID LAYOUT */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1: Total Feedbacks */}
                  <div className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-300 flex flex-col justify-between h-[190px]">
                    <div
                      className="flex items-center justify-between text-xs font-bold text-slate-400"
                      title="Total patient submissions"
                    >
                      <span>Total Sales (Feedbacks)</span>
                      <Icon
                        icon="ph:info-bold"
                        className="w-4 h-4 text-slate-350 cursor-pointer hover:text-slate-500"
                      />
                    </div>
                    <div className="mt-2.5">
                      <div className="text-3xl font-black text-slate-900 tracking-tight leading-none font-mono">
                        {totalCount.toLocaleString()}
                      </div>
                      {/* Ratios block like image */}
                      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 mt-2.5">
                        <span className="flex items-center gap-1">
                          Week ratio{" "}
                          <span className="font-extrabold text-emerald-600 flex items-center">
                            13%{" "}
                            <Icon
                              icon="ph:caret-up-fill"
                              className="w-2.5 h-2.5 ml-0.5"
                            />
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          Day ratio{" "}
                          <span className="font-extrabold text-red-500 flex items-center">
                            10%{" "}
                            <Icon
                              icon="ph:caret-down-fill"
                              className="w-2.5 h-2.5 ml-0.5"
                            />
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-2.5 mt-2.5 flex items-center justify-between text-[11px] font-bold text-slate-500 font-mono select-none">
                      <span>Day Sales (Daily Submissions)</span>
                      <span className="text-slate-800 font-extrabold">154</span>
                    </div>
                  </div>

                  {/* Card 2: Visits (Area Sparkline) */}
                  <div className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-300 flex flex-col justify-between h-[190px]">
                    <div
                      className="flex items-center justify-between text-xs font-bold text-slate-400"
                      title="Patient OPD visits telemetry"
                    >
                      <span>Visits (Patient Traffic)</span>
                      <Icon
                        icon="ph:info-bold"
                        className="w-4 h-4 text-slate-350 cursor-pointer hover:text-slate-500"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-end mt-1">
                      <div className="text-2xl font-black text-slate-900 tracking-tight leading-none font-mono mb-1.5">
                        6,480
                      </div>
                      <VisitsSparkline />
                    </div>
                    <div className="border-t border-slate-100 pt-2 mt-2 flex items-center justify-between text-[11px] font-bold text-slate-500 font-mono select-none">
                      <span>Day visits</span>
                      <span className="text-slate-800 font-extrabold">
                        4,280
                      </span>
                    </div>
                  </div>

                  {/* Card 3: Payments (Vertical Column Sparkline) */}
                  <div className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-300 flex flex-col justify-between h-[190px]">
                    <div
                      className="flex items-center justify-between text-xs font-bold text-slate-400"
                      title="Audited case statistics"
                    >
                      <span>Payments (Active Audits)</span>
                      <Icon
                        icon="ph:info-bold"
                        className="w-4 h-4 text-slate-350 cursor-pointer hover:text-slate-500"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-end mt-1">
                      <div className="text-2xl font-black text-slate-900 tracking-tight leading-none font-mono mb-1.5">
                        5,320
                      </div>
                      <PaymentsSparkline />
                    </div>
                    <div className="border-t border-slate-100 pt-2 mt-2 flex items-center justify-between text-[11px] font-bold text-slate-500 font-mono select-none">
                      <span>Conversion rate</span>
                      <span className="text-slate-800 font-extrabold">50%</span>
                    </div>
                  </div>

                  {/* Card 4: Operation Effect (Donut Ring Chart) */}
                  <div className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-300 flex items-center justify-between h-[190px]">
                    <div className="flex flex-col justify-between h-full flex-1">
                      <div className="text-xs font-bold text-slate-400">
                        Operation Effect
                      </div>
                      <div className="mb-2">
                        <div className="text-3xl font-black text-slate-900 font-mono leading-tight">
                          {slaResolutionRate}%
                        </div>
                        <div className="text-[10px] font-bold text-emerald-600 mt-1 leading-normal">
                          SLA Compliance target achieved
                        </div>
                      </div>
                    </div>
                    <OperationEffectRing percentage={slaResolutionRate} />
                  </div>
                </div>

                {/* 2. MAIN CHARTS RENDERING */}
                <AdminCharts />
              </motion.div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB: LIST (ALL PATIENT FEEDBACKS) */}
            {/* ------------------------------------------------------------- */}
            {activeMenu === "list" && (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* SEARCH & FILTERS TOOLBAR */}
                <div className="bg-white text-slate-900 rounded-3xl p-5 shadow-sm border border-slate-200 space-y-4">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Search Field */}
                    <div className="relative w-full md:w-96 shrink-0">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) =>
                          dispatch(setSearchQuery(e.target.value))
                        }
                        placeholder="Search Patient Name, Mobile, Tracking ID, Facility..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-2xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                      />
                      <Icon
                        icon="ph:magnifying-glass-bold"
                        className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => dispatch(setSearchQuery(""))}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <Icon icon="ph:x-bold" className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Filters dropdowns group */}
                    <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                      <select
                        value={ratingFilter}
                        onChange={(e) =>
                          dispatch(setRatingFilter(e.target.value as any))
                        }
                        className="bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      >
                        <option value="ALL">All Ratings</option>
                        <option value="Could Be Better">Could Be Better</option>
                        <option value="Acceptable">Acceptable</option>
                        <option value="Excellent">Excellent</option>
                      </select>

                      <select
                        value={mediaFilter}
                        onChange={(e) =>
                          dispatch(setMediaFilter(e.target.value as any))
                        }
                        className="bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      >
                        <option value="ALL">All Media Attachments</option>
                        <option value="AUDIO">🎙️ Has Voice Recording</option>
                        <option value="IMAGE">📷 Has Photo Evidence</option>
                        <option value="BOTH">🎙️+📷 Audio & Photo Both</option>
                      </select>

                      <select
                        value={statusFilter}
                        onChange={(e) =>
                          dispatch(setStatusFilter(e.target.value as any))
                        }
                        className="bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      >
                        <option value="ALL">All Case Statuses</option>
                        <option value="Assigned to CMO">Assigned to CMO</option>
                        <option value="Action In Progress">
                          Action In Progress
                        </option>
                        <option value="Logged & Verified">
                          Logged & Verified
                        </option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* FEEDBACKS DATA GRID TABLE */}
                <div className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-200">
                  <div className="px-5 py-4 bg-[#001529] text-white flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                      <Icon
                        icon="ph:list-bullets-bold"
                        className="w-4 h-4 text-blue-400"
                      />
                      Showing {filteredRecords.length} Active Patients logs
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                      Click details to open comprehensive user history, logs &
                      play recordings
                    </span>
                  </div>

                  {filteredRecords.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 space-y-2">
                      <Icon
                        icon="ph:tray-bold"
                        className="w-12 h-12 mx-auto text-slate-350"
                      />
                      <p className="text-sm font-extrabold text-slate-600">
                        No matching telemetry logs found.
                      </p>
                      <p className="text-xs text-slate-400">
                        Modify your search query or reset dropdown filters.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <th className="py-4 px-5">Patient & Tracking ID</th>
                            <th className="py-4 px-5">Healthcare Facility</th>
                            <th className="py-4 px-5">Overall Rating</th>
                            <th className="py-4 px-5">Audio & Uploads</th>
                            <th className="py-4 px-5">Audits & Status</th>
                            <th className="py-4 px-5 text-right">
                              Inspect Detail
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                          {filteredRecords.map((record) => {
                            const hasAudio =
                              record.registration.audioUrl ||
                              record.doctor.audioUrl ||
                              record.pharmacy.audioUrl ||
                              record.cleanliness.audioUrl ||
                              record.suggestions.audioUrl;

                            const hasImage =
                              record.registration.imageUrl ||
                              record.doctor.imageUrl ||
                              record.pharmacy.imageUrl ||
                              record.cleanliness.imageUrl ||
                              record.suggestions.imageUrl;

                            const sampleAudio =
                              record.registration.audioUrl ||
                              record.doctor.audioUrl ||
                              record.pharmacy.audioUrl ||
                              record.cleanliness.audioUrl ||
                              record.suggestions.audioUrl;

                            return (
                              <tr
                                key={record.id}
                                onClick={() =>
                                  dispatch(openDetailModal(record))
                                }
                                className="hover:bg-slate-50/80 transition cursor-pointer group"
                              >
                                {/* Patient */}
                                <td className="py-4 px-5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[10px]">
                                      {record.trackingId}
                                    </span>
                                    {record.urgency === "High SLA Priority" && (
                                      <span
                                        className="w-2 h-2 rounded-full bg-red-650 animate-pulse"
                                        title="High SLA Priority"
                                      />
                                    )}
                                  </div>
                                  <div className="font-bold text-slate-900 mt-1.5 group-hover:text-blue-600 transition">
                                    {record.patientName}
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                                    {record.mobileNumber} •{" "}
                                    {record.aadhaarMasked}
                                  </div>
                                </td>

                                {/* Facility */}
                                <td className="py-4 px-5 max-w-xs">
                                  <div
                                    className="font-bold text-slate-800 truncate"
                                    title={record.facilityName}
                                  >
                                    {record.facilityName}
                                  </div>
                                  <div className="text-[11px] text-slate-450 font-medium mt-0.5">
                                    District: {record.district}
                                  </div>
                                </td>

                                {/* Overall Rating */}
                                <td className="py-4 px-5">
                                  <span
                                    className={`px-2.5 py-1 rounded-full font-black text-[10px] uppercase border inline-flex items-center gap-1 ${
                                      record.overallRating === "Excellent"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : record.overallRating === "Acceptable"
                                          ? "bg-blue-50 text-blue-700 border-blue-200"
                                          : "bg-amber-50 text-amber-800 border-amber-300"
                                    }`}
                                  >
                                    {record.overallRating}
                                  </span>
                                </td>

                                {/* Media Audio Play button */}
                                <td
                                  className="py-4 px-5"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {hasAudio && sampleAudio && (
                                      <AudioPlayerWidget
                                        audioUrl={sampleAudio}
                                        compact
                                      />
                                    )}
                                    {hasImage && (
                                      <span className="px-2.5 py-0.5 rounded-full bg-blue-550/10 text-blue-700 border border-blue-200 font-bold text-[10px] inline-flex items-center gap-1">
                                        <Icon
                                          icon="ph:camera-bold"
                                          className="w-3 h-3"
                                        />
                                        <span>Photo</span>
                                      </span>
                                    )}
                                    {!hasAudio && !hasImage && (
                                      <span className="text-[11px] text-slate-400 font-semibold">
                                        Text log
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* Timestamp & Status */}
                                <td className="py-4 px-5">
                                  <div className="text-[11px] font-bold text-slate-450">
                                    {record.timestamp}
                                  </div>
                                  <span
                                    className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-full font-black text-[10px] border uppercase ${
                                      record.status === "Resolved"
                                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                        : record.status === "Action In Progress"
                                          ? "bg-blue-100 text-blue-800 border-blue-300"
                                          : "bg-amber-100 text-amber-900 border-amber-300"
                                    }`}
                                  >
                                    {record.status}
                                  </span>
                                </td>

                                {/* Inspect Button */}
                                <td className="py-4 px-5 text-right">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      dispatch(openDetailModal(record))
                                    }
                                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[11px] transition shadow-sm inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>Details</span>
                                    <Icon
                                      icon="ph:caret-right-bold"
                                      className="w-3 h-3 text-blue-400"
                                    />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB: PROFILE OVERVIEW */}
            {/* ------------------------------------------------------------- */}
            {activeMenu === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md p-6 sm:p-10 space-y-8"
              >
                {/* Visual Header */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
                  <img
                    src={cmoAvatar}
                    alt="Dr. John Varma"
                    className="w-24 h-24 rounded-3xl object-cover border-2 border-blue-500 shadow-md shadow-blue-500/10 shrink-0"
                  />
                  <div className="text-center sm:text-left space-y-1.5">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider">
                      Authenticated officer
                    </span>
                    <h2 className="text-2xl font-black text-slate-800">
                      Dr. John Varma
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold font-mono">
                      Chief Medical Officer (CMO) • Delhi State Health Services
                    </p>
                  </div>
                </div>

                {/* Details layout Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 font-sans">
                  <div className="space-y-4">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-1.50">
                      <div className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                        Official Email
                      </div>
                      <div className="font-mono font-black text-slate-800 mt-1">
                        {adminEmail}
                      </div>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-1.50">
                      <div className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                        Jurisdiction (Active Districts)
                      </div>
                      <div className="font-black text-slate-800 mt-1">
                        NCT of Delhi (Central, Rohini, West, Dwarka hubs)
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-1.50">
                      <div className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                        Key Signature Status
                      </div>
                      <div className="font-black text-emerald-600 mt-1 flex items-center gap-1">
                        <Icon
                          icon="ph:shield-check-fill"
                          className="w-4 h-4 text-emerald-500"
                        />{" "}
                        Digital SHA-256 Verified Signature
                      </div>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-1.50">
                      <div className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                        Total Actions Taken (This Month)
                      </div>
                      <div className="font-mono font-black text-slate-800 mt-1">
                        42 Grievance Audits Closed
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50/50 border border-blue-150 rounded-2xl text-[11px] text-blue-900 font-medium leading-relaxed">
                  <span className="font-extrabold flex items-center gap-1.5 mb-1.5">
                    <Icon
                      icon="ph:shield-check-bold"
                      className="w-4 h-4 text-blue-600"
                    />{" "}
                    Security Access Notice
                  </span>
                  Your administrative credentials authorize you to perform
                  audits, coordinate inventory refills, and append resolution
                  notes to public grievance escalations under the Digital India
                  Health Protocol.
                </div>
              </motion.div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB: RESULT (CATEGORY WISE STATS) */}
            {/* ------------------------------------------------------------- */}
            {activeMenu === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-800">
                      Category Breakdown Performance
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">
                      Average satisfaction rate of patients across core hospital
                      services.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category 1 */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <span className="flex items-center gap-2 font-bold">
                          <Icon
                            icon="ph:qr-code-bold"
                            className="w-4.5 h-4.5 text-slate-500"
                          />
                          Registration Desk & Tokens
                        </span>
                        <span className="text-emerald-700 font-mono font-black">
                          92.4% Satisfied
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                        <div className="bg-emerald-500 h-full w-[92.4%]" />
                        <div className="bg-amber-450 h-full w-[5%]" />
                        <div className="bg-red-500 h-full w-[2.6%]" />
                      </div>
                    </div>

                    {/* Category 2 */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <span className="flex items-center gap-2 font-bold">
                          <Icon
                            icon="ph:stethoscope-bold"
                            className="w-4.5 h-4.5 text-slate-500"
                          />
                          Doctor Consultations
                        </span>
                        <span className="text-emerald-700 font-mono font-black">
                          96.8% Satisfied
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                        <div className="bg-emerald-500 h-full w-[96.8%]" />
                        <div className="bg-amber-450 h-full w-[2%]" />
                        <div className="bg-red-500 h-full w-[1.2%]" />
                      </div>
                    </div>

                    {/* Category 3 */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <span className="flex items-center gap-2 font-bold">
                          <Icon
                            icon="ph:pill-bold"
                            className="w-4.5 h-4.5 text-slate-500"
                          />
                          Pharmacy & Medication Stocks
                        </span>
                        <span className="text-amber-700 font-mono font-black">
                          84.1% Satisfied
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                        <div className="bg-emerald-500 h-full w-[84.1%]" />
                        <div className="bg-amber-450 h-full w-[10%]" />
                        <div className="bg-red-500 h-full w-[5.9%]" />
                      </div>
                    </div>

                    {/* Category 4 */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <span className="flex items-center gap-2 font-bold">
                          <Icon
                            icon="ph:sparkles-bold"
                            className="w-4.5 h-4.5 text-slate-500"
                          />
                          Facility Cleanliness
                        </span>
                        <span className="text-emerald-700 font-mono font-black">
                          88.5% Satisfied
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                        <div className="bg-emerald-500 h-full w-[88.5%]" />
                        <div className="bg-amber-450 h-full w-[7.5%]" />
                        <div className="bg-red-500 h-full w-[4%]" />
                      </div>
                    </div>
                  </div>

                  {/* Legend breakdown */}
                  <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-slate-100 text-xs font-bold text-slate-550">
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded bg-emerald-500" />{" "}
                      Excellent (Positive)
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded bg-amber-400" />{" "}
                      Acceptable (Medium)
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded bg-red-500" />{" "}
                      Grievance (Could Be Better)
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB: EXCEPTION (GRIEVANCES ESCALATIONS) */}
            {/* ------------------------------------------------------------- */}
            {activeMenu === "exception" && (
              <motion.div
                key="exception"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Header warning info panel */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-3xl flex items-start gap-3.5">
                  <Icon
                    icon="ph:warning-octagon-fill"
                    className="w-6 h-6 text-amber-600 shrink-0 mt-0.5"
                  />
                  <div className="space-y-1 text-xs text-amber-900 leading-normal">
                    <span className="font-bold uppercase tracking-wider block">
                      Grievance Escalations Radar
                    </span>
                    This page lists active, high-priority issues classified as
                    "Could Be Better" overall or marked for SLA escalations.
                    Re-audit inventories, warn staff, or dispatch resolutions.
                  </div>
                </div>

                {/* Grievance Table container */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
                  <div className="px-5 py-4 bg-red-950 text-white flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                      <Icon
                        icon="ph:warning-circle-bold"
                        className="w-4.5 h-4.5 text-red-400"
                      />
                      Critical SLA Telemetry Escalations ({grievanceCount})
                    </span>
                  </div>

                  {grievanceRecords.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                      <Icon
                        icon="ph:check-circle-bold"
                        className="w-12 h-12 mx-auto text-emerald-500 mb-2"
                      />
                      <p className="text-sm font-bold text-slate-700">
                        All Grievances Resolved!
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Excellent compliance - 0 active complaints.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <th className="py-4 px-5">Patient & Tracking ID</th>
                            <th className="py-4 px-5">Healthcare Facility</th>
                            <th className="py-4 px-5">Media Attachment</th>
                            <th className="py-4 px-5">Status Case</th>
                            <th className="py-4 px-5 text-right">
                              Coordinate Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                          {grievanceRecords.map((record) => {
                            const sampleAudio =
                              record.registration.audioUrl ||
                              record.doctor.audioUrl ||
                              record.pharmacy.audioUrl ||
                              record.cleanliness.audioUrl ||
                              record.suggestions.audioUrl;

                            return (
                              <tr
                                key={record.id}
                                onClick={() =>
                                  dispatch(openDetailModal(record))
                                }
                                className="hover:bg-slate-50 transition cursor-pointer"
                              >
                                <td className="py-4 px-5">
                                  <span className="font-mono font-black text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-200 text-[10px]">
                                    {record.trackingId}
                                  </span>
                                  <div className="font-bold text-slate-900 mt-1.5">
                                    {record.patientName}
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-semibold mt-0.5">
                                    {record.mobileNumber}
                                  </div>
                                </td>

                                <td className="py-4 px-5">
                                  <div className="font-bold text-slate-800 truncate max-w-xs">
                                    {record.facilityName}
                                  </div>
                                  <div className="text-[11px] text-slate-450 mt-0.5 font-semibold">
                                    District: {record.district}
                                  </div>
                                </td>

                                <td
                                  className="py-4 px-5"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {sampleAudio ? (
                                    <AudioPlayerWidget
                                      audioUrl={sampleAudio}
                                      compact
                                    />
                                  ) : (
                                    <span className="text-[11px] text-slate-400 font-semibold">
                                      Text suggestion
                                    </span>
                                  )}
                                </td>

                                <td className="py-4 px-5">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full font-black text-[10px] border uppercase ${
                                      record.status === "Resolved"
                                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                        : record.status === "Action In Progress"
                                          ? "bg-blue-100 text-blue-850 border-blue-200"
                                          : "bg-red-100 text-red-900 border-red-200"
                                    }`}
                                  >
                                    {record.status}
                                  </span>
                                </td>

                                <td className="py-4 px-5 text-right">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      dispatch(openDetailModal(record))
                                    }
                                    className="px-3.5 py-1.5 rounded-xl bg-red-650 hover:bg-red-700 text-white font-extrabold text-[11px] transition shadow-md cursor-pointer flex items-center gap-1 inline-flex"
                                  >
                                    <span>Action</span>
                                    <Icon
                                      icon="ph:arrow-square-out-bold"
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
                  )}
                </div>
              </motion.div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB: ACCOUNT / SETTINGS */}
            {/* ------------------------------------------------------------- */}
            {activeMenu === "account" && (
              <motion.div
                key="account"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* District Performance metrics */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
                  <div>
                    <h3 className="text-base font-black text-slate-800">
                      District Audit Telemetry Nodes
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">
                      Realtime evaluation indices of regional administrative
                      zones.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-450 uppercase tracking-widest">
                          <th className="py-3 px-4">District Node</th>
                          <th className="py-3 px-4">Total Submissions</th>
                          <th className="py-3 px-4">Satisfied Ratio</th>
                          <th className="py-3 px-4">Active Grievances</th>
                          <th className="py-3 px-4">SLA Compliance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {[
                          {
                            name: "Central Delhi",
                            count: 340,
                            rating: "94.2%",
                            complaints: 2,
                            sla: "98.5%",
                          },
                          {
                            name: "North West Delhi",
                            count: 285,
                            rating: "96.8%",
                            complaints: 0,
                            sla: "100%",
                          },
                          {
                            name: "South Delhi",
                            count: 412,
                            rating: "88.1%",
                            complaints: 4,
                            sla: "92.4%",
                          },
                          {
                            name: "East Delhi",
                            count: 201,
                            rating: "92.4%",
                            complaints: 1,
                            sla: "96.8%",
                          },
                        ].map((d, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-slate-50 transition-all"
                          >
                            <td className="py-3.5 px-4 font-bold text-slate-800">
                              {d.name}
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-650">
                              {d.count}
                            </td>
                            <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-600">
                              {d.rating}
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-red-650">
                              {d.complaints}
                            </td>
                            <td className="py-3.5 px-4 font-mono font-black text-slate-800">
                              {d.sla}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* GLOBAL USER FEEDBACK DETAILS MODAL */}
      {/* ------------------------------------------------------------- */}
      <UserFeedbackDetailModal />
    </div>
  );
};
