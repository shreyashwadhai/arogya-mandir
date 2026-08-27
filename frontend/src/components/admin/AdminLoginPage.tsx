import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginAdmin } from "../../redux/features/adminSlice";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { AuthService } from "../../services/authService";

interface AdminLoginPageProps {
  onBackToPatientForm: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onBackToPatientForm,
}) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    setTimeout(() => {
      const user = AuthService.loginByEmail(email);
      if (user) {
        dispatch(loginAdmin(user.email));
      } else {
        setErrorMsg(
          "Invalid email address or password. Please verify your credentials or contact the Nodal Administrator.",
        );
      }
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-[#0F1115] text-[#F5F6FA] flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 font-sans selection:bg-[#3498DB] selection:text-white relative overflow-x-hidden">
      {/* Background Ambient Glow Spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-[#0093E9]/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-[#7C5CFC]/15 blur-[140px] pointer-events-none" />

      {/* MAIN MODAL UI CONTAINER */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-700/20 flex flex-col md:flex-row z-10 my-auto min-h-[560px]"
      >
        {/* LEFT SIDE PANEL - Blue Vibrant Banner & AI Illustration */}
        <div className="hidden md:flex  flex-col justify-between items-center w-full md:w-1/2 bg-gradient-to-br from-[#1C82AD] via-[#0093E9] to-[#00B4DB] text-white p-6 sm:p-8 lg:p-10  relative overflow-hidden min-h-[380px] md:min-h-[560px]">
          {/* Decorative ripples */}
          <div className="absolute top-[-20%] left-[-20%] w-[450px] h-[450px] rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-black/10 blur-2xl pointer-events-none" />

          {/* Top Header Badge */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold tracking-wider border border-white/30 flex items-center gap-1.5 shadow-sm">
              <Icon
                icon="ph:shield-check-bold"
                className="w-3.5 h-3.5 text-white"
              />
              Delhi State Health Mission
            </span>
          </div>

          {/* Center AI Generated Illustration & Intro Text */}
          <div className="flex flex-col items-center text-center my-auto py-4 max-w-md z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30 bg-white/10 backdrop-blur-sm mb-5 group"
            >
              <img
                src="/cmo_login_illustration.jpg"
                alt="Arogya Mandir Healthcare Administration"
                className="w-full h-auto object-cover max-h-[220px] sm:max-h-[240px] group-hover:scale-105 transition-transform duration-500"
              />
            </motion.div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight mb-2">
              Welcome to Arogya Mandir Governance Portal
            </h1>
            <p className="text-xs text-white/90 font-medium leading-relaxed max-w-sm">
              Log in to monitor state health facilities, manage CMO hierarchy,
              process patient feedback, and review real-time SLA performance.
            </p>
          </div>

          {/* Bottom Feature Badges Grid */}
          <div className="w-full grid grid-cols-3 gap-1 pt-4 border-t border-white/20 z-10 text-center">
            <div className="flex flex-col items-center p-1">
              <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mb-1 shadow-inner">
                <Icon icon="arcticons:multi-app" className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-[10px] font-semibold text-white/95 leading-tight">
                Multi-Tier CMO
              </span>
            </div>

            <div className="flex flex-col items-center p-1 border-x border-white/20">
              <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mb-1 shadow-inner">
                <Icon icon="glyphs:analytics-duo" className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-[10px] font-semibold text-white/95 leading-tight">
              Analytics Data
              </span>
            </div>

            <div className="flex flex-col items-center p-1">
              <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mb-1 shadow-inner">
                <Icon icon="fluent:person-feedback-20-regular" className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-[10px] font-semibold text-white/95 leading-tight">
                Feedback Review
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE PANEL - Clean White Form Layout */}
        <div className="w-full md:w-1/2 bg-white text-[#2C3E50] p-6 sm:p-8 lg:p-10 flex flex-col justify-between items-center min-h-[460px] md:min-h-[560px]">
          {/* Top Emblem Header */}
          <div className="w-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-br from-[#E67E22] to-[#F39C12] text-white flex items-center justify-center shadow-md">
                <Icon
                  icon="healthicons:health-vulnerability-through-social-determinants-outline"
                  className="w-12 h-12"
                />
              </div>
              <div className="text-center">
                <div className="text-md sm:text-xl font-extrabold text-[#2C3E50] tracking-wide flex items-center gap-2">
                  <span>Arogya Mandir</span>
                </div>
                <div className="text-[10px] text-[#7F8C8D] font-medium">
                  State Health Portal
                </div>
              </div>
            </div>
          </div>

          {/* Main Form Box */}
          <div className="w-full max-w-sm my-auto py-4 space-y-5">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-[#2C3E50] tracking-tight">
                Sign In
              </h2>
              <p className="text-xs text-[#7F8C8D]">
                Enter your registered CMO credentials to access the governance
                desk.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#34495E] mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter official email address"
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#3498DB] focus:ring-2 focus:ring-[#3498DB]/20 rounded-xl px-3.5 py-2.5 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none transition shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#34495E] mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#3498DB] focus:ring-2 focus:ring-[#3498DB]/20 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none transition shadow-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#34495E] cursor-pointer"
                  >
                    <Icon
                      icon={showPassword ? "ph:eye-slash-bold" : "ph:eye-bold"}
                      className="w-4 h-4"
                    />
                  </button>
                </div>
              </div>

              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2"
                >
                  <Icon
                    icon="ph:warning-circle-fill"
                    className="w-4 h-4 text-red-500 shrink-0"
                  />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F39C12] to-[#E67E22] hover:from-[#E67E22] hover:to-[#D35400] text-white font-extrabold text-xs tracking-wider uppercase transition cursor-pointer shadow-lg shadow-[#E67E22]/25 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Icon
                    icon="ph:spinner-bold"
                    className="w-4 h-4 animate-spin"
                  />
                ) : (
                  <Icon icon="ph:sign-in-bold" className="w-4 h-4" />
                )}
                <span>LOGIN</span>
              </button>
            </form>
          </div>

          {/* Footer info */}
          <div className="w-full text-center text-[11px] text-[#95A5A6] pt-3 border-t border-slate-100">
            <span>Arogya Mandir State Health Mission • Encrypted Access</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
