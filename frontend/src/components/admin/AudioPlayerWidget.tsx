import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface AudioPlayerWidgetProps {
  audioUrl: string;
  title?: string;
  compact?: boolean;
}

export const AudioPlayerWidget: React.FC<AudioPlayerWidgetProps> = ({
  audioUrl,
  title = "Voice Recording",
  compact = false,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, [audioUrl]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => console.log('Audio playback error:', err));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const targetTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const handleSpeedToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rates = [1, 1.25, 1.5, 2];
    const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
    const newRate = rates[nextIndex];
    setPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (compact) {
    return (
      <div 
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-700 rounded-full px-3 py-1 text-xs font-bold shadow-sm"
      >
        <button
          type="button"
          onClick={togglePlay}
          className="w-6 h-6 rounded-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center transition shrink-0"
        >
          <Icon icon={isPlaying ? "ph:pause-fill" : "ph:play-fill"} className="w-3.5 h-3.5" />
        </button>

        {/* Animated Waveform indicator */}
        <div className="flex items-center gap-0.5 h-3">
          {[12, 18, 24, 16, 20, 10].map((h, i) => (
            <span
              key={i}
              className={`w-0.5 rounded-full transition-all duration-200 ${
                isPlaying ? 'bg-amber-600 animate-pulse' : 'bg-amber-400/60'
              }`}
              style={{
                height: isPlaying ? `${Math.floor(Math.random() * 12 + 6)}px` : `${h / 2}px`,
              }}
            />
          ))}
        </div>

        <span className="text-[11px] font-mono text-amber-900 font-extrabold">
          {isPlaying ? formatTime(currentTime) : "Voice Log"}
        </span>

        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      </div>
    );
  }

  return (
    <div 
      onClick={(e) => e.stopPropagation()}
      className="bg-slate-900 border border-amber-500/30 rounded-2xl p-4 text-white shadow-lg space-y-3"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="w-12 h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20 active:scale-95 transition shrink-0"
          >
            <Icon icon={isPlaying ? "ph:pause-fill" : "ph:play-fill"} className="w-6 h-6" />
          </button>
          <div>
            <div className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Icon icon="ph:microphone-fill" className="w-4 h-4 text-amber-400" />
              <span>{title}</span>
            </div>
            <div className="text-xs text-slate-400 font-medium">
              {isPlaying ? "Playing Audio Note..." : "Click play to listen to patient voice"}
            </div>
          </div>
        </div>

        {/* Speed button */}
        <button
          type="button"
          onClick={handleSpeedToggle}
          className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 text-xs font-extrabold hover:bg-slate-700 transition"
        >
          {playbackRate}x
        </button>
      </div>

      {/* Waveform Visualization Bars */}
      <div className="flex items-center justify-between gap-1 h-8 bg-slate-950/80 rounded-xl px-3 border border-slate-800">
        {[20, 35, 60, 45, 80, 50, 30, 90, 75, 40, 65, 85, 30, 50, 70, 40, 85, 95, 60, 40, 25, 55, 75, 90, 60, 35, 20].map((val, idx) => {
          const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
          const barPct = (idx / 27) * 100;
          const isPassed = barPct <= progressPct;

          return (
            <span
              key={idx}
              className={`w-1 rounded-full transition-all duration-150 ${
                isPassed
                  ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                  : 'bg-slate-800'
              }`}
              style={{
                height: isPlaying
                  ? `${Math.max(6, Math.min(26, (val * (Math.random() * 0.5 + 0.75))))}px`
                  : `${Math.max(6, Math.min(24, val * 0.25))}px`,
              }}
            />
          );
        })}
      </div>

      {/* Seekbar & Timer */}
      <div className="space-y-1">
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
        />
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};
