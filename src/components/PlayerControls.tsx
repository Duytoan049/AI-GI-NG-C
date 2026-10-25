/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  RotateCcw,
  Layers,
  Volume2,
  VolumeX,
  Sparkles,
  Download,
  Loader2,
  Repeat,
  Sliders,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { SpeechEngine, RepeatMode, EducationalVoiceProfile } from '../types';

interface PlayerControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReplayCurrentSentence: () => void;
  onReplayCurrentParagraph: () => void;
  currentSentenceIndex: number;
  totalSentences: number;
  rate: number;
  setRate: (rate: number) => void;
  pitch: number;
  setPitch: (pitch: number) => void;
  volume: number;
  setVolume: (vol: number) => void;
  repeatMode: RepeatMode;
  setRepeatMode: (mode: RepeatMode) => void;
  selectedProfile: EducationalVoiceProfile;
  engine: SpeechEngine;
  setEngine: (engine: SpeechEngine) => void;
  geminiAudioUrl: string | null;
  isGeneratingGemini: boolean;
  onGenerateGeminiAudio: () => void;
  fullText: string;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  isPaused,
  onPlay,
  onPause,
  onStop,
  onNext,
  onPrev,
  onReplayCurrentSentence,
  onReplayCurrentParagraph,
  currentSentenceIndex,
  totalSentences,
  rate,
  setRate,
  pitch,
  setPitch,
  volume,
  setVolume,
  repeatMode,
  setRepeatMode,
  selectedProfile,
  engine,
  setEngine,
  geminiAudioUrl,
  isGeneratingGemini,
  onGenerateGeminiAudio,
}) => {
  const [isTrayExpanded, setIsTrayExpanded] = useState(false);

  const speedOptions = [
    { label: '0.5x', icon: '🐢', value: 0.5 },
    { label: '0.75x', icon: '🦥', value: 0.75 },
    { label: '0.85x', icon: '🚶', value: 0.85 },
    { label: '1x', icon: '🏃', value: 1.0 },
    { label: '1.25x', icon: '⚡', value: 1.25 },
    { label: '1.5x', icon: '🚀', value: 1.5 },
  ];

  const repeatOptions: Array<{ mode: RepeatMode; label: string; icon: string }> = [
    { mode: 'none', label: '1 lần', icon: '➡️' },
    { mode: 'sentence-2x', label: 'Lặp 2 lần', icon: '2️⃣' },
    { mode: 'sentence-3x', label: 'Lặp 3 lần', icon: '3️⃣' },
    { mode: 'sentence-infinite', label: 'Lặp câu liên tục', icon: '🔂' },
    { mode: 'paragraph-loop', label: 'Lặp cả đoạn', icon: '🔁' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-blue-200 shadow-[0_-8px_32px_rgba(0,0,0,0.12)] transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
        {/* Top Mini Bar: Progress, Engine Toggle, Voice Badge & Expand Tray Toggle */}
        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100 text-xs">
          {/* Engine Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl">
            <button
              type="button"
              onClick={() => setEngine('web-speech')}
              className={`px-2 sm:px-3 py-1 rounded-lg font-bold text-[11px] sm:text-xs transition-all flex items-center gap-1 ${
                engine === 'web-speech'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>⚡</span>
              <span className="hidden sm:inline">Giọng máy trực tiếp (Karaoke mượt)</span>
              <span className="sm:hidden">Trực tiếp</span>
            </button>
            <button
              type="button"
              onClick={() => setEngine('gemini-tts')}
              className={`px-2 sm:px-3 py-1 rounded-lg font-bold text-[11px] sm:text-xs transition-all flex items-center gap-1 ${
                engine === 'gemini-tts'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span className="hidden sm:inline">Giọng đọc AI Diễn Cảm</span>
              <span className="sm:hidden">Giọng AI</span>
            </button>
          </div>

          {/* Active Voice & Progress Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-[11px] sm:text-xs">
              <span className="text-base">{selectedProfile.avatar}</span>
              <span className="font-bold text-blue-700">{selectedProfile.name}</span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-slate-500 font-bold">
                Câu {totalSentences > 0 ? currentSentenceIndex + 1 : 0}/{totalSentences}
              </span>
            </div>

            {/* Expand / Collapse Tray button */}
            <button
              type="button"
              onClick={() => setIsTrayExpanded(!isTrayExpanded)}
              className="p-1 sm:px-2 sm:py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] font-semibold flex items-center gap-1"
              title="Mở rộng tùy chỉnh lặp lại, âm lượng, tải audio"
            >
              <Sliders className="w-3 h-3 text-blue-600" />
              <span className="hidden md:inline">Tùy chỉnh thêm</span>
              {isTrayExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Main Controls Row: Big Buttons, Replay, Speed */}
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          {/* Left: Playback Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Prev Sentence */}
            <button
              type="button"
              onClick={onPrev}
              disabled={currentSentenceIndex <= 0}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center shrink-0"
              title="Lùi 1 câu"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Main Play / Pause Button */}
            {isPlaying && !isPaused ? (
              <button
                type="button"
                onClick={onPause}
                className="px-5 sm:px-7 h-11 sm:h-13 rounded-xl sm:rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-amber-500/25 active:scale-95 transition-all flex items-center gap-2"
                title="Tạm dừng đọc"
              >
                <Pause className="w-5 h-5 fill-current" />
                <span>Tạm dừng</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onPlay}
                disabled={totalSentences === 0}
                className="px-5 sm:px-7 h-11 sm:h-13 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-600/30 active:scale-95 transition-all flex items-center gap-2"
                title="Bắt đầu đọc"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{isPaused ? 'Tiếp tục đọc' : 'Bắt đầu đọc'}</span>
              </button>
            )}

            {/* Stop Button */}
            <button
              type="button"
              onClick={onStop}
              disabled={!isPlaying && !isPaused}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl border-2 border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center shrink-0"
              title="Dừng hẳn"
            >
              <Square className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current" />
            </button>

            {/* Next Sentence */}
            <button
              type="button"
              onClick={onNext}
              disabled={currentSentenceIndex >= totalSentences - 1}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center shrink-0"
              title="Tiến 1 câu"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Center: Replay sentence & paragraph */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={onReplayCurrentSentence}
              className="px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 font-bold text-xs sm:text-xs transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
              title="Đọc lại câu hiện tại"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đọc lại câu này</span>
            </button>

            <button
              type="button"
              onClick={onReplayCurrentParagraph}
              className="px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-purple-50 border border-purple-200 hover:bg-purple-100 text-purple-700 font-bold text-xs sm:text-xs transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 hidden sm:flex"
              title="Đọc lại toàn bộ đoạn văn hiện tại"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Đọc lại đoạn này</span>
            </button>
          </div>

          {/* Right: Quick Speed Selector Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
            {speedOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRate(opt.value)}
                className={`px-2 sm:px-2.5 py-1 sm:py-1.5 text-xs font-bold rounded-lg transition-all ${
                  rate === opt.value
                    ? 'bg-blue-600 text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title={`Tốc độ đọc ${opt.label}`}
              >
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Expandable Tray: Repeat modes, Audio wave, Volume, Pitch, AI Audio */}
        {isTrayExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-200 space-y-3 animate-in fade-in duration-150">
            {/* Repeat Modes Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-indigo-50/70 p-2.5 rounded-2xl border border-indigo-100">
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-indigo-600" />
                <span>Chế độ Lặp:</span>
              </span>
              <div className="flex items-center gap-1 flex-wrap">
                {repeatOptions.map((item) => (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => setRepeatMode(item.mode)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                      repeatMode === item.mode
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                        : 'bg-white text-indigo-900 border-indigo-200 hover:bg-indigo-100'
                    }`}
                  >
                    <span>{item.icon} {item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fine tuning: Pitch & Volume & AI actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
              {/* Pitch */}
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Cao độ (Pitch):</span>
                  <span className="text-blue-600">{pitch}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Volume */}
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Âm lượng:</span>
                  <span className="text-blue-600">{Math.round(volume * 100)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <Volume2 className="w-3.5 h-3.5 text-slate-700" />
                </div>
              </div>

              {/* Gemini Audio Actions */}
              <div className="flex items-center gap-2 justify-end">
                {engine === 'gemini-tts' && (
                  <button
                    type="button"
                    onClick={onGenerateGeminiAudio}
                    disabled={isGeneratingGemini}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                  >
                    {isGeneratingGemini ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    )}
                    <span>Tạo WAV AI</span>
                  </button>
                )}

                {geminiAudioUrl && (
                  <a
                    href={geminiAudioUrl}
                    download="EduVoice.wav"
                    className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 transition-colors"
                    title="Tải audio file (.wav)"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {geminiAudioUrl && (
              <audio
                src={geminiAudioUrl}
                controls
                className="w-full h-8 rounded-lg"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
