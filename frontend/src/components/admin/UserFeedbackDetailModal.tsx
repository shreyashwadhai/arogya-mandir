import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { closeDetailModal, updateRecordStatus } from '../../redux/features/adminSlice';
import { AudioPlayerWidget } from './AudioPlayerWidget';
import { exportSingleRecordPDF, exportToCSV } from './exportUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

type LanguageMode = 'english' | 'hindi' | 'gujarati' | 'marathi';

const STEP_DEFINITIONS = [
  {
    key: 'registration',
    sr: 1,
    icon: 'ph:user-focus-bold',
    title: {
      english: 'Step 1: Token & Registration Counter',
      hindi: 'चरण 1: टोकन एवं पंजीकरण काउंटर',
      gujarati: 'પગલું 1: ટોકન અને નોંધણી કાઉન્ટર',
      marathi: 'टप्पा 1: टोकन आणि नोंदणी काउंटर',
    },
  },
  {
    key: 'doctor',
    sr: 2,
    icon: 'ph:first-aid-kit-bold',
    title: {
      english: 'Step 2: Medical Officer / Doctor Consultation',
      hindi: 'चरण 2: चिकित्सा अधिकारी / डॉक्टर परामर्श',
      gujarati: 'પગલું 2: તબીબી અધિકારી / ડોક્ટર પરામર્શ',
      marathi: 'टप्पा 2: वैद्यकीय अधिकारी / डॉक्टर सल्ला',
    },
  },
  {
    key: 'pharmacy',
    sr: 3,
    icon: 'ph:pill-bold',
    title: {
      english: 'Step 3: Pharmacy Medicine Availability',
      hindi: 'चरण 3: फार्मेसी दवा उपलब्धता एवं वितरण',
      gujarati: 'પગલું 3: ફાર્મસી દવાની ઉપલબ્ધતા અને વિતરણ',
      marathi: 'टप्पा 3: फार्मसी औषध उपलब्धता व वाटप',
    },
  },
  {
    key: 'cleanliness',
    sr: 4,
    icon: 'ph:sparkles-bold',
    title: {
      english: 'Step 4: Cleanliness & Toilet Hygiene',
      hindi: 'चरण 4: स्वच्छता एवं शौचालय सफाई',
      gujarati: 'પગલું 4: સફાઈ અને શૌચાલયની સ્વચ્છતા',
      marathi: 'टप्पा 4: स्वच्छता आणि स्वच्छतागृह',
    },
  },
  {
    key: 'suggestions',
    sr: 5,
    icon: 'ph:chat-text-bold',
    title: {
      english: 'Step 5: General Suggestions & Feedback',
      hindi: 'चरण 5: सामान्य सुझाव एवं प्रतिक्रिया',
      gujarati: 'પગલું 5: સામાન્ય સૂચનો અને પ્રતિસાદ',
      marathi: 'टप्पा 5: सामान्य सूचना आणि अभिप्राय',
    },
  },
];

