/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Volume2, Mic, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Hướng Dẫn Sử Dụng EduVoice VN
              </h3>
              <p className="text-xs text-slate-500">
                Tiện ích chuyển văn bản thành giọng nói chuẩn cho học sinh & giáo viên
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-600">
          {/* Feature 1 */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
              1
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Đọc Văn Bản & Karaoke Trực Tiếp
              </h4>
              <p className="mt-1 leading-relaxed">
                Bấm nút <strong>"Bắt đầu đọc"</strong> để nghe toàn bộ bài đọc. Từng câu và từng từ đang đọc sẽ được tô sáng màu vàng (hiệu ứng Karaoke) giúp các em học sinh dễ dàng bám sát mặt chữ. Bạn có thể bấm vào bất kỳ câu nào để bắt đầu đọc từ câu đó.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold">
              2
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Tra Cứu Đánh Vần (Tiểu Học) & Phiên Âm IPA (Tiếng Anh)
              </h4>
              <p className="mt-1 leading-relaxed">
                Bấm trực tiếp vào <strong>bất kỳ từ nào</strong> trong bài đọc. Hệ thống sẽ mở bảng phân tích chi tiết:
                với Tiếng Việt sẽ tách âm đầu, vần, thanh điệu (ví dụ: b - an - ban - huyền - bàn);
                với Tiếng Anh sẽ hiện phiên âm quốc tế IPA và mẹo phát âm.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">
              3
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Chế Độ "Nghe - Chép Chính Tả" (Dictation)
              </h4>
              <p className="mt-1 leading-relaxed">
                Chuyển qua tab <strong>"✍️ Chép chính tả"</strong>. Máy sẽ đọc từng câu có ngắt quãng, học sinh gõ lại nội dung nghe được vào ô văn bản rồi bấm "Chấm điểm". Hệ thống tự động so khớp và tô màu từ đúng (xanh), từ gõ sai chính tả (đỏ), và từ bỏ sót (vàng).
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 font-bold">
              4
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Luyện Đọc & Ghi Âm So Sánh
              </h4>
              <p className="mt-1 leading-relaxed">
                Chuyển qua tab <strong>"🎤 Ghi âm đối chiếu"</strong>. Học sinh bấm nút ghi âm qua Micro của máy, tự đọc lại câu mẫu và phát lại để nghe xem mình phát âm đã giống với giọng cô giáo hoặc người bản xứ hay chưa.
              </p>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0 font-bold">
              5
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Kho Bài Mẫu & Nhập Văn Bản Tùy Ý
              </h4>
              <p className="mt-1 leading-relaxed">
                Bấm nút <strong>"Kho bài đọc SGK"</strong> để chọn hơn 20 bài mẫu chuẩn Bộ GD&ĐT lớp 1-12. Ngoài ra, thầy cô và học sinh có thể bấm <strong>"Nhập/Dán văn bản khác"</strong> hoặc bấm <strong>"Tạo bài mới bằng AI"</strong> để tự tạo bất kỳ nội dung bài học nào theo ý muốn.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
          >
            Đã hiểu, bắt đầu học!
          </button>
        </div>
      </div>
    </div>
  );
};
