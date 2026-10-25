/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CURRICULUM_LESSONS, CurriculumLesson } from '../data/curriculumData';
import { GradeLevel, SubjectType } from '../types';
import { BookOpen, Search, X, Check, ArrowRight, Sparkles } from 'lucide-react';

interface CurriculumLibraryModalProps {
  onClose: () => void;
  onSelectLesson: (lesson: CurriculumLesson) => void;
  currentLessonId?: string;
  initialGradeLevel?: GradeLevel;
  initialSubject?: SubjectType;
}

export const CurriculumLibraryModal: React.FC<CurriculumLibraryModalProps> = ({
  onClose,
  onSelectLesson,
  currentLessonId,
  initialGradeLevel,
  initialSubject,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>(initialGradeLevel || 'all');
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLessons = CURRICULUM_LESSONS.filter((item) => {
    if (selectedLevel !== 'all' && item.gradeLevel !== selectedLevel) return false;
    if (selectedSubject !== 'all' && item.subject !== selectedSubject) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchAuthor = item.authorOrSource.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchTitle && !matchAuthor && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Kho Bài Đọc SGK Tiếng Việt & Tiếng Anh
              </h2>
              <p className="text-xs text-slate-500">
                Chương trình Giáo dục Phổ thông 2018 (Tiểu học, THCS, THPT)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-white space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tiêu đề, tác giả hoặc nội dung bài học..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Level filters */}
            <span className="text-slate-400 font-semibold mr-1">Cấp học:</span>
            {[
              { id: 'all', label: 'Tất cả cấp học' },
              { id: 'tieu-hoc', label: '🎒 Tiểu học (Lớp 1-5)' },
              { id: 'thcs', label: '📚 THCS (Lớp 6-9)' },
              { id: 'thpt', label: '🎓 THPT (Lớp 10-12)' },
            ].map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setSelectedLevel(lvl.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedLevel === lvl.id
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lvl.label}
              </button>
            ))}

            <div className="h-4 w-px bg-slate-300 mx-1 hidden sm:block" />

            {/* Subject filters */}
            <span className="text-slate-400 font-semibold mr-1">Môn học:</span>
            {[
              { id: 'all', label: 'Cả 2 môn' },
              { id: 'tieng-viet', label: '🇻🇳 Tiếng Việt / Ngữ văn' },
              { id: 'tieng-anh', label: '🇬🇧 Tiếng Anh' },
            ].map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSelectedSubject(sub.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedSubject === sub.id
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lesson list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLessons.map((item) => {
            const isSelected = item.id === currentLessonId;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          item.subject === 'tieng-viet'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {item.subject === 'tieng-viet' ? '🇻🇳 Tiếng Việt' : '🇬🇧 Tiếng Anh'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        Lớp {item.gradeNumber}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {item.category}
                      </span>
                    </div>

                    <span className="text-[11px] font-semibold text-slate-400">
                      Tốc độ: {item.speedRecommended}x
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    {item.authorOrSource}
                  </p>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {item.vocabulary.length} từ vựng trọng tâm
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectLesson(item);
                      onClose();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700'
                    }`}
                  >
                    <span>{isSelected ? 'Đang mở' : 'Học bài này'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredLessons.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm">Không tìm thấy bài học nào phù hợp với bộ lọc.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
