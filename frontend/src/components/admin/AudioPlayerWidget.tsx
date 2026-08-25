import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface AudioPlayerWidgetProps {
  audioUrl: string;
  title?: string;
  compact?: boolean;
  theme?: 'amber' | 'emerald' | 'blue' | 'rose';
}

export const AudioPlayerWidget: React.FC<AudioPlayerWidgetProps> = ({
  audioUrl,
  title = "Voice Recording",
  compact = false,
  theme = "amber",
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Dynamic animation heights state for reactive waveform
  const [waveHeights, setWaveHeights] = useState<number[]>([
    20, 35, 60, 45, 80, 50, 30, 90, 75, 40, 65, 85, 30, 50, 70, 40, 85, 95, 60, 40, 25, 55, 75, 90, 60, 35, 20
  ]);

  // Theme color mappings
  const themeStyles = {
    amber: {
      border: "border-amber-500/30",
      bgCompact: "bg-amber-500/10 text-amber-300 border-amber-500/30",
      playBtnCompact: "bg-amber-500 hover:bg-amber-400 text-slate-950",
      playBtn: "bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-lg shadow-amber-500/20",
      titleText: "text-amber-400",
      waveActive: "bg-amber-400 shadow-sm shadow-amber-400/60",
      speedText: "text-amber-400 border-amber-500/30 bg-amber-500/10",
      rangeAccent: "accent-amber-500",
      wavePassed: "bg-amber-400 animate-pulse",
      waveUnplayed: "bg-amber-400/30",
      textCompact: "text-amber-300",
    },
    emerald: {
      border: "border-emerald-500/30",
      bgCompact: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
      playBtnCompact: "bg-emerald-500 hover:bg-emerald-400 text-slate-950",
      playBtn: "bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20",
      titleText: "text-emerald-400",
      waveActive: "bg-emerald-400 shadow-sm shadow-emerald-400/60",
      speedText: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      rangeAccent: "accent-emerald-500",
      wavePassed: "bg-emerald-400 animate-pulse",
      waveUnplayed: "bg-emerald-400/30",
      textCompact: "text-emerald-300",
    },
    blue: {
      border: "border-blue-500/30",
      bgCompact: "bg-blue-500/10 text-blue-300 border-blue-500/30",
      playBtnCompact: "bg-blue-500 hover:bg-blue-400 text-white",
      playBtn: "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/20",
      titleText: "text-blue-400",
      waveActive: "bg-blue-400 shadow-sm shadow-blue-400/60",
      speedText: "text-blue-400 border-blue-500/30 bg-blue-500/10",
      rangeAccent: "accent-blue-500",
      wavePassed: "bg-blue-400 animate-pulse",
      waveUnplayed: "bg-blue-400/30",
      textCompact: "text-blue-300",
    },
    rose: {
      border: "border-rose-500/30",
      bgCompact: "bg-rose-500/10 text-rose-300 border-rose-500/30",
      playBtnCompact: "bg-rose-500 hover:bg-rose-400 text-white",
      playBtn: "bg-gradient-to-r from-rose-500 to-rose-400 text-white shadow-lg shadow-rose-500/20",
      titleText: "text-rose-400",
      waveActive: "bg-rose-400 shadow-sm shadow-rose-400/60",
      speedText: "text-rose-400 border-rose-500/30 bg-rose-500/10",
      rangeAccent: "accent-rose-500",
      wavePassed: "bg-rose-400 animate-pulse",
      waveUnplayed: "bg-rose-400/30",
      textCompact: "text-rose-300",
    },
  };

  const t = themeStyles[theme] || themeStyles.amber;

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, [audioUrl]);

  // Waveform animation effect when audio plays
  useEffect(() => {
    let animationInterval: any;
    if (isPlaying) {
      animationInterval = setInterval(() => {
        setWaveHeights((prev) =>
          prev.map((val) => {
            const delta = (Math.random() - 0.5) * 40;
            return Math.max(15, Math.min(95, val + delta));
          })
        );
      }, 100);
    }
    return () => clearInterval(animationInterval);
  }, [isPlaying]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Audio playback error:', err));
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

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      if (val === 0) setIsMuted(true);
      else setIsMuted(false);
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
        className={`inline-flex items-center gap-2 border rounded-full px-3 py-1 text-xs font-bold shadow-sm select-none ${t.bgCompact}`}
      >
        <button
          type="button"
          onClick={togglePlay}
          className={`w-6 h-6 rounded-full flex items-center justify-center transition shrink-0 cursor-pointer ${t.playBtnCompact}`}
        >
          <Icon icon={isPlaying ? "ph:pause-fill" : "ph:play-fill"} className="w-3.5 h-3.5" />
        </button>

        {/* Animated Waveform indicator */}
        <div className="flex items-center gap-0.5 h-3">
          {waveHeights.slice(0, 8).map((h, i) => (
            <span
              key={i}
              className={`w-0.5 rounded-full transition-all duration-150 ${
                isPlaying ? t.wavePassed : t.waveUnplayed
              }`}
              style={{
                height: isPlaying ? `${Math.floor(h * 0.15 + 4)}px` : '4px',
              }}
            />
          ))}
        </div>

        <span className={`text-[11px] font-mono font-extrabold ${t.textCompact}`}>
          {isPlaying ? formatTime(currentTime) : "Voice Note"}
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
      className={`bg-slate-900/90 backdrop-blur-md border ${t.border} rounded-2xl p-4 text-white shadow-xl space-y-3.5 select-none`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition cursor-pointer active:scale-95 shrink-0 ${t.playBtn}`}
          >
            <Icon icon={isPlaying ? "ph:pause-fill" : "ph:play-fill"} className="w-6 h-6" />
          </button>
          <div>
            <div className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${t.titleText}`}>
              <Icon icon="ph:microphone-fill" className="w-4 h-4" />
              <span>{title}</span>
            </div>
            <div className="text-xs text-slate-400 font-medium">
              {isPlaying ? "Playing Audio Feedback..." : "Click play to listen to patient recording"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Speed Button */}
          <button
            type="button"
            onClick={handleSpeedToggle}
            className={`px-2.5 py-1 rounded-xl border text-xs font-extrabold transition cursor-pointer ${t.speedText}`}
            title="Playback Speed"
          >
            {playbackRate}x
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-xl px-2.5 py-1">
            <button type="button" onClick={toggleMute} className="text-slate-400 hover:text-white cursor-pointer">
              <Icon icon={isMuted || volume === 0 ? "ph:speaker-x-bold" : "ph:speaker-high-bold"} className="w-4 h-4" />
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-14 bg-slate-700 h-1 rounded-lg cursor-pointer accent-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Reactive Waveform Bars */}
      <div className="flex items-center justify-between gap-1 h-9 bg-slate-950/80 rounded-xl px-3 border border-slate-800">
        {waveHeights.map((val, idx) => {
          const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
          const barPct = (idx / waveHeights.length) * 100;
          const isPassed = barPct <= progressPct;

          return (
            <span
              key={idx}
              className={`w-1 rounded-full transition-all duration-150 ${
                isPassed
                  ? t.waveActive
                  : 'bg-slate-800'
              }`}
              style={{
                height: isPlaying
                  ? `${Math.max(6, Math.min(28, val * 0.28))}px`
                  : `${Math.max(6, Math.min(22, val * 0.18))}px`,
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
          className={`w-full bg-slate-800 h-1.5 rounded-lg cursor-pointer ${t.rangeAccent}`}
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
