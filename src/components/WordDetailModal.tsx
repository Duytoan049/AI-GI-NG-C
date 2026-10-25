/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { parseVietnameseSyllable } from '../utils/textParser';
import { SubjectType, WordPhoneticDetail } from '../types';
import { Volume2, X, Sparkles, BookOpen, Loader2 } from 'lucide-react';

interface WordDetailModalProps {
  word: string;
  cleanWord: string;
  subject: SubjectType;
  onClose: () => void;
  onSpeakWord: (text: string, rate?: number) => void;
}

export const WordDetailModal: React.FC<WordDetailModalProps> = ({
  word,
  cleanWord,
  subject,
  onClose,
  onSpeakWord,
}) => {
  const [detail, setDetail] = useState<WordPhoneticDetail | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  useEffect(() => {
    if (subject === 'tieng-viet') {
      const parsed = parseVietnameseSyllable(cleanWord);
      if (parsed) {
        setDetail({
          word: cleanWord,
          amDau: parsed.initialConsonant || '(không có âm đầu)',
          van: parsed.rhyme,
          thanhDieu: `Thanh ${parsed.tone}`,
          danhVan: parsed.spellingGuide,
        });
      }
    } else {
      // English initial simple phonetic mockup
      setDetail({
        word: cleanWord,
        ipa: `/${cleanWord}/`,
        meaning: 'Bấm "Phân tích ngữ âm sâu" để tra cứu phiên âm quốc tế chuẩn.',
      });
    }
  }, [cleanWord, subject]);

  const handleDeepAIAnalyze = async () => {
    setIsLoadingAI(true);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: cleanWord,
          language: subject === 'tieng-viet' ? 'vi' : 'en',
        }),
      });
      const data = await res.json();
      if (data) {
        setDetail((prev) => ({
          ...prev,
          ...data,
          word: cleanWord,
        }));
      }
    } catch (e) {
      console.warn('AI analysis error', e);
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base">
              {subject === 'tieng-viet' ? 'Đánh vần & Cấu tạo từ' : 'Phiên âm & Ngữ âm'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Main Word Display with Audio Buttons */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {word}
              </span>
              {detail?.ipa && (
                <span className="block text-sm font-semibold text-blue-600 mt-0.5">
                  {detail.ipa}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSpeakWord(cleanWord, 0.7)}
                className="p-2.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-800 transition-colors flex items-center gap-1 text-xs font-bold"
                title="Phát âm chậm 0.7x"
              >
                <Volume2 className="w-4 h-4" />
                <span>Chậm</span>
              </button>
              <button
                type="button"
                onClick={() => onSpeakWord(cleanWord, 1.0)}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1 text-xs font-bold shadow-xs"
                title="Phát âm chuẩn 1.0x"
              >
                <Volume2 className="w-4 h-4" />
                <span>Chuẩn</span>
              </button>
            </div>
          </div>

          {/* Vietnamese specific breakdown */}
          {subject === 'tieng-viet' && detail && (
            <div className="space-y-3 text-sm">
              <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl">
                <span className="text-xs font-bold text-amber-800 uppercase block mb-1">
                  Cách đánh vần mẫu giáo & tiểu học:
                </span>
                <span className="text-base font-bold text-amber-950">
                  {detail.danhVan || `${detail.amDau} - ${detail.van} - ${cleanWord}`}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block mb-0.5">Âm đầu</span>
                  <span className="font-bold text-slate-800">{detail.amDau || '-'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block mb-0.5">Vần</span>
                  <span className="font-bold text-slate-800">{detail.van || '-'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block mb-0.5">Thanh điệu</span>
                  <span className="font-bold text-slate-800">{detail.thanhDieu || '-'}</span>
                </div>
              </div>
            </div>
          )}

          {/* English specific breakdown */}
          {subject === 'tieng-anh' && detail && (
            <div className="space-y-3 text-sm">
              {detail.partOfSpeech && (
                <div className="text-xs text-slate-500 font-medium">
                  Từ loại: <span className="font-bold text-slate-800">{detail.partOfSpeech}</span>
                </div>
              )}
              {detail.meaning && (
                <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl">
                  <span className="text-xs font-bold text-blue-900 block mb-1">Nghĩa tiếng Việt:</span>
                  <span className="text-sm font-medium text-slate-800">{detail.meaning}</span>
                </div>
              )}
            </div>
          )}

          {/* AI Deep Analysis Button */}
          <div>
            <button
              type="button"
              onClick={handleDeepAIAnalyze}
              disabled={isLoadingAI}
              className="w-full py-2.5 px-4 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              {isLoadingAI ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                  <span>Đang tra cứu nâng cao...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Phân tích ngữ âm sâu bằng AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
