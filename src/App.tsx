/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { GradeLevel, SubjectType, ActiveTab, EducationalVoiceProfile } from './types';
import { CURRICULUM_LESSONS, CurriculumLesson } from './data/curriculumData';
import { splitIntoSentences } from './utils/textParser';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { Header } from './components/Header';
import { LevelSelector } from './components/LevelSelector';
import { TextInputCard } from './components/TextInputCard';
import { VoiceSelectorBar } from './components/VoiceSelectorBar';
import { PlayerControls } from './components/PlayerControls';
import { KaraokeReader } from './components/KaraokeReader';
import { DictationPractice } from './components/DictationPractice';
import { VoiceComparison } from './components/VoiceComparison';
import { WordDetailModal } from './components/WordDetailModal';
import { CurriculumLibraryModal } from './components/CurriculumLibraryModal';
import { AILessonGeneratorModal } from './components/AILessonGeneratorModal';
import { HelpModal } from './components/HelpModal';
import {
  BookOpen,
  Volume2,
  Mic,
  PenTool,
  BookmarkCheck,
} from 'lucide-react';

export default function App() {
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('tieu-hoc');
  const [subject, setSubject] = useState<SubjectType>('tieng-viet');

  // Find initial lesson for default grade and subject
  const initialLesson = useMemo(() => {
    return (
      CURRICULUM_LESSONS.find(
        (l) => l.gradeLevel === gradeLevel && l.subject === subject
      ) || CURRICULUM_LESSONS[0]
    );
  }, []);

  const [currentLesson, setCurrentLesson] = useState<CurriculumLesson>(initialLesson);
  const [rawText, setRawText] = useState(initialLesson.content);
  const [activeTab, setActiveTab] = useState<ActiveTab>('reader');

  // Modals state
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [selectedWordForModal, setSelectedWordForModal] = useState<{
    word: string;
    cleanWord: string;
  } | null>(null);

  // Parse sentences
  const sentences = useMemo(() => {
    return splitIntoSentences(rawText);
  }, [rawText]);

  // Speech synthesis custom hook
  const speech = useSpeechSynthesis({
    sentences,
    rawText,
    currentLanguage: subject === 'tieng-viet' ? 'vi' : 'en',
    onSentenceComplete: () => {},
    onAllComplete: () => {},
  });

  // Handle grade level change
  const handleGradeLevelChange = (lvl: GradeLevel) => {
    setGradeLevel(lvl);
    speech.stop();
    const matching = CURRICULUM_LESSONS.find(
      (l) => l.gradeLevel === lvl && l.subject === subject
    );
    if (matching) {
      setCurrentLesson(matching);
      setRawText(matching.content);
      speech.setRate(matching.speedRecommended);
      setActiveTab('reader');
    }
  };

  // Handle subject change
  const handleSubjectChange = (sub: SubjectType) => {
    setSubject(sub);
    speech.stop();
    const matching = CURRICULUM_LESSONS.find(
      (l) => l.gradeLevel === gradeLevel && l.subject === sub
    );
    if (matching) {
      setCurrentLesson(matching);
      setRawText(matching.content);
      speech.setRate(matching.speedRecommended);
      setActiveTab('reader');
    }
  };

  // Select lesson from library
  const handleSelectLesson = (lesson: CurriculumLesson) => {
    speech.stop();
    setGradeLevel(lesson.gradeLevel);
    setSubject(lesson.subject);
    setCurrentLesson(lesson);
    setRawText(lesson.content);
    speech.setRate(lesson.speedRecommended);
    speech.jumpToSentence(0);
    setActiveTab('reader');
  };

  // Direct text update from the top input card
  const handleUpdateRawText = (newText: string) => {
    speech.stop();
    setRawText(newText);
    speech.jumpToSentence(0);
  };

  // Word click handler
  const handleWordClick = (wordText: string, cleanWord: string) => {
    speech.speakCustomText(cleanWord);
    setSelectedWordForModal({ word: wordText, cleanWord });
  };

  // Preview voice sample
  const handlePreviewVoice = (profile: EducationalVoiceProfile) => {
    speech.setSelectedProfile(profile);
    const sampleText =
      profile.language === 'vi'
        ? profile.gender === 'female'
          ? `Xin chào các em học sinh, cô là ${profile.name}. Hôm nay chúng mình cùng luyện đọc nhé!`
          : `Chào các em học sinh, thầy là ${profile.name}. Hãy cùng luyện phát âm thật chuẩn xác nào.`
        : profile.gender === 'female'
        ? `Hello students! I am ${profile.name}. Let's practice English pronunciation and listening together!`
        : `Hey everyone! I am ${profile.name}. Listen carefully and repeat after me!`;

    speech.speakCustomText(sampleText, 1.0, profile);
  };

  // Generate Gemini audio on demand
  const handleGenerateGemini = async () => {
    const res = await speech.generateGeminiAudio(
      rawText,
      gradeLevel === 'tieu-hoc'
        ? 'Dịu dàng, phát âm chậm rãi cho học sinh tiểu học'
        : 'Chuẩn mực, truyền cảm và rõ ràng'
    );
    if (!res.success) {
      alert(res.message || 'Chuyển sang giọng máy Web Speech.');
    }
  };

  // Listen to single sentence for dictation
  const handlePlayDictationSentence = (text: string) => {
    speech.speakCustomText(text, Math.min(speech.rate, 0.85));
  };

  // Check URL query parameters for ?autostart=1 or initial grade
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        speech.play();
      }
      const lvl = params.get('grade');
      if (lvl === 'thcs' || lvl === 'thpt' || lvl === 'tieu-hoc') {
        handleGradeLevelChange(lvl);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Be_Vietnam_Pro',sans-serif]">
      {/* App Header */}
      <Header
        gradeLevel={gradeLevel}
        setGradeLevel={handleGradeLevelChange}
        subject={subject}
        setSubject={handleSubjectChange}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenAIGenerator={() => setIsAIGeneratorOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Single-Page Unified Container (pb-36 ensures content is not covered by the fixed bottom player) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-36 sm:pb-44">
        {/* Top 1: Grade Level Selection Cards */}
        <LevelSelector
          gradeLevel={gradeLevel}
          setGradeLevel={handleGradeLevelChange}
        />

        {/* Top 2: Prominent Text Input & Paste Card right at the TOP */}
        <TextInputCard
          rawText={rawText}
          onUpdateText={handleUpdateRawText}
          currentLessonTitle={currentLesson.title}
          currentLessonSource={currentLesson.authorOrSource}
          subject={subject}
          rate={speech.rate}
          onOpenLibrary={() => setIsLibraryOpen(true)}
          onOpenAIGenerator={() => setIsAIGeneratorOpen(true)}
        />

        {/* Top 3: Voice Selector Bar (Male/Female & Native Accents) */}
        <VoiceSelectorBar
          profiles={speech.availableProfiles}
          selectedProfile={speech.selectedProfile}
          onSelectProfile={speech.setSelectedProfile}
          genderFilter={speech.genderFilter}
          setGenderFilter={speech.setGenderFilter}
          subject={subject}
          onPreviewVoice={handlePreviewVoice}
        />

        {/* Practice Mode Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-5 overflow-x-auto pb-1 text-xs sm:text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('reader')}
            className={`pb-3 px-3.5 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'reader'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📖 Luyện đọc & Karaoke</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dictation')}
            className={`pb-3 px-3.5 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'dictation'
                ? 'border-emerald-600 text-emerald-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>✍️ Chép chính tả (Dictation)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('recorder')}
            className={`pb-3 px-3.5 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'recorder'
                ? 'border-purple-600 text-purple-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>🎤 Ghi âm đối chiếu giọng</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`pb-3 px-3.5 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'library'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>📚 Từ vựng trọng tâm ({currentLesson.vocabulary.length})</span>
          </button>
        </div>

        {/* Tab 1: Karaoke Reader Mode */}
        {activeTab === 'reader' && (
          <KaraokeReader
            sentences={sentences}
            currentSentenceIndex={speech.currentSentenceIndex}
            currentWordIndex={speech.currentWordIndex}
            onSentenceClick={(idx) => speech.jumpToSentence(idx)}
            onWordClick={handleWordClick}
            subject={subject}
            gradeLevel={gradeLevel}
            isPlaying={speech.isPlaying}
            rate={speech.rate}
            rawText={rawText}
            onUpdateRawText={handleUpdateRawText}
            readingTips={currentLesson.readingTips}
          />
        )}

        {/* Tab 2: Dictation Practice Mode */}
        {activeTab === 'dictation' && (
          <DictationPractice
            key={currentLesson.id}
            currentSentence={sentences[speech.currentSentenceIndex] || ''}
            sentenceIndex={speech.currentSentenceIndex}
            totalSentences={sentences.length}
            onPlaySentence={handlePlayDictationSentence}
            onNextSentence={speech.nextSentence}
            onPrevSentence={speech.previousSentence}
            rate={speech.rate}
          />
        )}

        {/* Tab 3: Voice Comparison Mode */}
        {activeTab === 'recorder' && (
          <VoiceComparison
            key={currentLesson.id}
            currentSentence={sentences[speech.currentSentenceIndex] || ''}
            onPlayModelVoice={() =>
              speech.speakCustomText(sentences[speech.currentSentenceIndex] || '', speech.rate)
            }
            isModelPlaying={speech.isPlaying}
          />
        )}

        {/* Tab 4: Vocabulary and Notes */}
        {activeTab === 'library' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5 sm:p-7 mb-6">
            <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-indigo-600" />
              <span>Từ vựng trọng tâm & Chú giải bài học</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentLesson.vocabulary.map((vocab, vIdx) => (
                <div
                  key={vIdx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50/40 transition-colors flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-base">
                        {vocab.word}
                      </span>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                        {vocab.ipaOrTone}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 font-medium">
                      {vocab.meaning}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => speech.speakCustomText(vocab.word)}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 shadow-2xs transition-colors shrink-0"
                    title="Nghe phát âm từ này"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {currentLesson.vocabulary.length === 0 && (
              <p className="text-xs text-slate-400 py-6 text-center">
                Chưa có danh sách từ vựng cho văn bản này. Bấm vào bất kỳ từ nào trong bài đọc để tra cứu riêng.
              </p>
            )}
          </div>
        )}
      </main>

      {/* FIXED DYNAMIC BOTTOM FLOATING DOCK: Sticks to the bottom as requested */}
      <PlayerControls
        isPlaying={speech.isPlaying}
        isPaused={speech.isPaused}
        onPlay={speech.play}
        onPause={speech.pause}
        onStop={speech.stop}
        onNext={speech.nextSentence}
        onPrev={speech.previousSentence}
        onReplayCurrentSentence={speech.replayCurrentSentence}
        onReplayCurrentParagraph={speech.replayCurrentParagraph}
        currentSentenceIndex={speech.currentSentenceIndex}
        totalSentences={sentences.length}
        rate={speech.rate}
        setRate={speech.setRate}
        pitch={speech.pitch}
        setPitch={speech.setPitch}
        volume={speech.volume}
        setVolume={speech.setVolume}
        repeatMode={speech.repeatMode}
        setRepeatMode={speech.setRepeatMode}
        selectedProfile={speech.selectedProfile}
        engine={speech.engine}
        setEngine={speech.setEngine}
        geminiAudioUrl={speech.geminiAudioUrl}
        isGeneratingGemini={speech.isGeneratingGemini}
        onGenerateGeminiAudio={handleGenerateGemini}
        fullText={rawText}
      />

      {/* Modals */}
      {selectedWordForModal && (
        <WordDetailModal
          word={selectedWordForModal.word}
          cleanWord={selectedWordForModal.cleanWord}
          subject={subject}
          onClose={() => setSelectedWordForModal(null)}
          onSpeakWord={(wordToSpeak, customRate) =>
            speech.speakCustomText(wordToSpeak, customRate)
          }
        />
      )}

      {isLibraryOpen && (
        <CurriculumLibraryModal
          onClose={() => setIsLibraryOpen(false)}
          onSelectLesson={handleSelectLesson}
          currentLessonId={currentLesson.id}
          initialGradeLevel={gradeLevel}
          initialSubject={subject}
        />
      )}

      {isAIGeneratorOpen && (
        <AILessonGeneratorModal
          onClose={() => setIsAIGeneratorOpen(false)}
          onLessonCreated={handleSelectLesson}
          currentGradeLevel={gradeLevel}
          currentSubject={subject}
        />
      )}

      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}
    </div>
  );
}
