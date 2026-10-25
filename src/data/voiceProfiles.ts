/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EducationalVoiceProfile } from '../types';

export const EDUCATIONAL_VOICES: EducationalVoiceProfile[] = [
  // ===================================
  // TIẾNG VIỆT (VIETNAMESE)
  // ===================================
  {
    id: 'vi-female-bac-mai',
    name: 'Cô Mai',
    role: 'Cô giáo miền Bắc (Hà Nội)',
    gender: 'female',
    accent: 'vi-bac',
    language: 'vi',
    description: 'Giọng Nữ Bắc trong trẻo, dịu dàng, phát âm chuẩn chính tả SGK, rất phù hợp học vần và tập đọc.',
    avatar: '👩‍🏫',
    pitchOffset: 1.45, // High feminine pitch register
    rateMultiplier: 0.95,
    engine: 'both',
    geminiVoiceName: 'Kore',
  },
  {
    id: 'vi-male-bac-tuan',
    name: 'Thầy Tuấn',
    role: 'Thầy giáo miền Bắc (Hà Nội)',
    gender: 'male',
    accent: 'vi-bac',
    language: 'vi',
    description: 'Giọng Nam Bắc trầm ấm, đĩnh đạc, hào sảng cho các tác phẩm thơ kháng chiến, văn chính luận.',
    avatar: '👨‍🏫',
    pitchOffset: 0.76, // Deep masculine baritone pitch register
    rateMultiplier: 1.0,
    engine: 'both',
    geminiVoiceName: 'Puck',
  },
  {
    id: 'vi-female-nam-huong',
    name: 'Cô Hương',
    role: 'Cô giáo miền Nam (Sài Gòn)',
    gender: 'female',
    accent: 'vi-nam',
    language: 'vi',
    description: 'Giọng Nữ Nam ngọt ngào, truyền cảm, gần gũi, giúp các em thư giãn khi nghe truyện.',
    avatar: '👩',
    pitchOffset: 1.4, // High feminine pitch register
    rateMultiplier: 0.95,
    engine: 'both',
    geminiVoiceName: 'Zephyr',
  },
  {
    id: 'vi-male-nam-minh',
    name: 'Thầy Minh',
    role: 'Thầy giáo miền Nam (Miền Tây)',
    gender: 'male',
    accent: 'vi-nam',
    language: 'vi',
    description: 'Giọng Nam Nam mộc mạc, ấm áp, điềm đạm.',
    avatar: '👨',
    pitchOffset: 0.74, // Deep masculine baritone pitch register
    rateMultiplier: 1.0,
    engine: 'both',
    geminiVoiceName: 'Charon',
  },

  // ===================================
  // TIẾNG ANH (ENGLISH - NATIVE SPEAKERS)
  // ===================================
  {
    id: 'en-female-us-emma',
    name: 'Teacher Emma',
    role: 'American English (US Female)',
    gender: 'female',
    accent: 'en-us',
    language: 'en',
    description: 'Giọng Nữ bản ngữ Mỹ chuẩn General American, phát âm rõ âm đuôi, hoàn hảo cho luyện nghe & phát âm.',
    avatar: '🇺🇸 👩‍🏫',
    pitchOffset: 1.42, // High feminine pitch register
    rateMultiplier: 1.0,
    engine: 'both',
    geminiVoiceName: 'Kore',
  },
  {
    id: 'en-male-us-david',
    name: 'Teacher David',
    role: 'American English (US Male)',
    gender: 'male',
    accent: 'en-us',
    language: 'en',
    description: 'Giọng Nam bản ngữ Mỹ tự nhiên, rõ ràng, giàu năng lượng cho các đoạn hội thoại giao tiếp.',
    avatar: '🇺🇸 👨‍🏫',
    pitchOffset: 0.76, // Deep masculine pitch register
    rateMultiplier: 1.0,
    engine: 'both',
    geminiVoiceName: 'Puck',
  },
  {
    id: 'en-female-uk-charlotte',
    name: 'Teacher Charlotte',
    role: 'British English (UK Female)',
    gender: 'female',
    accent: 'en-uk',
    language: 'en',
    description: 'Giọng Nữ bản ngữ Anh chuẩn RP quý phái, chuẩn mực cho luyện thi IELTS & THPT.',
    avatar: '🇬🇧 👩‍💼',
    pitchOffset: 1.38, // High feminine pitch register
    rateMultiplier: 0.95,
    engine: 'both',
    geminiVoiceName: 'Zephyr',
  },
  {
    id: 'en-male-uk-oliver',
    name: 'Teacher Oliver',
    role: 'British English (UK Male)',
    gender: 'male',
    accent: 'en-uk',
    language: 'en',
    description: 'Giọng Nam bản ngữ Anh Oxford trầm ấm, phát âm mẫu mực cho văn bản học thuật.',
    avatar: '🇬🇧 👨‍💼',
    pitchOffset: 0.74, // Deep masculine pitch register
    rateMultiplier: 0.95,
    engine: 'both',
    geminiVoiceName: 'Charon',
  },
  {
    id: 'en-male-au-liam',
    name: 'Teacher Liam',
    role: 'Australian English (AU Male)',
    gender: 'male',
    accent: 'en-au',
    language: 'en',
    description: 'Giọng Nam bản ngữ Úc phóng khoáng, sinh động.',
    avatar: '🇦🇺 🏄‍♂️',
    pitchOffset: 0.78, // Deep masculine pitch register
    rateMultiplier: 1.0,
    engine: 'both',
    geminiVoiceName: 'Fenrir',
  },
];
