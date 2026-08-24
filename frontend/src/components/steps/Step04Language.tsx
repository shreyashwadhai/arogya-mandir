import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import {
  setCurrentStep,
  setSelectedLanguage,
} from "../../redux/features/journeySlice";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const Step04Language: React.FC = () => {
  const dispatch = useDispatch();
  const selectedLanguage = useSelector(
    (state: RootState) => state.journey.selectedLanguage,
  );

  const languages = [
    { code: "en", native: "English", eng: "English", short: "EN" },
    { code: "hi", native: "हिंदी", eng: "Hindi", short: "HI" },
    { code: "pa", native: "ਪੰਜਾਬੀ", eng: "Punjabi", short: "PA" },
    { code: "ur", native: "اردو", eng: "Urdu", short: "UR" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm sm:max-w-md mx-auto"
    >
      <div className="bg-[#0B132B] border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl p-4 sm:p-5">
        {/* Header */}

        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => dispatch(setCurrentStep(4))}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <Icon icon="ph:arrow-left-bold" className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-extrabold text-white">
            Language Selection
          </h2>
        </div>

        {/* Hospital Photo Banner Header */}
        <div className="relative rounded-2xl overflow-hidden mb-4 h-36 bg-slate-900 flex items-end p-4 text-left">
          <img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
            alt="Healthcare Workers"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.4] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/60 to-transparent" />

          <div className="relative z-10">
            <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-xs uppercase tracking-wider mb-0.5">
              <Icon icon="ph:globe-bold" className="w-4 h-4" />
              Choose Your Language
            </div>
            <p className="text-xs text-slate-200 leading-snug">
              Select your preferred language for the feedback form. All upcoming
              instructions and help text will load in this script.
            </p>
          </div>
        </div>

        {/* 4 Language Cards Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {languages.map((lang) => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <div
                key={lang.code}
                onClick={() => dispatch(setSelectedLanguage(lang.code as any))}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between h-24 relative ${
                  isSelected
                    ? "bg-teal-950/50 border-[#0D9488] text-white shadow-lg"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                )}

                <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center">
                  {lang.short}
                </div>

                <div>
                  <div className="text-base font-black text-white">
                    {lang.native}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {lang.eng}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Saffron/Gold Submit Button */}
        <button
          onClick={() => dispatch(setCurrentStep(6))}
          className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-base font-extrabold flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20 active:scale-[0.99]"
        >
          <span>Start Feedback / फीडबैक शुरू करें</span>
          <Icon icon="ph:arrow-right-bold" className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
