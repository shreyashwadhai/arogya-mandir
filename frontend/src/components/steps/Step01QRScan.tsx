import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { setCurrentStep } from "../../redux/features/journeySlice";
import { toggleFacilityModal } from "../../redux/features/facilitySlice";
import { translations } from "../../translations/languages";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import FeedbackQR from "../../assets/feedback-qr.jpeg";

export const Step01QRScan: React.FC = () => {
  const dispatch = useDispatch();
  const selectedFacility = useSelector(
    (state: RootState) => state.facility.selectedFacility,
  );
  const selectedLanguage = useSelector(
    (state: RootState) => state.journey.selectedLanguage,
  );

  const t = translations[selectedLanguage] || translations.en;
  const s = t.scannerPage || translations.en.scannerPage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm sm:max-w-md mx-auto"
    >
      <div className="bg-[#0B132B] border border-slate-800 rounded-2xl overflow-hidden text-center shadow-2xl relative">
        {/* Top Hospital Exterior Photo Header */}
        <div className="relative h-48 sm:h-56 bg-slate-900 overflow-hidden flex items-end p-5 text-left">
          {/* Hospital Building Image Background */}
          <img
            src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80"
            alt="Hospital Exterior Building"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.45] scale-105"
          />

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/60 to-transparent" />

          {/* Text Content over Image */}
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-1 tracking-tight">
              {s.headerTitle}
            </h1>
            <p className="text-xs text-slate-300 leading-snug max-w-xs">
              {s.headerSubtitle}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-7 pt-2">
          {/* QR Container */}
          <div className="mb-6 flex flex-col items-center">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {s.scanQrTitle}
            </span>

            {/* QR Card Frame with Camera Scanner Targets & Continuous Scanning Beam */}
            <div className="relative p-3 bg-white rounded-xl shadow-2xl overflow-hidden group">
              {/* Camera Scanner Corner Reticles */}
              <div className="absolute top-1.5 left-1.5 w-4 h-4 border-t-2 border-l-2 border-amber-500 rounded-tl-lg z-20" />
              <div className="absolute top-1.5 right-1.5 w-4 h-4 border-t-2 border-r-2 border-amber-500 rounded-tr-lg z-20" />
              <div className="absolute bottom-1.5 left-1.5 w-4 h-4 border-b-2 border-l-2 border-amber-500 rounded-bl-lg z-20" />
              <div className="absolute bottom-1.5 right-1.5 w-4 h-4 border-b-2 border-r-2 border-amber-500 rounded-br-lg z-20" />

              {/* Continuous Laser Scanning Beam Animation */}
              <motion.div
                animate={{
                  top: ["4%", "90%", "4%"],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-amber-500/10 via-amber-400 to-amber-500/10 shadow-[0_0_18px_#F59E0B] z-20 pointer-events-none rounded-full"
              >
                <div className="w-full h-full bg-amber-300 opacity-90 blur-[0.5px]" />
              </motion.div>

              <img src={FeedbackQR} alt="" className="w-32 h-32 rounded-lg" />
            </div>
          </div>

          {/* Detected Facility Badge */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 mb-5 flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-teal-400"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path
                    fill="currentColor"
                    d="M6.72 16.64a1 1 0 1 1 .56 1.92c-.5.146-.86.3-1.091.44c.238.143.614.303 1.136.452C8.48 19.782 10.133 20 12 20s3.52-.218 4.675-.548c.523-.149.898-.309 1.136-.452c-.23-.14-.59-.294-1.09-.44a1 1 0 0 1 .559-1.92c.668.195 1.28.445 1.75.766c.435.299.97.82.97 1.594c0 .783-.548 1.308-.99 1.607c-.478.322-1.103.573-1.786.768C15.846 21.77 14 22 12 22s-3.846-.23-5.224-.625c-.683-.195-1.308-.446-1.786-.768c-.442-.3-.99-.824-.99-1.607c0-.774.535-1.295.97-1.594c.47-.321 1.082-.571 1.75-.766M12 7.5c-1.54 0-2.502 1.667-1.732 3c.357.619 1.017 1 1.732 1c1.54 0 2.502-1.667 1.732-3A2 2 0 0 0 12 7.5"
                  />
                  <path
                    fill="currentColor"
                    d="M12 2a7.5 7.5 0 0 1 7.5 7.5c0 2.568-1.4 4.656-2.85 6.14a16.4 16.4 0 0 1-1.853 1.615c-.594.446-1.952 1.282-1.952 1.282a1.71 1.71 0 0 1-1.69 0a21 21 0 0 1-1.952-1.282A16.4 16.4 0 0 1 7.35 15.64C5.9 14.156 4.5 12.068 4.5 9.5A7.5 7.5 0 0 1 12 2"
                    opacity=".3"
                  />
                </svg>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-slate-400">
                  {s.detectedFacility}
                </div>
                <div className="text-xs font-bold text-white">
                  {selectedFacility.name}
                </div>
              </div>
            </div>

            <button
              onClick={() => dispatch(toggleFacilityModal())}
              className="text-[11px] font-semibold text-amber-400 hover:underline shrink-0"
            >
              {s.changeBtn}
            </button>
          </div>

          {/* Trust Pills */}
          <div className="flex items-center justify-center gap-2 mb-6 text-[10px] text-slate-300 font-semibold md:font-bold">
            <span className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 flex items-center gap-1 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="text-teal-400 w-3.5 h-3.5"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="M12 17a2 2 0 0 1-2-2c0-1.11.89-2 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2m6 3V10H6v10zm0-12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10c0-1.11.89-2 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3"
                />
              </svg>
              {s.securePrivate}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 flex items-center gap-1 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-3 h-3 text-amber-400"
              >
                <path d="M0 0h48v48H0z" fill="none" />
                <g
                  fill="none"
                  stroke="currentColor"
                  stroke-linejoin="round"
                  stroke-width="4"
                >
                  <path d="M6 9.256L24.009 4L42 9.256v10.778A26.32 26.32 0 0 1 24.003 45A26.32 26.32 0 0 1 6 20.029z" />
                  <path stroke-linecap="round" d="m15 23l7 7l12-12" />
                </g>
              </svg>
              {s.govtVerified}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 flex items-center gap-1 shrink-0">
              <Icon icon="ph:headset-bold" className="w-3 h-3 text-blue-400" />
              {s.support247}
            </span>
          </div>

          {/* Saffron/Gold Primary Button */}
          <button
            onClick={() => dispatch(setCurrentStep(2))}
            className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-base font-extrabold flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20 active:scale-[0.99]"
          >
            <span>{s.continueBtn}</span>
            <Icon icon="ph:arrow-right-bold" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
