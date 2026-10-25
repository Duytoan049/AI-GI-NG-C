/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { splitIntoWords, estimateReadingTime } from '../utils/textParser';
import { SubjectType, GradeLevel } from '../types';
import {
  Volume2,
  Clock,
  Info,
  BookOpen,
} from 'lucide-react';

interface KaraokeReaderProps {
  sentences: string[];
  currentSentenceIndex: number;
  currentWordIndex: number;
  onSentenceClick: (index: number) => void;
  onWordClick: (wordText: string, cleanWord: string) => void;
  subject: SubjectType;
  gradeLevel: GradeLevel;
  isPlaying: boolean;
  rate: number;
  rawText: string;
  onUpdateRawText: (newText: string) => void;
  readingTips?: string;
}

export const KaraokeReader: React.FC<KaraokeReaderProps> = ({
  sentences,
  currentSentenceIndex,
  currentWordIndex,
  onSentenceClick,
  onWordClick,
  gradeLevel,
  isPlaying,
  rate,
  rawText,
  readingTips,
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>(
    gradeLevel === 'tieu-hoc' ? 'large' : 'normal'
  );

  const readingTime = estimateReadingTime(rawText, rate);

  const fontSizeClasses = {
    normal: 'text-base sm:text-lg leading-relaxed sm:leading-loose',
    large: 'text-lg sm:text-xl leading-loose tracking-wide',
    xlarge: 'text-xl sm:text-2xl leading-loose tracking-wider font-medium',
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl shadow-xs overflow-hidden mb-6">
      {/* Top toolbar */}
      <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
          <span className="flex items-center gap-1.5 text-blue-700">
            <BookOpen className="w-4 h-4" />
            <span>Chế độ Luyện Đọc & Theo Dõi Karaoke</span>
          </span>
          <span className="text-slate-300">•</span>
          <span>{sentences.length} câu</span>
          <span className="text-slate-300">•</span>
          <span>{rawText.trim().split(/\s+/).filter(Boolean).length} từ</span>
        </div>

        {/* Font size selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400">Cỡ chữ:</span>
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFontSize('normal')}
              className={`px-2.5 py-1 rounded-lg ${
                fontSize === 'normal'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Cỡ chữ chuẩn (THPT)"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize('large')}
              className={`px-2.5 py-1 rounded-lg ${
                fontSize === 'large'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Cỡ chữ to (THCS & Tiểu học)"
            >
              A+
            </button>
            <button
              type="button"
              onClick={() => setFontSize('xlarge')}
              className={`px-2.5 py-1 rounded-lg ${
                fontSize === 'xlarge'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Cỡ chữ rất to (Lớp 1 - 2)"
            >
              A++
            </button>
          </div>
        </div>
      </div>

      {/* Reading Tips Alert if available */}
      {readingTips && (
        <div className="bg-sky-50/80 border-b border-sky-100 px-4 py-2.5 flex items-start gap-2.5 text-xs text-sky-900">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold text-sky-950">Gợi ý cách đọc: </span>
            <span className="font-medium">{readingTips}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-5 sm:p-7 min-h-[240px]">
        {sentences.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <p className="text-sm">Chưa có văn bản bài đọc. Hãy nhập hoặc dán nội dung ở khung phía trên!</p>
          </div>
        ) : (
          <div className={`space-y-4 ${fontSizeClasses[fontSize]}`}>
            {sentences.map((sentence, sIdx) => {
              const isCurrentSentence = sIdx === currentSentenceIndex;
              const wordTokens = splitIntoWords(sentence);
              let currentWordCount = -1;

              return (
                <div
                  key={sIdx}
                  onClick={() => onSentenceClick(sIdx)}
                  className={`p-3.5 rounded-2xl transition-all cursor-pointer select-text relative group ${
                    isCurrentSentence
                      ? 'bg-blue-50/80 border-l-4 border-blue-600 shadow-xs ring-1 ring-blue-500/20'
                      : 'hover:bg-slate-50/80 border-l-4 border-transparent'
                  }`}
                >
                  {/* Sentence play icon on hover */}
                  <span
                    className={`absolute -left-2.5 top-3.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded-full shadow-xs border border-slate-200 text-blue-600 ${
                      isCurrentSentence ? 'opacity-100' : ''
                    }`}
                    title="Bấm để đọc câu này"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </span>

                  {wordTokens.map((token, wIdx) => {
                    if (token.isWord) {
                      currentWordCount++;
                    }
                    const isCurrentWord =
                      isCurrentSentence &&
                      isPlaying &&
                      currentWordIndex >= 0 &&
                      currentWordCount === currentWordIndex;

                    if (!token.isWord) {
                      return <span key={wIdx}>{token.text}</span>;
                    }

                    return (
                      <span
                        key={wIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          onWordClick(token.text, token.clean);
                        }}
                        className={`inline-block px-1 py-0.5 rounded-lg mx-0.5 transition-all cursor-pointer ${
                          isCurrentWord
                            ? 'bg-amber-300 text-slate-900 font-extrabold scale-105 shadow-xs'
                            : isCurrentSentence
                            ? 'text-slate-950 hover:bg-blue-200/70 font-semibold'
                            : 'text-slate-800 hover:bg-slate-200/70'
                        }`}
                        title="Bấm để xem phiên âm / đánh vần & nghe riêng từ này"
                      >
                        {token.text}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer instruction note */}
      <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
        <span>💡 Bấm vào từ bất kỳ để tra phiên âm IPA / cách đánh vần và nghe phát âm riêng từ đó.</span>
        <span className="hidden sm:inline text-slate-400">Bấm vào câu bất kỳ để đọc từ câu đó</span>
      </div>
    </div>
  );
};
