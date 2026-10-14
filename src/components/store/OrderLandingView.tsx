import React, { useState } from 'react';
import {
  ArrowRight,
  Bot,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  ExternalLink,
  Eye,
  Heart,
  Instagram,
  LayoutDashboard,
  Mail,
  MapPin,
  MessageCircle,
  Music,
  Palette,
  Phone,
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
  onGoToOrderDashboard?: (orderId: string) => void;
}

export const OrderLandingView: React.FC<OrderLandingViewProps> = ({
  onOpenSampleInvitation,
  onOpenDashboard,
  onCreateNewOrder,
  onGoToOrderDashboard,
}) => {
  // Form State - Synchronized with Couple Profile
  const [selectedPackage, setSelectedPackage] = useState<PackageTier>('Gold');
  const [selectedTheme, setSelectedTheme] = useState<WeddingThemeId>('champagne');

  // Groom Details
  const [groomFullName, setGroomFullName] = useState('');
  const [groomNick, setGroomNick] = useState('');
  const [groomParents, setGroomParents] = useState('');
  const [groomIg, setGroomIg] = useState('');

  // Bride Details
  const [brideFullName, setBrideFullName] = useState('');
  const [brideNick, setBrideNick] = useState('');
  const [brideParents, setBrideParents] = useState('');
  const [brideIg, setBrideIg] = useState('');

  // Event & Contact Details
  const [eventDate, setEventDate] = useState('2026-11-20');
  const [eventVenue, setEventVenue] = useState('');
  const [eventCity, setEventCity] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Post-order state
  const [createdOrderResult, setCreatedOrderResult] = useState<{
    order: WeddingOrder;
    waUrl: string;
  } | null>(null);

  const [copiedLink, setCopiedLink] = useState(false);

  // Pricing Packages (Displayed right at the beginning)
  const pricingPackages: Array<{
    name: PackageTier;
    price: string;
    originalPrice: string;
    badge?: string;
    popular?: boolean;
    description: string;
    features: string[];
  }> = [
    {
      name: 'Silver',
      price: 'Rp 149.000',
      originalPrice: 'Rp 299.000',
      description: 'Paket esensial pernikahan praktis dan ekonomis.',
      features: [
        'Masa Aktif Selamanya',
        'Pilihan 5 Desain Tema Estetik',
        'Sapaan Nama Tamu Tanpa Batas',
        'Amplop Digital Rekening Bank',
        'Navigasi Peta Google Maps',
        'Buku Doa Restu & RSVP Tamu',
        'Background Musik Romantis',
      ],
    },
    {
      name: 'Gold',
      price: 'Rp 249.000',
      originalPrice: 'Rp 450.000',
      popular: true,
      badge: 'Paling Diminati Pengantin',
      description: 'Paket terlengkap dengan fitur modern terfavorit.',
      features: [
        'Semua Fitur Paket Silver',
        'Custom Musik Direct YouTube (Audio Saja)',
        'Moderasi Doa Cerdas AI (Bebas Kata Kasar)',
        'QR Code Tiket Tamu Meja Resepsionis Hari-H',
        'Galeri Foto Pre-Wedding (10 Foto)',
        'Amplop QRIS Langsung ke Rekening Pribadi',
        'Dasbor Manajemen Tamu & Check-in',
        'Ekspor Data Tamu ke File Excel / CSV',
      ],
    },
    {
      name: 'Platinum',
      price: 'Rp 399.000',
      originalPrice: 'Rp 750.000',
      badge: 'Eksklusif VIP',
      description: 'Kemewahan tanpa batas dengan fleksibilitas penuh.',
      features: [
        'Semua Fitur Paket Gold',
        'Galeri Foto Pre-Wedding Tanpa Batas',
        'Milestone Kisah Cinta (Love Story)',
        'Pengaturan Sesi Acara Berbeda (Akad & Resepsi)',
        'Generator Undangan Personal WhatsApp 1-Klik',
        'Kustomisasi Penuh Tema, Foto, & Rekening di Dasbor',
        'Prioritas Pendampingan & Konsultasi Langsung',
      ],
    },
  ];

  // Showcase of Themes with Realistic High-Fidelity Wedding Mockups
  const themeShowcase = [
    {
      id: 'champagne',
      name: 'Champagne Royal Gold',
      badge: 'Best Seller',
      color: '#8A724D',
      bgPreview: '#faf8f5',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      desc: 'Kemewahan abadi khas high-end editorial dengan aksen emas hangat, tipografi klasik serif, dan bingkai floral mewah.',
    },
    {
      id: 'emerald',
      name: 'Emerald Botanical Garden',
      badge: 'Konsep Alam Asri',
      color: '#2D6A4F',
      bgPreview: '#f4f7f4',
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      desc: 'Sentuhan alam segar dengan harmoni warna hijau sage, dedaunan botani yang menenangkan, dan atmosfer taman romantis.',
    },
    {
      id: 'rose',
      name: 'Rose Blush & Velvet',
      badge: 'Paling Romantis',
      color: '#A84458',
      bgPreview: '#faf5f6',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      desc: 'Keanggunan feminin yang manis dengan kelopak mawar mekar, palet blush pink lembut, dan nuansa cinta yang mendalam.',
    },
    {
      id: 'navy',
      name: 'Midnight Sapphire',
      badge: 'Modern Glamour',
      color: '#1E3A8A',
      bgPreview: '#f4f7fb',
      image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
      desc: 'Pesona malam berbintang yang berkelas dengan royal sapphire blue, perak mewah, dan tipografi kontemporer.',
    },
    {
      id: 'heritage',
      name: 'Jawa Sogan & Batik Heritage',
      badge: 'Adat Nusantara',
      color: '#78350F',
      bgPreview: '#fcf8f2',
      image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
      desc: 'Keagungan tradisi budaya luhur Nusantara dengan sentuhan ornamen batik sogan, nuansa kayu cendana, dan kehangatan keluarga.',
    },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyStoreLink = () => {
    const storeUrl = `${window.location.origin}${window.location.pathname}?view=toko`;
    navigator.clipboard.writeText(storeUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!groomNick.trim() || !brideNick.trim() || !clientPhone.trim()) {
      alert('Mohon lengkapi nama panggilan kedua mempelai dan nomor WhatsApp pemesan.');
      return;
    }

    const orderId = `ORD-${Date.now().toString().slice(-4)}`;
    const formattedPrice =
      selectedPackage === 'Silver'
        ? 'Rp 149.000'
        : selectedPackage === 'Platinum'
        ? 'Rp 399.000'
        : 'Rp 249.000';

    const cleanGroomFull = groomFullName.trim() || groomNick.trim();
    const cleanGroomNick = groomNick.trim();
    const cleanGroomParents =
      groomParents.trim() || `Putra tercinta dari Bpk. & Ibu Orang Tua ${cleanGroomNick}`;
    const cleanGroomIg = groomIg.trim() ? (groomIg.startsWith('@') ? groomIg.trim() : `@${groomIg.trim()}`) : '@';

    const cleanBrideFull = brideFullName.trim() || brideNick.trim();
    const cleanBrideNick = brideNick.trim();
    const cleanBrideParents =
      brideParents.trim() || `Putri tercinta dari Bpk. & Ibu Orang Tua ${cleanBrideNick}`;
    const cleanBrideIg = brideIg.trim() ? (brideIg.startsWith('@') ? brideIg.trim() : `@${brideIg.trim()}`) : '@';

    const venue = eventVenue.trim() || 'Gedung Pertemuan / Kediaman Mempelai';
    const city = eventCity.trim() || 'Indonesia';

    const newOrder: WeddingOrder = {
      id: orderId,
      clientName: `${cleanGroomNick} & ${cleanBrideNick}`,
      clientPhone: clientPhone.trim(),
      packageName: selectedPackage,
      priceFormatted: formattedPrice,
      status: 'baru',
      createdAt: new Date().toISOString(),
      weddingSlug: `${cleanGroomNick.toLowerCase()}-${cleanBrideNick.toLowerCase()}`.replace(/\s+/g, '-'),
      config: {
        ...initialWeddingConfig,
        eventTitle: `The Wedding of ${cleanGroomNick} & ${cleanBrideNick}`,
        theme: selectedTheme,
        groom: {
          ...initialWeddingConfig.groom,
          fullName: cleanGroomFull,
          nickName: cleanGroomNick,
          parents: cleanGroomParents,
          igHandle: cleanGroomIg,
        },
        bride: {
          ...initialWeddingConfig.bride,
          fullName: cleanBrideFull,
          nickName: cleanBrideNick,
          parents: cleanBrideParents,
          igHandle: cleanBrideIg,
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
          venueName: venue,
          address: city,
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
          venueName: venue,
          address: city,
        },
      },
      guests: [],
      wishes: [],
      notes: notes.trim() || 'Pemesanan online melalui Toko Undangan NitiLestari.',
    };

    // 1. Save new order in App state & localStorage
    onCreateNewOrder(newOrder);

    // 2. Format Structured WhatsApp message for 0881024040191
    const themeNameMap: Record<WeddingThemeId, string> = {
      champagne: 'Champagne Royal Gold',
      emerald: 'Emerald Botanical Garden',
      rose: 'Rose Blush & Velvet',
      navy: 'Midnight Sapphire',
      heritage: 'Jawa Sogan & Batik Heritage',
    };

    const waMessage = `Halo Admin NitiLestari, saya ingin konfirmasi pemesanan undangan digital dengan rincian berikut:

📌 DATA PESANAN:
• No. Pesanan: ${orderId}
• Paket Pilihan: ${selectedPackage} (${formattedPrice})
• Desain Tema: ${themeNameMap[selectedTheme] || selectedTheme}

🤵 DATA MEMPELAI PRIA:
• Nama Lengkap: ${cleanGroomFull}
• Nama Panggilan: ${cleanGroomNick}
• Nama Orang Tua: ${cleanGroomParents}
• Instagram: ${cleanGroomIg}

👰 DATA MEMPELAI WANITA:
• Nama Lengkap: ${cleanBrideFull}
• Nama Panggilan: ${cleanBrideNick}
• Nama Orang Tua: ${cleanBrideParents}
• Instagram: ${cleanBrideIg}

📅 WAKTU & LOKASI ACARA:
• Tanggal Acara: ${new Date(eventDate).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })}
• Tempat / Venue: ${venue} (${city})

📞 KONTAK PEMESAN:
• No. WhatsApp: ${clientPhone.trim()}
${notes.trim() ? `• Catatan Khusus: ${notes.trim()}` : ''}

Mohon bantuannya untuk proses aktivasi dan tautan dasbor pengaturannya. Terima kasih!`;

    const waUrl = `https://wa.me/62881024040191?text=${encodeURIComponent(waMessage)}`;

    setCreatedOrderResult({
      order: newOrder,
      waUrl,
    });

    // Attempt direct WhatsApp navigation
    window.open(waUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 font-sans selection:bg-[#8a724d] selection:text-white pb-24">
      {/* Top Banner / Breadcrumb of Toko Pemesanan */}
      <div className="bg-stone-900 text-stone-200 py-3 px-6 border-b border-stone-800 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="font-editorial text-lg font-bold text-amber-300">NitiLestari</span>
            <span className="text-stone-500">|</span>
            <span className="font-medium text-stone-300">Toko Pemesanan Undangan Digital Online</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyStoreLink}
              className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg font-mono text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Salin Tautan Halaman Toko Pemesanan Ini"
            >
              <Copy className="w-3 h-3 text-amber-400" />
              <span>{copiedLink ? 'Tautan Disalin!' : 'Salin Link Toko: /?view=toko'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenDashboard}
              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LayoutDashboard className="w-3 h-3" />
              <span>Dasbor Pengaturan</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. AWAL TAMPILAN PENGUNJUNG: LANGSUNG DISUGUHKAN PILIHAN PAKET */}
      <section className="pt-10 pb-16 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2ece1] border border-[#e4dcce] text-[#7a643e] text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#8a724d]" />
            <span>Pilihan Paket Undangan Digital &amp; Manajemen Tamu</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl text-stone-900 font-bold leading-tight">
            Pilih Paket Undangan Digital Sesuai Kebutuhan Anda
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-3 leading-relaxed">
            Satu kali pembayaran aktif selamanya. Dilengkapi musik YouTube audio-only, QRIS langsung ke rekening Anda, moderasi AI, dan buku tamu digital.
          </p>
        </div>

        {/* 3 Paket Utama */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {pricingPackages.map((pkg) => {
            const isSelected = selectedPackage === pkg.name;
            return (
              <div
                key={pkg.name}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
                  pkg.popular
                    ? 'bg-white border-2 border-[#8a724d] shadow-xl ring-4 ring-[#8a724d]/10'
                    : 'bg-white border border-stone-200 shadow-sm hover:shadow-md'
                }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#8a724d] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {pkg.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-xl text-stone-900 font-sans">
                      Paket {pkg.name}
                    </h3>
                    {isSelected && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Dipilih
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mb-4">{pkg.description}</p>

                  <div className="flex items-baseline gap-2 mb-6 pb-5 border-b border-stone-100">
                    <span className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-editorial">
                      {pkg.price}
                    </span>
                    <span className="text-xs text-stone-400 line-through">
                      {pkg.originalPrice}
                    </span>
                  </div>

                  {/* Daftar Fitur */}
                  <ul className="space-y-2.5 text-xs text-stone-700 mb-8">
                    {pkg.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#8a724d] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPackage(pkg.name);
                    scrollToSection('formulir-pemesanan');
                  }}
                  className={`w-full py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                    pkg.popular
                      ? 'bg-[#8a724d] hover:bg-[#735e3d] text-white shadow-md'
                      : 'bg-stone-900 hover:bg-stone-800 text-white'
                  }`}
                >
                  <span>Pilih Paket {pkg.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. JIKA DI SCROLL KE BAWAH: DISUGUHKAN GAMBAR-GAMBAR CONTOH TEMA YANG TERKAIT */}
      <section id="katalog-tema" className="py-16 bg-white border-y border-stone-200 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-[#8a724d] font-bold block">
              Galeri &amp; Contoh Tema
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-stone-900 mt-2 font-bold">
              Contoh Gambar Desain Tema Undangan
            </h2>
            <p className="text-xs text-stone-500 mt-2">
              Pilih tema yang paling sesuai dengan konsep pernikahan Anda. Klik untuk mencoba demo langsung atau pilih tema untuk formulir pemesanan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {themeShowcase.map((t) => {
              const isSelected = selectedTheme === t.id;
              return (
                <div
                  key={t.id}
                  className={`rounded-2xl border overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between bg-white ${
                    isSelected ? 'border-[#8a724d] ring-2 ring-[#8a724d]/30' : 'border-stone-200'
                  }`}
                >
                  {/* Gambar Mockup Tema */}
                  <div className="relative h-48 overflow-hidden group">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] uppercase font-bold text-stone-900 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full shadow-xs">
                        {t.badge}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-white/40 shadow-xs"
                          style={{ backgroundColor: t.color }}
                        />
                        <span className="font-editorial font-bold text-base drop-shadow-sm">
                          {t.name}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full">
                          Tema Terpilih
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Keterangan */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-stone-600 leading-relaxed mb-4">
                      {t.desc}
                    </p>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenSampleInvitation(t.id as WeddingThemeId)}
                        className="text-xs font-semibold text-[#8a724d] hover:text-[#735e3d] flex items-center gap-1 cursor-pointer"
                        title="Buka live demo tampilan undangan dengan tema ini"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Demo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTheme(t.id as WeddingThemeId);
                          scrollToSection('formulir-pemesanan');
                        }}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white font-semibold'
                            : 'bg-[#8a724d] hover:bg-[#735e3d] text-white'
                        }`}
                      >
                        {isSelected ? '✓ Tema Dipilih' : 'Pilih Tema Ini'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FORMULIR PEMESANAN ONLINE LENGKAP SESUAI PROFIL MEMPELAI */}
      <section id="formulir-pemesanan" className="py-20 px-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 bg-stone-900 text-white">
            <span className="text-xs uppercase tracking-widest text-[#e6ca65] font-semibold block">
              Formulir Pemesanan Online Resmi
            </span>
            <h2 className="font-editorial text-3xl font-bold mt-1">
              Data Pernikahan &amp; Profil Lengkap Mempelai
            </h2>
            <p className="text-xs text-stone-300 mt-1.5 font-sans leading-relaxed">
              Data yang Anda isi di bawah ini akan <strong>otomatis terisi</strong> ke profil undangan dan dasbor admin pernikahan Anda. Setelah memesan, Anda akan langsung diarahkan ke WhatsApp Admin <strong>0881024040191</strong>.
            </p>
          </div>

          <form onSubmit={handleOrderSubmit} className="p-6 sm:p-8 space-y-8 text-xs font-sans">
            {/* 1. Konfirmasi Paket & Tema */}
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8a724d] tracking-wider block">
                    Pilihan Paket &amp; Desain Tema
                  </span>
                  <div className="font-bold text-stone-900 text-sm mt-0.5">
                    Paket {selectedPackage} · Tema:{' '}
                    {themeShowcase.find((t) => t.id === selectedTheme)?.name || selectedTheme}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedPackage}
                    onChange={(e) => setSelectedPackage(e.target.value as PackageTier)}
                    className="px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold"
                  >
                    <option value="Silver">Paket Silver (Rp 149.000)</option>
                    <option value="Gold">Paket Gold (Rp 249.000)</option>
                    <option value="Platinum">Paket Platinum (Rp 399.000)</option>
                  </select>

                  <select
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value as WeddingThemeId)}
                    className="px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold"
                  >
                    <option value="champagne">Champagne Royal Gold</option>
                    <option value="emerald">Emerald Botanical Garden</option>
                    <option value="rose">Rose Blush &amp; Velvet</option>
                    <option value="navy">Midnight Sapphire</option>
                    <option value="heritage">Jawa Sogan &amp; Batik Heritage</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Profil Mempelai Pria */}
            <div className="space-y-4">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2 pb-2 border-b border-stone-200">
                <span className="w-5 h-5 rounded-full bg-[#8a724d] text-white flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Data Profil Mempelai Pria (Pengantin Pria)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Nama Lengkap Mempelai Pria *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Arga Pratama, S.T."
                    value={groomFullName}
                    onChange={(e) => setGroomFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#8a724d]/30"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Nama Panggilan Mempelai Pria *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Arga"
                    value={groomNick}
                    onChange={(e) => setGroomNick(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#8a724d]/30 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Nama Kedua Orang Tua Mempelai Pria *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Putra dari Bpk. Bambang Wijaya & Ibu Siti Aminah"
                    value={groomParents}
                    onChange={(e) => setGroomParents(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#8a724d]/30"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Instagram Mempelai Pria
                  </label>
                  <div className="relative">
                    <Instagram className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Contoh: @arga_pratama"
                      value={groomIg}
                      onChange={(e) => setGroomIg(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#8a724d]/30 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Profil Mempelai Wanita */}
            <div className="space-y-4">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2 pb-2 border-b border-stone-200">
                <span className="w-5 h-5 rounded-full bg-[#8a724d] text-white flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>Data Profil Mempelai Wanita (Pengantin Wanita)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Nama Lengkap Mempelai Wanita *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sarah Anastasya, M.Ds."
                    value={brideFullName}
                    onChange={(e) => setBrideFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#8a724d]/30"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Nama Panggilan Mempelai Wanita *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sarah"
                    value={brideNick}
                    onChange={(e) => setBrideNick(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#8a724d]/30 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Nama Kedua Orang Tua Mempelai Wanita *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Putri dari Bpk. Hendra Saputra & Ibu Ratna Dewi"
                    value={brideParents}
                    onChange={(e) => setBrideParents(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#8a724d]/30"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Instagram Mempelai Wanita
                  </label>
                  <div className="relative">
                    <Instagram className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Contoh: @sarah_anastasya"
                      value={brideIg}
                      onChange={(e) => setBrideIg(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#8a724d]/30 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Rangkaian Waktu, Tempat & WhatsApp Pemesan */}
            <div className="space-y-4">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2 pb-2 border-b border-stone-200">
                <span className="w-5 h-5 rounded-full bg-[#8a724d] text-white flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>Waktu, Lokasi Acara &amp; Nomor WhatsApp Pemesan</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Tanggal Rencana Pernikahan *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#8a724d]/30"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Tempat / Gedung Acara *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Grand Ballroom Hotel Mulia"
                    value={eventVenue}
                    onChange={(e) => setEventVenue(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#8a724d]/30"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Kota / Wilayah Acara *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Jakarta Selatan"
                    value={eventCity}
                    onChange={(e) => setEventCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#8a724d]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Nomor WhatsApp Pemesan (Wajib Aktif) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890 (Digunakan untuk konfirmasi dan aktivasi link)"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#8a724d]/30 font-mono font-medium"
                  />
                </div>
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Setelah klik kirim pesanan, rincian ini akan otomatis diteruskan ke WhatsApp pribadi admin <strong>0881024040191</strong>.
                </span>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Catatan Tambahan / Permintaan Khusus (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Tuliskan catatan khusus atau konsep tambahan jika ada..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#8a724d]/30"
                />
              </div>
            </div>

            {/* Tombol Submit Order */}
            <div className="pt-4 border-t border-stone-200">
              <button
                type="submit"
                className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-sm font-bold tracking-wide uppercase shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5 text-emerald-200" />
                <span>Pesan Sekarang &amp; Lanjut ke WhatsApp Admin (0881024040191)</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* MODAL HASIL PESANAN & REDIREKSI WHATSAPP */}
      {createdOrderResult && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Pesanan Berhasil Disimpan!
            </span>

            <h3 className="font-editorial text-2xl font-bold text-stone-900 mt-3">
              {createdOrderResult.order.config.groom.nickName} &amp;{' '}
              {createdOrderResult.order.config.bride.nickName}
            </h3>

            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Data profil kedua mempelai dan tema telah otomatis terisi ke akun dasbor pesanan. Silakan lanjutkan konfirmasi pemesanan Anda ke WhatsApp Admin.
            </p>

            <div className="my-5 p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Nomor Pesanan:</span>
                <span className="font-mono font-bold text-stone-900">{createdOrderResult.order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Paket:</span>
                <span className="font-semibold text-stone-900">
                  {createdOrderResult.order.packageName} ({createdOrderResult.order.priceFormatted})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Tema Dipilih:</span>
                <span className="font-semibold text-[#8a724d]">
                  {createdOrderResult.order.config.theme}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">WhatsApp Admin:</span>
                <span className="font-mono font-bold text-emerald-700">0881024040191</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <a
                href={createdOrderResult.waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kirim Pesanan ke WhatsApp Admin (0881024040191)</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCreatedOrderResult(null);
                    onOpenDashboard();
                  }}
                  className="w-full py-2.5 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Buka Dasbor Pesanan</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCreatedOrderResult(null);
                    onOpenSampleInvitation(createdOrderResult.order.config.theme);
                  }}
                  className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#8a724d]" />
                  <span>Lihat Undangan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
