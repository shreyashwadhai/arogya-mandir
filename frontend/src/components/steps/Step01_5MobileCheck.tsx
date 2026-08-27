import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import {
  setCurrentStep,
  updateAadhaarData,
} from "../../redux/features/journeySlice";
import { translations } from "../../translations/languages";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const Step01_5MobileCheck: React.FC = () => {
  const dispatch = useDispatch();
  const selectedLanguage = useSelector(
    (state: RootState) => state.journey.selectedLanguage,
  );
  const t = translations[selectedLanguage] || translations.en;
  const v = t.verifyIdentity || translations.en.verifyIdentity;

  const [authMode, setAuthMode] = useState<"mobile" | "aadhaar">("mobile");
  const [mobileNumber, setMobileNumber] = useState("");
  const [aadhaarLast4, setAadhaarLast4] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleMobileChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 10);
    setMobileNumber(cleaned);
    setErrorMsg("");
  };

  const handleAadhaarChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 4);
    setAadhaarLast4(cleaned);
    setErrorMsg("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === "mobile" && mobileNumber.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number");
      return;
    }
    if (authMode === "aadhaar" && aadhaarLast4.length < 4) {
      setErrorMsg("Please enter all 4 digits of Aadhaar");
      return;
    }

    dispatch(
      updateAadhaarData({
        mobileNumber: mobileNumber,
        aadhaarNumber: aadhaarLast4
          ? `XXXX-XXXX-${aadhaarLast4}`
          : "XXXX-XXXX-1234",
      }),
    );

    // Directly proceed to OTP Verification (Step 3)
    dispatch(setCurrentStep(3));
  };

  const isValid =
    authMode === "mobile"
      ? mobileNumber.length === 10
      : aadhaarLast4.length === 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm sm:max-w-md mx-auto"
    >
      <div className="bg-[#0B132B] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-7 text-left space-y-5">
        {/* Top Navigation & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(setCurrentStep(1))}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <Icon icon="ph:arrow-left-bold" className="w-5 h-5" />
          </button>
          <div>
            <div className="text-[10px] font-bold tracking-wider uppercase text-amber-400">
              Identity Link
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {v.title || "Verify it's really you"}
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          {v.subtitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Segmented Control Toggle (Mobile vs Aadhaar) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-1.5 flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setAuthMode("mobile");
                setErrorMsg("");
              }}
              className={`flex-1 py-3 rounded-xl text-sm sm:text-md font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                authMode === "mobile"
                  ? "bg-white text-slate-950 shadow-md shadow-slate-950/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon icon="mdi-light:phone" className="w-5 h-5" />
              <span>{v.mobileTab}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode("aadhaar");
                setErrorMsg("");
              }}
              className={`flex-1 py-3 rounded-xl text-sm sm:text-md font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                authMode === "aadhaar"
                  ? "bg-white text-slate-950 shadow-md shadow-slate-950/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon icon="arcticons:maadhaar" className="w-8 h-8" />
              <span>{v.aadhaarTab}</span>
            </button>
          </div>

          {/* INPUT FIELD CONTAINER */}
          {authMode === "mobile" ? (
            <div>
              <div className="relative flex items-center bg-white border border-slate-300 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500/40">
                <span className="pl-4 pr-2 text-xs font-black text-slate-500 border-r border-slate-200">
                  +91
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => handleMobileChange(e.target.value)}
                  placeholder={
                    v.mobilePlaceholder || "10-अंकों का मोबाइल नंबर दर्ज करें"
                  }
                  className="w-full py-3.5 px-3 text-slate-900 text-sm font-bold focus:outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="w-full relative flex items-center bg-white border border-slate-300 rounded-2xl py-3.5 px-4 focus-within:ring-2 focus-within:ring-amber-500/40">
                <span className="w-full text-slate-400 font-extrabold font-sans tracking-wider text-sm sm:text-base select-none">
                  XXXX-XXXX-
                </span>
                <span className="mx-2 text-slate-300">|</span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={aadhaarLast4}
                  onChange={(e) => handleAadhaarChange(e.target.value)}
                  placeholder="1234"
                  className="w-full bg-transparent text-slate-900 text-base sm:text-lg font-black tracking-widest focus:outline-none placeholder:text-slate-300 placeholder:tracking-widest"
                />
              </div>
            </div>
          )}

          {errorMsg && (
            <p className="text-red-400 text-xs font-bold text-center">
              {errorMsg}
            </p>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-4 px-6 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition active:scale-[0.99] ${
              isValid
                ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            <span>{v.submitBtn || "सत्यापित करें और ओटीपी प्राप्त करें"}</span>
            <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Step01_5MobileCheck;
