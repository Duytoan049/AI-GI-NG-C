/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GradeLevel } from '../types';
import { Backpack, BookOpen, GraduationCap } from 'lucide-react';

interface LevelSelectorProps {
  gradeLevel: GradeLevel;
  setGradeLevel: (level: GradeLevel) => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  gradeLevel,
  setGradeLevel,
}) => {
  const levels = [
    {
      id: 'tieu-hoc' as GradeLevel,
      title: 'Tiểu Học',
      grades: 'Lớp 1 - 5',
      icon: Backpack,
      description: 'Tập đọc, đánh vần chậm rãi, ngắt nhịp thơ thiếu nhi, phonics cơ bản',
      color: 'amber',
      accentBg: 'bg-amber-500',
      activeBorder: 'border-amber-500 bg-amber-50/70 text-amber-900',
      badgeBg: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'thcs' as GradeLevel,
      title: 'THCS',
      grades: 'Lớp 6 - 9',
      icon: BookOpen,
      description: 'Văn bản đọc hiểu, thơ hiện đại, hội thoại tiếng Anh SGK Global Success',
      color: 'blue',
      accentBg: 'bg-blue-600',
      activeBorder: 'border-blue-600 bg-blue-50/70 text-blue-900',
      badgeBg: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'thpt' as GradeLevel,
      title: 'THPT',
      grades: 'Lớp 10 - 12',
      icon: GraduationCap,
      description: 'Tác phẩm kinh điển, nghị luận văn học, tiếng Anh học thuật & ôn thi',
      color: 'indigo',
      accentBg: 'bg-indigo-600',
      activeBorder: 'border-indigo-600 bg-indigo-50/70 text-indigo-900',
      badgeBg: 'bg-indigo-100 text-indigo-800',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5 sm:mb-6">
      {levels.map((lvl) => {
        const Icon = lvl.icon;
        const isActive = gradeLevel === lvl.id;
        return (
          <button
            key={lvl.id}
            type="button"
            onClick={() => setGradeLevel(lvl.id)}
            className={`text-left p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
              isActive
                ? `${lvl.activeBorder} shadow-xs ring-2 ring-${lvl.color}-400/20`
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 text-slate-700'
            }`}
          >
            {isActive && (
              <div
                className={`absolute top-0 left-0 right-0 h-1 sm:h-1.5 ${lvl.accentBg}`}
              />
            )}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5">
              <div
                className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${
                  isActive
                    ? `${lvl.accentBg} text-white`
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-base leading-tight">
                  {lvl.title}
                </h3>
                <span
                  className={`inline-block text-[9px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full mt-0.5 ${lvl.badgeBg}`}
                >
                  {lvl.grades}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2 mt-2 hidden md:block">
              {lvl.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};
