/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import {
  FileText,
  ClipboardPaste,
  Trash2,
  BookOpen,
  Sparkles,
  Upload,
  Clock,
} from 'lucide-react';
import { estimateReadingTime } from '../utils/textParser';
import { SubjectType } from '../types';

interface TextInputCardProps {
  rawText: string;
  onUpdateText: (text: string) => void;
  currentLessonTitle: string;
  currentLessonSource: string;
  subject: SubjectType;
  rate: number;
  onOpenLibrary: () => void;
  onOpenAIGenerator: () => void;
}

export const TextInputCard: React.FC<TextInputCardProps> = ({
  rawText,
  onUpdateText,
  currentLessonTitle,
  currentLessonSource,
  subject,
  rate,
  onOpenLibrary,
  onOpenAIGenerator,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const readingTime = estimateReadingTime(rawText, rate);
  const wordCount = rawText.trim().split(/\s+/).filter(Boolean).length;

  const handlePaste = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) onUpdateText(text);
      }
    } catch (e) {
      // Fallback
    }
  };

  const handleClear = () => {
    onUpdateText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) onUpdateText(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-white border-2 border-blue-200/80 rounded-3xl p-4 sm:p-5 shadow-xs mb-5 transition-all">
      {/* Header of Input Card */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Nhập / Dán Văn Bản Cần Đọc</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {subject === 'tieng-viet' ? '🇻🇳 Tiếng Việt' : '🇬🇧 Tiếng Anh'}
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 font-medium truncate max-w-md">
              Đang mở: <strong className="text-slate-700">{currentLessonTitle}</strong> ({currentLessonSource})
            </p>
          </div>
        </div>

        {/* Quick helper buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={handlePaste}
            className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors flex items-center gap-1"
            title="Dán từ Clipboard"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span>Dán</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1"
            title="Tải tệp văn bản .txt"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tải file txt</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.md"
            className="hidden"
          />

          <button
            type="button"
            onClick={onOpenLibrary}
            className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors flex items-center gap-1"
            title="Chọn bài mẫu SGK"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Chọn bài SGK</span>
          </button>

          <button
            type="button"
            onClick={onOpenAIGenerator}
            className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors flex items-center gap-1"
            title="Tạo bài mới bằng AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Tạo bằng AI</span>
          </button>

          {rawText && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Xóa nội dung"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Direct Interactive Textarea */}
      <div className="mt-3 relative">
        <textarea
          value={rawText}
          onChange={(e) => onUpdateText(e.target.value)}
          rows={3}
          placeholder="Nhập hoặc dán văn bản tiếng Việt hoặc tiếng Anh vào đây để chuyển thành giọng nói ngay lập tức..."
          className="w-full p-3 sm:p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm sm:text-base leading-relaxed focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y font-sans"
        />

        {/* Stats bottom bar */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1.5 font-medium">
          <div className="flex items-center gap-2">
            <span>{wordCount} từ</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Thời lượng ước tính: ~{readingTime.formatted}</span>
            </span>
          </div>
          <span className="text-blue-600 font-semibold">
            {rawText.length > 0 ? '✓ Văn bản đã sẵn sàng đọc' : 'Hãy nhập văn bản'}
          </span>
        </div>
      </div>
    </div>
  );
};
