/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GradeLevel = 'tieu-hoc' | 'thcs' | 'thpt';
export type SubjectType = 'tieng-viet' | 'tieng-anh';
export type ActiveTab = 'reader' | 'dictation' | 'recorder' | 'library';
export type SpeechEngine = 'web-speech' | 'gemini-tts';
export type Gender = 'female' | 'male';

export type RepeatMode =
  | 'none' // Đọc 1 lần
  | 'sentence-2x' // Lặp câu 2 lần
  | 'sentence-3x' // Lặp câu 3 lần
  | 'sentence-infinite' // Lặp câu liên tục
  | 'paragraph-loop'; // Lặp cả đoạn văn

export interface EducationalVoiceProfile {
  id: string;
  name: string;
  gender: Gender;
  accent: 'vi-bac' | 'vi-nam' | 'en-us' | 'en-uk' | 'en-au';
  language: 'vi' | 'en';
  role: string; // e.g., 'Cô giáo Mai (Bắc)', 'Thầy Tuấn (Bắc)', 'Teacher Emma (US)', etc.
  description: string;
  avatar: string; // Emoji avatar
  pitchOffset: number; // Applied to synthesis pitch
  rateMultiplier: number;
  engine: 'web-speech' | 'gemini-tts' | 'both';
  geminiVoiceName?: string; // e.g. 'Kore' or 'Puck'
}

export interface VoiceOption {
  id: string;
  name: string;
  lang: string;
  isDefault?: boolean;
  source: 'native' | 'gemini';
}

export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  currentSentenceIndex: number;
  currentWordIndex: number;
  totalSentences: number;
  engine: SpeechEngine;
  speed: number;
  pitch: number;
  volume: number;
  selectedVoice: string;
}

export interface WordPhoneticDetail {
  word: string;
  ipa?: string;
  partOfSpeech?: string;
  meaning?: string;
  amDau?: string;
  van?: string;
  thanhDieu?: string;
  danhVan?: string;
}
