import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { selectFacility, setFacilityModalOpen } from '../redux/features/facilitySlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

export const FacilityModal: React.FC = () => {
  const dispatch = useDispatch();
  const { isFacilityModalOpen, availableFacilities, selectedFacility } = useSelector(
    (state: RootState) => state.facility
  );

  if (!isFacilityModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-[#091225] border border-slate-700/80 rounded-3xl p-6 shadow-2xl relative text-left"
        >
          {/* Close */}
          <button
            onClick={() => dispatch(setFacilityModalOpen(false))}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <Icon icon="ph:x-bold" className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Icon icon="ph:map-pin-bold" className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">HOSPITAL LOCATION</span>
              <h2 className="text-xl font-extrabold text-white">Select Healthcare Centre</h2>
            </div>
          </div>

          <div className="space-y-3 mb-6 max-h-[60vh] overflow-y-auto pr-1">
            {availableFacilities.map((fac) => {
              const isSelected = selectedFacility.id === fac.id;
              return (
                <div
                  key={fac.id}
                  onClick={() => {
                    dispatch(selectFacility(fac));
                    dispatch(setFacilityModalOpen(false));
                  }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon icon="ph:buildings-bold" className={`w-5 h-5 mt-0.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-sm font-extrabold text-white">{fac.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{fac.location}</div>
                      <div className="text-[10px] text-teal-400 font-mono mt-1">
                        Code: {fac.code} • District: {fac.district}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => dispatch(setFacilityModalOpen(false))}
            className="w-full py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs"
          >
            Cancel
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
