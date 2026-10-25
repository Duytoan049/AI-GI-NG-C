/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI client if key exists
function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// Helper to wrap raw 24kHz mono 16-bit PCM in a standard WAV header
function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitDepth = 16): Buffer {
  const header = Buffer.alloc(44);
  const dataLength = pcmBuffer.length;
  const byteRate = (sampleRate * numChannels * bitDepth) / 8;
  const blockAlign = (numChannels * bitDepth) / 8;

  // RIFF identifier
  header.write('RIFF', 0);
  // file length minus 8
  header.writeUInt32LE(36 + dataLength, 4);
  // WAVE identifier
  header.write('WAVE', 8);
  // format chunk identifier
  header.write('fmt ', 12);
  // format chunk length
  header.writeUInt32LE(16, 16);
  // sample format (1 = PCM)
  header.writeUInt16LE(1, 20);
  // channels
  header.writeUInt16LE(numChannels, 22);
  // sample rate
  header.writeUInt32LE(sampleRate, 24);
  // byte rate
  header.writeUInt32LE(byteRate, 28);
  // block align
  header.writeUInt16LE(blockAlign, 32);
  // bits per sample
  header.writeUInt16LE(bitDepth, 34);
  // data chunk identifier
  header.write('data', 36);
  // data length
  header.writeUInt32LE(dataLength, 40);

  return Buffer.concat([header, pcmBuffer]);
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const ai = getAiClient();
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(ai),
    supportedEngines: ['web-speech', Boolean(ai) ? 'gemini-tts' : 'web-speech-only'],
  });
});

// Gemini TTS generation endpoint
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const {
      text,
      voice = 'Kore',
      style,
      language = 'vi',
      gender,
    } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    const ai = getAiClient();
    if (!ai) {
      res.json({
        fallback: true,
        message: 'GEMINI_API_KEY not configured. Use browser native Web Speech API.',
      });
      return;
    }

    // Determine gender strictly
    const isFemale =
      gender === 'female' ||
      voice === 'Kore' ||
      voice === 'Zephyr' ||
      (!gender && voice !== 'Puck' && voice !== 'Fenrir' && voice !== 'Charon');

    const voiceNameToUse = isFemale
      ? (voice === 'Zephyr' ? 'Zephyr' : 'Kore')
      : (voice === 'Fenrir' ? 'Fenrir' : voice === 'Charon' ? 'Charon' : 'Puck');

    // Build clear speaker metadata and prompt
    let speakerName = isFemale ? 'Cô giáo' : 'Thầy giáo';
    let defaultStyle = isFemale
      ? (language === 'vi'
          ? 'Giọng nữ cô giáo Việt Nam dịu dàng, trong trẻo, phát âm chuẩn chính tả'
          : 'Female teacher voice with warm, articulate, native English diction')
      : (language === 'vi'
          ? 'Giọng nam thầy giáo Việt Nam trầm ấm, hào sảng, phát âm chuẩn chính tả'
          : 'Male teacher voice with natural, confident, native English diction');

    if (language === 'en') {
      speakerName = isFemale ? 'Female Teacher' : 'Male Teacher';
    }

    const promptText = language === 'en'
      ? `${speakerName}: ${text}`
      : `${speakerName}: ${text}`;

    // Request Gemini TTS
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: promptText,
              speechMetadata: {
                speaker: speakerName,
                style: style || defaultStyle,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voiceNameToUse,
            },
          },
        },
      },
    });

    const candidate = response.candidates?.[0];
    const inlineData = candidate?.content?.parts?.[0]?.inlineData;
    const rawData = inlineData?.data;

    if (!rawData) {
      res.json({ fallback: true, message: 'No audio returned from model' });
      return;
    }

    const rawBuffer = Buffer.from(rawData, 'base64');
    let finalWavBuffer = rawBuffer;

    // Check if it already has RIFF header, if not wrap PCM in WAV
    if (rawBuffer.length >= 4 && rawBuffer.toString('utf8', 0, 4) !== 'RIFF') {
      finalWavBuffer = pcmToWav(rawBuffer, 24000, 1, 16);
    }

    const base64Wav = finalWavBuffer.toString('base64');

    res.json({
      fallback: false,
      audioBase64: `data:audio/wav;base64,${base64Wav}`,
      mimeType: 'audio/wav',
    });
  } catch (err: any) {
    console.error('Error in /api/tts:', err);
    // Graceful fallback to client Web Speech API
    res.json({
      fallback: true,
      error: err.message || 'TTS generation error',
    });
  }
});

