import React, { useState, useEffect } from 'react';
import { Sparkles, Check, RefreshCw, BookOpen, Search, Heart, Quote } from 'lucide-react';

export interface HolyQuoteItem {
  category: string;
  title: string;
  text: string;
  source: string;
}

interface AiHolyQuotesPickerProps {
  currentQuote: { text: string; source: string };
  onSelectQuote: (quote: { text: string; source: string }) => void;
  groomName?: string;
  brideName?: string;
}

const PRESET_QUOTES: HolyQuoteItem[] = [
  {
    category: 'Islam',
    title: 'QS. Ar-Rum: 21 (Sakinah Mawaddah Warahmah)',
    text: 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.',
    source: 'QS. Ar-Rum: 21',
  },
  {
    category: 'Islam',
    title: 'QS. An-Nur: 32 (Karunia Kecukupan Rezeki)',
    text: 'Dan nikahkanlah orang-orang yang masih membujang di antara kamu, dan juga orang-orang yang layak (menikah) dari hamba-hamba sahayamu yang laki-laki dan perempuan. Jika mereka miskin, Allah akan memberi kemampuan kepada mereka dengan karunia-Nya.',
    source: 'QS. An-Nur: 32',
  },
  {
    category: 'Islam',
    title: 'Hadits Riwayat Baihaqi (Menyempurnakan Separuh Agama)',
    text: 'Jika seseorang menikah, maka ia telah menyempurnakan separuh agamanya. Karenanya, hendaklah ia bertakwa kepada Allah pada separuh yang lainnya.',
    source: 'HR. Baihaqi dalam Syu\'abul Iman',
  },
  {
    category: 'Kristen',
    title: '1 Korintus 13:4-7 (Kasih Itu Sabar & Abadi)',
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
    title: 'Sigalovada Sutta (Keluarga Harmonis Penuh Berkah)',
    text: 'Dengan saling menghormati, setia, bersikap ramah dan saling mendukung dalam suka maupun duka, terciptalah rumah tangga yang damai, kokoh, dan senantiasa dilimpahi berkah kebajikan.',
    source: 'Digha Nikaya: Sigalovada Sutta',
  },
  {
    category: 'Universal',
    title: 'Kahlil Gibran (Tentang Cinta Sejati)',
    text: 'Kalian dilahirkan bersama, dan bersama pula kalian seterusnya. Namun biarlah ada ruang di antara kebersamaan kalian, dan biarkan angin surga menari di antara kalian. Kasihilah satu sama lain, namun jangan jadikan kasih sebagai belenggu.',
    source: 'Kahlil Gibran (Mutiara Pernikahan)',
  },
];

export const AiHolyQuotesPicker: React.FC<AiHolyQuotesPickerProps> = ({
  currentQuote,
  onSelectQuote,
  groomName = 'Pengantin Pria',
  brideName = 'Pengantin Wanita',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [customKeyword, setCustomKeyword] = useState<string>('');
  const [quotesList, setQuotesList] = useState<HolyQuoteItem[]>(PRESET_QUOTES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [appliedSource, setAppliedSource] = useState<string>(currentQuote.source);

  useEffect(() => {
    setAppliedSource(currentQuote.source);
  }, [currentQuote.source]);

  const categories = ['Semua', 'Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Universal'];

  const handleGenerateAiQuotes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-holy-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          religion: selectedCategory === 'Semua' ? '' : selectedCategory,
          themeStyle: 'Elegan, Sakral, Penuh Berkah',
          groomName,
          brideName,
          customKeyword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.quotes && Array.isArray(data.quotes) && data.quotes.length > 0) {
          setQuotesList(data.quotes);
          return;
        }
      }
      // Fallback
      filterLocalQuotes(selectedCategory);
    } catch (err) {
      console.warn('AI generation error, using curated presets:', err);
      filterLocalQuotes(selectedCategory);
    } finally {
      setIsLoading(false);
    }
  };

  const filterLocalQuotes = (cat: string) => {
    if (cat === 'Semua') {
      setQuotesList(PRESET_QUOTES);
    } else {
      setQuotesList(PRESET_QUOTES.filter((q) => q.category.toLowerCase().includes(cat.toLowerCase())));
    }
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    filterLocalQuotes(cat);
  };

  const handleApply = (item: HolyQuoteItem) => {
    onSelectQuote({
      text: item.text,
      source: item.source,
    });
    setAppliedSource(item.source);
  };

  return (
    <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-50/70 via-stone-50 to-amber-100/30 rounded-2xl border border-amber-200/80 shadow-xs space-y-4">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-[#8a724d]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 font-sans">
              <span>Pilihan Kutipan Ayat Suci Online via AI</span>
              <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-semibold">
                AI Gemini
              </span>
            </h4>
            <p className="text-[11px] text-stone-600 font-sans">
              Pilih dari koleksi kitab suci atau buat inspirasi baru bernuansa sakral secara otomatis
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerateAiQuotes}
          disabled={isLoading}
          className="px-3.5 py-2 bg-[#8a724d] hover:bg-[#735e3d] text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Sedang Generate...' : '✨ Generate Ayat Baru (AI)'}</span>
        </button>
      </div>

      {/* Category Pills & Optional Keyword */}
      <div className="space-y-2 pt-1 border-t border-amber-200/50">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer text-xs ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-amber-300 shadow-xs'
                  : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-200'
              }`}
            >
              {cat === 'Islam' && '🕌 '}
              {cat === 'Kristen' && '✝️ '}
              {cat === 'Katolik' && '⛪ '}
              {cat === 'Hindu' && '🕉️ '}
              {cat === 'Buddha' && '☸️ '}
              {cat === 'Universal' && '🕊️ '}
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ketik kata kunci AI (contoh: restu orang tua, jodoh sejati, adat jawa)..."
            value={customKeyword}
            onChange={(e) => setCustomKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleGenerateAiQuotes();
              }
            }}
            className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs placeholder:text-stone-400 focus:ring-1 focus:ring-[#8a724d]"
          />
          <button
            type="button"
            onClick={handleGenerateAiQuotes}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium cursor-pointer"
          >
            Cari
          </button>
        </div>
      </div>

      {/* Quote Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
        {quotesList.map((item, idx) => {
          const isSelected = appliedSource === item.source || currentQuote.source === item.source;
          return (
            <div
              key={`${item.source}-${idx}`}
              className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between transition-all ${
                isSelected
                  ? 'bg-white border-[#8a724d] ring-2 ring-[#8a724d]/25 shadow-xs'
                  : 'bg-white/90 border-stone-200 hover:border-amber-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                    {item.category}
                  </span>
                  <span className="font-semibold text-stone-900 text-[11px] truncate max-w-[180px]">
                    {item.source}
                  </span>
                </div>
                <p className="text-stone-700 leading-relaxed italic text-[11px] font-serif line-clamp-4 mb-3">
                  "{item.text}"
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] text-stone-400 font-medium">
                  {item.title}
                </span>

                <button
                  type="button"
                  onClick={() => handleApply(item)}
                  className={`px-3 py-1 rounded-lg font-semibold text-[11px] transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#8a724d] hover:bg-[#735e3d] text-white shadow-xs'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Aktif Digunakan</span>
                    </>
                  ) : (
                    <>
                      <Quote className="w-3 h-3" />
                      <span>Gunakan Ayat Ini</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
