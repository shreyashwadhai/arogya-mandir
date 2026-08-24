import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { updateFeedbackResponses } from "../redux/features/journeySlice";
import { translations } from "../translations/languages";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

interface CouldBeBetterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitAndNext: () => void;
  categoryName: string;
  commentsKey: string;
  audioKey: string;
  imageKey: string;
}

export const CouldBeBetterBottomSheet: React.FC<
  CouldBeBetterBottomSheetProps
> = ({
  isOpen,
  onClose,
  onSubmitAndNext,
  categoryName,
  commentsKey,
  audioKey,
  imageKey,
}) => {
  const dispatch = useDispatch();
  const selectedLanguage = useSelector(
    (state: RootState) => state.journey.selectedLanguage,
  );
  const feedbackResponses = useSelector(
    (state: RootState) => state.journey.feedbackResponses,
  );

  const t = translations[selectedLanguage] || translations.en;
  const b = t.bottomSheet || translations.en.bottomSheet;

  // Selected tab: 'speak' | 'type' | 'photo' | null
  const [activeTab, setActiveTab] = useState<"speak" | "type" | "photo" | null>(
    null,
  );
  const [textVal, setTextVal] = useState(
    (feedbackResponses as any)[commentsKey] || "",
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [micError, setMicError] = useState<string | null>(null);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const [audioLevels, setAudioLevels] = useState<number[]>([
    10, 18, 26, 32, 26, 18, 10,
  ]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Audio Playback State & Ref
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentAudioUrl = (feedbackResponses as any)[audioKey] as string | null;
  const currentImageUrl = (feedbackResponses as any)[imageKey] as string | null;

  useEffect(() => {
    setTextVal((feedbackResponses as any)[commentsKey] || "");
  }, [commentsKey, feedbackResponses]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(null);
    }
  }, [isOpen]);

  // Clean up recording on unmount or tab switch
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  const getSupportedMimeType = () => {
    if (typeof MediaRecorder === "undefined") return "";
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/aac",
      "audio/wav",
    ];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return "";
  };

  const startRecording = async () => {
    setMicError(null);
    setRecordingTimer(0);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicError("Voice recording is not supported on this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      const chunks: Blob[] = [];

      try {
        const AudioCtx =
          window.AudioContext || (window as any).webkitAudioContext;
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
            const bars = [
              Math.max(8, Math.min(36, (dataArray[1] || 0) / 4)),
              Math.max(12, Math.min(36, (dataArray[2] || 0) / 3.5)),
              Math.max(18, Math.min(36, (dataArray[3] || 0) / 3)),
              Math.max(26, Math.min(36, (dataArray[4] || 0) / 2.5)),
              Math.max(18, Math.min(36, (dataArray[5] || 0) / 3)),
              Math.max(12, Math.min(36, (dataArray[6] || 0) / 3.5)),
              Math.max(8, Math.min(36, (dataArray[7] || 0) / 4)),
            ];
            setAudioLevels(bars);
            animFrameRef.current = requestAnimationFrame(updateWave);
          };
          updateWave();
        }
      } catch (err) {
        console.warn("Audio analyser error:", err);
      }

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
        if (audioContextRef.current) {
          try {
            audioContextRef.current.close();
          } catch {}
          audioContextRef.current = null;
        }

        const actualMime = recorder.mimeType || mimeType || "audio/webm";
        const audioBlob = new Blob(chunks, { type: actualMime });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          dispatch(updateFeedbackResponses({ [audioKey]: base64Audio }));
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);

      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setRecordingTimer((prev) => prev + 1);
      }, 1000);
    } catch {
      setMicError(
        "Microphone access blocked. Please allow mic permissions in your browser.",
      );
    }
  };

  const stopRecording = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsRecording(false);

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      dispatch(updateFeedbackResponses({ [imageKey]: result }));
    };
    reader.readAsDataURL(file);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSaveAndNext = () => {
    const combinedText =
      selectedTags.length > 0
        ? `[Tags: ${selectedTags.join(", ")}] ${textVal}`
        : textVal;
    dispatch(updateFeedbackResponses({ [commentsKey]: combinedText }));
    onSubmitAndNext();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-10 flex items-end justify-center bg-slate-950/65 backdrop-blur-lg px-1">
        {/* Backdrop overlay click to close modal */}
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={onClose}
          title="Click to close"
        />

        {/* Bottom Sheet Card (leaves a top gap showing blurred background, drag down to close) */}
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.8 }}
          onDragEnd={(_e, info) => {
            if (info.offset.y > 90 || info.velocity.y > 250) {
              onClose();
            }
          }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          className="relative z-50 w-full max-w-lg bg-white rounded-t-3xl p-5 sm:p-6 text-left shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar mb-0"
        >
          {/* Top Drag Handle */}
          <div className="w-12 h-1 bg-slate-300 hover:bg-slate-400 rounded-full mx-auto mb-3 cursor-grab active:cursor-grabbing transition" />

          {/* Badge Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span>{categoryName}</span>
          </div>

          {/* Header Titles */}
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {b.title || "क्या दिक्कत हुई?"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {b.subtitle ||
                "जैसे चाहें बताइए। यह वैकल्पिक है, पर इससे समस्या जल्दी ठीक होती है।"}
            </p>
          </div>

          {/* 3 INPUT OPTIONS LIST (Matching Images 2, 3, 4) */}
          <div className="space-y-3">
            {/* OPTION 1: TYPE / WRITE MESSAGE */}
            <div
              onClick={() => setActiveTab(activeTab === "type" ? null : "type")}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                activeTab === "type"
                  ? "border-slate-700 bg-slate-50/40 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    activeTab === "type"
                      ? "bg-slate-700 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <Icon icon="ph:list-checks-bold" className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    {b.typeOption || "लिखकर बताएँ"}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {b.typeDesc || "Type a short message"}
                  </p>
                </div>
              </div>

              {/* WRITE TEXT CONTENT (When activeTab === 'type') */}
              {activeTab === "type" && (
                <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-3">
                  {/* Quick Tags */}
                  <div className="flex flex-wrap gap-2">
                    {(
                      t.improvementTags || [
                        "लंबी लाइन",
                        "स्टाफ का व्यवहार",
                        "दवा उपलब्ध नहीं",
                        "साफ-सफाई",
                        "बहुत इंतज़ार",
                        "ठीक से समझाया नहीं",
                      ]
                    ).map((tag, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-extrabold border transition ${
                          selectedTags.includes(tag)
                            ? "bg-slate-700 text-white border-slate-700 shadow-sm"
                            : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  {/* Textarea */}
                  <textarea
                    rows={3}
                    value={textVal}
                    onChange={(e) => setTextVal(e.target.value)}
                    placeholder={
                      b.textPlaceholder ||
                      "जैसे: दवा काउंटर पर 40 मिनट लाइन में लगना पड़ा..."
                    }
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-600 resize-none"
                  />
                </div>
              )}
            </div>

            {/* OPTION 2: SPEAK / RECORD VOICE */}
            <div
              onClick={() => setActiveTab(activeTab === "speak" ? null : "speak")}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                activeTab === "speak"
                  ? "border-slate-700 bg-slate-50/40 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    activeTab === "speak"
                      ? "bg-slate-700 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <Icon icon="ph:microphone-fill" className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    {b.speakOption || "बोलकर बताएँ"}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {b.speakDesc || "Record a voice note."}
                  </p>
                </div>
              </div>

              {/* VOICE RECORDING CONTENT (When activeTab === 'speak') */}
              {activeTab === "speak" && (
                <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-4">
                  {micError && (
                    <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                      {micError}
                    </p>
                  )}

                  {!isRecording && !currentAudioUrl && (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="w-full py-3.5 bg-slate-700 hover:bg-slate-800 text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 shadow-md transition"
                    >
                      <Icon icon="ph:microphone-bold" className="w-4 h-4" />
                      <span>{b.speakOption || "बोलकर बताएँ"}</span>
                    </button>
                  )}

                  {isRecording && (
                    <div className="bg-slate-50/80 border border-slate-300 rounded-2xl p-4 text-center space-y-3 shadow-inner">
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
                      <p className="text-xs font-bold text-slate-800">
                        {b.listeningText || "सुन रहे हैं... दोबारा दबाकर रोकें"}
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

                  {currentAudioUrl && (
                    <div className="p-3 bg-slate-50 border border-slate-300 rounded-2xl space-y-2 shadow-sm text-left">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              if (!audioRef.current) return;
                              if (isPlayingAudio) {
                                audioRef.current.pause();
                                setIsPlayingAudio(false);
                              } else {
                                audioRef.current.play();
                                setIsPlayingAudio(true);
                              }
                            }}
                            className="w-10 h-10 rounded-xl bg-slate-700 hover:bg-slate-800 text-white flex items-center justify-center font-black shadow-md transition active:scale-95 shrink-0"
                          >
                            <Icon
                              icon={
                                isPlayingAudio
                                  ? "ph:pause-fill"
                                  : "ph:play-fill"
                              }
                              className="w-5 h-5"
                            />
                          </button>
                          <div className="text-left">
                            <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                              <Icon
                                icon="ph:microphone-fill"
                                className="w-3.5 h-3.5 text-slate-700"
                              />
                              <span>Voice Note Recorded</span>
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium">
                              {isPlayingAudio
                                ? "Playing voice note..."
                                : "Click play to listen"}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (isPlayingAudio && audioRef.current) {
                              audioRef.current.pause();
                              setIsPlayingAudio(false);
                            }
                            setAudioProgress(0);
                            dispatch(
                              updateFeedbackResponses({ [audioKey]: null }),
                            );
                          }}
                          title="Delete voice note"
                          className="p-2 rounded-xl bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 transition border border-slate-200"
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
                            const pct =
                              (audioRef.current.currentTime /
                                audioRef.current.duration) *
                              100;
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
                </div>
              )}
            </div>

            {/* OPTION 3: ATTACH PHOTO */}
            <div
              onClick={() => setActiveTab(activeTab === "photo" ? null : "photo")}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                activeTab === "photo"
                  ? "border-slate-700 bg-slate-50/40 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    activeTab === "photo"
                      ? "bg-slate-700 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <Icon icon="ph:camera-bold" className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    {b.photoOption || "फोटो भेजें"}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {b.photoDesc || "Upload a photo of the issue"}
                  </p>
                </div>
              </div>

              {/* PHOTO CONTENT (When activeTab === 'photo') */}
              {activeTab === "photo" && (
                <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-3">
                  {currentImageUrl ? (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-300 h-32 flex items-center justify-center">
                      <img
                        src={currentImageUrl}
                        alt="Attachment"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            updateFeedbackResponses({ [imageKey]: null }),
                          )
                        }
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow"
                      >
                        <Icon icon="ph:x-bold" className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-300 hover:border-slate-600 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition bg-white">
                      <Icon
                        icon="ph:camera-bold"
                        className="w-8 h-8 text-slate-400 mb-1"
                      />
                      <span className="text-xs font-black text-slate-900">
                        {b.photoUploadText || "कैमरा खोलें या फोटो चुनें"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                        {b.photoLimitText || "JPG or PNG · up to 5MB"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS (Skip vs Submit) */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                onClose();
                onSubmitAndNext();
              }}
              className="w-full py-3.5 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-800 text-sm font-extrabold transition"
            >
              {b.skipBtn || "छोड़ें"}
            </button>

            <button
              type="button"
              onClick={handleSaveAndNext}
              className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-extrabold shadow-md transition"
            >
              {b.submitBtn || "भेजें"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CouldBeBetterBottomSheet;
