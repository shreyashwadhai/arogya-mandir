import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { resetForm } from "../../redux/features/journeySlice";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const Step06Confirmation: React.FC = () => {
  const dispatch = useDispatch();
  const { trackingId, aadhaarData } = useSelector(
    (state: RootState) => state.journey,
  );
  const [copied, setCopied] = useState(false);

  const displayTrackingId = trackingId || "AGM-2024-08547";

  const copyTrackingId = () => {
    navigator.clipboard.writeText(displayTrackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mobileRaw = aadhaarData.mobileNumber;
  const maskedMobile = `+91 ${mobileRaw.slice(0, 2)}XXX XX${mobileRaw.slice(-3)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm sm:max-w-md mx-auto"
    >
      <div className="bg-[#0B132B] border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl p-5 sm:p-7 text-center space-y-5">
        {/* Teal Checkmark Circle Icon */}
        <div className="flex justify-center my-1">
          <div className="w-20 h-20 rounded-full border-2 border-teal-400 bg-teal-500/10 flex items-center justify-center">
            <Icon icon="ph:check-bold" className="w-9 h-9 text-teal-400" />
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-black text-white">Thank You!</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Your feedback has been submitted successfully
          </p>
        </div>

        {/* WHITE TICKET CARD SHEET matching Screen 6 in Reference Image! */}
        <div className="bg-white text-slate-900 rounded-[28px] p-5 shadow-2xl text-left space-y-3.5">
          <div className="border-b border-slate-200 pb-3">
            <div className="text-[10px] font-extrabold uppercase text-slate-500">
              Feedback Status
            </div>
            <div className="text-xs font-black text-teal-700 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Logged & Verified
            </div>
          </div>

          <div>
            <div className="text-[10px] font-extrabold uppercase text-slate-500">
              Tracking ID
            </div>
            <div className="text-base font-black text-slate-900 font-sans flex items-center justify-between mt-0.5">
              <span>{displayTrackingId}</span>
              <button
                onClick={copyTrackingId}
                className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              >
                <Icon
                  icon={copied ? "ph:check-bold" : "ph:copy-bold"}
                  className="w-4 h-4"
                />
              </button>
            </div>
            {copied && (
              <span className="text-[10px] text-teal-600 font-bold">
                Copied to Clipboard!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-200 text-xs text-slate-700">
            <Icon
              icon="ph:envelope-simple-bold"
              className="w-4 h-4 text-teal-600 shrink-0"
            />
            <span>
              SMS confirmation sent to <strong>{maskedMobile}</strong>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* Top Saffron/Gold button */}
          <button
            onClick={() => dispatch(resetForm())}
            className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-base font-extrabold flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20 active:scale-[0.99]"
          >
            <span>Submit Another Feedback</span>
            <Icon icon="ph:arrows-clockwise-bold" className="w-5 h-5" />
          </button>

          {/* Bottom Teal Outlined button */}
          <button
            onClick={() => dispatch(resetForm())}
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-950 border-2 border-teal-500/80 hover:border-teal-400 text-teal-300 text-sm font-extrabold flex items-center justify-center gap-2 transition"
          >
            <span>Track Your Feedback</span>
            <Icon icon="ph:magnifying-glass-bold" className="w-4 h-4" />
          </button>
        </div>

        {/* Subtext Branding Footer */}
        <div className="text-[10px] text-slate-500 font-medium pt-3 border-t border-slate-800/80">
          Powered by Arogya Mandir Digital Health Initiative • MINISTRY OF
          HEALTH AND FAMILY WELFARE
        </div>
      </div>
    </motion.div>
  );
};
