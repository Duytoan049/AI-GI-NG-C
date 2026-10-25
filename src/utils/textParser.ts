/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TokenizedWord {
  text: string;
  clean: string;
  isWord: boolean;
}

export interface DictationWordDiff {
  word: string;
  status: 'correct' | 'incorrect' | 'missing' | 'extra';
  typedWord?: string;
}

export interface DictationResult {
  score: number; // 0 to 100
  accuracyPercent: number;
  matchedWords: number;
  totalWords: number;
  diff: DictationWordDiff[];
}

export interface VietnameseSyllableInfo {
  syllable: string;
  initialConsonant: string; // âm đầu (vd: b, tr, th, ng, c, ...)
  rhyme: string; // vần (vd: a, ang, oai, uyên, ...)
  tone: 'ngang' | 'huyền' | 'sắc' | 'hỏi' | 'ngã' | 'nặng';
  spellingGuide: string; // Hướng dẫn đánh vần (vd: b - a - ba)
}

/**
 * Split text into educational sentences/clauses suitable for reading aloud and dictation
 */
export function splitIntoSentences(text: string): string[] {
  if (!text || !text.trim()) return [];

  // Protect common abbreviations in Vietnamese and English
  let protectedText = text
    .replace(/(?<=\b(ThS|TS|GS|PGS|BS|Mrs|Mr|Ms|Dr|Prof|St|v\.v|v\.d))\./gi, '___DOT___')
    .replace(/(\d+)\.(\d+)/g, '$1___DECIMAL___$2');

  // Split on sentence boundaries: newline, period, question mark, exclamation mark, ellipsis, semicolon
  const rawSegments = protectedText.split(/([.?!;\n]+["'”’]?)/g);

  const sentences: string[] = [];
  let current = '';

  for (let i = 0; i < rawSegments.length; i++) {
    const part = rawSegments[i];
    current += part;

    if (/[.?!;\n]+["'”’]?$/.test(part) || i === rawSegments.length - 1) {
      const restored = current
        .replace(/___DOT___/g, '.')
        .replace(/___DECIMAL___/g, '.')
        .trim();

      if (restored.length > 0) {
        sentences.push(restored);
      }
      current = '';
    }
  }

  // Handle case where trailing fragment remained without punctuation
  if (current.trim().length > 0) {
    const restored = current
      .replace(/___DOT___/g, '.')
      .replace(/___DECIMAL___/g, '.')
      .trim();
    if (restored.length > 0) {
      sentences.push(restored);
    }
  }

  return sentences;
}

/**
 * Split a sentence into word tokens for karaoke highlighting and word-level interaction
 */
export function splitIntoWords(sentence: string): TokenizedWord[] {
  if (!sentence) return [];

  const tokens = sentence.split(/(\s+|[.,!?;:()"“”'’—–-]+)/);
  return tokens
    .filter((token) => token.length > 0)
    .map((token) => {
      const clean = token.toLowerCase().replace(/[.,!?;:()"“”'’—–-]/g, '').trim();
      const isWord = clean.length > 0 && /[\p{L}\p{N}]/u.test(clean);
      return {
        text: token,
        clean,
        isWord,
      };
    });
}

/**
 * Clean text for comparison in dictation
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFC')
    .replace(/[.,!?;:()"“”'’—–]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Levenshtein distance between two strings
 */
export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

/**
 * Compare student's typed text with target sentence for Dictation / Chép chính tả mode
 */
export function calculateDictationScore(targetText: string, typedText: string): DictationResult {
  const targetTokens = normalizeText(targetText).split(' ').filter(Boolean);
  const typedTokens = normalizeText(typedText).split(' ').filter(Boolean);

  if (targetTokens.length === 0) {
    return {
      score: typedTokens.length === 0 ? 100 : 0,
      accuracyPercent: typedTokens.length === 0 ? 100 : 0,
      matchedWords: 0,
      totalWords: 0,
      diff: [],
    };
  }

  const diff: DictationWordDiff[] = [];
  let matchedWords = 0;

  // Use dynamic programming alignment (Needleman-Wunsch inspired) for words
  let i = 0;
  let j = 0;

  while (i < targetTokens.length && j < typedTokens.length) {
    const targetWord = targetTokens[i];
    const typedWord = typedTokens[j];

    if (targetWord === typedWord) {
      diff.push({ word: targetWord, status: 'correct', typedWord });
      matchedWords++;
      i++;
      j++;
    } else {
      // Check if typedWord matches future targetWord (missing word in between)
      const lookaheadTarget = targetTokens.slice(i + 1, i + 3).indexOf(typedWord);
      const lookaheadTyped = typedTokens.slice(j + 1, j + 3).indexOf(targetWord);

      if (lookaheadTarget !== -1) {
        // Target words were missed
        diff.push({ word: targetWord, status: 'missing' });
        i++;
      } else if (lookaheadTyped !== -1) {
        // Extra typed word
        diff.push({ word: typedWord, status: 'extra', typedWord });
        j++;
      } else {
        // Mismatched / misspelled word
        // Check similarity
        const distance = levenshteinDistance(targetWord, typedWord);
        const maxLen = Math.max(targetWord.length, typedWord.length);
        const similarity = maxLen > 0 ? 1 - distance / maxLen : 0;

        diff.push({
          word: targetWord,
          status: 'incorrect',
          typedWord,
        });
        if (similarity >= 0.7) {
          matchedWords += 0.5; // partial credit for minor typo
        }
        i++;
        j++;
      }
    }
  }

  // Any remaining target words are missing
  while (i < targetTokens.length) {
    diff.push({ word: targetTokens[i], status: 'missing' });
    i++;
  }

  // Any remaining typed words are extra
  while (j < typedTokens.length) {
    diff.push({ word: typedTokens[j], status: 'extra', typedWord: typedTokens[j] });
    j++;
  }

  const accuracyPercent = Math.min(100, Math.max(0, Math.round((matchedWords / targetTokens.length) * 100)));
  const score = accuracyPercent;

  return {
    score,
    accuracyPercent,
    matchedWords: Math.floor(matchedWords),
    totalWords: targetTokens.length,
    diff,
  };
}

/**
 * Parse a Vietnamese syllable for Primary School (Tiểu học lớp 1 - 2) spelling assistance
 */
export function parseVietnameseSyllable(rawWord: string): VietnameseSyllableInfo | null {
  const word = rawWord.toLowerCase().trim();
  if (!word || !/^[\p{L}]+$/u.test(word)) return null;

  // Determine tone
  let tone: VietnameseSyllableInfo['tone'] = 'ngang';
  if (/[àằầèềìòồờùừỳ]/.test(word)) tone = 'huyền';
  else if (/[áắấéếíóốớúứý]/.test(word)) tone = 'sắc';
  else if (/[ảẳẩẻểỉỏổởủửỷ]/.test(word)) tone = 'hỏi';
  else if (/[ãẵẫẽễĩõỗỡũữỹ]/.test(word)) tone = 'ngã';
  else if (/[ạặậẹệịọộợụựỵ]/.test(word)) tone = 'nặng';

  // Base vowels without tone mark
  const unaccented = word
    .normalize('NFD')
    .replace(/[\u0300\u0301\u0303\u0309\u0323]/g, '')
    .normalize('NFC');

  // Common Vietnamese initial consonants
  const initialConsonants = [
    'ngh', 'ng', 'nh', 'th', 'ch', 'ph', 'kh', 'tr', 'gh', 'gi', 'qu',
    'b', 'c', 'd', 'đ', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'x'
  ];

  let initialConsonant = '';
  let remainder = unaccented;

  for (const c of initialConsonants) {
    if (unaccented.startsWith(c)) {
      initialConsonant = c;
      remainder = unaccented.slice(c.length);
      break;
    }
  }

  const rhyme = remainder || unaccented;

  // Generate spelling guide (hướng dẫn đánh vần)
  let spellingGuide = '';
  if (initialConsonant && rhyme) {
    if (tone === 'ngang') {
      spellingGuide = `${initialConsonant} - ${rhyme} - ${unaccented}`;
    } else {
      spellingGuide = `${initialConsonant} - ${rhyme} - ${unaccented}, ${unaccented} - thanh ${tone} - ${word}`;
    }
  } else {
    spellingGuide = `${word} (vần: ${rhyme})`;
  }

  return {
    syllable: word,
    initialConsonant,
    rhyme,
    tone,
    spellingGuide,
  };
}

/**
 * Estimate reading time in seconds based on word count and speech rate
 */
export function estimateReadingTime(text: string, rate: number = 1.0): { seconds: number; formatted: string } {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  // Standard speech is ~140 words per minute for Vietnamese and ~130 for English
  const baseWpm = 135;
  const effectiveWpm = Math.max(40, baseWpm * rate);
  const totalSeconds = Math.max(1, Math.round((words / effectiveWpm) * 60));

  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  const formatted =
    minutes > 0 ? `${minutes} phút ${remainingSeconds} giây` : `${remainingSeconds} giây`;

  return { seconds: totalSeconds, formatted };
}

/**
 * Split text into paragraphs separated by blank lines or multiple newlines
 */
export function splitIntoParagraphs(text: string): string[] {
  if (!text || !text.trim()) return [];
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Determine the start and end sentence indexes of the paragraph containing the given sentence
 */
export function getParagraphSentenceRange(
  sentences: string[],
  targetIndex: number,
  rawText: string
): { startIdx: number; endIdx: number } {
  if (sentences.length === 0 || targetIndex < 0 || targetIndex >= sentences.length) {
    return { startIdx: 0, endIdx: 0 };
  }

  const paragraphs = splitIntoParagraphs(rawText);
  if (paragraphs.length <= 1) {
    return { startIdx: 0, endIdx: sentences.length - 1 };
  }

  let currentSentenceCounter = 0;

  for (const para of paragraphs) {
    const paraSentences = splitIntoSentences(para);
    const startIdx = currentSentenceCounter;
    const endIdx = currentSentenceCounter + paraSentences.length - 1;

    if (targetIndex >= startIdx && targetIndex <= endIdx) {
      return { startIdx, endIdx: Math.min(sentences.length - 1, endIdx) };
    }
    currentSentenceCounter += paraSentences.length;
  }

  return { startIdx: 0, endIdx: sentences.length - 1 };
}

/**
 * Check if the sentence should be repeated based on current count and repeat mode
 */
export function shouldRepeatSentence(currentCount: number, mode: string): boolean {
  if (mode === 'none') return false;
  if (mode === 'sentence-2x' && currentCount < 2) return true;
  if (mode === 'sentence-3x' && currentCount < 3) return true;
  if (mode === 'sentence-infinite') return true;
  return false;
}

