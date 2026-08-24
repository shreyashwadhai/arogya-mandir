import React from 'react';
import { Icon } from '@iconify/react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 bg-[#050A14] border-t border-slate-800/90 text-slate-400 py-10 px-4 sm:px-6 relative z-10 text-center sm:text-left">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1: Government Identity */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Icon icon="ph:first-aid-kit-bold" className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-base font-extrabold text-white tracking-tight">AROGYA MANDIR FEEDBACK PORTAL</span>
          </div>

          <p className="text-xs text-slate-400 max-w-md leading-relaxed mx-auto sm:mx-0">
            An Initiative by Health Directorate, Government of Delhi for direct patient empowerment, transparent hospital rating, and 48-Hour CMO grievance redressal.
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4 text-[11px] text-slate-300 font-semibold">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5">
              <Icon icon="ph:shield-check-bold" className="w-3.5 h-3.5 text-amber-400" />
              IT Act 2000 Encrypted
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5">
              <Icon icon="ph:lock-key-bold" className="w-3.5 h-3.5 text-teal-400" />
              Aadhaar Masked Data
            </span>
          </div>
        </div>

        {/* Col 2: Emergency Helplines */}
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Emergency Helplines</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center justify-center sm:justify-start gap-2 text-slate-300">
              <Icon icon="ph:phone-call-bold" className="w-3.5 h-3.5 text-amber-400" />
              <span>National Health Helpline: <strong>1075</strong></span>
            </li>
            <li className="flex items-center justify-center sm:justify-start gap-2 text-slate-300">
              <Icon icon="ph:phone-call-bold" className="w-3.5 h-3.5 text-teal-400" />
              <span>Delhi Ambulance Service: <strong>102 / 108</strong></span>
            </li>
            <li className="flex items-center justify-center sm:justify-start gap-2 text-slate-300">
              <Icon icon="ph:phone-call-bold" className="w-3.5 h-3.5 text-amber-400" />
              <span>CMO Grievance Call Desk: <strong>1800-11-2026</strong></span>
            </li>
          </ul>
        </div>

        {/* Col 3: Portal Information */}
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Portal Standards</h4>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li>• Accessible for Senior Citizens</li>
            <li>• Audio Text-to-Speech Enabled</li>
            <li>• Multilingual Support (EN, HI, PA, UR)</li>
            <li>• Direct Chief Medical Officer SLA</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
        <div>© 2026 Arogya Mandir. All rights reserved. Government of National Capital Territory of Delhi.</div>
        <div className="flex items-center gap-4 text-[11px]">
          <a href="#" className="hover:text-amber-400 transition">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:text-amber-400 transition">Terms of Service</a>
          <span>•</span>
          <a href="#" className="hover:text-amber-400 transition">Accessibility Statement</a>
        </div>
      </div>
    </footer>
  );
};
