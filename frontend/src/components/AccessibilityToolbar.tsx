import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { setFontSize, toggleHighContrast, toggleTextToSpeech, toggleGovtDashboard } from '../redux/features/accessibilitySlice';
import { Icon } from '@iconify/react';

export const AccessibilityToolbar: React.FC = () => {
  const dispatch = useDispatch();
  const { fontSize, highContrast, textToSpeechEnabled, showGovtDashboard } = useSelector((state: RootState) => state.accessibility);

  return (
    <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2 text-xs text-slate-300 backdrop-blur-md relative z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Govt Portal Identity Badge */}
        <div className="flex items-center space-x-2 text-slate-300 font-medium">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-semibold">
            <Icon icon="ph:shield-check-fill" className="w-3.5 h-3.5 text-amber-400" />
            Official Government of Delhi Healthcare Portal
          </span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline text-slate-400">Public Health Directorate & CMO SLA Enabled</span>
        </div>

        {/* Right: Accessibility Controls & Admin Dashboard Toggle */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Font Size Adjuster */}
          <div className="flex items-center bg-slate-800/80 border border-slate-700/60 rounded-lg p-0.5">
            <span className="px-2 text-[11px] text-slate-400 font-medium hidden sm:inline">Text Size:</span>
            <button
              onClick={() => dispatch(setFontSize('normal'))}
              title="Normal Text Size"
              className={`px-2 py-0.5 rounded text-xs font-semibold transition ${fontSize === 'normal' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              A
            </button>
            <button
              onClick={() => dispatch(setFontSize('large'))}
              title="Large Text Size"
              className={`px-2 py-0.5 rounded text-xs font-bold transition ${fontSize === 'large' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              A+
            </button>
            <button
              onClick={() => dispatch(setFontSize('xlarge'))}
              title="Extra Large Text Size"
              className={`px-2 py-0.5 rounded text-sm font-black transition ${fontSize === 'xlarge' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              A++
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={() => dispatch(toggleHighContrast())}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition ${
              highContrast
                ? 'bg-yellow-400 text-slate-950 border-yellow-300 font-bold'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
            title="Toggle High Contrast Mode for Senior Citizens"
          >
            <Icon icon="ph:eye-bold" className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">High Contrast</span>
          </button>

          {/* Text to Speech Toggle */}
          <button
            onClick={() => dispatch(toggleTextToSpeech())}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition ${
              textToSpeechEnabled
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                : 'bg-slate-800/80 text-slate-400 border-slate-700'
            }`}
            title="Toggle Audio Question Reader"
          >
            <Icon icon={textToSpeechEnabled ? "ph:speaker-high-bold" : "ph:speaker-slash-bold"} className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Audio Guide</span>
          </button>

          {/* CMO Dashboard Toggle */}
          <button
            onClick={() => dispatch(toggleGovtDashboard())}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${
              showGovtDashboard
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            <Icon icon="ph:chart-line-up-bold" className="w-3.5 h-3.5" />
            <span>Govt CMO Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
