import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { closeDetailModal, updateRecordStatus } from '../../redux/features/adminSlice';
import { AudioPlayerWidget } from './AudioPlayerWidget';
import { exportSingleRecordPDF, exportToCSV } from './exportUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

type LanguageMode = 'english' | 'hindi' | 'gujarati' | 'marathi';

const QUESTION_DEFINITIONS = {
  english: [
    { sr: 1, text: "Name of Patient/Visitor?", key: "patientName", isPersonal: true },
    { sr: 2, text: "AADHAAR Number / ECHS Health Card / ABHA Number", key: "aadhaarMasked", isPersonal: true },
    { sr: 3, text: "Mobile Number (+91)", key: "mobileNumber", isPersonal: true },
    { sr: 4, category: "Medical Care & Doctors", text: "How was your Doctor Consultation Experience?", key: "doctor" },
    { sr: 5, category: "Pharmacy Dispensary", text: "How was your Pharmacy / Medicine Counter Experience?", key: "pharmacy" },
    { sr: 6, category: "Medicine Availability", text: "Were all your Prescribed Medicines available free of cost?", key: "medicineAvailability" },
    { sr: 7, category: "Hospital Cleanliness", text: "How was the Cleanliness & Sanitation of the Facility?", key: "cleanliness" },
    { sr: 8, category: "Feedback & Grievance", text: "Any Suggestions, Grievance or Additional Comments?", key: "suggestions" },
  ],
  hindi: [
    { sr: 1, text: "मरीज़ / आगंतुक का नाम?", key: "patientName", isPersonal: true },
    { sr: 2, text: "आधार नंबर / ईसीएचएस कार्ड / आभा नंबर", key: "aadhaarMasked", isPersonal: true },
    { sr: 3, text: "मोबाइल नंबर (+91)", key: "mobileNumber", isPersonal: true },
    { sr: 4, category: "चिकित्सा देखभाल एवं डॉक्टर", text: "आपका डॉक्टर परामर्श अनुभव कैसा रहा?", key: "doctor" },
    { sr: 5, category: "फार्मेसी वितरण", text: "आपका फार्मेसी / दवा काउंटर अनुभव कैसा रहा?", key: "pharmacy" },
    { sr: 6, category: "दवा उपलब्धता", text: "क्या आपकी सभी निर्धारित दवाएं मुफ्त उपलब्ध थीं?", key: "medicineAvailability" },
    { sr: 7, category: "अस्पताल स्वच्छता", text: "सुविधा की स्वच्छता और सफाई कैसी थी?", key: "cleanliness" },
    { sr: 8, category: "सुझाव एवं शिकायत", text: "कोई सुझाव, शिकायत या अतिरिक्त टिप्पणी?", key: "suggestions" },
  ],
  gujarati: [
    { sr: 1, text: "દર્દી / મુલાકાતીનું નામ?", key: "patientName", isPersonal: true },
    { sr: 2, text: "આધાર નંબર / ECHS હેલ્થ કાર્ડ / આભા નંબર", key: "aadhaarMasked", isPersonal: true },
    { sr: 3, text: "મોબાઇલ નંબર (+91)", key: "mobileNumber", isPersonal: true },
    { sr: 4, category: "તબીબી સંભાળ અને તબીબો", text: "તમારો ડૉક્ટર પરામર્શ અનુભવ કેવો રહ્યો?", key: "doctor" },
    { sr: 5, category: "ફાર્મસી કાઉન્ટર", text: "તમારો ફાર્મસી / દવા કાઉન્ટર અનુભવ કેવો રહ્યો?", key: "pharmacy" },
    { sr: 6, category: "દવાની ઉપલબ્ધતા", text: "શું તમારી બધી નિયત દવાઓ મફત ઉપલબ્ધ હતી?", key: "medicineAvailability" },
    { sr: 7, category: "હોસ્પિટલ સ્વચ્છતા", text: "સુવિધાઓની સફાઈ અને શૌચાલય સ્વચ્છતા કેવી હતી?", key: "cleanliness" },
    { sr: 8, category: "સૂચનો અને ફરિયાદો", text: "કોઈ સૂચનો, ફરિયાદ અથવા વધારાની ટિપ્પણીઓ?", key: "suggestions" },
  ],
  marathi: [
    { sr: 1, text: "रुग्णाचे / भेट देणाऱ्याचे नाव?", key: "patientName", isPersonal: true },
    { sr: 2, text: "आधार क्रमांक / ECHS हेल्थ कार्ड / आभा क्रमांक", key: "aadhaarMasked", isPersonal: true },
    { sr: 3, text: "मोबाईल नंबर (+91)", key: "mobileNumber", isPersonal: true },
    { sr: 4, category: "वैद्यकीय काळजी व डॉक्टर", text: "तुमचा डॉक्टर सल्ला अनुभव कसा होता?", key: "doctor" },
    { sr: 5, category: "फार्मसी काउंटर", text: "तुमचा फार्मसी / औषध काउंटर अनुभव कसा होता?", key: "pharmacy" },
    { sr: 6, category: "औषध उपलब्धता", text: "तुमची सर्व औषधे मोफत उपलब्ध होती का?", key: "medicineAvailability" },
    { sr: 7, category: "रुग्णालय स्वच्छता", text: "सुविधेची स्वच्छता व स्वच्छतागृह स्वच्छता कशी होती?", key: "cleanliness" },
    { sr: 8, category: "सूचना व तक्रारी", text: "काही सूचना, तक्रारी किंवा अतिरिक्त टिप्पण्या?", key: "suggestions" },
  ],
};

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
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  // CMO Voice Recording State
  const [isRecordingCMOVoice, setIsRecordingCMOVoice] = useState(false);
  const [cmoVoiceTimer, setCmoVoiceTimer] = useState(0);
  const [hasCmoRecordedAudio, setHasCmoRecordedAudio] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      setShowSuccessModal(true);
    }, 300);
  };

  const getRowData = (item: any) => {
    switch (item.key) {
      case 'patientName':
        return {
          answer: selectedRecord.patientName,
          comments: null,
          audioUrl: null,
          imageUrl: null,
        };
      case 'aadhaarMasked':
        return {
          answer: selectedRecord.aadhaarMasked,
          comments: null,
          audioUrl: null,
          imageUrl: null,
        };
      case 'mobileNumber':
        return {
          answer: selectedRecord.mobileNumber,
          comments: null,
          audioUrl: null,
          imageUrl: null,
        };
      case 'doctor':
        return {
          answer: selectedRecord.doctor?.rating || 'Excellent',
          comments: selectedRecord.doctor?.comments || null,
          audioUrl: selectedRecord.doctor?.audioUrl || null,
          imageUrl: selectedRecord.doctor?.imageUrl || null,
        };
      case 'pharmacy':
        return {
          answer: selectedRecord.pharmacy?.rating || 'Excellent',
          comments: selectedRecord.pharmacy?.comments || null,
          audioUrl: selectedRecord.pharmacy?.audioUrl || null,
          imageUrl: selectedRecord.pharmacy?.imageUrl || null,
        };
      case 'medicineAvailability':
        return {
          answer: selectedRecord.pharmacy?.rating === 'Could Be Better' ? 'Could Be Better' : 'Skip',
          comments: selectedRecord.pharmacy?.rating === 'Could Be Better' ? selectedRecord.pharmacy?.comments || null : null,
          audioUrl: null,
          imageUrl: null,
        };
      case 'cleanliness':
        return {
          answer: selectedRecord.cleanliness?.rating || 'Excellent',
          comments: selectedRecord.cleanliness?.comments || null,
          audioUrl: selectedRecord.cleanliness?.audioUrl || null,
          imageUrl: selectedRecord.cleanliness?.imageUrl || null,
        };
      case 'suggestions':
        return {
          answer: selectedRecord.suggestions?.text || selectedRecord.suggestions?.audioUrl || selectedRecord.suggestions?.imageUrl ? 'Image' : '-',
          comments: selectedRecord.suggestions?.text || null,
          audioUrl: selectedRecord.suggestions?.audioUrl || null,
          imageUrl: selectedRecord.suggestions?.imageUrl || null,
        };
      default:
        return { answer: '-', comments: null, audioUrl: null, imageUrl: null };
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
          className="relative z-10 w-full max-w-5xl bg-[#0F172A] text-slate-100 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        >
          {/* TOP UTILITY HEADER BAR */}
          <div className="px-6 py-3.5 bg-[#111827] border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs">
                <Icon icon="ph:file-text-bold" className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white leading-tight">
                  Patient Feedback Record Details
                </h2>
                <div className="text-[11px] text-slate-400 font-mono">
                  Tracking ID: <span className="text-amber-400 font-bold">{selectedRecord.trackingId}</span>
                </div>
              </div>
            </div>

            {/* Actions & PDF/CSV Export Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => exportSingleRecordPDF(selectedRecord)}
                className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <Icon icon="bi:filetype-pdf" className="w-4 h-4 text-red-500" />
                <span>Download PDF</span>
              </button>

              <button
                onClick={() => exportToCSV([selectedRecord], `Feedback_${selectedRecord.trackingId}.csv`)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <Icon icon="bi:filetype-xls" className="w-4 h-4" />
                <span>Export CSV</span>
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
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
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

            {/* GOLDEN HEADER BANNER FOR TABLE - MATCHING REFERENCE IMAGE */}
            <div className="bg-[#181F2F] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              {/* Bright Golden-Yellow Banner Header Bar */}
              <div className="bg-[#ffbf00e7] text-slate-950 px-5 py-3.5 flex items-center justify-between shadow-md">
                <span className="font-bold text-sm tracking-wide">
                  Answer Details
                </span>

                {/* Language Switcher Tabs */}
                <div className="flex items-center gap-1.5">
                  {(['english', 'hindi', 'marathi', 'gujarati'] as LanguageMode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setLang(m)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                        lang === m
                          ? 'bg-slate-950 text-amber-400 border border-slate-900 shadow-sm'
                          : 'border border-slate-950/40 text-slate-950 hover:bg-slate-950/10'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* TABLE CONTAINER FOR STEPS & RESPONSES */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#1e2738] text-slate-300 border-b border-slate-700/80 font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4 w-16 text-center">Sr. No</th>
                      <th className="py-3.5 px-4 min-w-[220px]">Question Text</th>
                      <th className="py-3.5 px-4 min-w-[160px]">Response</th>
                      <th className="py-3.5 px-4 min-w-[320px]">User Comments & Grievance Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-medium">
                    {QUESTION_DEFINITIONS[lang].map((item) => {
                      const data = getRowData(item);
                      const isGrievanceRating = data.answer === 'Could Be Better';
                      const isExcellent = data.answer === 'Excellent' || data.answer === 'Excellent Service';
                      const isGrievanceOrSuggestion = isGrievanceRating || item.key === 'suggestions';

                      let statusBadgeClass = "bg-slate-800 text-slate-300 border-slate-700";
                      if (isExcellent) {
                        statusBadgeClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold";
                      } else if (isGrievanceRating) {
                        statusBadgeClass = "bg-red-500/10 text-red-400 border-red-500/30 font-bold";
                      } else if (data.answer === 'Acceptable' || data.answer === 'Acceptable standard') {
                        statusBadgeClass = "bg-amber-500/10 text-amber-400 border-amber-500/30 font-bold";
                      }

                      return (
                        <tr
                          key={item.sr}
                          className="hover:bg-slate-800/60 transition group relative"
                        >
                          {/* Sr. No */}
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-400">
                            {item.sr}
                          </td>

                          {/* Question Text */}
                          <td className="py-3.5 px-4 text-slate-100 font-semibold leading-relaxed">
                            {item.category && (
                              <span className="block text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-0.5">
                                {item.category}
                              </span>
                            )}
                            <span>{item.text}</span>
                          </td>

                          {/* Response */}
                          <td className="py-3.5 px-4 font-bold">
                            {item.isPersonal ? (
                              <span className="text-slate-200 font-semibold">{data.answer}</span>
                            ) : data.answer !== '-' ? (
                              <span className={`inline-block px-3 py-1 rounded-xl border text-xs ${statusBadgeClass}`}>
                                {data.answer}
                              </span>
                            ) : (
                              <span className="text-slate-500">-</span>
                            )}
                          </td>

                          {/* MERGED COLUMN: User Comments, Voice Note & Uploaded Image */}
                          <td
                            className="py-3.5 px-4 text-slate-300 relative group/tooltip"
                            onMouseEnter={() => setActiveTooltip(item.sr)}
                            onMouseLeave={() => setActiveTooltip(null)}
                          >
                            {isGrievanceOrSuggestion && (data.comments || data.audioUrl || data.imageUrl) ? (
                              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                {/* 1. Text Comment */}
                                {data.comments && (
                                  <div className="flex-1 min-w-0">
                                    <div className="line-clamp-2 leading-relaxed italic text-slate-300">
                                      "{data.comments}"
                                    </div>

                                    {/* Full Comment Tooltip Popover on Hover */}
                                    {activeTooltip === item.sr && (
                                      <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute left-4 bottom-full mb-2 z-50 w-72 bg-slate-900 text-slate-100 text-xs p-3 rounded-xl border border-slate-700 shadow-2xl pointer-events-none"
                                      >
                                        <div className="font-bold text-amber-400 mb-1 flex items-center gap-1">
                                          <Icon icon="ph:quotes-bold" className="w-3.5 h-3.5" />
                                          <span>Full User Comment</span>
                                        </div>
                                        <p className="leading-relaxed font-normal">{data.comments}</p>
                                      </motion.div>
                                    )}
                                  </div>
                                )}

                                {/* 2. Voice Note Audio Widget */}
                                {data.audioUrl && (
                                  <div className="shrink-0">
                                    <AudioPlayerWidget
                                      audioUrl={data.audioUrl}
                                      title="Voice Note"
                                      theme="amber"
                                      compact={true}
                                    />
                                  </div>
                                )}

                                {/* 3. Photo Evidence Lightbox Trigger */}
                                {data.imageUrl && (
                                  <div className="shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => setActiveImagePreview(data.imageUrl)}
                                      className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                                      title="View Uploaded Photo Evidence"
                                    >
                                      <Icon icon="ph:image-bold" className="w-4 h-4 text-amber-400" />
                                      <span>View Photo</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-600 text-xs">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
                {/* <span className="text-xs text-slate-400">Officer: CMO Rajkot</span> */}
              </div>

              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* <div>
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
                  </div> */}

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Text Remark / Directive</label>
                    <textarea
                      rows={4}
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
              {/* {selectedRecord.officerNotes && selectedRecord.officerNotes.length > 0 && (
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
              )} */}
            </div>
          </div>
        </motion.div>

        {/* POLISHED LIGHTBOX FOR IMAGES */}
        <AnimatePresence>
          {activeImagePreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveImagePreview(null)}
              className="fixed inset-0 z-60 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4 cursor-pointer"
            >
              <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-700 shadow-2xl bg-slate-900 p-2">
                <img src={activeImagePreview} alt="Evidence" className="max-w-full max-h-[82vh] object-contain rounded-xl" />
                <button
                  onClick={() => setActiveImagePreview(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 text-white hover:bg-slate-800 cursor-pointer shadow-lg"
                >
                  <Icon icon="ph:x-bold" className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MINOR RESOLUTION LOG SUBMITTED SUCCESS POPUP MODAL WITH MICRO-ANIMATIONS */}
        <AnimatePresence>
          {showSuccessModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 15 }}
                transition={{ type: "spring", damping: 22, stiffness: 280 }}
                className="bg-[#111827] border border-amber-500/30 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl z-50 relative overflow-hidden"
              >
                {/* Subtle Amber Glow Background Accent */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

                {/* Animated Green Checkmark Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 16, delay: 0.1 }}
                  className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner relative z-10"
                >
                  <Icon icon="ph:check-circle-bold" className="w-8 h-8 text-emerald-400" />
                </motion.div>

                <div className="relative z-10 space-y-1">
                  <motion.h3
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-lg font-bold text-white tracking-wide"
                  >
                    Resolution Log Submitted!
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs text-slate-300 leading-relaxed"
                  >
                    CMO directive and resolution status update have been recorded into the history audit log.
                  </motion.p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition cursor-pointer relative z-10"
                >
                  Done
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};
