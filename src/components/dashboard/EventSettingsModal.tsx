import React, { useState, useEffect } from 'react';
import {
  Camera,
  Check,
  CreditCard,
  Eye,
  Heart,
  HelpCircle,
  Image as ImageIcon,
  Info,
  MapPin,
  Music,
  Palette,
  Plus,
  QrCode,
  RotateCcw,
  Settings,
  Sparkles,
  Trash2,
  Users,
  X,
  Youtube,
} from 'lucide-react';
import { BankAccount, GalleryPhotoItem, StoryMilestone, WeddingConfig } from '../../types/wedding';
import { WeddingThemeId } from '../../types/theme';
import { extractYouTubeId } from '../../utils/youtubeAudio';

interface EventSettingsModalProps {
  config: WeddingConfig;
  isOpen: boolean;
  onClose: () => void;
  onSaveConfig: (updated: WeddingConfig) => void;
  onResetData: () => void;
  onPreviewInvitation?: () => void;
}

export const EventSettingsModal: React.FC<EventSettingsModalProps> = ({
  config,
  isOpen,
  onClose,
  onSaveConfig,
  onResetData,
  onPreviewInvitation,
}) => {
  const [activeTab, setActiveTab] = useState<
    'theme-music' | 'couple' | 'events' | 'photos' | 'story' | 'banks'
  >('theme-music');

  const [formData, setFormData] = useState<WeddingConfig>(config);

  useEffect(() => {
    if (isOpen) {
      setFormData(config);
    }
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    onClose();
  };

  // Gallery handlers
  const handleAddGalleryPhoto = () => {
    const newPhoto: GalleryPhotoItem = {
      id: `gal-${Date.now()}`,
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      title: 'Momen Indah Berdua',
      caption: 'Kenangan manis selama masa persiapan pernikahan.',
    };
    setFormData({
      ...formData,
      galleryPhotos: [...(formData.galleryPhotos || []), newPhoto],
    });
  };

  const handleUpdateGalleryPhoto = (
    id: string,
    field: keyof GalleryPhotoItem,
    value: string
  ) => {
    const updated = (formData.galleryPhotos || []).map((p) =>
      p.id === id ? { ...p, [field]: value } : p
    );
    setFormData({ ...formData, galleryPhotos: updated });
  };

  const handleDeleteGalleryPhoto = (id: string) => {
    const updated = (formData.galleryPhotos || []).filter((p) => p.id !== id);
    setFormData({ ...formData, galleryPhotos: updated });
  };

  // Story Milestone handlers
  const handleAddStoryMilestone = () => {
    const newMilestone: StoryMilestone = {
      year: `${new Date().getFullYear()}`,
      title: 'Momen Spesial',
      story: 'Tuliskan kisah perjalanan cinta Anda berdua di sini...',
    };
    setFormData({
      ...formData,
      loveStory: [...(formData.loveStory || []), newMilestone],
    });
  };

  const handleUpdateStoryMilestone = (
    index: number,
    field: keyof StoryMilestone,
    value: string
  ) => {
    const updated = [...(formData.loveStory || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, loveStory: updated });
  };

  const handleDeleteStoryMilestone = (index: number) => {
    const updated = [...(formData.loveStory || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, loveStory: updated });
  };

  // Bank account handlers
  const handleAddBankAccount = () => {
    const newBank: BankAccount = {
      id: `bank-${Date.now()}`,
      bankName: 'Bank Central Asia (BCA)',
      accountNumber: '1234567890',
      accountHolder: formData.groom.nickName ? formData.groom.nickName.toUpperCase() : 'MEMPELAI',
    };
    setFormData({
      ...formData,
      bankAccounts: [...(formData.bankAccounts || []), newBank],
    });
  };

  const handleUpdateBank = (id: string, field: keyof BankAccount, value: string) => {
    const updated = (formData.bankAccounts || []).map((b) =>
      b.id === id ? { ...b, [field]: value } : b
    );
    setFormData({ ...formData, bankAccounts: updated });
  };

  const handleDeleteBank = (id: string) => {
    setFormData({
      ...formData,
      bankAccounts: (formData.bankAccounts || []).filter((b) => b.id !== id),
    });
  };

  const extractedYtId = extractYouTubeId(formData.music?.youtubeUrl);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-[#e6ca65]" />
            <div>
              <h3 className="font-semibold text-base font-sans">
                Kustomisasi Lengkap Undangan
              </h3>
              <p className="text-[11px] text-stone-300 font-sans">
                Pengaturan tema, musik YouTube, foto direct link, mempelai, acara, dan amplop digital
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

        {/* Tab Navigation Strip (All Menu Customization) */}
        <div className="flex overflow-x-auto border-b border-stone-200 bg-stone-100 px-3 text-xs font-medium no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('theme-music')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'theme-music'
                ? 'border-[#8a724d] text-[#8a724d] font-semibold bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-[#8a724d]" />
            <span>1. Tema &amp; Musik YouTube</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('couple')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'couple'
                ? 'border-[#8a724d] text-[#8a724d] font-semibold bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>2. Profil Mempelai</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('events')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'events'
                ? 'border-[#8a724d] text-[#8a724d] font-semibold bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>3. Rangkaian Acara &amp; Venue</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'photos'
                ? 'border-[#8a724d] text-[#8a724d] font-semibold bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-amber-600" />
            <span>4. Foto Header &amp; Galeri</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('story')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'story'
                ? 'border-[#8a724d] text-[#8a724d] font-semibold bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>5. Kisah Cinta (Story)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('banks')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'banks'
                ? 'border-[#8a724d] text-[#8a724d] font-semibold bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-teal-600" />
            <span>6. Amplop &amp; QRIS</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 overflow-y-auto text-xs font-sans flex-1">
          {/* TAB 1: TEMA & MUSIK YOUTUBE DIRECT */}
          {activeTab === 'theme-music' && (
            <div className="space-y-6">
              {/* Pilihan Tema Server */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-[#8a724d]" />
                    <span>Pilihan Desain Tema Undangan</span>
                  </h4>
                  <span className="text-[10px] text-stone-500 uppercase">Aktif: {formData.theme}</span>
                </div>
                <p className="text-xs text-stone-500 mb-3">
                  Pilih gaya visual undangan. Setiap tema memiliki harmoni tipografi, warna, dan ornamen yang unik:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'champagne',
                      name: 'Champagne Royal Gold',
                      color: '#8A724D',
                      bg: '#faf8f5',
                      desc: 'Mewah, hangat & elegan khas editorial high-end',
                    },
                    {
                      id: 'emerald',
                      name: 'Emerald Botanical Garden',
                      color: '#2D6A4F',
                      bg: '#f4f7f4',
                      desc: 'Nuansa hijau sage & dedaunan segar bernuansa alam',
                    },
                    {
                      id: 'rose',
                      name: 'Rose Blush & Velvet',
                      color: '#A84458',
                      bg: '#faf5f6',
                      desc: 'Romantis lembut dengan palet blush & crimson anggun',
                    },
                    {
                      id: 'navy',
                      name: 'Midnight Sapphire',
                      color: '#1E3A8A',
                      bg: '#f4f7fb',
                      desc: 'Elegan klasik bernuansa royal blue & perak kontemporer',
                    },
                    {
                      id: 'heritage',
                      name: 'Jawa Sogan & Batik Heritage',
                      color: '#78350F',
                      bg: '#fcf8f2',
                      desc: 'Kehangatan tradisi Jawa dengan sentuhan sogan modern',
                    },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, theme: t.id as WeddingThemeId })}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        formData.theme === t.id
                          ? 'border-[#8a724d] ring-2 ring-[#8a724d]/30 bg-white shadow-xs'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: t.color }}
                          />
                          {formData.theme === t.id && (
                            <span className="text-[10px] font-bold text-[#8a724d] flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> Terpilih
                            </span>
                          )}
                        </div>
                        <div className="font-semibold text-stone-900 text-xs">{t.name}</div>
                        <div className="text-[10px] text-stone-500 mt-1 leading-snug">{t.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pengaturan Musik YouTube Direct (Hanya Musik Saja) */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <Youtube className="w-4 h-4 text-red-600" />
                    <span>Musik Latar Undangan (YouTube Audio Direct)</span>
                  </h4>
                  <span className="text-[10px] bg-red-100 text-red-800 font-semibold px-2 py-0.5 rounded-full">
                    Audio Saja
                  </span>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-xs flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">Otomatis Terputar Tanpa Tombol Speaker:</p>
                    <p className="text-[11px] leading-relaxed text-blue-800">
                      Sesuai permintaan Anda, tombol speaker mengambang telah ditiadakan dari tampilan undangan. Lagu akan <strong>otomatis terputar</strong> seketika tamu mengklik tombol <strong>&quot;Buka Undangan&quot;</strong> pada amplop pembuka.
                    </p>
                  </div>
                </div>

                {/* Pilihan Sumber Musik */}
                <div className="space-y-2">
                  <label className="block text-stone-700 font-medium">Tipe Sumber Musik:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      {
                        type: 'youtube',
                        label: 'Direct YouTube Link',
                        desc: 'Gunakan lagu/instrumen apa pun dari YouTube (hanya audionya)',
                      },
                      {
                        type: 'synth',
                        label: 'Acoustic Synthesizer',
                        desc: 'Alunan romantis Canon in D harp & celesta Web Audio bawaan',
                      },
                      {
                        type: 'audioUrl',
                        label: 'Direct MP3/Audio URL',
                        desc: 'Tautan file audio langsung (.mp3 atau .aac)',
                      },
                    ].map((m) => (
                      <label
                        key={m.type}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors flex flex-col justify-between ${
                          (formData.music?.type || 'youtube') === m.type
                            ? 'border-[#8a724d] bg-white ring-1 ring-[#8a724d]'
                            : 'border-stone-200 bg-white hover:bg-stone-100/60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="musicType"
                            checked={(formData.music?.type || 'youtube') === m.type}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                music: {
                                  ...(formData.music || { youtubeUrl: '', title: '' }),
                                  type: m.type as 'youtube' | 'synth' | 'audioUrl',
                                },
                              })
                            }
                            className="text-[#8a724d] focus:ring-[#8a724d]"
                          />
                          <span className="font-semibold text-stone-900 text-xs">{m.label}</span>
                        </div>
                        <span className="text-[10px] text-stone-500 mt-1.5 pl-5">{m.desc}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Input Direct YouTube Link */}
                {(formData.music?.type === 'youtube' || !formData.music?.type) && (
                  <div className="p-3.5 bg-white rounded-lg border border-stone-200 space-y-3">
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">
                        Direct Link / URL YouTube:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          placeholder="https://www.youtube.com/watch?v=2Vv-BfVoq4g atau https://youtu.be/..."
                          value={formData.music?.youtubeUrl || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              music: {
                                ...(formData.music || { type: 'youtube' }),
                                type: 'youtube',
                                youtubeUrl: e.target.value,
                              },
                            })
                          }
                          className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">
                        Format didukung: <code>https://www.youtube.com/watch?v=...</code>, <code>https://youtu.be/...</code>, atau ID video 11 karakter.
                      </p>
                    </div>

                    {extractedYtId ? (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>
                            ID Video Terdeteksi: <strong className="font-mono">{extractedYtId}</strong>
                          </span>
                        </div>
                        <span className="text-[10px] bg-emerald-200 text-emerald-900 font-semibold px-2 py-0.5 rounded">
                          Siap Diputar Otomatis
                        </span>
                      </div>
                    ) : formData.music?.youtubeUrl ? (
                      <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px]">
                        Link belum valid. Mohon periksa kembali tautan YouTube yang dimasukkan.
                      </div>
                    ) : null}

                    <div>
                      <label className="block text-stone-700 font-medium mb-1">
                        Judul Lagu / Keterangan Musik (Opsional):
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Ed Sheeran - Perfect (Acoustic Piano)"
                        value={formData.music?.title || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            music: {
                              ...(formData.music || { type: 'youtube', youtubeUrl: '' }),
                              type: 'youtube',
                              title: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* Input Direct Audio File URL */}
                {formData.music?.type === 'audioUrl' && (
                  <div className="p-3.5 bg-white rounded-lg border border-stone-200 space-y-3">
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">
                        Direct URL File MP3 / Audio:
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com/audio/lagu-pernikahan.mp3"
                        value={formData.music?.audioUrl || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            music: {
                              ...(formData.music || { type: 'audioUrl' }),
                              type: 'audioUrl',
                              audioUrl: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Judul & Kutipan Utama Undangan */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <h4 className="font-bold text-stone-900 text-sm">
                  Judul &amp; Kutipan Mutiara (Quotes)
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">
                      Judul Acara Utama
                    </label>
                    <input
                      type="text"
                      value={formData.eventTitle}
                      onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">
                      Isi Kutipan / Ayat Suci
                    </label>
                    <textarea
                      rows={2}
                      value={formData.quote?.text || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quote: { ...(formData.quote || { source: '' }), text: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">
                      Sumber Kutipan (Contoh: QS. Ar-Rum: 21 atau 1 Korintus 13:4-7)
                    </label>
                    <input
                      type="text"
                      value={formData.quote?.source || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quote: { ...(formData.quote || { text: '' }), source: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFIL KEDUA MEMPELAI */}
          {activeTab === 'couple' && (
            <div className="space-y-6">
              {/* Mempelai Pria */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#8a724d]" />
                    <span>Profil Mempelai Pria (Groom)</span>
                  </h4>
                  <span className="text-[10px] text-stone-500 uppercase">Foto Rasio 1:1</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                  <div className="w-28 h-28 rounded-xl overflow-hidden border border-stone-300 bg-stone-200 shrink-0 mx-auto sm:mx-0">
                    <img
                      src={formData.groom.photoUrl?.trim() || '/src/assets/images/groom_portrait_1791869151086.jpg'}
                      alt="Groom Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/src/assets/images/groom_portrait_1791869151086.jpg';
                      }}
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-2.5">
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">
                        Direct Link Foto Mempelai Pria
                      </label>
                      <input
                        type="url"
                        value={formData.groom.photoUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            groom: { ...formData.groom, photoUrl: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-stone-700 font-medium mb-1">
                          Nama Lengkap &amp; Gelar
                        </label>
                        <input
                          type="text"
                          value={formData.groom.fullName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              groom: { ...formData.groom, fullName: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-700 font-medium mb-1">
                          Nama Panggilan
                        </label>
                        <input
                          type="text"
                          value={formData.groom.nickName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              groom: { ...formData.groom, nickName: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-700 font-medium mb-1">
                        Nama Kedua Orang Tua
                      </label>
                      <input
                        type="text"
                        placeholder="Putra pertama dari Bpk. ... & Ibu ..."
                        value={formData.groom.parents}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            groom: { ...formData.groom, parents: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-stone-700 font-medium mb-1">
                          Instagram Handle
                        </label>
                        <input
                          type="text"
                          placeholder="@username"
                          value={formData.groom.igHandle}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              groom: { ...formData.groom, igHandle: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-700 font-medium mb-1">
                          Bio / Kalimat Singkat
                        </label>
                        <input
                          type="text"
                          value={formData.groom.bio || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              groom: { ...formData.groom, bio: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mempelai Wanita */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Profil Mempelai Wanita (Bride)</span>
                  </h4>
                  <span className="text-[10px] text-stone-500 uppercase">Foto Rasio 1:1</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                  <div className="w-28 h-28 rounded-xl overflow-hidden border border-stone-300 bg-stone-200 shrink-0 mx-auto sm:mx-0">
                    <img
                      src={formData.bride.photoUrl?.trim() || '/src/assets/images/bride_portrait_1791869150747.jpg'}
                      alt="Bride Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/src/assets/images/bride_portrait_1791869150747.jpg';
                      }}
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-2.5">
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">
                        Direct Link Foto Mempelai Wanita
                      </label>
                      <input
                        type="url"
                        value={formData.bride.photoUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bride: { ...formData.bride, photoUrl: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-stone-700 font-medium mb-1">
                          Nama Lengkap &amp; Gelar
                        </label>
                        <input
                          type="text"
                          value={formData.bride.fullName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              bride: { ...formData.bride, fullName: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-700 font-medium mb-1">
                          Nama Panggilan
                        </label>
                        <input
                          type="text"
                          value={formData.bride.nickName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              bride: { ...formData.bride, nickName: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-700 font-medium mb-1">
                        Nama Kedua Orang Tua
                      </label>
                      <input
                        type="text"
                        placeholder="Putri bungsu dari Bpk. ... & Ibu ..."
                        value={formData.bride.parents}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bride: { ...formData.bride, parents: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-stone-700 font-medium mb-1">
                          Instagram Handle
                        </label>
                        <input
                          type="text"
                          placeholder="@username"
                          value={formData.bride.igHandle}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              bride: { ...formData.bride, igHandle: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-700 font-medium mb-1">
                          Bio / Kalimat Singkat
                        </label>
                        <input
                          type="text"
                          value={formData.bride.bio || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              bride: { ...formData.bride, bio: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RANGKAIAN ACARA & VENUE */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              {/* Foto Tempat Acara / Venue */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Foto Venue / Gedung Acara (Direct Link)</span>
                  </h4>
                  <span className="text-[10px] text-stone-500 uppercase">Landscape 16:9</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-36 h-24 rounded-lg overflow-hidden border border-stone-300 bg-stone-200 shrink-0">
                    <img
                      src={formData.venuePhotoUrl?.trim() || '/src/assets/images/wedding_venue_glasshouse_1791869150973.jpg'}
                      alt="Venue Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/src/assets/images/wedding_venue_glasshouse_1791869150973.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    <label className="block text-stone-700 font-medium">
                      Direct Link Foto Venue
                    </label>
                    <input
                      type="url"
                      value={formData.venuePhotoUrl}
                      onChange={(e) => setFormData({ ...formData, venuePhotoUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Akad Nikah */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <h4 className="font-bold text-stone-900 text-sm">
                  1. Rangkaian Akad Nikah / Pemberkatan
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Judul Sesi</label>
                    <input
                      type="text"
                      value={formData.ceremony.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ceremony: { ...formData.ceremony, title: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">
                      Waktu &amp; Jam Pelaksanaan
                    </label>
                    <input
                      type="text"
                      value={formData.ceremony.time}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ceremony: { ...formData.ceremony, time: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">
                      Format Tanggal (Teks)
                    </label>
                    <input
                      type="text"
                      value={formData.ceremony.dateFormatted}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ceremony: { ...formData.ceremony, dateFormatted: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Nama Tempat/Gedung</label>
                    <input
                      type="text"
                      value={formData.ceremony.venueName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ceremony: { ...formData.ceremony, venueName: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-700 font-medium mb-1">Alamat Lengkap</label>
                    <input
                      type="text"
                      value={formData.ceremony.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ceremony: { ...formData.ceremony, address: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-700 font-medium mb-1">
                      Tautan Google Maps
                    </label>
                    <input
                      type="url"
                      value={formData.ceremony.mapsUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ceremony: { ...formData.ceremony, mapsUrl: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Resepsi Pernikahan */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <h4 className="font-bold text-stone-900 text-sm">
                  2. Rangkaian Resepsi Pernikahan
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Judul Sesi</label>
                    <input
                      type="text"
                      value={formData.reception.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reception: { ...formData.reception, title: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">
                      Waktu &amp; Jam Pelaksanaan
                    </label>
                    <input
                      type="text"
                      value={formData.reception.time}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reception: { ...formData.reception, time: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">
                      Format Tanggal (Teks)
                    </label>
                    <input
                      type="text"
                      value={formData.reception.dateFormatted}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reception: { ...formData.reception, dateFormatted: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Nama Tempat/Gedung</label>
                    <input
                      type="text"
                      value={formData.reception.venueName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reception: { ...formData.reception, venueName: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-700 font-medium mb-1">Alamat Lengkap</label>
                    <input
                      type="text"
                      value={formData.reception.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reception: { ...formData.reception, address: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-700 font-medium mb-1">
                      Tautan Google Maps
                    </label>
                    <input
                      type="url"
                      value={formData.reception.mapsUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reception: { ...formData.reception, mapsUrl: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-700 font-medium mb-1">
                      Panduan Dresscode Tamu
                    </label>
                    <input
                      type="text"
                      value={formData.reception.dresscode || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reception: { ...formData.reception, dresscode: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FOTO HEADER & GALERI KENANGAN / PRE-WEDDING */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              {/* Foto Header Utama */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-600" />
                    <span>Foto Header di Awal &amp; Amplop Pembuka (Direct Link)</span>
                  </h4>
                  <span className="text-[10px] text-stone-500 uppercase">Rasio 16:9</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-36 h-24 rounded-lg overflow-hidden border border-stone-300 bg-stone-200 shrink-0">
                    <img
                      src={formData.heroPhotoUrl?.trim() || '/src/assets/images/wedding_hero_couple_1791869150830.jpg'}
                      alt="Header Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/src/assets/images/wedding_hero_couple_1791869150830.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    <label className="block text-stone-700 font-medium">
                      Direct Link Foto Header Utama
                    </label>
                    <input
                      type="url"
                      value={formData.heroPhotoUrl}
                      onChange={(e) => setFormData({ ...formData, heroPhotoUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                    />
                    <p className="text-[11px] text-stone-500">
                      Tampil sebagai sampul amplop pembuka dan foto hero utama di bagian atas undangan.
                    </p>
                  </div>
                </div>
              </div>

              {/* Galeri Pre-wedding */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#8a724d]" />
                      <span>Galeri Foto Kenangan &amp; Pre-Wedding ({formData.galleryPhotos?.length || 0})</span>
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Tambahkan momen foto pra-nikah dengan direct link gambar.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddGalleryPhoto}
                    className="px-3 py-1.5 bg-[#8a724d] hover:bg-[#735e3d] text-white rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Foto</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(formData.galleryPhotos || []).map((photo, idx) => (
                    <div
                      key={photo.id || idx}
                      className="p-3.5 bg-white rounded-xl border border-stone-200 flex flex-col sm:flex-row gap-3 items-start"
                    >
                      <div className="w-24 h-24 rounded-lg overflow-hidden border border-stone-300 bg-stone-100 shrink-0">
                        <img
                          src={photo.url?.trim() || '/src/assets/images/wedding_hero_couple_1791869150830.jpg'}
                          alt={photo.title || 'Foto Galeri'}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/src/assets/images/wedding_hero_couple_1791869150830.jpg';
                          }}
                        />
                      </div>

                      <div className="flex-1 w-full space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] text-stone-600 font-medium">
                              Direct Link URL Foto #{idx + 1}
                            </label>
                            <input
                              type="url"
                              value={photo.url}
                              onChange={(e) =>
                                handleUpdateGalleryPhoto(photo.id, 'url', e.target.value)
                              }
                              className="w-full px-2.5 py-1.5 border border-stone-300 rounded text-xs font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-stone-600 font-medium">
                              Judul Foto
                            </label>
                            <input
                              type="text"
                              value={photo.title}
                              onChange={(e) =>
                                handleUpdateGalleryPhoto(photo.id, 'title', e.target.value)
                              }
                              className="w-full px-2.5 py-1.5 border border-stone-300 rounded text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] text-stone-600 font-medium">
                            Keterangan / Caption
                          </label>
                          <input
                            type="text"
                            value={photo.caption}
                            onChange={(e) =>
                              handleUpdateGalleryPhoto(photo.id, 'caption', e.target.value)
                            }
                            className="w-full px-2.5 py-1.5 border border-stone-300 rounded text-xs"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteGalleryPhoto(photo.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-100 transition-colors cursor-pointer self-start sm:self-center"
                        title="Hapus Foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: KISAH CINTA (LOVE STORY) */}
          {activeTab === 'story' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Milestone Perjalanan Kisah Cinta ({formData.loveStory?.length || 0})</span>
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Bagikan cerita manis bagaimana Anda dan pasangan bertemu hingga memutuskan menikah.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddStoryMilestone}
                  className="px-3 py-1.5 bg-[#8a724d] hover:bg-[#735e3d] text-white rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Milestone</span>
                </button>
              </div>

              <div className="space-y-3">
                {(formData.loveStory || []).map((milestone, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#8a724d]">
                        Milestone #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteStoryMilestone(idx)}
                        className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Hapus Milestone"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-stone-700 font-medium mb-1">Tahun / Waktu</label>
                        <input
                          type="text"
                          value={milestone.year}
                          onChange={(e) =>
                            handleUpdateStoryMilestone(idx, 'year', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-stone-700 font-medium mb-1">Judul Momen</label>
                        <input
                          type="text"
                          value={milestone.title}
                          onChange={(e) =>
                            handleUpdateStoryMilestone(idx, 'title', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-stone-700 font-medium mb-1">Cerita Momen</label>
                        <textarea
                          rows={2}
                          value={milestone.story}
                          onChange={(e) =>
                            handleUpdateStoryMilestone(idx, 'story', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: AMPLOP DIGITAL, QRIS & KADO FISIK */}
          {activeTab === 'banks' && (
            <div className="space-y-6">
              {/* QRIS Standar Pembayaran */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-[#8a724d]" />
                    <span>QRIS Standar (BCA, Mandiri, BRI, BSI, GoPay, DANA Bisnis)</span>
                  </h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                    100% Langsung Ke Rekening Anda
                  </span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Masukkan direct link foto barcode QRIS toko/rekening Anda dari aplikasi merchant bank Anda. Dana amplop digital akan langsung masuk ke rekening pribadi tanpa perantara.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-2">
                    <label className="block text-stone-700 font-medium">
                      Direct Link Foto QRIS (URL Gambar .png / .jpg)
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/qris-saya.png"
                      value={formData.qrisImageUrl || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, qrisImageUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                    />
                    <p className="text-[11px] text-stone-500">
                      Jika dikosongkan, sistem otomatis membuat QR Code geometris yang rapi.
                    </p>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">
                      Nama Merchant QRIS
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Arya & Citra Wedding"
                      value={formData.qrisMerchantName || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, qrisMerchantName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Daftar Rekening Bank */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-teal-600" />
                      <span>Rekening Bank Transfer ({formData.bankAccounts?.length || 0})</span>
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Tamu dapat menyalin nomor rekening dengan 1 klik untuk mengirim tanda kasih.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddBankAccount}
                    className="px-3 py-1.5 bg-[#8a724d] hover:bg-[#735e3d] text-white rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Rekening</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(formData.bankAccounts || []).map((bank) => (
                    <div
                      key={bank.id}
                      className="p-3.5 bg-white rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-center"
                    >
                      <div>
                        <label className="block text-[11px] text-stone-500 mb-1">Nama Bank</label>
                        <input
                          type="text"
                          value={bank.bankName}
                          onChange={(e) =>
                            handleUpdateBank(bank.id, 'bankName', e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 border border-stone-300 rounded text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-500 mb-1">Nomor Rekening</label>
                        <input
                          type="text"
                          value={bank.accountNumber}
                          onChange={(e) =>
                            handleUpdateBank(bank.id, 'accountNumber', e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 border border-stone-300 rounded text-xs font-mono font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-500 mb-1">Atas Nama Pemilik</label>
                        <input
                          type="text"
                          value={bank.accountHolder}
                          onChange={(e) =>
                            handleUpdateBank(bank.id, 'accountHolder', e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 border border-stone-300 rounded text-xs uppercase"
                        />
                      </div>

                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => handleDeleteBank(bank.id)}
                          className="p-2 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-100 transition-colors cursor-pointer"
                          title="Hapus Rekening"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alamat Pengiriman Kado Fisik */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <h4 className="font-bold text-stone-900 text-sm">
                  Alamat Pengiriman Kado Fisik
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Nama Penerima</label>
                    <input
                      type="text"
                      value={formData.giftAddress.recipient}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          giftAddress: { ...formData.giftAddress, recipient: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">No. Handphone / WhatsApp</label>
                    <input
                      type="text"
                      value={formData.giftAddress.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          giftAddress: { ...formData.giftAddress, phone: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-700 font-medium mb-1">Alamat Lengkap Pengiriman</label>
                    <textarea
                      rows={2}
                      value={formData.giftAddress.fullAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          giftAddress: { ...formData.giftAddress, fullAddress: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Kembalikan seluruh data dan foto ke default contoh awal?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="text-stone-500 hover:text-stone-800 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset ke Data Awal</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-lg font-medium transition-colors cursor-pointer text-xs uppercase tracking-wider"
              >
                Batal
              </button>

              {onPreviewInvitation && (
                <button
                  type="button"
                  onClick={() => {
                    onSaveConfig(formData);
                    onPreviewInvitation();
                  }}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-medium transition-colors cursor-pointer text-xs uppercase tracking-wider flex items-center gap-1.5"
                  title="Simpan perubahan dan buka tampilan undangan tamu"
                >
                  <Eye className="w-3.5 h-3.5 text-[#8a724d]" />
                  <span>Lihat Undangan</span>
                </button>
              )}

              <button
                type="submit"
                className="px-5 py-2 bg-[#8a724d] hover:bg-[#735e3d] text-white rounded-lg font-medium transition-colors shadow-xs cursor-pointer text-xs uppercase tracking-wider flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
