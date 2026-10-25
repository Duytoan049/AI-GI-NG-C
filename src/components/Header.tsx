/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GradeLevel, SubjectType } from '../types';
import { Sparkles, BookOpen, Volume2, HelpCircle } from 'lucide-react';

interface HeaderProps {
  gradeLevel: GradeLevel;
  setGradeLevel: (level: GradeLevel) => void;
  subject: SubjectType;
  setSubject: (sub: SubjectType) => void;
  onOpenLibrary: () => void;
  onOpenAIGenerator: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  subject,
  setSubject,
  onOpenLibrary,
  onOpenAIGenerator,
  onOpenHelp,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-xl text-slate-900 tracking-tight">
                  EduVoice<span className="text-blue-600">.VN</span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 hidden md:inline-block">
                  GDPT 2018
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden lg:block">
                Trợ lý phát âm & chuyển văn bản thành giọng nói Tiếng Việt - Tiếng Anh
              </p>
            </div>
          </div>

          {/* Controls: Subject switch + Library + AI + Help */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Subject Toggle */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSubject('tieng-viet')}
                className={`px-2 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  subject === 'tieng-viet'
                    ? 'bg-white text-red-600 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Môn Tiếng Việt và Ngữ Văn"
              >
                <span>🇻🇳</span>
                <span className="hidden sm:inline">Tiếng Việt</span>
              </button>
              <button
                type="button"
                onClick={() => setSubject('tieng-anh')}
                className={`px-2 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  subject === 'tieng-anh'
                    ? 'bg-white text-blue-600 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Môn Tiếng Anh (English)"
              >
                <span>🇬🇧</span>
                <span className="hidden sm:inline">Tiếng Anh</span>
              </button>
            </div>

            {/* Curriculum Library Button */}
            <button
              type="button"
              onClick={onOpenLibrary}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5"
              title="Kho bài đọc SGK mẫu"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span className="hidden md:inline">Kho bài đọc SGK</span>
              <span className="md:hidden">Kho bài</span>
            </button>

            {/* AI Generator Button */}
            <button
              type="button"
              onClick={onOpenAIGenerator}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center gap-1"
              title="Tạo bài đọc mới bằng AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Tạo bài mới</span>
              <span className="sm:hidden">Tạo bài</span>
            </button>

            {/* Help Button */}
            <button
              type="button"
              onClick={onOpenHelp}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
              title="Hướng dẫn sử dụng"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