// AI Lesson Generator Endpoint (chương trình GDPT Tiểu học, THCS, THPT)
app.post('/api/ai/lesson', async (req: Request, res: Response) => {
  try {
    const { gradeLevel, subject, topic, gradeNumber } = req.body;
    const ai = getAiClient();

    if (!ai) {
      res.status(503).json({ error: 'AI key not available' });
      return;
    }

    const systemPrompt = `Bạn là chuyên gia sư phạm biên soạn sách giáo khoa chương trình GDPT 2018 của Bộ Giáo dục và Đào tạo Việt Nam.
Nhiệm vụ: Biên soạn một bài đọc ngắn, chuẩn mực, hay, có tính giáo dục cao, phù hợp lứa tuổi học sinh.
Thông tin:
- Cấp học: ${gradeLevel} (Lớp ${gradeNumber || 1})
- Môn học: ${subject === 'tieng-anh' ? 'Tiếng Anh (English)' : 'Tiếng Việt / Ngữ Văn'}
- Chủ đề: ${topic || 'Đời sống học đường và tình yêu quê hương đất nước'}

Hãy trả về DUY NHẤT một chuỗi JSON hợp lệ không bọc trong markdown triple backticks theo cấu trúc:
{
  "title": "Tiêu đề bài đọc",
  "category": "Thể loại (Tập đọc, Thơ, Đoạn văn nghị luận, Hội thoại...)",
  "speedRecommended": 0.85,
  "description": "Lời giới thiệu ngắn gọn về bài học",
  "content": "Nội dung bài đọc đầy đủ",
  "vocabulary": [
    { "word": "từ khóa 1", "ipaOrTone": "phiên âm hoặc thanh điệu", "meaning": "giải nghĩa dễ hiểu" }
  ],
  "readingTips": "Lời khuyên về cách lấy hơi, ngắt nhịp và ngữ điệu khi đọc"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      res.status(500).json({ error: 'Không nhận được dữ liệu từ AI' });
      return;
    }

    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/ai/lesson:', err);
    res.status(500).json({ error: err.message || 'Lỗi khi tạo bài học' });
  }
});

// AI Phonetics & Syllable Analyzer Endpoint
app.post('/api/ai/analyze', async (req: Request, res: Response) => {
  try {
    const { word, language } = req.body;
    const ai = getAiClient();

    if (!ai || !word) {
      res.status(400).json({ error: 'Invalid parameters or missing AI' });
      return;
    }

    const prompt = language === 'en'
      ? `Provide concise phonetic analysis for the English word "${word}" for ESL school students in JSON:
{
  "word": "${word}",
  "ipa": "/.../",
  "partOfSpeech": "noun / verb / adj...",
  "vietnameseMeaning": "nghĩa tiếng Việt súc tích",
  "pronunciationTip": "mẹo phát âm khẩu hình hoặc trọng âm"
}`
      : `Phân tích cấu tạo âm tiết và chính tả tiếng Việt của từ "${word}" cho học sinh tiểu học/phổ thông dạng JSON:
{
  "word": "${word}",
  "amDau": "âm đầu (nếu có)",
  "van": "vần",
  "thanhDieu": "thanh sắc/huyền/hỏi/ngã/nặng/ngang",
  "danhVan": "cách đánh vần chậm rãi",
  "yNghia": "nghĩa của từ trong câu"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json' },
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json(JSON.parse(text || '{}'));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Start dev server with Vite middlewares, or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduVoice VN server listening on port ${PORT}`);
  });
}

startServer();
