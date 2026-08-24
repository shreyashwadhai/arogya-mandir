import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import {
  setCurrentStep,
  nextQuestion,
  previousQuestion,
  updateFeedbackResponses,
  generateNewTrackingId
} from '../../redux/features/journeySlice';
import { translations } from '../../translations/languages';
import { CouldBeBetterBottomSheet } from '../CouldBeBetterBottomSheet';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import confetti from 'canvas-confetti';

export const Step05FeedbackInterview: React.FC = () => {
  const dispatch = useDispatch();
  const { currentQuestionIndex, feedbackResponses, selectedLanguage } = useSelector(
    (state: RootState) => state.journey
  );
  const t = translations[selectedLanguage] || translations.en;
  const currentQ = t.questions[currentQuestionIndex];
  const totalQuestions = t.questions.length;

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<any>(null);

  // Sound wave visualization state & refs (9 bars for rich equalizer visualizer)
  const [audioLevels, setAudioLevels] = useState<number[]>([6, 8, 12, 18, 24, 18, 12, 8, 6]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Helper to format seconds as MM:SS
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Detect supported audio MIME type
  const getSupportedMimeType = () => {
    if (typeof MediaRecorder === 'undefined') return '';
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/aac',
      'audio/ogg;codecs=opus',
      'audio/wav'
    ];
    for (const t of types) {
      if (MediaRecorder.isTypeSupported(t)) return t;
    }
    return '';
  };

  // Category Icon helper
  const getCategoryIcon = (idx: number) => {
    const q = t.questions[idx];
    if (!q) return 'ph:question-bold';
    if (q.category?.includes('DOCTOR') || q.category?.includes('MEDICAL')) return 'ph:stethoscope-bold';
    if (q.category?.includes('PHARMACY') || q.category?.includes('DISPENSARY')) return 'ph:pill-bold';
    if (q.category?.includes('MEDICINE')) return 'ph:first-aid-kit-bold';
    if (q.category?.includes('CLEANLINESS')) return 'ph:sparkles-bold';
    return 'ph:chat-teardrop-text-bold';
  };

  // Helper for Rating Questions
  const getRatingFieldForQIndex = (idx: number) => {
    const q = t.questions[idx];
    if (!q || q.type !== 'rating') return null;

    switch (idx) {
      case 0:
        return { ratingKey: 'doctorRating', commentsKey: 'doctorComments' };
      case 1:
        return { ratingKey: 'pharmacyRating', commentsKey: 'pharmacyComments' };
      case 2:
        return { ratingKey: 'prescribedMedicinesAvailable', commentsKey: 'medicinesComments' };
      case 3:
        return { ratingKey: 'cleanlinessRating', commentsKey: 'cleanlinessComments' };
      default:
        if (q.category?.includes('DOCTOR') || q.category?.includes('MEDICAL')) {
          return { ratingKey: 'doctorRating', commentsKey: 'doctorComments' };
        }
        if (q.category?.includes('PHARMACY')) {
          return { ratingKey: 'pharmacyRating', commentsKey: 'pharmacyComments' };
        }
        if (q.category?.includes('MEDICINE')) {
          return { ratingKey: 'prescribedMedicinesAvailable', commentsKey: 'medicinesComments' };
        }
        if (q.category?.includes('CLEANLINESS')) {
          return { ratingKey: 'cleanlinessRating', commentsKey: 'cleanlinessComments' };
        }
        return { ratingKey: 'doctorRating', commentsKey: 'doctorComments' };
    }
  };

  const currentRatingInfo = getRatingFieldForQIndex(currentQuestionIndex);
  const currentRatingVal = currentRatingInfo ? ((feedbackResponses as any)[currentRatingInfo.ratingKey] || '') : '';
  const currentCommentsVal = currentRatingInfo ? ((feedbackResponses as any)[currentRatingInfo.commentsKey] || '') : '';

  const handleRatingSelect = (rating: 'Could Be Better' | 'Acceptable' | 'Excellent') => {
    if (!currentRatingInfo) return;
    dispatch(updateFeedbackResponses({ [currentRatingInfo.ratingKey]: rating }));

    if (rating === 'Acceptable' || rating === 'Excellent') {
      setTimeout(() => {
        handleNext();
      }, 400);
    } else if (rating === 'Could Be Better') {
      setIsBottomSheetOpen(true);
    }
  };

  const handleCommentsChange = (text: string) => {
    if (!currentRatingInfo) return;
    dispatch(updateFeedbackResponses({ [currentRatingInfo.commentsKey]: text }));
  };

  // Helper for Text Questions
  const getTextInfoForQIndex = (idx: number) => {
    const q = t.questions[idx];
    if (!q || q.type !== 'text') return null;
    return {
      value: feedbackResponses.additionalSuggestions || '',
      onChange: (val: string) => dispatch(updateFeedbackResponses({ additionalSuggestions: val })),
      placeholder: q.description || 'Type suggestions or comments here...'
    };
  };

  const textInfo = getTextInfoForQIndex(currentQuestionIndex);

  const getMediaFieldKeysForQIndex = (idx: number) => {
    const q = t.questions[idx];
    switch (idx) {
      case 0: return { audioKey: 'doctorAudioUrl', imageKey: 'doctorImageUrl' };
      case 1: return { audioKey: 'pharmacyAudioUrl', imageKey: 'pharmacyImageUrl' };
      case 2: return { audioKey: 'medicinesAudioUrl', imageKey: 'medicinesImageUrl' };
      case 3: return { audioKey: 'cleanlinessAudioUrl', imageKey: 'cleanlinessImageUrl' };
      case 4: return { audioKey: 'suggestionAudioUrl', imageKey: 'suggestionImageUrl' };
      default:
        if (q?.category?.includes('DOCTOR')) return { audioKey: 'doctorAudioUrl', imageKey: 'doctorImageUrl' };
        if (q?.category?.includes('PHARMACY')) return { audioKey: 'pharmacyAudioUrl', imageKey: 'pharmacyImageUrl' };
        if (q?.category?.includes('MEDICINE')) return { audioKey: 'medicinesAudioUrl', imageKey: 'medicinesImageUrl' };
        if (q?.category?.includes('CLEANLINESS')) return { audioKey: 'cleanlinessAudioUrl', imageKey: 'cleanlinessImageUrl' };
        return { audioKey: 'suggestionAudioUrl', imageKey: 'suggestionImageUrl' };
    }
  };

  const currentMediaKeys = getMediaFieldKeysForQIndex(currentQuestionIndex);
  const currentAudioUrl = currentMediaKeys ? feedbackResponses[currentMediaKeys.audioKey as keyof typeof feedbackResponses] as string | null : null;
  const currentImageUrl = currentMediaKeys ? feedbackResponses[currentMediaKeys.imageKey as keyof typeof feedbackResponses] as string | null : null;

  // Pure Microphone recording logic - captures user's exact original voice
  const startRecording = async () => {
    setMicError(null);
    setRecordingTimer(0);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicError('Voice recording is not supported on this browser.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      const chunks: Blob[] = [];

      // Connect Web Audio Analyser to render live dynamic sound waves
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 32;
          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateWave = () => {
            analyser.getByteFrequencyData(dataArray);
            // Calculate dynamic height for 9 equalizer wave bars based on real mic frequencies
            const bars = [
              Math.max(6, Math.min(28, (dataArray[0] || 0) / 6)),
              Math.max(8, Math.min(28, (dataArray[1] || 0) / 5)),
              Math.max(10, Math.min(28, (dataArray[2] || 0) / 4.5)),
              Math.max(14, Math.min(28, (dataArray[3] || 0) / 4)),
              Math.max(18, Math.min(28, (dataArray[4] || 0) / 3.5)),
              Math.max(14, Math.min(28, (dataArray[5] || 0) / 4)),
              Math.max(10, Math.min(28, (dataArray[6] || 0) / 4.5)),
              Math.max(8, Math.min(28, (dataArray[7] || 0) / 5)),
              Math.max(6, Math.min(28, (dataArray[8] || 0) / 6)),
            ];
            setAudioLevels(bars);
            animFrameRef.current = requestAnimationFrame(updateWave);
          };
          updateWave();
        }
      } catch (err) {
        console.warn('Web Audio visualizer initialization failed:', err);
      }

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        // Cleanup AudioContext & Animation Loop
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
        if (audioContextRef.current) {
          try { audioContextRef.current.close(); } catch {}
          audioContextRef.current = null;
        }

        const actualMime = recorder.mimeType || mimeType || 'audio/webm';
        const audioBlob = new Blob(chunks, { type: actualMime });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          const mediaKeys = getMediaFieldKeysForQIndex(currentQuestionIndex);
          if (mediaKeys) {
            dispatch(updateFeedbackResponses({ [mediaKeys.audioKey]: base64Audio }));
          }
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setMediaRecorder(recorder);
      setIsRecording(true);

      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setRecordingTimer((prev) => prev + 1);
      }, 1000);
    } catch {
      setMicError('Microphone access blocked. Please allow mic permissions in your browser to record your voice.');
    }
  };

  const stopRecording = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch {}
      audioContextRef.current = null;
    }

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsRecording(false);

    const recorder = mediaRecorderRef.current || mediaRecorder;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
      mediaRecorderRef.current = null;
      setMediaRecorder(null);
    }
  };

  const removeAudio = () => {
    if (isPlayingAudio && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
    setAudioProgress(0);
    const mediaKeys = getMediaFieldKeysForQIndex(currentQuestionIndex);
    if (mediaKeys) {
      dispatch(updateFeedbackResponses({ [mediaKeys.audioKey]: null }));
    }
  };

  const toggleAudioPlay = () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    audio.volume = 1.0;

    if (isPlayingAudio) {
      audio.pause();
      setIsPlayingAudio(false);
    } else {
      audio.currentTime = 0;
      audio
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => {
          setIsPlayingAudio(false);
        });
    }
  };

  const handleSuggestionImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const mediaKeys = getMediaFieldKeysForQIndex(currentQuestionIndex);
      if (mediaKeys) {
        dispatch(updateFeedbackResponses({ [mediaKeys.imageKey]: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeSuggestionImage = () => {
    const mediaKeys = getMediaFieldKeysForQIndex(currentQuestionIndex);
    if (mediaKeys) {
      dispatch(updateFeedbackResponses({ [mediaKeys.imageKey]: null }));
    }
  };

  // Determine if Save & Continue button should be enabled
  const getIsSaveDisabled = () => {
    if (currentQ?.type === 'choice') {
      return !feedbackResponses.userRole;
    }
    if (currentQ?.type === 'rating') {
      return !currentRatingVal;
    }
    if (currentQ?.type === 'text') {
      return false;
    }
    return false;
  };

  const renderMediaWidget = () => (
    <div className="space-y-2.5 pt-1">
      {/* MIC ERROR ALERT BANNER */}
      {micError && (
        <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-2xl text-[11px] font-semibold text-red-300 flex items-start gap-2 text-left mt-2">
          <Icon icon="ph:warning-bold" className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{micError}</span>
        </div>
      )}

      {/* RECORDING LIVE WIDGET */}
      {isRecording && (
        <div className="bg-slate-50/90 border border-slate-300 rounded-2xl p-4 text-center space-y-3 shadow-sm mt-2 text-slate-900">
          {/* Equalizer Waveform Lines */}
          <div className="flex items-center justify-center gap-1.5 h-12">
            {audioLevels.map((lvl, idx) => (
              <span
                key={idx}
                className="w-1.5 bg-slate-700 rounded-full transition-all duration-75 ease-out"
                style={{ height: `${lvl}px` }}
              />
            ))}
          </div>

          <div className="text-2xl font-black font-mono text-slate-900">
            0:{recordingTimer.toString().padStart(2, "0")}
          </div>
          <p className="text-xs font-bold text-slate-700">
            {t.bottomSheet?.listeningText || "सुन रहे हैं... दोबारा दबाकर रोकें"}
          </p>

          <button
            type="button"
            onClick={stopRecording}
            className="w-14 h-14 rounded-full bg-slate-950 hover:bg-slate-900 text-white flex items-center justify-center mx-auto shadow-lg active:scale-95 transition"
          >
            <div className="w-4 h-4 rounded-sm bg-white" />
          </button>
        </div>
      )}

      {/* RECORDED VOICE PLAYER CARD */}
      {!isRecording && currentAudioUrl && (
        <div className="p-3 bg-slate-800 border border-slate-300 rounded-2xl space-y-2 shadow-sm mt-2 text-left text-slate-900">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleAudioPlay}
                className="w-10 h-10 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center font-black shadow-md transition active:scale-95 shrink-0"
              >
                <Icon
                  icon={isPlayingAudio ? "ph:pause-fill" : "ph:play-fill"}
                  className="w-5 h-5"
                />
              </button>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Icon icon="ph:microphone-fill" className="w-3.5 h-3.5 text-slate-200" />
                  <span>Voice Note Recorded</span>
                </div>
                <div className="text-[11px] text-slate-300 font-medium">
                  {isPlayingAudio ? "Playing voice note..." : "Click play to listen"}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={removeAudio}
              title="Delete voice note"
              className="p-2 rounded-xl bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 transition border border-slate-200 cursor-pointer"
            >
              <Icon icon="ph:trash-bold" className="w-4 h-4" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-600 transition-all duration-100 rounded-full"
              style={{ width: `${audioProgress}%` }}
            />
          </div>

          <audio
            ref={audioRef}
            src={currentAudioUrl}
            onTimeUpdate={() => {
              if (audioRef.current && audioRef.current.duration) {
                const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
                setAudioProgress(pct);
              }
            }}
            onEnded={() => {
              setIsPlayingAudio(false);
              setAudioProgress(0);
            }}
            className="hidden"
          />
        </div>
      )}

      {/* ATTACHED SUGGESTION IMAGE PREVIEW */}
      {currentImageUrl && (
        <div className="relative rounded-2xl overflow-hidden border-2 border-teal-500 bg-slate-900 h-28 flex items-center justify-center shadow-md mt-2">
          <img
            src={currentImageUrl}
            alt="Suggestion Attachment"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={removeSuggestionImage}
            title="Remove photo"
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition active:scale-95 z-10"
          >
            <Icon icon="ph:x-bold" className="w-3.5 h-3.5" />
          </button>
          <div className="absolute bottom-1.5 left-2 bg-teal-950/90 text-teal-300 px-2 py-0.5 rounded-md text-[10px] font-bold border border-teal-500/40 flex items-center gap-1">
            <Icon icon="ph:image-bold" className="w-3 h-3 text-teal-400" /> Attached Photo
          </div>
        </div>
      )}

      {/* TOOLBAR BUTTONS: MIC & UPLOAD PHOTO */}
      {!isRecording && (
        <div className="grid grid-cols-2 gap-2 mt-2">
          {!currentAudioUrl && (
            <button
              type="button"
              onClick={startRecording}
              className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 hover:bg-amber-500/10 text-slate-300 hover:text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Icon icon="ph:microphone-fill" className="w-3.5 h-3.5" />
              </div>
              <span>Record Voice</span>
            </button>
          )}

          {!currentImageUrl && (
            <label className={`p-2.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-teal-500/60 hover:bg-teal-500/10 text-slate-300 hover:text-teal-300 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${currentAudioUrl ? 'col-span-2' : ''}`}>
              <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                <Icon icon="ph:camera-bold" className="w-3.5 h-3.5" />
              </div>
              <span>Upload Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleSuggestionImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      )}
    </div>
  );

  const isSaveDisabled = getIsSaveDisabled();
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      dispatch(nextQuestion());
    } else {
      dispatch(generateNewTrackingId());
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      dispatch(setCurrentStep(5)); // Proceed to Confirmation Thank You Page (Step 5)
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      dispatch(previousQuestion());
    } else {
      dispatch(setCurrentStep(3)); // Go back to OTP Verification (Step 3)
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm sm:max-w-md mx-auto"
    >
      <div className="bg-[#0B132B] border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl p-4 sm:p-5 space-y-4">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-1.5 text-amber-400">
            <Icon icon="ph:list-checks-bold" className="w-4 h-4" />
            {t.stepIndicator || 'Step'} {currentQuestionIndex + 1}
          </span>
          <span className="text-slate-400 font-medium">
            {currentQuestionIndex + 1} / {totalQuestions}
          </span>
        </div>

        {/* Progress Bar Line */}
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-teal-400 transition-all duration-300 rounded-full"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Header Card */}
        <div className="relative rounded-2xl overflow-hidden h-36 bg-slate-900 flex items-end p-4 text-left shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80"
            alt="Facility Banner"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.35] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/60 to-transparent" />

          <div className="relative z-10 w-full">
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-widest text-amber-400 uppercase mb-1">
              <Icon icon={getCategoryIcon(currentQuestionIndex)} className="w-3.5 h-3.5" />
              <span>{currentQ?.category || 'HOSPITAL CLEANLINESS'}</span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-white leading-snug">
              {currentQ?.title}
            </h2>
            {currentQ?.description && (
              <p className="text-[11px] text-slate-300 font-medium mt-1 leading-tight line-clamp-2">
                {currentQ.description}
              </p>
            )}
          </div>
        </div>

        {/* RENDER QUESTION CHOICE OPTIONS (Index 0) */}
        {currentQ?.type === 'choice' && currentQ?.options && (
          <div className="space-y-2.5 my-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = feedbackResponses.userRole === option;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => dispatch(updateFeedbackResponses({ userRole: option }))}
                  className={`w-full p-3.5 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-between transition-all duration-200 ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-md shadow-amber-500/10 scale-[1.01]'
                      : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span>{option}</span>
                  </div>
                  {isSelected ? (
                    <Icon icon="ph:check-circle-fill" className="w-5 h-5 text-amber-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* RENDER RATING QUESTIONS (Q5 - Q9) */}
        {currentQ?.type === 'rating' && (
          <div className="space-y-2.5 my-3">
            {/* Could Be Better Card */}
            <div>
              <button
                type="button"
                onClick={() => handleRatingSelect('Could Be Better')}
                className={`w-full p-3.5 rounded-2xl border text-xs sm:text-sm font-extrabold flex items-center justify-between transition-all duration-200 ${
                  currentRatingVal === 'Could Be Better'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-md shadow-amber-500/10'
                    : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                    <Icon icon="ph:warning-bold" className="w-4 h-4" />
                  </div>
                  <span>{t.ratingLabels?.couldBeBetter || 'Could Be Better'}</span>
                </div>
                {currentRatingVal === 'Could Be Better' && (
                  <Icon icon="ph:check-circle-fill" className="w-5 h-5 text-amber-400" />
                )}
              </button>
            </div>

            {/* Acceptable Card */}
            <button
              type="button"
              onClick={() => handleRatingSelect('Acceptable')}
              className={`w-full p-3.5 rounded-2xl border text-xs sm:text-sm font-extrabold flex items-center justify-between transition-all duration-200 ${
                currentRatingVal === 'Acceptable'
                  ? 'bg-teal-500/20 text-teal-300 border-teal-400 shadow-md shadow-teal-500/10'
                  : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
                  <Icon icon="ph:thumbs-up-bold" className="w-4 h-4" />
                </div>
                <span>{t.ratingLabels?.acceptable || 'Acceptable'}</span>
              </div>
              {currentRatingVal === 'Acceptable' && (
                <Icon icon="ph:check-circle-fill" className="w-5 h-5 text-teal-400" />
              )}
            </button>

            {/* Excellent Card */}
            <button
              type="button"
              onClick={() => handleRatingSelect('Excellent')}
              className={`w-full p-3.5 rounded-2xl border text-xs sm:text-sm font-extrabold flex items-center justify-between transition-all duration-200 ${
                currentRatingVal === 'Excellent'
                  ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400 shadow-md shadow-yellow-500/10'
                  : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center shrink-0 border border-yellow-500/30">
                  <Icon icon="ph:star-fill" className="w-4 h-4" />
                </div>
                <span>{t.ratingLabels?.excellent || 'Excellent'}</span>
              </div>
              {currentRatingVal === 'Excellent' && (
                <Icon icon="ph:check-circle-fill" className="w-5 h-5 text-yellow-400" />
              )}
            </button>
          </div>
        )}

        {/* RENDER TEXT INPUT QUESTIONS (FEEDBACK & GRIEVANCE) */}
        {currentQ?.type === 'text' && textInfo && (
          <div className="my-3 space-y-3 text-left">
            <div className="relative">
              <textarea
                rows={4}
                value={textInfo.value}
                onChange={(e) => textInfo.onChange(e.target.value)}
                placeholder={textInfo.placeholder}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-2xl p-3.5 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none transition"
              />
            </div>

            {/* SPECIAL FEATURES: VOICE MIC & IMAGE UPLOAD */}
            {renderMediaWidget()}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrevious}
            className="flex-1 sm:flex-initial px-3 sm:px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
          >
            <Icon icon="ph:arrow-left-bold" className="w-3.5 h-3.5" />
            <span>{t.commonButtons?.previous || 'Previous'}</span>
          </button>

          {/* Skip Button (hidden on final question) */}
          {!isLastQuestion && (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 sm:flex-initial px-3 sm:px-4 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
            >
              <span>{t.commonButtons?.skip || 'Skip Question'}</span>
              <Icon icon="ph:fast-forward-bold" className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Save & Continue / Submit Button */}
          <button
            type="button"
            disabled={isSaveDisabled}
            onClick={handleNext}
            className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all duration-200 ${
              isSaveDisabled
                ? 'bg-slate-800/80 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-60 shadow-none'
                : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-[0.98]'
            }`}
          >
            <span>
              {isLastQuestion
                ? (t.commonButtons?.submit || t.bottomSheet?.submitBtn || 'Submit')
                : (t.commonButtons?.next || 'Save & Continue')}
            </span>
            <Icon icon={isLastQuestion ? "ph:paper-plane-tilt-bold" : "ph:arrow-right-bold"} className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* COULD BE BETTER BOTTOM SHEET MODAL (Images 2, 3, 4) */}
      {currentRatingInfo && (
        <CouldBeBetterBottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          onSubmitAndNext={() => {
            setIsBottomSheetOpen(false);
            handleNext();
          }}
          categoryName={currentQ?.category || 'FEEDBACK'}
          commentsKey={currentRatingInfo.commentsKey}
          audioKey={currentMediaKeys?.audioKey || 'registrationAudioUrl'}
          imageKey={currentMediaKeys?.imageKey || 'registrationImageUrl'}
        />
      )}
    </motion.div>
  );
};


