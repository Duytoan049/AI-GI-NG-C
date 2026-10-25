/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { calculateDictationScore, DictationResult } from '../utils/textParser';
import {
  Volume2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Award,
  ArrowRight,
  HelpCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

interface DictationPracticeProps {
  currentSentence: string;
  sentenceIndex: number;
  totalSentences: number;
  onPlaySentence: (text: string) => void;
  onNextSentence: () => void;
  onPrevSentence: () => void;
  rate: number;
}

export const DictationPractice: React.FC<DictationPracticeProps> = ({
  currentSentence,
  sentenceIndex,
  totalSentences,
  onPlaySentence,
  onNextSentence,
  onPrevSentence,
  rate,
}) => {
  const [typedInput, setTypedInput] = useState('');
  const [result, setResult] = useState<DictationResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [repeatCount, setRepeatCount] = useState(0);

  const handlePlay = () => {
    onPlaySentence(currentSentence);
    setRepeatCount((prev) => prev + 1);
  };

  const handleCheck = () => {
    if (!typedInput.trim()) return;
    const evaluation = calculateDictationScore(currentSentence, typedInput);
    setResult(evaluation);
  };

  const handleResetForNext = (direction: 'next' | 'prev') => {
    setTypedInput('');
    setResult(null);
    setShowHint(false);
    setRepeatCount(0);
    if (direction === 'next') onNextSentence();
    else onPrevSentence();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5 sm:p-7 mb-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold">
              ✍️ Chép chính tả (Dictation)
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Câu {sentenceIndex + 1} / {totalSentences}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Lắng nghe giọng đọc và gõ lại thật chính xác từng từ để rèn luyện kỹ năng nghe và viết.
          </p>
        </div>

        {/* Listen Button */}
        <button
          type="button"
          onClick={handlePlay}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
        >
          <Volume2 className="w-4 h-4" />
          <span>Nghe đọc câu này ({repeatCount > 0 ? `Lần ${repeatCount}` : 'Bắt đầu'})</span>
        </button>
      </div>

      {/* Input Section */}
      <div className="mt-5 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Nhập lại câu bạn vừa nghe được:
          </label>
          <textarea
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleCheck();
              }
            }}
            rows={3}
            className="w-full p-4 border border-slate-200 rounded-xl text-slate-800 text-base sm:text-lg focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-400 font-sans"
            placeholder="Gõ câu nghe được vào đây (nhấn Enter để chấm bài)..."
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200"
            >
              {showHint ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showHint ? 'Ẩn câu mẫu' : 'Xem câu mẫu (Gợi ý)'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setTypedInput('');
                setResult(null);
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Làm lại
            </button>
            <button
              type="button"
              onClick={handleCheck}
              disabled={!typedInput.trim()}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Chấm điểm</span>
            </button>
          </div>
        </div>

        {/* Hint Box */}
        {showHint && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-900 font-medium">
            <span className="font-bold">Câu gốc: </span>
            <span>{currentSentence}</span>
          </div>
        )}

        {/* Evaluation Result */}
        {result && (
          <div className="mt-5 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-base ${
                    result.accuracyPercent >= 90
                      ? 'bg-emerald-600'
                      : result.accuracyPercent >= 70
                      ? 'bg-blue-600'
                      : 'bg-amber-500'
                  }`}
                >
                  {result.accuracyPercent}%
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {result.accuracyPercent === 100
                      ? '🎉 Xuất sắc! Bạn đã viết hoàn toàn chính xác!'
                      : result.accuracyPercent >= 80
                      ? '👍 Rất tốt! Chỉ còn vài lỗi nhỏ.'
                      : '💪 Cố gắng lên! Hãy nghe lại và đối chiếu từng từ nhé.'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Đúng {result.matchedWords} / {result.totalWords} từ
                  </p>
                </div>
              </div>

              {/* Navigation button */}
              <button
                type="button"
                onClick={() => handleResetForNext('next')}
                disabled={sentenceIndex >= totalSentences - 1}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span>Câu tiếp theo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Word by word breakdown */}
            <div>
              <span className="block text-xs font-bold text-slate-600 mb-2">
                Chi tiết đối chiếu từng từ:
              </span>
              <div className="flex flex-wrap gap-2 text-sm">
                {result.diff.map((item, idx) => {
                  if (item.status === 'correct') {
                    return (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200"
                      >
                        ✓ {item.word}
                      </span>
                    );
                  }
                  if (item.status === 'incorrect') {
                    return (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-red-100 text-red-800 font-medium border border-red-200 flex items-center gap-1"
                        title={`Bạn đã gõ: "${item.typedWord || ''}"`}
                      >
                        <span className="line-through text-red-500">{item.typedWord}</span>
                        <span className="font-bold text-red-700">➜ {item.word}</span>
                      </span>
                    );
                  }
                  if (item.status === 'missing') {
                    return (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-medium border border-dashed border-amber-300"
                        title="Từ này bạn chưa gõ"
                      >
                        (thiếu: {item.word})
                      </span>
                    );
                  }
                  return (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-slate-200 text-slate-600 line-through text-xs"
                      title="Từ thừa"
                    >
                      {item.typedWord}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
