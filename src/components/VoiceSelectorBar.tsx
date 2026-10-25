/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EducationalVoiceProfile, Gender, SubjectType } from '../types';
import { Volume2, Check, Sparkles, UserCheck } from 'lucide-react';

interface VoiceSelectorBarProps {
  profiles: EducationalVoiceProfile[];
  selectedProfile: EducationalVoiceProfile;
  onSelectProfile: (profile: EducationalVoiceProfile) => void;
  genderFilter: 'all' | Gender;
  setGenderFilter: (g: 'all' | Gender) => void;
  subject: SubjectType;
  onPreviewVoice: (profile: EducationalVoiceProfile) => void;
}

export const VoiceSelectorBar: React.FC<VoiceSelectorBarProps> = ({
  profiles,
  selectedProfile,
  onSelectProfile,
  genderFilter,
  setGenderFilter,
  subject,
  onPreviewVoice,
}) => {
  const filteredProfiles = profiles.filter((p) => {
    if (genderFilter !== 'all' && p.gender !== genderFilter) return false;
    return true;
  });

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs mb-6">
      {/* Title & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
              Giọng Đọc & Ngữ Điệu (Nam / Nữ / Bản Ngữ)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {subject === 'tieng-viet'
              ? 'Tùy chọn giọng cô giáo / thầy giáo miền Bắc chuẩn SGK hoặc miền Nam ngọt ngào.'
              : 'Tùy chọn người bản ngữ Anh - Mỹ (US), Anh - Anh (UK) hoặc Anh - Úc (AU).'}
          </p>
        </div>

        {/* Gender Filter Toggle with Vibrant Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setGenderFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              genderFilter === 'all'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả ({profiles.length})
          </button>
          <button
            type="button"
            onClick={() => setGenderFilter('female')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
              genderFilter === 'female'
                ? 'bg-pink-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-pink-600'
            }`}
          >
            <span>👩</span>
            <span>Giọng Nữ</span>
          </button>
          <button
            type="button"
            onClick={() => setGenderFilter('male')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
              genderFilter === 'male'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-blue-700'
            }`}
          >
            <span>👨</span>
            <span>Giọng Nam</span>
          </button>
        </div>
      </div>

      {/* Profile Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {filteredProfiles.map((p) => {
          const isSelected = selectedProfile.id === p.id;
          const isFemale = p.gender === 'female';

          return (
            <div
              key={p.id}
              onClick={() => onSelectProfile(p)}
              className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? isFemale
                    ? 'border-pink-500 bg-pink-50/50 shadow-sm ring-2 ring-pink-400/20'
                    : 'border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{p.avatar}</span>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                        {p.name}
                      </h4>
                      <span className="text-[11px] font-semibold text-slate-500 block">
                        {p.role}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 ${
                        isFemale ? 'bg-pink-500' : 'bg-blue-600'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                  {p.description}
                </p>
              </div>

              {/* Card Footer: Badge & Test Voice button */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isFemale
                      ? 'bg-pink-100 text-pink-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {p.gender === 'female' ? 'Nữ' : 'Nam'} • {p.accent.toUpperCase()}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreviewVoice(p);
                  }}
                  className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors flex items-center gap-1"
                  title={`Nghe thử giọng ${p.name}`}
                >
                  <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Thử giọng</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
