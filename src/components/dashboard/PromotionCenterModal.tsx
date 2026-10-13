import React, { useState } from 'react';
import {
  Briefcase,
  Check,
  Copy,
  ExternalLink,
  Megaphone,
  MessageCircle,
  Share2,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { WeddingConfig } from '../../types/wedding';

interface PromotionCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WeddingConfig;
}

export const PromotionCenterModal: React.FC<PromotionCenterModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const baseUrl = window.location.origin;
  const guestDemoLink = `${baseUrl}/?to=Nama+Tamu`;
  const adminDirectLink = `${baseUrl}/?admin=true`;

  const promoCopywriting = `✨ *JASA PEMBUATAN UNDANGAN DIGITAL WEBSITE ELEGAN & INTERAKTIF* ✨

Hai Kak! Sedang mempersiapkan hari pernikahan atau acara spesial? 
Buat momen bahagia Kakak lebih berkesan, modern, dan hemat dengan Undangan Digital Website Premium (seperti undgn.id)!

💎 *Keunggulan Undangan Digital Kami:*
✅ *Desain Mewah & 5 Pilihan Tema:* Champagne Gold, Emerald Garden, Rose Velvet, Midnight Sapphire, & Jawa Heritage
✅ *RSVP & Manajemen Tamu Real-Time:* Tahu pasti siapa yang hadir, jumlah porsi catering, & sesi acara
✅ *Sapaan Nama Tamu Personalisasi:* Setiap tamu mendapatkan link dengan namanya sendiri
✅ *Amplop Digital & QRIS Terhubung Langsung:* Dana kado langsung cair ke rekening/e-wallet Kakak (tanpa potongan!)
✅ *Buku Doa Dilengkapi AI Filter:* Bebas dari kata-kata kotor/makian
✅ *QR Code Tiket Masuk:* Memudahkan registrasi tamu di meja penerima tamu
✅ *Navigasi Google Maps & Musik Latar Romantis*
✅ *Foto Pra-Wedding & Galeri Kenangan Tanpa Batas*

📲 *Lihat Contoh Live Demo Di Sini:*
${guestDemoLink}

Hubungi kami sekarang untuk promo khusus & konsultasi desain gratis! 💌`;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
          <div className="flex items-center gap-2.5">
            <Megaphone className="w-5 h-5 text-[#e6ca65]" />
            <div>
              <h3 className="font-semibold text-base font-sans">
                Panduan Promosi &amp; Pemisahan Tampilan (Admin vs Tamu)
              </h3>
              <p className="text-[11px] text-stone-300 font-sans">
                Strategi menawarkan jasa undangan digital Anda ke calon klien &amp; cara membagikan link
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs font-sans">
          {/* Section 1: Pemisahan 2 Tampilan */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#8a724d]" />
              <span>1. Pemisahan Tampilan: Tamu vs Admin Pengantin</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                  A. Tampilan Tamu (Undangan Bersih)
                </span>
                <p className="text-stone-600 mt-1 leading-relaxed">
                  Tautan yang dibagikan ke para tamu undangan. Tamu hanya melihat undangan pernikahan yang anggun, buka amplop, konfirmasi RSVP, dan menulis doa. <strong>Tombol dasbor disembunyikan</strong> agar tamu tidak bisa mengutak-atik data.
                </p>
                <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-stone-400 truncate">
                    {baseUrl}/?to=Nama+Tamu
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(guestDemoLink, 'guest-link')}
                    className="text-[#8a724d] font-semibold flex items-center gap-1"
                  >
                    {copiedKey === 'guest-link' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'guest-link' ? 'Tersalin' : 'Salin Link'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-amber-800 block">
                  B. Tampilan Admin (Pengantin &amp; WO)
                </span>
                <p className="text-stone-600 mt-1 leading-relaxed">
                  Tautan khusus untuk Anda atau pengantin untuk mengedit foto-foto, mengubah tema, melihat siapa yang hadir, scan check-in di hari-H, dan ekspor CSV.
                </p>
                <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-stone-400 truncate">
                    {baseUrl}/?admin=true
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(adminDirectLink, 'admin-link')}
                    className="text-[#8a724d] font-semibold flex items-center gap-1"
                  >
                    {copiedKey === 'admin-link' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'admin-link' ? 'Tersalin' : 'Salin Link'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Copywriting Promosi Siap Pakai */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>2. Teks Promosi Siap Salin (WhatsApp &amp; Media Sosial)</span>
              </h4>
              <button
                type="button"
                onClick={() => handleCopy(promoCopywriting, 'promo-text')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedKey === 'promo-text' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'promo-text' ? 'Tersalin!' : 'Salin Teks Iklan'}</span>
              </button>
            </div>
            <div className="bg-white p-3.5 rounded-lg border border-stone-200 font-sans text-stone-700 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
              {promoCopywriting}
            </div>
          </div>

          {/* Section 3: Cara Mempromosikan & Mendapatkan Klien */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>3. Langkah-Langkah Mempromosikan Bisnis Undangan Ini:</span>
            </h4>
            <div className="space-y-2 text-stone-700 leading-relaxed">
              <p>
                <strong>1. Rekam Video Layar Singkat (Reels / TikTok):</strong> Buka link undangan di HP Anda, rekam momen membuka amplop bunga, alunan musik yang memutar otomatis, efek kelopak bunga gugur, dan live RSVP. Ini sangat menarik bagi calon pengantin!
              </p>
              <p>
                <strong>2. Tawarkan ke Lingkaran Terdekat:</strong> Cari teman atau keluarga yang akan menikah dalam 1–6 bulan ke depan. Berikan harga perkenalan atau gratis 1 tema sebagai portofolio awal Anda.
              </p>
              <p>
                <strong>3. Kerjasama dengan Vendor Pernikahan:</strong> Jalin kemitraan dengan fotografer pre-wedding, Makeup Artist (MUA), atau Wedding Organizer (WO) lokal dengan sistem bagi komisi.
              </p>
              <p>
                <strong>4. Tonjolkan Fitur Unik yang Tidak Ada di Kompetitor:</strong> Tunjukkan fitur AI Moderasi Doa (bebas kata kotor), QRIS yang 100% langsung cair ke rekening pribadi tanpa potongan, dan dasbor check-in resepsionis hari-H.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#8a724d] hover:bg-[#735e3d] text-white rounded-lg font-medium transition-colors cursor-pointer text-xs uppercase tracking-wider"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
