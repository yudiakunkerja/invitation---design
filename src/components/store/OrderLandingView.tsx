import React, { useState } from 'react';
import {
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  ExternalLink,
  Gift,
  Heart,
  HelpCircle,
  LayoutDashboard,
  Mail,
  MapPin,
  MessageCircle,
  Music,
  Palette,
  QrCode,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Youtube,
} from 'lucide-react';
import { WeddingThemeId } from '../../types/theme';
import { PackageTier, WeddingOrder } from '../../types/wedding';
import { initialWeddingConfig } from '../../data/initialData';

interface OrderLandingViewProps {
  onOpenSampleInvitation: (themeId?: WeddingThemeId) => void;
  onOpenDashboard: () => void;
  onCreateNewOrder: (newOrder: WeddingOrder) => void;
}

export const OrderLandingView: React.FC<OrderLandingViewProps> = ({
  onOpenSampleInvitation,
  onOpenDashboard,
  onCreateNewOrder,
}) => {
  // Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [groomNick, setGroomNick] = useState('');
  const [brideNick, setBrideNick] = useState('');
  const [eventDate, setEventDate] = useState('2026-11-14');
  const [selectedPackage, setSelectedPackage] = useState<PackageTier>('Gold');
  const [selectedTheme, setSelectedTheme] = useState<WeddingThemeId>('champagne');
  const [notes, setNotes] = useState('');
  const [createdOrderResult, setCreatedOrderResult] = useState<WeddingOrder | null>(null);

  const pricingPackages: Array<{
    name: PackageTier;
    price: string;
    originalPrice: string;
    badge?: string;
    popular?: boolean;
    features: string[];
  }> = [
    {
      name: 'Silver',
      price: 'Rp 149.000',
      originalPrice: 'Rp 299.000',
      features: [
        'Masa Aktif Selamanya',
        'Pilihan 5 Tema Server Desain',
        'Sapaan Nama Tamu Tanpa Batas',
        'Amplop Digital & No Rekening',
        'Navigasi Peta Google Maps',
        'RSVP Standar',
        'Musik Romantis Akustik',
      ],
    },
    {
      name: 'Gold',
      price: 'Rp 249.000',
      originalPrice: 'Rp 450.000',
      popular: true,
      badge: 'Paling Diminati',
      features: [
        'Semua Fitur Paket Silver',
        'Musik Custom Direct YouTube (Audio Saja)',
        'Moderasi Doa Cerdas AI (Anti-Makian)',
        'QR Code Tiket Tamu Masuk Meja Resepsionis',
        'Galeri Foto Pre-Wedding (10 Foto)',
        'Amplop QRIS Direct ke Rekening Anda',
        'Dasbor Tamu & Check-in Meja Resepsionis',
        'Ekspor Daftar Tamu CSV / Excel',
      ],
    },
    {
      name: 'Platinum',
      price: 'Rp 399.000',
      originalPrice: 'Rp 750.000',
      badge: 'Eksklusif VIP',
      features: [
        'Semua Fitur Paket Gold',
        'Galeri Foto & Video Pre-Wedding Tanpa Batas',
        'Timeline Kisah Cinta (Love Story Milestone)',
        'Dukungan Sesi Acara Berbeda (Akad & Resepsi 2 Sesi)',
        'WhatsApp Generator Pesan Undangan Personal 1-Klik',
        'Pengaturan Custom Lengkap di Dasbor',
        'Bimbingan Pengisian Data hingga Selesai',
      ],
    },
  ];

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groomNick.trim() || !brideNick.trim() || !clientPhone.trim()) {
      alert('Mohon isi nama kedua mempelai dan nomor WhatsApp pemesan.');
      return;
    }

    const orderId = `ORD-${Date.now().toString().slice(-4)}`;
    const formattedPrice =
      selectedPackage === 'Silver'
        ? 'Rp 149.000'
        : selectedPackage === 'Platinum'
        ? 'Rp 399.000'
        : 'Rp 249.000';

    const newOrder: WeddingOrder = {
      id: orderId,
      clientName: clientName.trim() || `${groomNick} & ${brideNick}`,
      clientPhone: clientPhone.trim(),
      packageName: selectedPackage,
      priceFormatted: formattedPrice,
      status: 'baru',
      createdAt: new Date().toISOString(),
      weddingSlug: `${groomNick.toLowerCase()}-${brideNick.toLowerCase()}`,
      config: {
        ...initialWeddingConfig,
        eventTitle: `The Wedding of ${groomNick} & ${brideNick}`,
        theme: selectedTheme,
        groom: {
          ...initialWeddingConfig.groom,
          nickName: groomNick,
          fullName: groomNick,
        },
        bride: {
          ...initialWeddingConfig.bride,
          nickName: brideNick,
          fullName: brideNick,
        },
        ceremony: {
          ...initialWeddingConfig.ceremony,
          date: eventDate,
          dateFormatted: new Date(eventDate).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
        },
        reception: {
          ...initialWeddingConfig.reception,
          date: eventDate,
          dateFormatted: new Date(eventDate).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
        },
      },
      guests: [],
      wishes: [],
      notes: notes.trim() || 'Pesanan online melalui form pemesanan undgn.',
    };

    onCreateNewOrder(newOrder);
    setCreatedOrderResult(newOrder);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 font-sans selection:bg-[#8a724d] selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 px-6 py-4 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-editorial text-2xl font-bold tracking-tight text-stone-900">
              NitiLestari
            </span>
            <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider text-stone-400 font-sans">
              · Undangan Digital Studio
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-stone-600">
            <button
              onClick={() => scrollToSection('fitur')}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Fitur Unggulan
            </button>
            <button
              onClick={() => scrollToSection('katalog-tema')}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Katalog Tema
            </button>
            <button
              onClick={() => scrollToSection('harga')}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Paket Harga
            </button>
            <button
              onClick={() => scrollToSection('pesan')}
              className="text-[#8a724d] font-semibold hover:underline cursor-pointer"
            >
              Pesan Sekarang
            </button>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => scrollToSection('pesan')}
              className="px-4 py-2 bg-[#8a724d] hover:bg-[#735e3d] text-white rounded-lg text-xs font-semibold uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
            >
              <span>Mulai Buat Pesanan</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-6 max-w-6xl mx-auto text-center relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2ece1] border border-[#e4dcce] text-[#7a643e] text-xs font-medium mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-[#8a724d]" />
          <span>Platform Undangan Digital Website Premium Seperti undgn.id</span>
        </div>

        <h1 className="font-editorial text-4xl sm:text-6xl text-stone-900 font-bold max-w-4xl mx-auto leading-tight">
          Buat Undangan Digital Elegan &amp; Kelola Tamu Secara Real-Time
        </h1>

        <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto mt-5 leading-relaxed font-sans">
          Jadikan hari pernikahan Anda berkesan dengan desain mewah, musik romantis direct YouTube, filter AI moderasi doa, amplop QRIS langsung ke rekening Anda, dan dasbor check-in hari-H.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => scrollToSection('pesan')}
            className="w-full sm:w-auto px-7 py-3.5 bg-[#8a724d] hover:bg-[#735e3d] text-white rounded-xl text-sm font-semibold tracking-wide uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Pesan Undangan Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onOpenSampleInvitation()}
            className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-xl text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Lihat Live Demo Undangan</span>
            <ExternalLink className="w-4 h-4 text-stone-500" />
          </button>
        </div>

        {/* Highlight Trust Badges */}
        <div className="mt-12 pt-8 border-t border-stone-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3">
            <span className="block text-2xl font-bold text-stone-900 font-editorial">100%</span>
            <span className="text-xs text-stone-500">QRIS Cair Langsung</span>
          </div>
          <div className="p-3">
            <span className="block text-2xl font-bold text-stone-900 font-editorial">5 Tema</span>
            <span className="text-xs text-stone-500">Desain Estetika Mewah</span>
          </div>
          <div className="p-3">
            <span className="block text-2xl font-bold text-stone-900 font-editorial">AI Filter</span>
            <span className="text-xs text-stone-500">Doa Bebas Kata Kasar</span>
          </div>
          <div className="p-3">
            <span className="block text-2xl font-bold text-stone-900 font-editorial">Real-Time</span>
            <span className="text-xs text-stone-500">RSVP &amp; Tiket QR Masuk</span>
          </div>
        </div>
      </section>

      {/* Fitur Unggulan Section */}
      <section id="fitur" className="py-20 bg-white border-y border-stone-200 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#8a724d] font-bold block">
              Fitur Lengkap &amp; Terpercaya
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-stone-900 mt-2 font-bold">
              Kenyamanan Maksimal Bagi Pengantin &amp; Tamu
            </h2>
            <p className="text-xs text-stone-500 mt-2">
              Didesain khusus untuk memenuhi seluruh kebutuhan pesta pernikahan modern di Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-[#8a724d]">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-stone-900 font-sans">
                5 Pilihan Tema Desain
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Pilih gaya favorit mulai dari Champagne Royal Gold, Emerald Botanical, Rose Blush, Midnight Sapphire, hingga Tradisi Jawa Heritage.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                <Youtube className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-stone-900 font-sans">
                Musik Direct YouTube (Audio Saja)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Pilih musik pernikahan apa pun dari YouTube. Lagu otomatis berputar saat tamu membuka amplop tanpa tombol speaker yang mengganggu.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-stone-900 font-sans">
                Moderasi Doa Cerdas Berbasis AI
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Buku doa dilindungi oleh teknologi Gemini AI yang otomatis mendeteksi dan memblokir kata-kata kasar, makian, atau pesan tidak pantas.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-stone-900 font-sans">
                Amplop Digital &amp; QRIS 100% Langsung
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tamu dapat mengirim kado dengan mudah. Salin nomor rekening 1-klik atau scan QRIS bank/e-wallet Anda tanpa potongan komisi.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-stone-900 font-sans">
                RSVP &amp; QR Code Tiket Masuk
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Konfirmasi kehadiran langsung masuk ke dasbor Anda, dan tamu mendapatkan e-ticket ber-QR code untuk registrasi cepat di meja tamu hari-H.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-stone-900 font-sans">
                Dasbor Manajemen Tamu Lengkap
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Kustomisasi seluruh teks, foto direct link, generator undangan WhatsApp otomatis, ekspor ke CSV, dan scanner check-in hari-H.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Katalog Tema Section (seperti undgn.id) */}
      <section id="katalog-tema" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-[#8a724d] font-bold block">
            Pilihan Tema Desain
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-stone-900 mt-2 font-bold">
            Pilih Tema yang Mencerminkan Cerita Cinta Anda
          </h2>
          <p className="text-xs text-stone-500 mt-2">
            Klik tema di bawah ini untuk langsung mencoba pratinjau live undangan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              id: 'champagne',
              title: 'Champagne Royal Gold',
              desc: 'Gaya kemewahan klasik dengan ornamen emas hangat, tipografi serif anggun, dan bingkai floral mewah.',
              badge: 'Tema Terfavorit',
              color: '#8A724D',
            },
            {
              id: 'emerald',
              title: 'Emerald Botanical Garden',
              desc: 'Harmoni kesegaran alam dengan palet hijau sage, dedaunan botani lembut, dan kesan asri romantis.',
              badge: 'Konsep Alam',
              color: '#2D6A4F',
            },
            {
              id: 'rose',
              title: 'Rose Blush & Velvet',
              desc: 'Sentuhan feminin lembut dengan palet blush pink, bunga mawar mekar, dan suasana penuh kelembutan.',
              badge: 'Romantis',
              color: '#A84458',
            },
            {
              id: 'navy',
              title: 'Midnight Sapphire',
              desc: 'Pesona malam berbintang dengan sentuhan royal sapphire blue, perak mewah, dan gaya kontemporer modern.',
              badge: 'Modern Glam',
              color: '#1E3A8A',
            },
            {
              id: 'heritage',
              title: 'Jawa Sogan & Batik Heritage',
              desc: 'Kearifan tradisi luhur dengan ornamen batik sogan, nuansa kayu cendana, dan kehangatan adat budaya.',
              badge: 'Tradisional',
              color: '#78350F',
            },
          ].map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[10px] uppercase font-bold text-[#8a724d] bg-[#f2ece1] px-2.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-editorial text-2xl font-bold text-stone-900">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onOpenSampleInvitation(item.id as WeddingThemeId)}
                  className="text-xs font-semibold text-[#8a724d] hover:text-[#735e3d] flex items-center gap-1 cursor-pointer"
                >
                  <span>Coba Demo Tema Ini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedTheme(item.id as WeddingThemeId);
                    scrollToSection('pesan');
                  }}
                  className="px-3 py-1 bg-[#8a724d] text-white rounded-md text-[11px] font-medium hover:bg-[#735e3d] cursor-pointer"
                >
                  Pilih Tema
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricelist / Paket Harga Section */}
      <section id="harga" className="py-20 bg-stone-100/70 border-y border-stone-200 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest text-[#8a724d] font-bold block">
              Pilihan Paket Terbaik
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-stone-900 mt-2 font-bold">
              Harga Terjangkau, Fitur Tanpa Kompromi
            </h2>
            <p className="text-xs text-stone-500 mt-2">
              Satu kali bayar, aktif selamanya tanpa biaya bulanan tersembunyi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {pricingPackages.map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                  pkg.popular
                    ? 'bg-white border-2 border-[#8a724d] shadow-xl ring-4 ring-[#8a724d]/10'
                    : 'bg-white border border-stone-200 shadow-sm'
                }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#8a724d] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {pkg.badge}
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-xl text-stone-900 font-sans">{pkg.name}</h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-stone-900">
                      {pkg.price}
                    </span>
                    <span className="text-xs text-stone-400 line-through">
                      {pkg.originalPrice}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">Sekali bayar untuk seluruh acara</p>

                  <div className="w-full h-px bg-stone-100 my-6" />

                  <ul className="space-y-3 text-xs text-stone-700">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPackage(pkg.name);
                      scrollToSection('pesan');
                    }}
                    className={`w-full py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                      pkg.popular
                        ? 'bg-[#8a724d] hover:bg-[#735e3d] text-white shadow-xs'
                        : 'bg-stone-900 hover:bg-stone-800 text-white'
                    }`}
                  >
                    Pilih Paket {pkg.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Pemesanan Undangan (Order Online) */}
      <section id="pesan" className="py-20 px-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 bg-stone-900 text-white">
            <span className="text-xs uppercase tracking-widest text-[#e6ca65] font-semibold block">
              Formulir Pemesanan Online
            </span>
            <h2 className="font-editorial text-3xl font-bold mt-1">
              Pesan Undangan Pernikahan Anda Sekarang
            </h2>
            <p className="text-xs text-stone-300 mt-1.5 font-sans leading-relaxed">
              Isi data awal pernikahan Anda di bawah ini. Sistem kami akan langsung menyiapkan link undangan dan akun dasbor admin Anda secara otomatis.
            </p>
          </div>

          <form onSubmit={handleOrderSubmit} className="p-6 sm:p-8 space-y-6 text-xs">
            {/* Step 1: Data Pemesan */}
            <div>
              <h3 className="font-bold text-stone-900 text-sm mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#8a724d] text-white flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Data Pemesan &amp; Kontak</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Nama Pemesan / Penanggung Jawab *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Raden Arya Kusuma"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#8a724d]/30 focus:border-[#8a724d]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Nomor WhatsApp Aktif *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081289213940"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#8a724d]/30 focus:border-[#8a724d] font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Nama Kedua Mempelai */}
            <div className="pt-4 border-t border-stone-100">
              <h3 className="font-bold text-stone-900 text-sm mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#8a724d] text-white flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>Nama Kedua Mempelai &amp; Tanggal Acara</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Nama Panggilan Pengantin Pria *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Arya"
                    value={groomNick}
                    onChange={(e) => setGroomNick(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#8a724d]/30 focus:border-[#8a724d]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Nama Panggilan Pengantin Wanita *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Citra"
                    value={brideNick}
                    onChange={(e) => setBrideNick(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#8a724d]/30 focus:border-[#8a724d]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Tanggal Rencana Pernikahan *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#8a724d]/30 focus:border-[#8a724d]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Pilihan Paket & Tema */}
            <div className="pt-4 border-t border-stone-100">
              <h3 className="font-bold text-stone-900 text-sm mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#8a724d] text-white flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>Pilihan Paket &amp; Tema Awal</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-1.5">
                    Pilihan Paket Undangan:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Silver', 'Gold', 'Platinum'] as PackageTier[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setSelectedPackage(p)}
                        className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                          selectedPackage === p
                            ? 'border-[#8a724d] bg-[#f2ece1] text-[#8a724d] font-bold'
                            : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <span className="block">{p}</span>
                        <span className="text-[10px] text-stone-500 font-normal">
                          {p === 'Silver' ? '149rb' : p === 'Gold' ? '249rb' : '399rb'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1.5">
                    Pilihan Desain Tema Awal:
                  </label>
                  <select
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value as WeddingThemeId)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg bg-white text-xs"
                  >
                    <option value="champagne">Champagne Royal Gold (Emas Hangat)</option>
                    <option value="emerald">Emerald Botanical Garden (Hijau Sage)</option>
                    <option value="rose">Rose Blush &amp; Velvet (Blush Romantis)</option>
                    <option value="navy">Midnight Sapphire (Biru Malam Glam)</option>
                    <option value="heritage">Jawa Sogan &amp; Batik Heritage (Adat Klasik)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 4: Catatan Khusus */}
            <div className="pt-4 border-t border-stone-100">
              <label className="block text-stone-700 font-medium mb-1">
                Catatan / Request Khusus (Opsional):
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Kami ingin menggunakan lagu Ed Sheeran - Perfect dari YouTube untuk musik latar..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-xs"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-[#8a724d] hover:bg-[#735e3d] text-white rounded-xl text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Kirim Pesanan &amp; Buat Undangan Saya</span>
              </button>
              <p className="text-center text-[11px] text-stone-500 mt-2">
                🔒 Data aman. Undangan Anda dapat langsung dilihat dan disesuaikan melalui dasbor.
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* Success Modal after ordering */}
      {createdOrderResult && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg border border-stone-200 shadow-2xl p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-editorial text-2xl font-bold text-stone-900">
              Pesanan Undangan Berhasil Dibuat!
            </h3>

            <p className="text-xs text-stone-600 leading-relaxed">
              Selamat! Proyek undangan pernikahan untuk <strong>{createdOrderResult.clientName}</strong> telah berhasil didaftarkan dengan ID <strong>#{createdOrderResult.id}</strong> (Paket {createdOrderResult.packageName}).
            </p>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-left text-xs space-y-1 font-mono">
              <div className="text-stone-700">ID Pesanan: #{createdOrderResult.id}</div>
              <div className="text-stone-700">Paket: {createdOrderResult.packageName} ({createdOrderResult.priceFormatted})</div>
              <div className="text-stone-700">Tema: {createdOrderResult.config.theme}</div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  setCreatedOrderResult(null);
                  onOpenSampleInvitation(createdOrderResult.config.theme);
                }}
                className="flex-1 py-3 bg-[#8a724d] hover:bg-[#735e3d] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Buka Undangan Baru Saya
              </button>

              <button
                type="button"
                onClick={() => {
                  setCreatedOrderResult(null);
                  onOpenDashboard();
                }}
                className="flex-1 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Buka Dasbor Pesanan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 bg-stone-900 text-stone-400 text-xs px-6 border-t border-stone-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-editorial text-xl font-bold text-white">NitiLestari</span>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Platform Undangan Digital Pernikahan &amp; Manajemen Tamu Real-time.
            </p>
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <button
              onClick={() => scrollToSection('fitur')}
              className="hover:text-white cursor-pointer"
            >
              Fitur
            </button>
            <button
              onClick={() => scrollToSection('katalog-tema')}
              className="hover:text-white cursor-pointer"
            >
              Tema
            </button>
            <button
              onClick={() => scrollToSection('harga')}
              className="hover:text-white cursor-pointer"
            >
              Harga
            </button>
            <button onClick={onOpenDashboard} className="hover:text-white cursor-pointer">
              Dasbor
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
