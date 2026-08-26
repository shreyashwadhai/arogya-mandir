import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginAdmin } from "../../redux/features/adminSlice";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

interface AdminLoginPageProps {
  onBackToPatientForm: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onBackToPatientForm,
}) => {
  const dispatch = useDispatch();

  const envEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
          "Invalid email or password. Please verify credentials configured in  file.",
        );
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickFill = () => {
    setEmail(envEmail);
    setPassword(envPassword);
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0A101D] via-[#0D1527] to-[#040812] text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Executive Clean Header */}
      <header className="w-full bg-[#070D1B]/40 backdrop-blur-md border-b border-slate-800/60 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 z-10">
        <div className="flex items-center gap-3">
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
          <div>
            <div className="text-[10px] tracking-widest text-slate-400 font-semibold">
              Government Of India • Ministry Of Health
            </div>
            <div className="text-sm font-bold text-white tracking-wide">
              Arogya Mandir Administrative Node
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToPatientForm}
          className="self-end sm:self-auto px-4 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-all duration-200 flex items-center gap-2 border border-slate-700/60 hover:border-slate-500/50 cursor-pointer hover:shadow-lg active:scale-95"
        >
          <Icon
            icon="ph:arrow-left-bold"
            className="w-3.5 h-3.5 text-blue-400"
          />
          <span>Back to Form</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative">
        {/* Background decorative glow spots */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[460px] bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-4xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] p-4 sm:p-10 space-y-6 text-center z-10"
        >
          {/* Logo Brand Icon */}
          <div className=" w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
            <div className="w-14 h-14 border border-white rounded-full text-white flex items-center justify-center shrink-0 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-8 h-8"
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

          <div>
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-extrabold uppercase tracking-widest border border-blue-500/20">
              Executive Authentication
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-3 leading-tight tracking-tight">
              CMO Portal Sign In
            </h2>
            <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed max-w-[320px] mx-auto">
              Please enter your official administrator credentials to access
              live patient telemetry.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white text-slate-900 rounded-[24px] p-4 sm:p-6 shadow-2xl text-left space-y-4">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 flex items-start gap-2"
              >
                <Icon
                  icon="ph:warning-circle-fill"
                  className="w-4 h-4 text-red-600 shrink-0 mt-0.5"
                />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 tracking-wider mb-1.5 pl-1">
                  Official Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all duration-200"
                  />
                  <Icon
                    icon="ph:envelope-simple-bold"
                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500  tracking-wider mb-1.5 pl-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-10 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all duration-200"
                  />
                  <Icon
                    icon="ph:lock-key-bold"
                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    <Icon
                      icon={showPassword ? "ph:eye-slash-bold" : "ph:eye-bold"}
                      className="w-4 h-4"
                    />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg hover:shadow-blue-500/10 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <>
                    <Icon
                      icon="ph:spinner-gap-bold"
                      className="w-4 h-4 animate-spin"
                    />
                    <span>Verifying Access Card...</span>
                  </>
                ) : (
                  <>
                    <Icon
                      icon="ph:sign-in-bold"
                      className="w-4 h-4 text-white"
                    />
                    <span>Sign In to CMO Node</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="text-[10px] text-slate-500 font-medium pt-3 border-t border-slate-800/80 leading-relaxed">
            Authorized Personnel Only. Transactions are monitored & audited.{" "}
            <br />
            Arogya Mandir Digital Health Initiative • GOVT. OF INDIA
          </div>
        </motion.div>
      </main>
    </div>
  );
};
