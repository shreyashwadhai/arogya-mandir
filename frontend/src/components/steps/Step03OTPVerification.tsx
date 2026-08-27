import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import OtpGif from "../../assets/otp.gif";
import {
  setCurrentStep,
  setOtpDigit,
  setOtpDigitsAll,
  setOtpVerified,
  decrementOtpTimer,
} from "../../redux/features/journeySlice";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const Step03OTPVerification: React.FC = () => {
  const dispatch = useDispatch();
  const { otpDigits, otpTimerSeconds, aadhaarData } = useSelector(
    (state: RootState) => state.journey,
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const mobileRaw = aadhaarData.mobileNumber;
  const maskedMobile = `+91 ${mobileRaw.slice(0, 2)}XXX XX${mobileRaw.slice(-3)}`;

  useEffect(() => {
    // Auto-focus 1st digit box when OTP page mounts
    inputRefs.current[0]?.focus();

    const timer = setInterval(() => {
      dispatch(decrementOtpTimer());
    }, 1000);
    return () => clearInterval(timer);
  }, [dispatch]);

  const handleDigitChange = (index: number, val: string) => {
    const char = val.replace(/\D/g, "").slice(-1);
    dispatch(setOtpDigit({ index, value: char }));
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    dispatch(setOtpVerified(true));
    dispatch(setCurrentStep(4)); // Direct navigation to Feedback Interview (Step 4)
  };

  const isOtpComplete = otpDigits.every((digit) => digit.trim() !== "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm sm:max-w-md mx-auto"
    >
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(setCurrentStep(2))}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <Icon icon="ph:arrow-left-bold" className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-extrabold text-white">
            OTP Verification
          </h2>
        </div>

        {/* Yellow Circle Outline Icon */}
        <div className="flex justify-center my-2">
          <div className="w-20 h-20 rounded-full border-2 border-amber-500/80 flex items-center justify-center bg-amber-500/10">
            <img src={OtpGif} alt="" className="rounded-full" />
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-black text-white">Verify Your Mobile</h3>
          <p className="text-xs text-slate-300 mt-1">
            Enter the 6-digit OTP sent to{" "}
            <strong className="text-white font-sans">{maskedMobile}</strong>
          </p>
        </div>

        {/* 6 Square Inputs */}
        <div className="flex justify-center gap-2 sm:gap-3 my-4">
          {otpDigits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-11 h-13 sm:w-13 sm:h-14 bg-slate-950 border-2 border-slate-700 focus:border-amber-400 rounded-xl text-center text-xl font-black text-white focus:outline-none transition"
            />
          ))}
        </div>

        {/* Resend & Edit links */}
        <div className="space-y-1 text-xs text-slate-400">
          <div>
            Resend OTP in{" "}
            <strong className="text-amber-400 font-sans">
              00:
              {otpTimerSeconds < 10 ? `0${otpTimerSeconds}` : otpTimerSeconds}
            </strong>
          </div>
          <div>
            <button
              onClick={() => dispatch(setCurrentStep(2))}
              className="text-amber-400 font-semibold hover:underline"
            >
              Edit Mobile Number
            </button>
          </div>
        </div>

        {/* Golden Submit Button */}
        <button
          onClick={handleVerify}
          disabled={!isOtpComplete}
          className={`w-full py-4 px-6 rounded-2xl text-base font-extrabold flex items-center justify-center gap-2 transition active:scale-[0.99] ${
            isOtpComplete
              ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          }`}
        >
          <span>Verify & Proceed</span>
          <Icon icon="ph:check-circle-bold" className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
