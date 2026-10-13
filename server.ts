import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// List of Indonesian and multilingual profanity / inappropriate terms for robust hybrid detection
const BLOCKED_KEYWORDS = [
  'anjing', 'asw', 'anjir', 'babi', 'bangsat', 'bajingan', 'kontol', 'memek',
  'pantek', 'itil', 'jembut', 'pepek', 'tolol', 'goblok', 'bego', 'idiot',
  'sialan', 'kampret', 'tai', 'tae', 'ngentot', 'perek', 'lonte', 'sundal',
  'fak', 'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'cunt', 'dick',
  'bodoh', 'mampus', 'mati aja', 'cerai', 'bubar', 'selingkuh', 'penipu'
];

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Content Moderation Endpoint for Wedding Wishes & Prayers
app.post('/api/moderate-wish', async (req: Request, res: Response) => {
  try {
    const { message, name } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const lower = message.toLowerCase();

    // 1. Instant Keyword Check (Fast Gatekeeper)
    const foundBadWord = BLOCKED_KEYWORDS.find((kw) => {
      // Regex word boundary or substring match
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      return regex.test(lower) || lower.includes(kw);
    });

    if (foundBadWord) {
      return res.json({
        isAllowed: false,
        flaggedWord: foundBadWord,
        reason: 'Ucapan Anda mengandung kata yang tidak pantas atau kurang santun. Mohon gunakan kata-kata yang baik dan penuh doa berkah untuk kedua mempelai.',
      });
    }

    // 2. Deep Contextual AI Analysis via Gemini 3.8 Flash
    if (aiClient) {
      try {
        const prompt = `Anda adalah sistem moderasi konten otomatis untuk Buku Tamu & Doa Pernikahan (Wedding Guestbook).
Tugas Anda adalah memeriksa apakah pesan ucapan berikut pantas, sopan, dan layak dipublikasikan untuk kedua mempelai dan keluarga.

Pesan pengirim (${name || 'Tamu'}): "${message}"

Kriteria TIDAK PANTAS (isAllowed: false):
- Mengandung kata makian, kata kotor, kata jorok, seksual, atau cabul (dalam bahasa Indonesia, daerah, atau Inggris).
- Mengandung ujaran kebencian, hinaan fisik, rasisme/SARA, atau pelecehan.
- Berisi doa buruk, kutukan, ancaman, atau pengharapan agar pasangan bercerai/celaka.
- Berisi spam iklan judi, pinjol, obat terlarang, atau promosi ilegal.

Kriteria PANTAS (isAllowed: true):
- Ucapan selamat menikah, doa berkah, harapan bahagia, pantun pernikahan yang sopan, candaan wajar antar sahabat yang tidak vulgar.

Format respon HARUS JSON valid dengan struktur:
{
  "isAllowed": boolean,
  "reason": "Alasan singkat dalam bahasa Indonesia jika ditolak (kosongkan jika diterima)"
}`;

        const aiResponse = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.1,
          },
        });

        const text = aiResponse.text?.trim();
        if (text) {
          const parsed = JSON.parse(text);
          return res.json({
            isAllowed: Boolean(parsed.isAllowed),
            reason: parsed.reason || (parsed.isAllowed ? '' : 'Pesan dinilai kurang pantas untuk buku tamu pernikahan.'),
          });
        }
      } catch (geminiError) {
        console.warn('Gemini AI moderation fallback to keyword check:', geminiError);
      }
    }

    // If no keyword match and Gemini passed or unavailable
    return res.json({
      isAllowed: true,
      reason: '',
    });
  } catch (error) {
    console.error('Moderation error:', error);
    return res.status(500).json({ error: 'Failed to moderate content' });
  }
});

// Dev vs Prod Vite Integration
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server running on port ${port} (mode: ${isProduction ? 'production' : 'development'})`);
  });
}

startServer();
