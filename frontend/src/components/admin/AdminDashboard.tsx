import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import {
  closeAdminModal,
  logoutAdmin,
  setActiveTab,
  setSearchQuery,
  setRatingFilter,
  setMediaFilter,
  setStatusFilter,
  openDetailModal,
} from "../../redux/features/adminSlice";
import { UserFeedbackDetailModal } from "./UserFeedbackDetailModal";
import { AudioPlayerWidget } from "./AudioPlayerWidget";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

export const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const showAdminModal = useSelector(
    (state: RootState) => state.admin.showAdminModal,
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.admin.isAuthenticated,
  );
  const adminEmail = useSelector((state: RootState) => state.admin.adminEmail);
  const activeTab = useSelector((state: RootState) => state.admin.activeTab);
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

  // Filtered dataset MUST be computed before any conditional return to obey Rules of Hooks
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Search
      const matchesSearch =
        !searchQuery ||
        r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.mobileNumber.includes(searchQuery) ||
        r.facilityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.aadhaarMasked.includes(searchQuery);

      // Rating
      const matchesRating =
        ratingFilter === "ALL" || r.overallRating === ratingFilter;

      // Status
      const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;

      // Media
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

  const handleClose = () => {
    dispatch(closeAdminModal());
    if (window.location.pathname.toLowerCase().includes("/admin")) {
      window.history.pushState({}, "", "/");
    }
  };

  const handleLogout = () => {
    dispatch(logoutAdmin());
    if (window.location.pathname.toLowerCase().includes("/admin")) {
      window.history.pushState({}, "", "/");
    }
  };

  if (!showAdminModal || !isAuthenticated) return null;

  // Analytics Metrics
  const totalCount = records.length;
  const grievanceCount = records.filter(
    (r) => r.isGrievance || r.overallRating === "Could Be Better",
  ).length;
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-7xl bg-white border border-slate-200 rounded-3xl p-4 sm:p-8 shadow-2xl text-left my-auto max-h-[95vh] flex flex-col"
        >
          {/* TOP BAR */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xl shadow-lg shadow-amber-500/20 shrink-0">
                <Icon icon="ph:chart-line-up-bold" className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs font-black tracking-widest text-amber-600 uppercase">
                    STATE HEALTHCARE ANALYTICS PORTAL
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                    Live Telemetry
                  </span>
                </div>
                <h1 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight">
                  Chief Medical Officer (CMO) Dashboard
                </h1>
              </div>
            </div>

            {/* Right Controls: Logged in admin info & Logout */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-2xl text-xs flex items-center gap-2">
                <Icon
                  icon="ph:user-circle-bold"
                  className="w-5 h-5 text-amber-600"
                />
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">
                    Authenticated Admin
                  </div>
                  <div className="font-extrabold text-slate-900">
                    {adminEmail}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="p-2.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-extrabold text-xs flex items-center gap-1.5 transition"
                title="Log out"
              >
                <Icon icon="ph:sign-out-bold" className="w-4 h-4" />
                <span className="hidden sm:inline">Log Out</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                title="Close Dashboard"
              >
                <Icon icon="ph:x-bold" className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 py-3 no-scrollbar shrink-0">
            {[
              {
                id: "analytics",
                label: "Analytics & KPI Overview",
                icon: "ph:chart-bar-bold",
              },
              {
                id: "feedbacks",
                label: `All Patient Feedbacks (${records.length})`,
                icon: "ph:table-bold",
              },
              {
                id: "grievances",
                label: `Grievances & Escalations (${grievanceCount})`,
                icon: "ph:warning-circle-bold",
              },
              {
                id: "facilities",
                label: "District Facility Metrics",
                icon: "ph:hospital-bold",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => dispatch(setActiveTab(tab.id as any))}
                className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-slate-900 text-amber-400 shadow-md"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                <Icon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* DASHBOARD BODY CONTENT */}
          <div className="flex-1 overflow-y-auto pt-4 space-y-6">
            {/* KPI METRICS ROW */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 shadow-sm">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase">
                  Total Feedbacks
                </div>
                <div className="text-2xl font-black text-slate-900 mt-0.5">
                  {totalCount}
                </div>
                <div className="text-[10px] font-bold text-emerald-600 mt-0.5">
                  ↑ +14% vs yesterday
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 shadow-sm">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase">
                  Avg Rating
                </div>
                <div className="text-2xl font-black text-amber-600 mt-0.5 flex items-center gap-1">
                  <span>4.8</span>
                  <span className="text-xs text-slate-400">/ 5.0</span>
                </div>
                <div className="text-[10px] font-bold text-amber-600 mt-0.5">
                  94.2% Satisfaction
                </div>
              </div>

              <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-3.5 shadow-sm">
                <div className="text-[10px] font-extrabold text-amber-800 uppercase flex items-center justify-between">
                  <span>Voice Recordings</span>
                  <Icon
                    icon="ph:microphone-fill"
                    className="w-3.5 h-3.5 text-amber-600"
                  />
                </div>
                <div className="text-2xl font-black text-amber-900 mt-0.5">
                  {audioNotesCount} Logs
                </div>
                <div className="text-[10px] font-bold text-amber-700 mt-0.5">
                  Playable Audio Files
                </div>
              </div>

              <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-3.5 shadow-sm">
                <div className="text-[10px] font-extrabold text-blue-800 uppercase flex items-center justify-between">
                  <span>Uploaded Photos</span>
                  <Icon
                    icon="ph:camera-bold"
                    className="w-3.5 h-3.5 text-blue-600"
                  />
                </div>
                <div className="text-2xl font-black text-blue-900 mt-0.5">
                  {imagesCount} Photos
                </div>
                <div className="text-[10px] font-bold text-blue-700 mt-0.5">
                  Image Evidence Logs
                </div>
              </div>

              <div className="bg-red-50/60 border border-red-200 rounded-2xl p-3.5 shadow-sm">
                <div className="text-[10px] font-extrabold text-red-800 uppercase flex items-center justify-between">
                  <span>Active Grievances</span>
                  <Icon
                    icon="ph:warning-bold"
                    className="w-3.5 h-3.5 text-red-600"
                  />
                </div>
                <div className="text-2xl font-black text-red-900 mt-0.5">
                  {grievanceCount} Cases
                </div>
                <div className="text-[10px] font-bold text-red-700 mt-0.5">
                  High Priority SLA
                </div>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-3.5 shadow-sm">
                <div className="text-[10px] font-extrabold text-emerald-800 uppercase">
                  SLA Resolved
                </div>
                <div className="text-2xl font-black text-emerald-900 mt-0.5">
                  {resolvedCount} Cases
                </div>
                <div className="text-[10px] font-bold text-emerald-700 mt-0.5">
                  96.4% Compliance
                </div>
              </div>
            </div>

            {/* TAB 1: ANALYTICS VIEW */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                {/* Visual Category Breakdown Progress Bars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Icon
                          icon="ph:chart-pie-slice-bold"
                          className="w-4 h-4 text-amber-600"
                        />
                        Patient Satisfaction Index by Category
                      </span>
                      <span className="text-[11px] text-slate-400 font-bold">
                        Target: &gt;90%
                      </span>
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-extrabold text-slate-700 mb-1">
                          <span>Token & Registration Counter</span>
                          <span className="text-emerald-600">92% Positive</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-[92%] rounded-full" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-extrabold text-slate-700 mb-1">
                          <span>Doctor OPD Examination & Care</span>
                          <span className="text-emerald-600">96% Positive</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-[96%] rounded-full" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-extrabold text-slate-700 mb-1">
                          <span>Pharmacy & Free Medicine Availability</span>
                          <span className="text-amber-600">84% Positive</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full w-[84%] rounded-full" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-extrabold text-slate-700 mb-1">
                          <span>Sanitation & Washroom Cleanliness</span>
                          <span className="text-amber-600">88% Positive</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full w-[88%] rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Format Breakdown */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Icon
                          icon="ph:waveform-bold"
                          className="w-4 h-4 text-amber-600"
                        />
                        Feedback Submission Format Telemetry
                      </span>
                      <span className="text-[11px] text-slate-400 font-bold">
                        Multimodal AI Logs
                      </span>
                    </h3>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-white border border-slate-200 p-3 rounded-xl">
                        <Icon
                          icon="ph:microphone-fill"
                          className="w-6 h-6 text-amber-600 mx-auto mb-1"
                        />
                        <div className="text-lg font-black text-slate-900">
                          42%
                        </div>
                        <div className="text-[10px] font-bold text-slate-500">
                          Voice Recording
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 p-3 rounded-xl">
                        <Icon
                          icon="ph:text-t-bold"
                          className="w-6 h-6 text-blue-600 mx-auto mb-1"
                        />
                        <div className="text-lg font-black text-slate-900">
                          38%
                        </div>
                        <div className="text-[10px] font-bold text-slate-500">
                          Typed Text
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 p-3 rounded-xl">
                        <Icon
                          icon="ph:camera-bold"
                          className="w-6 h-6 text-emerald-600 mx-auto mb-1"
                        />
                        <div className="text-lg font-black text-slate-900">
                          20%
                        </div>
                        <div className="text-[10px] font-bold text-slate-500">
                          Photo Attachments
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2 font-semibold">
                      <Icon
                        icon="ph:info-bold"
                        className="w-4 h-4 text-amber-600 shrink-0"
                      />
                      <span>
                        Voice recordings automatically transcribed & indexed for
                        CMO rapid audit.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SEARCH & FILTERS TOOLBAR */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                    placeholder="Search by Patient Name, Mobile, Tracking ID, Facility..."
                    className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <Icon
                    icon="ph:magnifying-glass-bold"
                    className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => dispatch(setSearchQuery(""))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <Icon icon="ph:x-bold" className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  {/* Rating filter */}
                  <select
                    value={ratingFilter}
                    onChange={(e) =>
                      dispatch(setRatingFilter(e.target.value as any))
                    }
                    className="bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  >
                    <option value="ALL">All Ratings</option>
                    <option value="Could Be Better">Could Be Better</option>
                    <option value="Acceptable">Acceptable</option>
                    <option value="Excellent">Excellent</option>
                  </select>

                  {/* Media filter */}
                  <select
                    value={mediaFilter}
                    onChange={(e) =>
                      dispatch(setMediaFilter(e.target.value as any))
                    }
                    className="bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  >
                    <option value="ALL">All Media</option>
                    <option value="AUDIO">🎙️ Has Voice Note</option>
                    <option value="IMAGE">📷 Has Photo Attachment</option>
                    <option value="BOTH">🎙️+📷 Both</option>
                  </select>

                  {/* Status filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      dispatch(setStatusFilter(e.target.value as any))
                    }
                    className="bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="Assigned to CMO">Assigned to CMO</option>
                    <option value="Action In Progress">
                      Action In Progress
                    </option>
                    <option value="Logged & Verified">Logged & Verified</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </div>

            {/* FEEDBACK RECORDS TABLE */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                  <Icon
                    icon="ph:list-bullets-bold"
                    className="w-4 h-4 text-amber-400"
                  />
                  Showing {filteredRecords.length} Patient Feedback Records
                </span>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  Click any row to inspect complete feedback history & play
                  voice recordings
                </span>
              </div>

              {filteredRecords.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <Icon
                    icon="ph:tray-bold"
                    className="w-12 h-12 mx-auto mb-2 text-slate-300"
                  />
                  <p className="text-sm font-bold text-slate-600">
                    No matching feedback records found.
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Try resetting search or filters.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4">Tracking ID & Patient</th>
                        <th className="py-3 px-4">Facility & District</th>
                        <th className="py-3 px-4">Overall Rating</th>
                        <th className="py-3 px-4">Voice & Image Attachments</th>
                        <th className="py-3 px-4">Date & Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
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
                            onClick={() => dispatch(openDetailModal(record))}
                            className="hover:bg-slate-50/80 transition cursor-pointer group"
                          >
                            {/* Patient & ID */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-sans font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                                  {record.trackingId}
                                </span>
                                {record.urgency === "High SLA Priority" && (
                                  <span
                                    className="w-2 h-2 rounded-full bg-red-600 animate-pulse"
                                    title="High SLA Priority"
                                  />
                                )}
                              </div>
                              <div className="font-bold text-slate-900 mt-1 group-hover:text-amber-600 transition">
                                {record.patientName}
                              </div>
                              <div className="text-[11px] text-slate-400 font-medium">
                                {record.mobileNumber} • {record.aadhaarMasked}
                              </div>
                            </td>

                            {/* Facility */}
                            <td className="py-3.5 px-4 max-w-xs">
                              <div
                                className="font-semibold text-slate-800 truncate"
                                title={record.facilityName}
                              >
                                {record.facilityName}
                              </div>
                              <div className="text-[11px] text-slate-400 font-medium">
                                {record.district}
                              </div>
                            </td>

                            {/* Rating */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-1 rounded-full font-extrabold text-[11px] border inline-flex items-center gap-1 ${
                                  record.overallRating === "Excellent"
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                    : record.overallRating === "Acceptable"
                                      ? "bg-blue-50 text-blue-800 border-blue-200"
                                      : "bg-amber-50 text-amber-900 border-amber-300"
                                }`}
                              >
                                {record.overallRating}
                              </span>
                            </td>

                            {/* Audio & Image Attachments */}
                            <td
                              className="py-3.5 px-4"
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
                                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] border border-blue-200 inline-flex items-center gap-1">
                                    <Icon
                                      icon="ph:camera-bold"
                                      className="w-3 h-3 text-blue-600"
                                    />
                                    <span>Photo</span>
                                  </span>
                                )}
                                {!hasAudio && !hasImage && (
                                  <span className="text-[11px] text-slate-400 font-medium">
                                    Text only
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Date & Status */}
                            <td className="py-3.5 px-4">
                              <div className="text-[11px] font-semibold text-slate-500">
                                {record.timestamp}
                              </div>
                              <span
                                className={`inline-block mt-1 px-2.5 py-0.5 rounded-full font-extrabold text-[10px] border ${
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

                            {/* Action Button */}
                            <td className="py-3.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  dispatch(openDetailModal(record))
                                }
                                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[11px] transition shadow-sm inline-flex items-center gap-1"
                              >
                                <span>Inspect</span>
                                <Icon
                                  icon="ph:caret-right-bold"
                                  className="w-3 h-3 text-amber-400"
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
          </div>

          {/* User Feedback Detail Modal */}
          <UserFeedbackDetailModal />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
