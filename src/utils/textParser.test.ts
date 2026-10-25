/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  splitIntoSentences,
  splitIntoWords,
  calculateDictationScore,
  parseVietnameseSyllable,
  estimateReadingTime,
  splitIntoParagraphs,
  getParagraphSentenceRange,
  shouldRepeatSentence,
} from './textParser';

test('splitIntoSentences handles Vietnamese and English paragraphs and abbreviations correctly', () => {
  const text = 'Em học lớp 1. Cô giáo rất yêu thương học sinh! Mr. David is our teacher. Are you ready?';
  const sentences = splitIntoSentences(text);

  assert.equal(sentences.length, 4);
  assert.equal(sentences[0], 'Em học lớp 1.');
  assert.equal(sentences[1], 'Cô giáo rất yêu thương học sinh!');
  assert.equal(sentences[2], 'Mr. David is our teacher.');
  assert.equal(sentences[3], 'Are you ready?');
});

test('splitIntoSentences preserves poetry line breaks for school texts', () => {
  const poem = 'Hạt gạo làng ta\nCó vị phù sa\nCủa sông Kinh Thầy';
  const lines = splitIntoSentences(poem);
  assert.equal(lines.length, 3);
  assert.equal(lines[0], 'Hạt gạo làng ta');
  assert.equal(lines[1], 'Có vị phù sa');
  assert.equal(lines[2], 'Của sông Kinh Thầy');
});

test('splitIntoWords identifies tokens and clean word stems', () => {
  const sentence = 'Hello, world! Em yêu trường em.';
  const tokens = splitIntoWords(sentence);

  const wordsOnly = tokens.filter((t) => t.isWord).map((t) => t.clean);
  assert.deepEqual(wordsOnly, ['hello', 'world', 'em', 'yêu', 'trường', 'em']);
});

test('calculateDictationScore computes exact accuracy for perfect input', () => {
  const target = 'Hôm nay trời nắng đẹp, chim hót líu lo trên cành.';
  const typed = 'Hôm nay trời nắng đẹp, chim hót líu lo trên cành.';
  const result = calculateDictationScore(target, typed);

  assert.equal(result.accuracyPercent, 100);
  assert.equal(result.diff.every((d) => d.status === 'correct'), true);
});

test('calculateDictationScore catches spelling mistakes and missing words', () => {
  const target = 'The quick brown fox jumps over the lazy dog';
  const typed = 'The fast brown fox jumps lazy dog'; // missed 'over', 'the', swapped 'quick' with 'fast'
  const result = calculateDictationScore(target, typed);

  assert.ok(result.accuracyPercent < 100);
  assert.ok(result.totalWords === 9);
  const missingOrIncorrect = result.diff.filter(
    (d) => d.status === 'incorrect' || d.status === 'missing'
  );
  assert.ok(missingOrIncorrect.length > 0);
});

test('parseVietnameseSyllable analyzes syllables for Primary school learners', () => {
  const syllable1 = parseVietnameseSyllable('bàn');
  assert.ok(syllable1 !== null);
  assert.equal(syllable1.initialConsonant, 'b');
  assert.equal(syllable1.tone, 'huyền');

  const syllable2 = parseVietnameseSyllable('hoa');
  assert.ok(syllable2 !== null);
  assert.equal(syllable2.initialConsonant, 'h');
  assert.equal(syllable2.rhyme, 'oa');
  assert.equal(syllable2.tone, 'ngang');
});

test('estimateReadingTime calculates human readable reading time', () => {
  const shortText = 'Một hai ba bốn năm sáu bảy tám chín mười';
  const time = estimateReadingTime(shortText, 1.0);
  assert.ok(time.seconds > 0);
  assert.ok(typeof time.formatted === 'string');
});

test('splitIntoParagraphs separates text blocks by double newlines', () => {
  const multiPara = 'Đoạn một câu một. Đoạn một câu hai.\n\nĐoạn hai câu một.\n\nĐoạn ba.';
  const paras = splitIntoParagraphs(multiPara);
  assert.equal(paras.length, 3);
  assert.equal(paras[0], 'Đoạn một câu một. Đoạn một câu hai.');
  assert.equal(paras[1], 'Đoạn hai câu một.');
  assert.equal(paras[2], 'Đoạn ba.');
});

test('getParagraphSentenceRange finds start and end indices of current paragraph', () => {
  const raw = 'Câu 1. Câu 2.\n\nCâu 3. Câu 4. Câu 5.\n\nCâu 6.';
  const sentences = splitIntoSentences(raw);
  assert.equal(sentences.length, 6);

  // sentence 3 is in paragraph 2 (index 2 to 4)
  const range = getParagraphSentenceRange(sentences, 3, raw);
  assert.equal(range.startIdx, 2);
  assert.equal(range.endIdx, 4);
});

test('shouldRepeatSentence verifies repeat mode counts correctly', () => {
  assert.equal(shouldRepeatSentence(1, 'sentence-2x'), true);
  assert.equal(shouldRepeatSentence(2, 'sentence-2x'), false);

  assert.equal(shouldRepeatSentence(1, 'sentence-3x'), true);
  assert.equal(shouldRepeatSentence(2, 'sentence-3x'), true);
  assert.equal(shouldRepeatSentence(3, 'sentence-3x'), false);

  assert.equal(shouldRepeatSentence(5, 'sentence-infinite'), true);
  assert.equal(shouldRepeatSentence(1, 'none'), false);
});

