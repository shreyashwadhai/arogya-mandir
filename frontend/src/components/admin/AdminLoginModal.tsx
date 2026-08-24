import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { loginAdmin, closeAdminModal } from "../../redux/features/adminSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

export const AdminLoginModal: React.FC = () => {
  const dispatch = useDispatch();
  const showAdminModal = useSelector(
    (state: RootState) => state.admin.showAdminModal,
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.admin.isAuthenticated,
  );

  // Read credentials from file with fallbacks
  const envEmail =
    import.meta.env.VITE_ADMIN_EMAIL;
  const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!showAdminModal || isAuthenticated) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    setTimeout(() => {
      if (
        email.trim().toLowerCase() === envEmail.toLowerCase() &&
        password === envPassword
      ) {
        dispatch(loginAdmin(envEmail));
        setIsLoading(false);
      } else {
        setErrorMsg(
          "Invalid email or password. Please verify credentials configured in variable file.",
        );
        setIsLoading(false);
      }
    }, 600);
  };

  const handleQuickFill = () => {
    setEmail(envEmail);
    setPassword(envPassword);
    setErrorMsg("");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        {/* Overlay click to close */}
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={() => dispatch(closeAdminModal())}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-left"
        >
          {/* Close button */}
          <button
            onClick={() => dispatch(closeAdminModal())}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <Icon icon="ph:x-bold" className="w-5 h-5" />
          </button>

          {/* Header Seal Icon */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center mb-3 shadow-inner">
              <Icon
                icon="ph:shield-check-fill"
                className="w-10 h-10 text-amber-600"
              />
            </div>
            <div className="text-[11px] font-black tracking-widest text-amber-600 uppercase">
              GOVERNMENT OF INDIA • HEALTH DIRECTORATE
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Admin & CMO Portal Login
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Access live patient feedback telemetry, grievances & voice logs.
            </p>
          </div>  

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
              <Icon
                icon="ph:warning-circle-bold"
                className="w-4 h-4 text-red-600 shrink-0"
              />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                Official Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-10 pr-4 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
                />
                <Icon
                  icon="ph:envelope-simple-bold"
                  className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-10 pr-10 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
                />
                <Icon
                  icon="ph:lock-key-bold"
                  className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <Icon
                    icon={showPassword ? "ph:eye-slash-bold" : "ph:eye-bold"}
                    className="w-5 h-5"
                  />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-extrabold shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Icon
                    icon="ph:spinner-gap-bold"
                    className="w-5 h-5 animate-spin"
                  />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Icon
                    icon="ph:sign-in-bold"
                    className="w-5 h-5 text-amber-400"
                  />
                  <span>Log In to CMO Dashboard</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
