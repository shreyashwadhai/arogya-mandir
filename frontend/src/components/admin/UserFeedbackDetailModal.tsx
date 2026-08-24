import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { closeDetailModal, updateRecordStatus } from '../../redux/features/adminSlice';
import { AudioPlayerWidget } from './AudioPlayerWidget';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

export const UserFeedbackDetailModal: React.FC = () => {
  const dispatch = useDispatch();
  const showDetailModal = useSelector((state: RootState) => state.admin.showDetailModal);
  const selectedRecord = useSelector((state: RootState) => state.admin.selectedRecord);

  // Form states
  const [newStatus, setNewStatus] = useState<any>('Assigned to CMO');
  const [officerNote, setOfficerNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [activeImagePreview, setActiveImagePreview] = useState<string | null>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'registration' | 'doctor' | 'pharmacy' | 'cleanliness'>('all');

  // Initialize form when record is loaded
  React.useEffect(() => {
    if (selectedRecord) {
      setNewStatus(selectedRecord.status);
    }
  }, [selectedRecord]);

  if (!showDetailModal || !selectedRecord) return null;

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerNote.trim()) return;

    setIsSubmittingNote(true);
    setTimeout(() => {
      dispatch(
        updateRecordStatus({
          id: selectedRecord.id,
          status: newStatus,
          note: officerNote,
          officerName: 'Chief Medical Officer (CMO)',
        })
      );
      setOfficerNote('');
      setIsSubmittingNote(false);
    }, 400);
  };

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'Excellent':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-250 font-black text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
            <Icon icon="ph:star-fill" className="w-3.5 h-3.5 text-emerald-500" />
            <span>Excellent</span>
          </span>
        );
      case 'Acceptable':
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-black text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
            <Icon icon="ph:thumbs-up-fill" className="w-3.5 h-3.5 text-blue-500" />
            <span>Acceptable</span>
          </span>
        );
      case 'Could Be Better':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 font-black text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
            <Icon icon="ph:warning-fill" className="w-3.5 h-3.5 text-amber-500" />
            <span>Could Be Better</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm overflow-y-auto">
        {/* Overlay background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 cursor-pointer"
          onClick={() => dispatch(closeDetailModal())}
        />

        {/* Modal Sheet Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative z-10 w-full max-w-4xl bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-2xl text-left my-8 flex flex-col max-h-[92vh]"
        >
          {/* Header Panel */}
          <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 text-[10px] tracking-wide">
                  {selectedRecord.trackingId}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  selectedRecord.urgency === 'High SLA Priority'
                    ? 'bg-red-50 text-red-650 border border-red-200'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}>
                  {selectedRecord.urgency}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1 leading-tight">
                {selectedRecord.patientName}
              </h2>
              <p className="text-[11px] text-slate-450 font-bold mt-0.5">
                Submitted on {selectedRecord.timestamp} • {selectedRecord.facilityName}
              </p>
            </div>

            {/* Top Close Button & Status badge */}
            <div className="flex items-center gap-3">
              <span className={`hidden sm:inline-block px-3.5 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest border shadow-sm ${
                selectedRecord.status === 'Resolved'
                  ? 'bg-emerald-500 text-white border-emerald-600'
                  : selectedRecord.status === 'Action In Progress'
                  ? 'bg-blue-600 text-white border-blue-750'
                  : 'bg-amber-500 text-slate-950 border-amber-600'
              }`}>
                {selectedRecord.status}
              </span>
              <button
                onClick={() => dispatch(closeDetailModal())}
                className="p-2 rounded-full bg-white hover:bg-slate-150 border border-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <Icon icon="ph:x-bold" className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Modal Content Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            {/* Identity Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 border border-slate-200 rounded-[20px] p-4 text-[11px] font-sans">
              <div>
                <div className="font-bold text-slate-400 uppercase tracking-wide">Aadhaar Health ID</div>
                <div className="font-mono font-extrabold text-slate-800 mt-1">{selectedRecord.aadhaarMasked}</div>
              </div>
              <div>
                <div className="font-bold text-slate-400 uppercase tracking-wide">Contact Number</div>
                <div className="font-mono font-extrabold text-slate-800 mt-1">{selectedRecord.mobileNumber}</div>
              </div>
              <div>
                <div className="font-bold text-slate-400 uppercase tracking-wide">Age & Gender</div>
                <div className="font-extrabold text-slate-800 mt-1">{selectedRecord.age} Yrs • {selectedRecord.gender}</div>
              </div>
              <div>
                <div className="font-bold text-slate-400 uppercase tracking-wide">Jurisdiction Node</div>
                <div className="font-extrabold text-slate-800 mt-1">{selectedRecord.district}</div>
              </div>
            </div>

            {/* Category Filter tabs inside detail modal */}
            <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-150 pb-2 no-scrollbar select-none">
              {[
                { key: 'all', label: 'All Categories', icon: 'ph:list-checks-bold' },
                { key: 'registration', label: 'Registration Desk', icon: 'ph:qr-code-bold' },
                { key: 'doctor', label: 'OPD Doctor', icon: 'ph:stethoscope-bold' },
                { key: 'pharmacy', label: 'Pharmacy Medicine', icon: 'ph:pill-bold' },
                { key: 'cleanliness', label: 'Sanitation Clean', icon: 'ph:sparkles-bold' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveCategoryTab(tab.key as any)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeCategoryTab === tab.key
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  <Icon icon={tab.icon} className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* CATEGORIES HISTORICAL LOGS CARD GRID */}
            <div className="space-y-4 font-sans">
              {/* Category card 1: Registration */}
              {(activeCategoryTab === 'all' || activeCategoryTab === 'registration') && (
                <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-800 text-xs flex items-center gap-2">
                      <Icon icon="ph:qr-code-bold" className="w-4 h-4 text-slate-500" />
                      1. Token & Registration Counter Feedback
                    </span>
                    {getRatingBadge(selectedRecord.registration.rating)}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 font-semibold italic">
                    "{selectedRecord.registration.comments || "No comment logs recorded."}"
                  </p>
                  {selectedRecord.registration.tags && selectedRecord.registration.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRecord.registration.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-650 text-[10px] font-bold border border-slate-200">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {selectedRecord.registration.audioUrl && (
                    <AudioPlayerWidget audioUrl={selectedRecord.registration.audioUrl} title="Registration Voice Note" />
                  )}
                  {selectedRecord.registration.imageUrl && (
                    <div className="pt-1.5">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Attached photo evidence:</div>
                      <img
                        src={selectedRecord.registration.imageUrl}
                        alt="Registration Attachment"
                        onClick={() => setActiveImagePreview(selectedRecord.registration.imageUrl!)}
                        className="w-36 h-24 object-cover rounded-xl border border-slate-350 cursor-pointer hover:opacity-90 transition shadow-sm"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Category card 2: Doctor Consultation */}
              {(activeCategoryTab === 'all' || activeCategoryTab === 'doctor') && (
                <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-800 text-xs flex items-center gap-2">
                      <Icon icon="ph:stethoscope-bold" className="w-4 h-4 text-slate-500" />
                      2. Doctor Consultation & OPD Care
                    </span>
                    {getRatingBadge(selectedRecord.doctor.rating)}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 font-semibold italic">
                    "{selectedRecord.doctor.comments || "No comment logs recorded."}"
                  </p>
                  {selectedRecord.doctor.tags && selectedRecord.doctor.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRecord.doctor.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-650 text-[10px] font-bold border border-slate-200">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {selectedRecord.doctor.audioUrl && (
                    <AudioPlayerWidget audioUrl={selectedRecord.doctor.audioUrl} title="Doctor Consultation Voice Note" />
                  )}
                  {selectedRecord.doctor.imageUrl && (
                    <div className="pt-1.5">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Attached photo evidence:</div>
                      <img
                        src={selectedRecord.doctor.imageUrl}
                        alt="Doctor OPD Attachment"
                        onClick={() => setActiveImagePreview(selectedRecord.doctor.imageUrl!)}
                        className="w-36 h-24 object-cover rounded-xl border border-slate-350 cursor-pointer hover:opacity-90 transition shadow-sm"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Category card 3: Pharmacy Stock */}
              {(activeCategoryTab === 'all' || activeCategoryTab === 'pharmacy') && (
                <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-800 text-xs flex items-center gap-2">
                      <Icon icon="ph:pill-bold" className="w-4 h-4 text-slate-500" />
                      3. Pharmacy Medicine Dispensing
                    </span>
                    {getRatingBadge(selectedRecord.pharmacy.rating)}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 font-semibold italic">
                    "{selectedRecord.pharmacy.comments || "No comment logs recorded."}"
                  </p>
                  {selectedRecord.pharmacy.tags && selectedRecord.pharmacy.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRecord.pharmacy.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-650 text-[10px] font-bold border border-slate-200">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {selectedRecord.pharmacy.audioUrl && (
                    <AudioPlayerWidget audioUrl={selectedRecord.pharmacy.audioUrl} title="Pharmacy Voice Note" />
                  )}
                  {selectedRecord.pharmacy.imageUrl && (
                    <div className="pt-1.5">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Uploaded Prescription Photo:</div>
                      <img
                        src={selectedRecord.pharmacy.imageUrl}
                        alt="Prescription Attachment"
                        onClick={() => setActiveImagePreview(selectedRecord.pharmacy.imageUrl!)}
                        className="w-40 h-28 object-cover rounded-xl border border-slate-350 cursor-pointer hover:opacity-90 transition shadow-md"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Category card 4: Sanitation Cleanliness */}
              {(activeCategoryTab === 'all' || activeCategoryTab === 'cleanliness') && (
                <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-800 text-xs flex items-center gap-2">
                      <Icon icon="ph:sparkles-bold" className="w-4 h-4 text-slate-500" />
                      4. Sanitation, Cleanliness & Water
                    </span>
                    {getRatingBadge(selectedRecord.cleanliness.rating)}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 font-semibold italic">
                    "{selectedRecord.cleanliness.comments || "No comment logs recorded."}"
                  </p>
                  {selectedRecord.cleanliness.tags && selectedRecord.cleanliness.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRecord.cleanliness.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-650 text-[10px] font-bold border border-slate-200">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {selectedRecord.cleanliness.audioUrl && (
                    <AudioPlayerWidget audioUrl={selectedRecord.cleanliness.audioUrl} title="Cleanliness Voice Note" />
                  )}
                  {selectedRecord.cleanliness.imageUrl && (
                    <div className="pt-1.5">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Attached photo evidence:</div>
                      <img
                        src={selectedRecord.cleanliness.imageUrl}
                        alt="Hygiene Attachment"
                        onClick={() => setActiveImagePreview(selectedRecord.cleanliness.imageUrl!)}
                        className="w-40 h-28 object-cover rounded-xl border border-slate-350 cursor-pointer hover:opacity-90 transition shadow-md"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Suggestions additional section */}
              {activeCategoryTab === 'all' && selectedRecord.suggestions.text && (
                <div className="bg-amber-50/50 border border-amber-200 rounded-[20px] p-5 shadow-sm space-y-3">
                  <span className="font-extrabold text-amber-900 text-xs flex items-center gap-2">
                    <Icon icon="ph:chat-teardrop-text-bold" className="w-4.5 h-4.5 text-amber-600" />
                    5. Patient Additional Suggestions
                  </span>
                  <p className="text-xs text-amber-950 leading-relaxed bg-white p-3.5 rounded-xl border border-amber-200 font-semibold">
                    "{selectedRecord.suggestions.text}"
                  </p>
                  {selectedRecord.suggestions.audioUrl && (
                    <AudioPlayerWidget audioUrl={selectedRecord.suggestions.audioUrl} title="Suggestion Audio Log" />
                  )}
                </div>
              )}
            </div>

            {/* ACTION & GRIEVANCE RESOLUTION PANEL */}
            <div className="bg-slate-900 border border-slate-800 rounded-[24px] p-5 sm:p-6 text-white space-y-5 shadow-lg select-none">
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
                <Icon icon="ph:user-gear-bold" className="w-5 h-5 text-blue-400" />
                CMO Official Action & Grievance Auditing Logs
              </h3>

              {/* TIMELINE OF ACTIONS */}
              {selectedRecord.officerNotes && selectedRecord.officerNotes.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1.5">Action History Timeline</div>
                  <div className="relative pl-6 border-l border-slate-700/60 ml-2.5 space-y-4 py-1">
                    {selectedRecord.officerNotes.map((n, idx) => (
                      <div key={idx} className="relative text-xs">
                        {/* Timeline node node indicator */}
                        <span className="absolute -left-[30px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 border border-slate-900 shadow-sm" />
                        <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-blue-450 font-bold">
                            <span>{n.officer}</span>
                            <span className="text-slate-500 font-mono">{n.date}</span>
                          </div>
                          <p className="text-slate-300 font-medium leading-relaxed">{n.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 text-center py-2 font-medium">No previous action logs recorded for this patient.</div>
              )}

              {/* Form Input fields for action notes */}
              <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2 border-t border-slate-800/85">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                      Coordinate Action Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-750 text-white text-xs font-bold py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
                    >
                      <option value="Assigned to CMO">Assigned to CMO</option>
                      <option value="Action In Progress">Action In Progress</option>
                      <option value="Logged & Verified">Logged & Verified</option>
                      <option value="Resolved">Resolved (Close Case)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                      Assigned Officer
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="Dr. John Varma (Chief Medical Officer)"
                      className="w-full bg-slate-950 border border-slate-850 text-slate-450 text-xs font-bold py-2.5 px-3 rounded-xl select-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                    Append Resolution Note / Audit Action
                  </label>
                  <textarea
                    rows={2}
                    value={officerNote}
                    onChange={(e) => setOfficerNote(e.target.value)}
                    placeholder="e.g. Audited stocks with pharmacy head; confirmed hypertension medicine restocked. Case closed."
                    className="w-full bg-slate-950 border border-slate-750 rounded-xl p-3 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingNote || !officerNote.trim()}
                    className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Icon icon="ph:check-circle-bold" className="w-4 h-4" />
                    <span>Save Note & Update</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FULL PREVIEW LIGHTBOX OVERLAY */}
      {/* ------------------------------------------------------------- */}
      {activeImagePreview && (
        <div
          onClick={() => setActiveImagePreview(null)}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img src={activeImagePreview} alt="Evidence attachment zoom" className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl" />
            <button
              onClick={() => setActiveImagePreview(null)}
              className="absolute -top-10 right-0 text-white text-xs font-bold bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 rounded-full cursor-pointer flex items-center gap-1"
            >
              <Icon icon="ph:x-bold" className="w-3.5 h-3.5" /> Close (ESC)
            </button>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