export const UserFeedbackDetailModal: React.FC = () => {
  const dispatch = useDispatch();
  const showDetailModal = useSelector((state: RootState) => state.admin.showDetailModal);
  const selectedRecord = useSelector((state: RootState) => state.admin.selectedRecord);

  // States
  const [lang, setLang] = useState<LanguageMode>('english');
  const [newStatus, setNewStatus] = useState<any>('Assigned to CMO');
  const [officerNote, setOfficerNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [activeImagePreview, setActiveImagePreview] = useState<string | null>(null);

  // CMO Voice Recording State
  const [isRecordingCMOVoice, setIsRecordingCMOVoice] = useState(false);
  const [cmoVoiceTimer, setCmoVoiceTimer] = useState(0);
  const [hasCmoRecordedAudio, setHasCmoRecordedAudio] = useState(false);

  useEffect(() => {
    if (selectedRecord) {
      setNewStatus(selectedRecord.status);
    }
  }, [selectedRecord]);

  // Voice recording timer simulator
  useEffect(() => {
    let interval: any;
    if (isRecordingCMOVoice) {
      interval = setInterval(() => {
        setCmoVoiceTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecordingCMOVoice]);

  if (!showDetailModal || !selectedRecord) return null;

  const toggleCMOVoiceRecord = () => {
    if (!isRecordingCMOVoice) {
      setIsRecordingCMOVoice(true);
      setCmoVoiceTimer(0);
      setHasCmoRecordedAudio(false);
    } else {
      setIsRecordingCMOVoice(false);
      setHasCmoRecordedAudio(true);
      if (!officerNote.trim()) {
        setOfficerNote("Recorded Voice Resolution Instruction (00:" + cmoVoiceTimer.toString().padStart(2, "0") + ")");
      }
    }
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerNote.trim() && !hasCmoRecordedAudio) return;

    setIsSubmittingNote(true);
    setTimeout(() => {
      const finalNote = hasCmoRecordedAudio
        ? `🎙️ Voice Note (${cmoVoiceTimer}s): ${officerNote || "Audio directive recorded"}`
        : officerNote;

      dispatch(
        updateRecordStatus({
          id: selectedRecord.id,
          status: newStatus,
          note: finalNote,
          officerName: 'CMO Rajkot (Chief Medical Officer)',
        })
      );
      setOfficerNote('');
      setIsSubmittingNote(false);
      setHasCmoRecordedAudio(false);
      setCmoVoiceTimer(0);
    }, 300);
  };

  const getStepData = (key: string) => {
    switch (key) {
      case 'registration':
        return selectedRecord.registration;
      case 'doctor':
        return selectedRecord.doctor;
      case 'pharmacy':
        return selectedRecord.pharmacy;
      case 'cleanliness':
        return selectedRecord.cleanliness;
      case 'suggestions':
        return {
          rating: null,
          comments: selectedRecord.suggestions?.text,
          audioUrl: selectedRecord.suggestions?.audioUrl,
          imageUrl: selectedRecord.suggestions?.imageUrl,
        };
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 cursor-pointer"
          onClick={() => dispatch(closeDetailModal())}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative z-10 w-full max-w-4xl bg-[#0F172A] text-slate-100 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        >
          {/* HEADER BAR */}
          <div className="px-6 py-4 bg-[#111827] border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <span>Feedback Details</span>
                <span className="text-slate-600">•</span>
                <span className="font-mono text-slate-300">{selectedRecord.trackingId}</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-0.5">
                {selectedRecord.patientName}
              </h2>
            </div>

            {/* Actions & PDF/CSV Export */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => exportSingleRecordPDF(selectedRecord)}
                className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <Icon icon="bi:filetype-pdf" className="w-4 h-4 text-red-500" />
                <span>PDF</span>
              </button>

              <button
                onClick={() => exportToCSV([selectedRecord], `Feedback_${selectedRecord.trackingId}.csv`)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <Icon icon="bi:filetype-xls" className="w-4 h-4" />
                <span>CSV</span>
              </button>

              <button
                onClick={() => dispatch(closeDetailModal())}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <Icon icon="ph:x-bold" className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* SCROLLABLE CONTENT BODY */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* SUMMARY METADATA CARD */}
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400">Clinic Name</span>
                <div className="font-bold text-amber-400 text-sm mt-0.5">{selectedRecord.clinicName || 'Rajkot'}</div>
                <div className="text-[11px] font-mono text-slate-500">{selectedRecord.clinicCode || 'JAM/PC/RAJ'}</div>
              </div>

              <div>
                <span className="text-slate-400">Feedback Date</span>
                <div className="font-bold text-slate-200 mt-0.5">{selectedRecord.timestamp || selectedRecord.date}</div>
                <div className="text-[11px] text-slate-500">{selectedRecord.stationHq || 'Jamnagar'} HQ</div>
              </div>

              <div>
                <span className="text-slate-400">Overall Rating Score</span>
                <div className={`font-extrabold text-sm uppercase mt-0.5 ${
                  String(selectedRecord.responseType || selectedRecord.overallRating) === 'Could Be Better'
                    ? 'text-red-400'
                    : 'text-emerald-400'
                }`}>
                  {selectedRecord.responseType || selectedRecord.overallRating}
                </div>
              </div>

              <div>
                <span className="text-slate-400">Resolution Status</span>
                <div className="font-bold text-amber-400 mt-0.5">{selectedRecord.status}</div>
              </div>
            </div>

            {/* STEP-BY-STEP FEEDBACK FORM RESPONSES */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Icon icon="ph:list-checks-bold" className="w-4 h-4 text-amber-400" />
                  <span>Feedback Form Steps & Responses</span>
                </h3>

                {/* Language Switcher Tabs */}
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {(['english', 'hindi', 'gujarati', 'marathi'] as LanguageMode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setLang(m)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize cursor-pointer transition ${
                        lang === m
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* CARD-BY-CARD DISPLAY FOR EACH FEEDBACK STEP */}
              <div className="space-y-4">
                {STEP_DEFINITIONS.map((step) => {
                  const stepData = getStepData(step.key);
                  if (!stepData) return null;

                  const rating = String(stepData.rating || '');
                  const comments = stepData.comments;
                  const audioUrl = stepData.audioUrl;
                  const imageUrl = stepData.imageUrl;

                  let badgeColor = "bg-slate-800 text-slate-300 border-slate-700";
                  if (rating === 'Excellent' || rating === 'Excellent Service') {
                    badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold";
                  } else if (rating === 'Could Be Better') {
                    badgeColor = "bg-red-500/10 text-red-400 border-red-500/30 font-bold";
                  } else if (rating === 'Acceptable' || rating === 'Acceptable standard') {
                    badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/30 font-bold";
                  }

                  return (
                    <motion.div
                      key={step.key}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: step.sr * 0.04 }}
                      className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-md space-y-3"
                    >
                      {/* Step Title & Rating Badge Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 flex items-center justify-center shrink-0">
                            <Icon icon={step.icon} className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-white">
                              {step.title[lang]}
                            </h4>
                          </div>
                        </div>

                        {rating && (
                          <span className={`px-3 py-1 rounded-xl border font-medium text-xs ${badgeColor} shrink-0`}>
                            {rating}
                          </span>
                        )}
                      </div>

                      {/* Patient Comments */}
                      {comments && (
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11.5px] text-slate-300 italic flex items-start gap-2">
                          <Icon icon="ph:quotes-bold" className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>{comments}</span>
                        </div>
                      )}

                      {/* Embedded Audio Player for this specific Step */}
                      {audioUrl && (
                        <div className="pt-1">
                          <AudioPlayerWidget
                            audioUrl={audioUrl}
                            title={`${step.title[lang]} - Voice Recording`}
                            theme="amber"
                            compact={false}
                          />
                        </div>
                      )}

                      {/* Embedded Photo Attachment for this specific Step */}
                      {imageUrl && (
                        <div className="pt-1 space-y-1.5">
                          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                            <Icon icon="ph:image-bold" className="w-3.5 h-3.5 text-amber-400" />
                            <span>Uploaded Photo Evidence</span>
                          </div>
                          <div
                            onClick={() => setActiveImagePreview(imageUrl)}
                            className="relative h-32 w-48 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 cursor-pointer group shadow-sm"
                          >
                            <img src={imageUrl} alt="Step Attachment" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                              <Icon icon="ph:arrows-out-bold" className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* CMO RESOLUTION & ACTION DESK WITH VOICE / TEXT RECORDING */}
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                    <Icon icon="icon-park-outline:protect" className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-white">CMO Resolution & Action Desk</span>
                </div>
                <span className="text-xs text-slate-400">Officer: CMO Rajkot</span>
              </div>

              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Status Update</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs font-bold text-amber-400 cursor-pointer focus:outline-none focus:border-amber-500"
                    >
                      <option value="Assigned to CMO">Assigned to CMO</option>
                      <option value="Action In Progress">Action In Progress</option>
                      <option value="Logged & Verified">Logged & Verified</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Text Remark / Directive</label>
                    <input
                      type="text"
                      value={officerNote}
                      onChange={(e) => setOfficerNote(e.target.value)}
                      placeholder="Type resolution remark or instructions..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs font-medium text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Voice Action Recording Bar for CMO */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={toggleCMOVoiceRecord}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 shadow-sm ${
                        isRecordingCMOVoice
                          ? "bg-red-600 text-white animate-pulse"
                          : hasCmoRecordedAudio
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      <Icon
                        icon={isRecordingCMOVoice ? "ph:stop-circle-bold" : "ph:microphone-bold"}
                        className="w-4 h-4"
                      />
                      <span>
                        {isRecordingCMOVoice
                          ? `Recording (00:${cmoVoiceTimer.toString().padStart(2, "0")}) - Click to Stop`
                          : hasCmoRecordedAudio
                          ? `Voice Recorded (${cmoVoiceTimer}s)`
                          : "Record CMO Voice Action"}
                      </span>
                    </button>

                    {hasCmoRecordedAudio && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <Icon icon="ph:check-bold" className="w-3.5 h-3.5" />
                          <span>Voice Directive Recorded</span>
                        </span>
                        {/* Audio Preview Widget */}
                        <AudioPlayerWidget
                          audioUrl="https://actions.google.com/sounds/v1/speech/human_voice_sample.ogg"
                          title="CMO Recorded Audio Directive"
                          compact={true}
                          theme="emerald"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingNote || (!officerNote.trim() && !hasCmoRecordedAudio)}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                  >
                    {isSubmittingNote ? (
                      <Icon icon="ph:spinner-bold" className="w-4 h-4 animate-spin" />
                    ) : (
                      <Icon icon="ph:paper-plane-right-bold" className="w-4 h-4" />
                    )}
                    <span>Submit Resolution Log</span>
                  </button>
                </div>
              </form>

              {/* Historical Notes Audit Trail */}
              {selectedRecord.officerNotes && selectedRecord.officerNotes.length > 0 && (
                <div className="border-t border-slate-800 pt-3 space-y-2">
                  <span className="text-xs font-semibold text-slate-400">Resolution History Log</span>
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {selectedRecord.officerNotes.map((note, idx) => (
                      <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
                        <div className="flex justify-between text-[11px] text-amber-400 font-bold">
                          <span>{note.officer}</span>
                          <span className="text-slate-500 font-mono">{note.date}</span>
                        </div>
                        <p className="text-slate-200 font-medium">{note.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* LIGHTBOX FOR IMAGES */}
        <AnimatePresence>
          {activeImagePreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveImagePreview(null)}
              className="fixed inset-0 z-60 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4 cursor-pointer"
            >
              <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-700 shadow-2xl">
                <img src={activeImagePreview} alt="Evidence" className="max-w-full max-h-[85vh] object-contain" />
                <button
                  onClick={() => setActiveImagePreview(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 cursor-pointer"
                >
                  <Icon icon="ph:x-bold" className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};
