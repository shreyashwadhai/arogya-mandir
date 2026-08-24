import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import {
  setSelectedLanguage,
  setCurrentStep,
} from "../redux/features/journeySlice";
import { toggleFacilityModal } from "../redux/features/facilitySlice";
import { Icon } from "@iconify/react";

interface HeaderProps {
  viewMode: "single" | "all";
  setViewMode: (mode: "single" | "all") => void;
}

export const Header: React.FC<HeaderProps> = ({ viewMode, setViewMode }) => {
  const dispatch = useDispatch();
  const selectedLanguage = useSelector(
    (state: RootState) => state.journey.selectedLanguage,
  );
  const selectedFacility = useSelector(
    (state: RootState) => state.facility.selectedFacility,
  );

  return (
    <header className="sticky top-0 z-40 bg-[#070D1B]/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Government Logo Identity */}
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => dispatch(setCurrentStep(1))}
        >
          <div className="w-10 h-10 border border-white rounded-full text-white flex items-center justify-center shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-6 h-6"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
              >
                <path d="M9.349 3.434a2.684 2.684 0 1 0 5.368 0a2.684 2.684 0 0 0-5.368 0m5.881 9.191a1.888 1.888 0 0 1 1.807 2.523m-5.004-9.03V23.25" />
                <path d="M14.494 4.5h7.889c2.677 0-1.2 6.453-6.772 4.3M9.569 4.5H1.682c-2.676 0 1.2 6.453 6.772 4.3m.381 3.825A1.9 1.9 0 0 0 6.916 14.5a1.975 1.975 0 0 0 1.919 1.964h5.116a1.92 1.92 0 0 1 0 3.838h-3.517a1.64 1.64 0 0 0-1.6 1.675a1.7 1.7 0 0 0 .531 1.247" />
              </g>
            </svg>
          </div>
          <div>
            <div className="text-[10px] md:text-xs font-bold tracking-wider text-slate-400">
              Goverment Of India
            </div>
            <div className="text-sm md:text-md uppercase font-bold md:font-extrabold text-white leading-tight">
              Arogya Mandir
            </div>
          </div>
        </div>

        {/* Right Controls: Language Selector & Facility */}
        <div className="flex items-center gap-2">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) =>
                dispatch(
                  setSelectedLanguage(
                    e.target.value as "en" | "hi" | "pa" | "ur",
                  ),
                )
              }
              className="appearance-none bg-slate-900 border border-slate-700 hover:border-amber-500/50 text-white text-xs font-bold py-1.5 pl-7 pr-2 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition shadow-sm"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="ur">اردو (Urdu)</option>
            </select>
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-amber-400">
              <Icon icon="ph:translate-bold" className="w-3.5 h-3.5" />
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <Icon icon="ph:caret-down-bold" className="w-3 h-3" />
            </div>
          </div>

          <div className="hidden sm:flex px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 text-[10px] font-bold uppercase tracking-wider items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.4em"
              height="1.4em"
              viewBox="0 0 48 48"
            >
              <path d="M0 0h48v48H0z" fill="none" />
              <defs>
                <mask id="SVGM7aMbcQo">
                  <g
                    fill="none"
                    stroke="#fff"
                    stroke-linejoin="round"
                    stroke-width="4"
                  >
                    <path
                      fill="#555"
                      d="M6 9.256L24.009 4L42 9.256v10.778A26.32 26.32 0 0 1 24.003 45A26.32 26.32 0 0 1 6 20.029z"
                    />
                    <path stroke-linecap="round" d="m15 23l7 7l12-12" />
                  </g>
                </mask>
              </defs>
              <path
                fill="currentColor"
                d="M0 0h48v48H0z"
                mask="url(#SVGM7aMbcQo)"
              />
            </svg>
            <span className="font-semibold">GOVT. VERIFIED</span>
          </div>
        </div>
      </div>
    </header>
  );
};
