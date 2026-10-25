/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { EducationalVoiceProfile, RepeatMode, SpeechEngine, Gender } from '../types';
import { EDUCATIONAL_VOICES } from '../data/voiceProfiles';
import {
  splitIntoWords,
  getParagraphSentenceRange,
  shouldRepeatSentence,
} from '../utils/textParser';

interface UseSpeechSynthesisProps {
  sentences: string[];
  rawText: string;
  currentLanguage: 'vi' | 'en';
  onSentenceComplete?: (index: number) => void;
  onAllComplete?: () => void;
}

export function useSpeechSynthesis({
  sentences,
  rawText,
  currentLanguage,
  onSentenceComplete,
  onAllComplete,
}: UseSpeechSynthesisProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Educational voice profiles with male/female and native speaker accents
  const availableProfiles = EDUCATIONAL_VOICES.filter(
    (p) => p.language === currentLanguage
  );
  const [selectedProfile, setSelectedProfile] = useState<EducationalVoiceProfile>(
    availableProfiles[0] || EDUCATIONAL_VOICES[0]
  );
  const [genderFilter, setGenderFilter] = useState<'all' | Gender>('all');

  // Playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);

  // Repetition control
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none');
  const sentenceRepeatCountRef = useRef(0);
  const [activeParagraphRange, setActiveParagraphRange] = useState<{
    startIdx: number;
    endIdx: number;
  }>({ startIdx: 0, endIdx: 0 });

  // Gemini TTS states
  const [engine, setEngine] = useState<SpeechEngine>('web-speech');
  const [geminiAudioUrl, setGeminiAudioUrl] = useState<string | null>(null);
  const [isGeneratingGemini, setIsGeneratingGemini] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Timers and refs
  const wordTimerRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);
  isPlayingRef.current = isPlaying;

  const currentSentenceIndexRef = useRef(currentSentenceIndex);
  currentSentenceIndexRef.current = currentSentenceIndex;

  const repeatModeRef = useRef(repeatMode);
  repeatModeRef.current = repeatMode;

  const selectedProfileRef = useRef(selectedProfile);
  selectedProfileRef.current = selectedProfile;

  // Update default profile when language changes
  useEffect(() => {
    const matchingProfiles = EDUCATIONAL_VOICES.filter(
      (p) => p.language === currentLanguage
    );
    if (matchingProfiles.length > 0) {
      setSelectedProfile(matchingProfiles[0]);
    }
  }, [currentLanguage]);

  // Load available browser voices
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const available = window.speechSynthesis.getVoices();
        setVoices(available);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Filter voices matching current language
  const filteredVoices = voices.filter((v) => {
    if (currentLanguage === 'vi') {
      return (
        v.lang.startsWith('vi') ||
        v.lang.includes('VIE') ||
        v.name.toLowerCase().includes('vietnam')
      );
    } else {
      return v.lang.startsWith('en') || v.name.toLowerCase().includes('english');
    }
  });

  // Accurate voice gender matching algorithm
  const findMatchingVoice = useCallback(
    (profile: EducationalVoiceProfile) => {
      if (filteredVoices.length === 0) return null;

      const isFemale = profile.gender === 'female';
      const femaleClues = [
        'female', 'woman', 'hoaimy', 'linh', 'mai', 'huong',
        'samantha', 'victoria', 'zira', 'karen', 'jenny', 'aria', 'gda', 'vic'
      ];

      // Strip "vietnam", "vietnamese", "tiếng việt" so "nam" in "vietnam" is NOT misidentified as male!
      const matched = filteredVoices.find((v) => {
        const nameLower = v.name.toLowerCase();
        const cleanName = nameLower
          .replace(/vietnam(ese)?/g, '')
          .replace(/tiếng việt/g, '');

        if (isFemale) {
          return femaleClues.some((clue) => nameLower.includes(clue));
        } else {
          return (
            cleanName.includes('male') ||
            cleanName.includes('man') ||
            cleanName.includes('namminh') ||
            /\b(nam|an|tuan|minh|david|daniel|guy|mark|george|alex|oliver|liam)\b/i.test(cleanName)
          );
        }
      });

      if (matched) return matched;

      // Fallback: If female and has Google voice
      if (isFemale) {
        const googleVoice = filteredVoices.find((v) => v.name.toLowerCase().includes('google'));
        if (googleVoice) return googleVoice;
      }

      return filteredVoices[0];
    },
    [filteredVoices]
  );

  // Update selected voice when selectedProfile or voices change
  useEffect(() => {
    const matched = findMatchingVoice(selectedProfile);
    setSelectedVoice(matched);
  }, [selectedProfile, findMatchingVoice]);

  const clearWordTimer = () => {
    if (wordTimerRef.current) {
      window.clearInterval(wordTimerRef.current);
      wordTimerRef.current = null;
    }
  };

  // Helper to start word highlighting cadence
  const startSimulatedWordCadence = (sentence: string, speechRate: number) => {
    clearWordTimer();
    const tokens = splitIntoWords(sentence);
    const wordTokens = tokens.filter((t) => t.isWord);
    if (wordTokens.length === 0) return;

    let index = 0;
    setCurrentWordIndex(0);

    const msPerWord = Math.max(120, Math.round(360 / speechRate));

    wordTimerRef.current = window.setInterval(() => {
      index++;
      if (index < wordTokens.length) {
        setCurrentWordIndex(index);
      } else {
        clearWordTimer();
      }
    }, msPerWord);
  };

  const speakSentence = useCallback(
    (index: number, isNewSentence: boolean = true) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      if (index < 0 || index >= sentences.length) {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentWordIndex(-1);
        sentenceRepeatCountRef.current = 0;
        clearWordTimer();
        onAllComplete?.();
        return;
      }

      window.speechSynthesis.cancel();
      clearWordTimer();

      if (isNewSentence) {
        sentenceRepeatCountRef.current = 0;
      }

      const text = sentences[index];
      const utterance = new SpeechSynthesisUtterance(text);

      const activeProfile = selectedProfileRef.current;
      const voiceToUse = findMatchingVoice(activeProfile);

      if (voiceToUse) {
        utterance.voice = voiceToUse;
      }
      utterance.lang = currentLanguage === 'vi' ? 'vi-VN' : 'en-US';

      // Enforce unmistakable female pitch vs deep male pitch
      const isFemale = activeProfile.gender === 'female';
      let effectivePitch: number;

      if (isFemale) {
        // High feminine teacher pitch register (1.35 - 1.6)
        effectivePitch = Math.min(1.8, Math.max(1.35, pitch * (activeProfile?.pitchOffset || 1.45)));
      } else {
        // Deep masculine teacher pitch register (0.7 - 0.8)
        effectivePitch = Math.max(0.55, Math.min(0.8, pitch * (activeProfile?.pitchOffset || 0.76)));
      }

      const effectiveRate = Math.min(
        2.0,
        Math.max(0.4, rate * (activeProfile?.rateMultiplier || 1.0))
      );

      utterance.pitch = effectivePitch;
      utterance.rate = effectiveRate;
      utterance.volume = volume;

      let boundaryFired = false;
      const wordTokens = splitIntoWords(text).filter((t) => t.isWord);

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          boundaryFired = true;
          clearWordTimer();
          const charIndex = event.charIndex;
          let runningLength = 0;
          for (let w = 0; w < wordTokens.length; w++) {
            const wordPos = text.indexOf(wordTokens[w].text, runningLength);
            if (wordPos >= 0) {
              runningLength = wordPos;
              if (Math.abs(charIndex - wordPos) <= wordTokens[w].text.length + 1) {
                setCurrentWordIndex(w);
                break;
              }
            }
          }
        }
      };

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        setCurrentSentenceIndex(index);

        const paraRange = getParagraphSentenceRange(sentences, index, rawText);
        setActiveParagraphRange(paraRange);

        window.setTimeout(() => {
          if (!boundaryFired && isPlayingRef.current) {
            startSimulatedWordCadence(text, effectiveRate);
          }
        }, 220);
      };

      utterance.onend = () => {
        clearWordTimer();
        setCurrentWordIndex(-1);
        onSentenceComplete?.(index);

        const currentRepeats = sentenceRepeatCountRef.current + 1;
        sentenceRepeatCountRef.current = currentRepeats;

        // Check sentence repetition
        if (shouldRepeatSentence(currentRepeats, repeatModeRef.current)) {
          window.setTimeout(() => {
            if (isPlayingRef.current) {
              speakSentence(index, false);
            }
          }, 600);
          return;
        }

        // Check paragraph loop repetition
        const paraRange = getParagraphSentenceRange(sentences, index, rawText);
        if (
          repeatModeRef.current === 'paragraph-loop' &&
          index === paraRange.endIdx
        ) {
          window.setTimeout(() => {
            if (isPlayingRef.current) {
              speakSentence(paraRange.startIdx, true);
            }
          }, 800);
          return;
        }

        // Proceed to next sentence
        sentenceRepeatCountRef.current = 0;
        if (index + 1 < sentences.length) {
          window.setTimeout(() => {
            if (isPlayingRef.current) {
              speakSentence(index + 1, true);
            }
          }, 350);
        } else {
          setIsPlaying(false);
          setIsPaused(false);
          onAllComplete?.();
        }
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis utterance error:', e);
        clearWordTimer();
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentWordIndex(-1);
      };

      window.speechSynthesis.speak(utterance);
    },
    [
      sentences,
      rawText,
      findMatchingVoice,
      currentLanguage,
      rate,
      pitch,
      volume,
      onSentenceComplete,
      onAllComplete,
    ]
  );

  const play = useCallback(() => {
    if (isPaused && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      setIsPlaying(true);
      speakSentence(currentSentenceIndex, true);
    }
  }, [isPaused, currentSentenceIndex, speakSentence]);

  const pause = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      clearWordTimer();
      setIsPaused(true);
      setIsPlaying(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    clearWordTimer();
    sentenceRepeatCountRef.current = 0;
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWordIndex(-1);
  }, []);

  const jumpToSentence = useCallback(
    (index: number) => {
      const validIndex = Math.max(0, Math.min(sentences.length - 1, index));
      setCurrentSentenceIndex(validIndex);
      setCurrentWordIndex(-1);
      sentenceRepeatCountRef.current = 0;
      if (isPlaying) {
        speakSentence(validIndex, true);
      }
    },
    [sentences.length, isPlaying, speakSentence]
  );

  const nextSentence = useCallback(() => {
    jumpToSentence(currentSentenceIndex + 1);
  }, [currentSentenceIndex, jumpToSentence]);

  const previousSentence = useCallback(() => {
    jumpToSentence(currentSentenceIndex - 1);
  }, [currentSentenceIndex, jumpToSentence]);

  const replayCurrentSentence = useCallback(() => {
    sentenceRepeatCountRef.current = 0;
    speakSentence(currentSentenceIndex, true);
  }, [currentSentenceIndex, speakSentence]);

  const replayCurrentParagraph = useCallback(() => {
    const range = getParagraphSentenceRange(sentences, currentSentenceIndex, rawText);
    sentenceRepeatCountRef.current = 0;
    jumpToSentence(range.startIdx);
  }, [sentences, currentSentenceIndex, rawText, jumpToSentence]);

  // Speak custom text with strict profile pitch enforcement
  const speakCustomText = useCallback(
    (text: string, customRate?: number, overrideProfile?: EducationalVoiceProfile) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      const targetProfile = overrideProfile || selectedProfileRef.current;
      const matchedVoice = findMatchingVoice(targetProfile);

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
      utterance.lang = currentLanguage === 'vi' ? 'vi-VN' : 'en-US';

      // Enforce unmistakable female pitch vs deep male pitch
      const isFemale = targetProfile.gender === 'female';
      let effectivePitch: number;

      if (isFemale) {
        effectivePitch = Math.min(1.8, Math.max(1.35, pitch * (targetProfile?.pitchOffset || 1.45)));
      } else {
        effectivePitch = Math.max(0.55, Math.min(0.8, pitch * (targetProfile?.pitchOffset || 0.76)));
      }

      utterance.pitch = effectivePitch;
      utterance.rate = customRate || rate * (targetProfile?.rateMultiplier || 1.0);
      utterance.volume = volume;
      window.speechSynthesis.speak(utterance);
    },
    [findMatchingVoice, currentLanguage, rate, pitch, volume]
  );

  // Generate Gemini TTS Audio
  const generateGeminiAudio = async (textToRead: string, style?: string) => {
    setIsGeneratingGemini(true);
    try {
      const activeProf = selectedProfileRef.current;
      const voiceNameToUse =
        activeProf.geminiVoiceName || (activeProf.gender === 'female' ? 'Kore' : 'Puck');
      const genderLabel = activeProf.gender === 'female' ? 'Cô giáo' : 'Thầy giáo';
      const rolePrompt = `${genderLabel} ${activeProf.name}: ${
        style || 'Rõ ràng, truyền cảm, sư phạm chuẩn mực'
      }`;

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToRead,
          voice: voiceNameToUse,
          gender: activeProf.gender,
          style: rolePrompt,
          language: currentLanguage,
        }),
      });

      const data = await response.json();
      if (data.fallback || !data.audioBase64) {
        return { success: false, message: data.message || 'Chuyển sang giọng máy Web Speech' };
      }

      setGeminiAudioUrl(data.audioBase64);
      return { success: true, audioUrl: data.audioBase64 };
    } catch (err: any) {
      console.error('Gemini TTS error:', err);
      return { success: false, message: err.message };
    } finally {
      setIsGeneratingGemini(false);
    }
  };

  return {
    voices,
    filteredVoices,
    selectedVoice,
    setSelectedVoice,
    availableProfiles,
    selectedProfile,
    setSelectedProfile,
    genderFilter,
    setGenderFilter,
    repeatMode,
    setRepeatMode,
    isPlaying,
    isPaused,
    currentSentenceIndex,
    currentWordIndex,
    activeParagraphRange,
    rate,
    setRate,
    pitch,
    setPitch,
    volume,
    setVolume,
    play,
    pause,
    stop,
    jumpToSentence,
    nextSentence,
    previousSentence,
    replayCurrentSentence,
    replayCurrentParagraph,
    speakCustomText,
    engine,
    setEngine,
    geminiAudioUrl,
    setGeminiAudioUrl,
    isGeneratingGemini,
    generateGeminiAudio,
    audioRef,
  };
}
