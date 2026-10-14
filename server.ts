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

// AI Holy Quotes & Sacred Verses Generator Endpoint for Wedding Invitations
app.post('/api/generate-holy-quotes', async (req: Request, res: Response) => {
  try {
    const { religion, themeStyle, groomName, brideName, customKeyword } = req.body;

    // Curated high-fidelity quotes across major religions in Indonesia
    const defaultQuotes = [
      {
        category: 'Islam',
        title: 'QS. Ar-Rum: 21 (Sakinah, Mawaddah, Warahmah)',
        text: 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.',
        source: 'QS. Ar-Rum: 21',
      },
      {
        category: 'Islam',
        title: 'QS. An-Nur: 32 (Karunia & Keberkahan Pernikahan)',
        text: 'Dan nikahkanlah orang-orang yang masih membujang di antara kamu, dan juga orang-orang yang layak (menikah) dari hamba-hamba sahayamu yang laki-laki dan perempuan. Jika mereka miskin, Allah akan memberi kemampuan kepada mereka dengan karunia-Nya. Dan Allah Mahaluas (pemberian-Nya), Maha Mengetahui.',
        source: 'QS. An-Nur: 32',
      },
      {
        category: 'Islam',
        title: 'QS. Az-Zariyat: 49 (Pasangan Saling Melengkapi)',
        text: 'Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).',
        source: 'QS. Az-Zariyat: 49',
      },
      {
        category: 'Kristen',
        title: '1 Korintus 13:4-7 (Hakikat Kasih Sejati)',
        text: 'Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong. Ia tidak melakukan yang tidak sopan dan tidak mencari keuntungan diri sendiri. Ia menutupi segala sesuatu, percaya segala sesuatu, mengharapkan segala sesuatu, sabar menanggung segala sesuatu.',
        source: '1 Korintus 13:4-7',
      },
      {
        category: 'Kristen',
        title: 'Kolose 3:14 (Pengikat Kesempurnaan)',
        text: 'Dan di atas semuanya itu: kenakanlah kasih, sebagai pengikat yang mempersatukan dan menyempurnakan.',
        source: 'Kolose 3:14',
      },
      {
        category: 'Katolik',
        title: 'Kejadian 2:24 (Satu Daging yang Kudus)',
        text: 'Sebab itu seorang laki-laki akan meninggalkan ayahnya dan ibunya dan bersatu dengan istrinya, sehingga keduanya menjadi satu daging. Demikianlah mereka bukan lagi dua, melainkan satu.',
        source: 'Kejadian 2:24',
      },
      {
        category: 'Hindu',
        title: 'Rg Veda X.85.42 (Kebahagiaan Rumah Tangga)',
        text: 'Ihaiva stam ma vi yaustam visvam ayur vyasnutam, kridantau putrair naptrbhih modamanau sve grhe. Tetaplah tinggal di sini bersama-sama, janganlah terpisah, nikmatilah masa hidupmu dalam kebahagiaan bersama anak-cucu di dalam rumah tanggamu yang damai.',
        source: 'Kitab Suci Rg Veda X.85.42',
      },
      {
        category: 'Buddha',
        title: 'Sigalovada Sutta (Kewajiban & Kasih Suami Istri)',
        text: 'Dengan saling menghormati, bersikap ramah, setia, serta berbagi kebahagiaan dan tanggung jawab, terciptalah rumah tangga yang harmonis, penuh berkah dan ketenteraman batin.',
        source: 'Digha Nikaya: Sigalovada Sutta',
      },
      {
        category: 'Universal',
        title: 'Kahlil Gibran (Tentang Cinta & Pernikahan Abadi)',
        text: 'Kalian dilahirkan bersama, dan bersama pula kalian seterusnya. Namun biarlah ada ruang di antara kebersamaan kalian, dan biarkan angin surga menari di antara kalian. Kasihilah satu sama lain, namun jangan jadikan kasih sebagai belenggu.',
        source: 'Kahlil Gibran (Mutiara Pernikahan)',
      },
    ];

    if (aiClient) {
      try {
        const prompt = `Anda adalah kurator sastra religi dan mutiara kata pernikahan Indonesia profesional.
Tugas Anda: Pilih atau ciptakan 4 sampai 5 rekomendasi kutipan ayat suci atau kata mutiara pernikahan bernuansa sakral, puitis, dan penuh doa berkah.

Konteks Permintaan:
- Pilihan Tradisi / Agama: ${religion || 'Islam'}
- Mempelai: ${groomName || 'Pengantin Pria'} & ${brideName || 'Pengantin Wanita'}
- Gaya / Tema: ${themeStyle || 'Elegan dan Puitis'}
- Kata Kunci Khusus: ${customKeyword || 'Pernikahan berkah, cinta abadi'}

Aturan:
1. Teks harus otentik, menggunakan Bahasa Indonesia yang halus, agung, dan menyentuh hati.
2. Cantumkan sumber kitab/surat/pasal/ayat atau penulis yang sah dan akurat.
3. Berikan judul ringkas tema pesan tersebut.

Format output HARUS JSON valid berupa array:
[
  {
    "category": "${religion || 'Islam'}",
    "title": "Judul ringkas tema ayat",
    "text": "Isi lengkap kutipan atau terjemahan ayat suci",
    "source": "Sumber kutipan spesifik (misal: QS. Ar-Rum: 21)"
  }
]`;

        const aiResponse = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        });

        const text = aiResponse.text?.trim();
        if (text) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return res.json({ quotes: parsed });
          }
        }
      } catch (geminiError) {
        console.warn('Gemini holy quotes generation fallback:', geminiError);
      }
    }

    // Filter fallback quotes by religion if requested
    let filtered = defaultQuotes;
    if (religion && religion !== 'Semua') {
      const matched = defaultQuotes.filter((q) =>
        q.category.toLowerCase().includes(religion.toLowerCase())
      );
      if (matched.length > 0) {
        filtered = matched;
      }
    }

    return res.json({ quotes: filtered });
  } catch (error) {
    console.error('Holy quotes error:', error);
    return res.status(500).json({ error: 'Failed to generate holy quotes' });
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
