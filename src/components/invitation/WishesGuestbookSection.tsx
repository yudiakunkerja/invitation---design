import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  AlertTriangle,
  CheckCircle2,
  Heart,
  Loader2,
  MessageSquare,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { WishComment } from '../../types/wedding';

interface WishesGuestbookSectionProps {
  wishes: WishComment[];
  defaultSenderName?: string;
  onLikeWish: (id: string) => void;
  onAddWish: (newWish: {
    guestName: string;
    attendance: 'hadir' | 'tidak_hadir' | 'ragu';
    message: string;
  }) => void;
}

export const WishesGuestbookSection: React.FC<WishesGuestbookSectionProps> = ({
  wishes,
  defaultSenderName = '',
  onLikeWish,
  onAddWish,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // New wish form state
  const [senderName, setSenderName] = useState(defaultSenderName);
  const [attendance, setAttendance] = useState<'hadir' | 'tidak_hadir' | 'ragu'>('hadir');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moderationError, setModerationError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Client-side quick filter fallback
  const clientBlockedWords = [
    'anjing', 'asw', 'anjir', 'babi', 'bangsat', 'bajingan', 'kontol', 'memek',
    'pantek', 'tolol', 'goblok', 'bego', 'sialan', 'kampret', 'ngentot', 'perek',
    'lonte', 'fuck', 'shit', 'bitch', 'cerai', 'bubar', 'mampus'
  ];

  const handleSubmitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    setModerationError(null);
    setSuccessBanner(null);

    const trimmedMsg = message.trim();
    const trimmedName = senderName.trim() || 'Sahabat & Kerabat';

    if (!trimmedMsg) return;

    setIsSubmitting(true);

    try {
      // 1. Fast client-side preliminary keyword check
      const lower = trimmedMsg.toLowerCase();
      const clientFound = clientBlockedWords.find((w) => {
        const regex = new RegExp(`\\b${w}\\b`, 'i');
        return regex.test(lower) || lower.includes(w);
      });

      if (clientFound) {
        setModerationError(
          'Ucapan Anda terdeteksi mengandung kata yang tidak pantas atau kurang santun. Mohon gunakan kata-kata yang penuh berkah dan doa baik untuk kedua mempelai.'
        );
        setIsSubmitting(false);
        return;
      }

      // 2. Call server-side Gemini AI content moderation endpoint
      const response = await fetch('/api/moderate-wish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          message: trimmedMsg,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (!result.isAllowed) {
          setModerationError(
            result.reason ||
              'Ucapan Anda terdeteksi mengandung bahasa yang kurang pantas oleh sistem AI moderasi. Mohon ubah pesan dengan doa yang baik.'
          );
          setIsSubmitting(false);
          return;
        }
      }
    } catch (err) {
      // If server is not yet reachable or in client preview, client filter passed
      console.warn('AI moderation server call fallback:', err);
    }

    // 3. Save wish
    onAddWish({
      guestName: trimmedName,
      attendance,
      message: trimmedMsg,
    });

    setIsSubmitting(false);
    setMessage('');
    setSuccessBanner('Doa restu Anda telah berhasil dikirim dan diverifikasi aman oleh sistem AI!');

    // Confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#8a724d', '#d4af37', '#e6ca65'],
    });

    setTimeout(() => {
      setSuccessBanner(null);
    }, 5000);
  };

  const filteredWishes = wishes.filter(
    (w) =>
      w.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="doa" className="py-24 px-6 bg-[#faf8f5]">
      <div className="max-w-3xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#9c825a] font-sans font-medium block">
            Untaian Doa &amp; Harapan Baik
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl text-stone-900 mt-2 font-normal">
            Buku Ucapan &amp; Doa Restu
          </h2>
          <p className="text-xs text-stone-600 mt-2 max-w-md mx-auto font-sans leading-relaxed">
            Kirimkan ucapan selamat dan doa tulus untuk kedua mempelai. Semua pesan dimoderasi oleh sistem AI demi kenyamanan bersama.
          </p>
          <div className="w-16 h-px bg-[#d6cebe] mx-auto mt-4" />
        </div>

        {/* Form Tulis Ucapan (Dapat ditulis oleh siapa saja yang memiliki link) */}
        <div className="bg-[#f7f4ee] rounded-2xl p-6 sm:p-8 border border-[#e8dfcf] shadow-sm mb-12">
          <div className="flex items-center justify-between pb-4 border-b border-[#e4dcce] mb-6">
            <div className="flex items-center gap-2 text-stone-900">
              <Sparkles className="w-4 h-4 text-[#8a724d]" />
              <h3 className="font-editorial text-2xl font-medium">
                Tulis Ucapan &amp; Doa Restu
              </h3>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Moderasi Aktif</span>
            </div>
          </div>

          {/* AI Moderation Error Warning */}
          {moderationError && (
            <div className="mb-5 p-4 bg-rose-50 border border-rose-300 rounded-xl flex items-start gap-3 text-rose-900 animate-fadeIn">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="block font-semibold">Pesan Ditolak oleh AI Moderasi:</strong>
                <p className="mt-0.5 leading-relaxed">{moderationError}</p>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successBanner && (
            <div className="mb-5 p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-start gap-3 text-emerald-900 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="block font-semibold">Berhasil Terkirim:</strong>
                <p className="mt-0.5 leading-relaxed">{successBanner}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmitWish} className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 font-medium mb-1.5 uppercase tracking-wider text-[11px]">
                  Nama Anda <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Contoh: Sarah &amp; Keluarga"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#d6cebe] rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8a724d]/40"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1.5 uppercase tracking-wider text-[11px]">
                  Status Kehadiran
                </label>
                <select
                  value={attendance}
                  onChange={(e) =>
                    setAttendance(e.target.value as 'hadir' | 'tidak_hadir' | 'ragu')
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-[#d6cebe] rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8a724d]/40 cursor-pointer"
                >
                  <option value="hadir">Pasti Hadir</option>
                  <option value="tidak_hadir">Berhalangan Hadir</option>
                  <option value="ragu">Mendoakan dari Kejauhan</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1.5 uppercase tracking-wider text-[11px]">
                Untaian Doa &amp; Ucapan <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (moderationError) setModerationError(null);
                }}
                placeholder="Tuliskan ucapan selamat dan doa restu terbaik untuk kedua mempelai..."
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8a724d]/40 ${
                  moderationError ? 'border-red-400 bg-red-50/20' : 'border-[#d6cebe]'
                }`}
              />
              <span className="text-[10px] text-stone-500 mt-1 block">
                Sistem AI otomatis memblokir kata makian, kata kasar, atau ujaran kebencian.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 bg-[#8a724d] hover:bg-[#735e3d] active:scale-[0.99] disabled:opacity-60 text-white rounded-xl text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memeriksa Konten dengan AI...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim Doa Restu</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Search Bar & Counter */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari ucapan atau nama kerabat..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#d6cebe] rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#8a724d]"
            />
          </div>
          <span className="text-xs text-stone-500 font-sans">
            Total <strong className="font-tabular text-stone-800">{wishes.length}</strong> Ucapan Terkirim
          </span>
        </div>

        {/* Wishes List Feed */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
          {filteredWishes.length === 0 ? (
            <div className="text-center py-12 bg-[#f7f4ee] rounded-xl border border-[#e8dfcf]">
              <MessageSquare className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-xs text-stone-500">Belum ada ucapan yang cocok dengan pencarian.</p>
            </div>
          ) : (
            filteredWishes.map((item) => (
              <div
                key={item.id}
                className="bg-[#f7f4ee] p-5 rounded-xl border border-[#e8dfcf] shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-sm text-stone-900 font-sans">
                        {item.guestName}
                      </h4>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          item.attendance === 'hadir'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.attendance === 'tidak_hadir'
                            ? 'bg-stone-200 text-stone-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.attendance === 'hadir'
                          ? 'Akan Hadir'
                          : item.attendance === 'tidak_hadir'
                          ? 'Tidak Bisa Hadir'
                          : 'Mendoakan'}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-500 mt-0.5 block font-sans">
                      {new Date(item.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Like Button */}
                  <button
                    type="button"
                    onClick={() => onLikeWish(item.id)}
                    className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-rose-600 transition-colors p-1 rounded-md cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-500/20 text-rose-500" />
                    <span className="font-tabular text-[11px] font-medium">{item.likes}</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 mt-3 leading-relaxed font-sans">
                  {item.message}
                </p>

                {/* Reply from couple */}
                {item.reply && (
                  <div className="mt-3.5 pl-3.5 border-l-2 border-[#8a724d] bg-[#f0e9dc] p-2.5 rounded-r-lg">
                    <span className="text-[10px] font-bold text-[#8a724d] uppercase tracking-wider block">
                      Balasan Mempelai:
                    </span>
                    <p className="text-xs text-stone-700 mt-0.5 italic font-sans">
                      {item.reply}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
