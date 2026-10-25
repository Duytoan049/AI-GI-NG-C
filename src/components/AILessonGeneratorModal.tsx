/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GradeLevel, SubjectType } from '../types';
import { CurriculumLesson } from '../data/curriculumData';
import { Sparkles, X, Loader2, BookOpen, Check } from 'lucide-react';

interface AILessonGeneratorModalProps {
  onClose: () => void;
  onLessonCreated: (lesson: CurriculumLesson) => void;
  currentGradeLevel: GradeLevel;
  currentSubject: SubjectType;
}

export const AILessonGeneratorModal: React.FC<AILessonGeneratorModalProps> = ({
  onClose,
  onLessonCreated,
  currentGradeLevel,
  currentSubject,
}) => {
  const [level, setLevel] = useState<GradeLevel>(currentGradeLevel);
  const [subject, setSubject] = useState<SubjectType>(currentSubject);
  const [gradeNumber, setGradeNumber] = useState<number>(
    currentGradeLevel === 'tieu-hoc' ? 3 : currentGradeLevel === 'thcs' ? 7 : 11
  );
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sampleTopics = [
    'Tình cảm gia đình và lòng hiếu thảo',
    'Tình bạn tuổi học trò và tinh thần tương thân tương ái',
    'Bảo vệ môi trường xanh và giảm thiểu rác thải nhựa',
    'Lễ hội truyền thống và nét đẹp văn hóa Việt Nam',
    'Khám phá vũ trụ và công nghệ trí tuệ nhân tạo',
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/ai/lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gradeLevel: level,
          subject,
          gradeNumber,
          topic: topic.trim() || 'Học tập và đời sống học đường',
        }),
      });

      if (!res.ok) {
        throw new Error('Không thể tạo bài học lúc này. Vui lòng thử lại sau.');
      }

      const data = await res.json();
      const newLesson: CurriculumLesson = {
        id: `ai-${Date.now()}`,
        title: data.title || 'Bài đọc do AI biên soạn',
        gradeLevel: level,
        gradeNumber,
        subject,
        authorOrSource: 'AI Giáo Dục GDPT 2018',
        category: data.category || 'Bài đọc mở rộng',
        speedRecommended: data.speedRecommended || (level === 'tieu-hoc' ? 0.75 : 0.9),
        description: data.description || 'Bài đọc tương tác được thiết kế phù hợp lứa tuổi.',
        content: data.content,
        vocabulary: data.vocabulary || [],
        readingTips: data.readingTips || 'Đọc diễn cảm, phát âm tròn vành rõ chữ và ngắt nhịp hợp lý.',
      };

      onLessonCreated(newLesson);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi tạo bài học');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">Tạo Bài Đọc Mới Bằng AI</h3>
              <p className="text-xs text-blue-100">
                Biên soạn chuẩn theo khung chương trình GDPT Bộ Giáo dục & Đào tạo
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {/* Cấp học & Lớp */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Cấp học:
              </label>
              <select
                value={level}
                onChange={(e) => {
                  const val = e.target.value as GradeLevel;
                  setLevel(val);
                  if (val === 'tieu-hoc') setGradeNumber(3);
                  else if (val === 'thcs') setGradeNumber(7);
                  else setGradeNumber(11);
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="tieu-hoc">🎒 Tiểu học (Lớp 1-5)</option>
                <option value="thcs">📚 THCS (Lớp 6-9)</option>
                <option value="thpt">🎓 THPT (Lớp 10-12)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Môn học:
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectType)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="tieng-viet">🇻🇳 Tiếng Việt / Ngữ văn</option>
                <option value="tieng-anh">🇬🇧 Tiếng Anh (English)</option>
              </select>
            </div>
          </div>

          {/* Chủ đề mong muốn */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Chủ đề bạn muốn biên soạn:
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ví dụ: Giúp đỡ bạn bè vượt khó, Mùa thu Hà Nội..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Gợi ý chủ đề nhanh */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
              Chủ đề gợi ý:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sampleTopics.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTopic(t)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded-lg text-[11px] transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang biên soạn bài học...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Biên soạn bài học ngay</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
