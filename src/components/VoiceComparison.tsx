/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Volume2, Sparkles, CheckCircle } from 'lucide-react';

interface VoiceComparisonProps {
  currentSentence: string;
  onPlayModelVoice: () => void;
  isModelPlaying: boolean;
}

export const VoiceComparison: React.FC<VoiceComparisonProps> = ({
  currentSentence,
  onPlayModelVoice,
  isModelPlaying,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingBlobUrl, setRecordingBlobUrl] = useState<string | null>(null);
  const [isStudentPlaying, setIsStudentPlaying] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const studentAudioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordingBlobUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordSeconds(0);
      timerRef.current = window.setInterval(() => {
        setRecordSeconds((sec) => sec + 1);
      }, 1000);
    } catch (err: any) {
      console.warn('Microphone access error:', err);
      alert('Vui lòng cấp quyền truy cập Microphone trong trình duyệt để ghi âm.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const playStudentAudio = () => {
    if (studentAudioRef.current && recordingBlobUrl) {
      studentAudioRef.current.play();
      setIsStudentPlaying(true);
    }
  };

  const pauseStudentAudio = () => {
    if (studentAudioRef.current) {
      studentAudioRef.current.pause();
      setIsStudentPlaying(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5 sm:p-7 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <span className="p-1.5 bg-purple-100 text-purple-800 rounded-lg text-xs font-bold inline-block">
            🎤 Luyện đọc & Đối chiếu giọng nói
          </span>
          <p className="text-xs text-slate-500 mt-1">
            Ghi âm giọng của bạn khi đọc câu dưới đây, sau đó nghe lại đối chiếu cùng giọng đọc chuẩn.
          </p>
        </div>
      </div>

      {/* Target sentence display */}
      <div className="my-5 p-4 bg-slate-50 border border-slate-200/80 rounded-xl">
        <span className="text-xs font-semibold text-slate-400 block mb-1">Câu luyện đọc:</span>
        <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
          "{currentSentence}"
        </p>
      </div>

      {/* Recording and Playback Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Model Voice Card */}
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span>1. Giọng đọc mẫu chuẩn</span>
              </span>
            </div>
            <p className="text-xs text-blue-700/80">
              Lắng nghe chuẩn phát âm, trọng âm và ngữ điệu câu.
            </p>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={onPlayModelVoice}
              disabled={isModelPlaying}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isModelPlaying ? 'Đang phát...' : 'Nghe giọng mẫu'}</span>
            </button>
          </div>
        </div>

        {/* Student Voice Card */}
        <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-purple-900 flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-purple-600" />
                <span>2. Giọng đọc của bạn</span>
              </span>
              {isRecording && (
                <span className="flex items-center gap-1 text-xs font-bold text-red-600 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <span>{recordSeconds}s</span>
                </span>
              )}
            </div>
            <p className="text-xs text-purple-700/80">
              {recordingBlobUrl
                ? 'Đã ghi âm thành công! Bấm phát để nghe lại và so sánh.'
                : 'Bấm nút ghi âm và đọc to rõ ràng câu trên.'}
            </p>
          </div>

          <div className="mt-4 flex gap-2">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <Mic className="w-4 h-4" />
                <span>{recordingBlobUrl ? 'Ghi âm lại' : 'Bắt đầu ghi âm'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors animate-pulse"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Dừng ghi ({recordSeconds}s)</span>
              </button>
            )}

            {recordingBlobUrl && !isRecording && (
              <button
                type="button"
                onClick={isStudentPlaying ? pauseStudentAudio : playStudentAudio}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                title="Nghe lại bản ghi của bạn"
              >
                {isStudentPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isStudentPlaying ? 'Tạm dừng' : 'Nghe'}</span>
              </button>
            )}
          </div>

          {recordingBlobUrl && (
            <audio
              ref={studentAudioRef}
              src={recordingBlobUrl}
              onEnded={() => setIsStudentPlaying(false)}
              className="hidden"
            />
          )}
        </div>
      </div>
    </div>
  );
};
