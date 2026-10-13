import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Flower2, Heart, Palette, QrCode, Sparkles } from 'lucide-react';
import { Guest, RsvpStatus, WeddingConfig, WishComment } from '../../types/wedding';
import { WeddingThemeId, WEDDING_THEMES } from '../../types/theme';
import { CoverEnvelope } from './CoverEnvelope';
import { HeroSection } from './HeroSection';
import { CoupleSection } from './CoupleSection';
import { EventSection } from './EventSection';
import { LoveStorySection } from './LoveStorySection';
import { GallerySection } from './GallerySection';
import { RsvpFormSection } from './RsvpFormSection';
import { DigitalGiftSection } from './DigitalGiftSection';
import { WishesGuestbookSection } from './WishesGuestbookSection';
import { DigitalTicketModal } from './DigitalTicketModal';
import { BackgroundAudioPlayer } from '../common/BackgroundAudioPlayer';
import { FallingPetals } from '../common/FallingPetals';
import { ThemeCatalogModal } from '../common/ThemeCatalogModal';

interface InvitationViewProps {
  config: WeddingConfig;
  currentGuest: Guest | null;
  wishes: WishComment[];
  onSaveRsvp: (data: {
    name: string;
    rsvpStatus: RsvpStatus;
    paxCount: number;
    session: string;
    wishes: string;
  }) => void;
  onLikeWish: (id: string) => void;
  onAddWish: (newWish: {
    guestName: string;
    attendance: 'hadir' | 'tidak_hadir' | 'ragu';
    message: string;
  }) => void;
  onSelectTheme: (themeId: WeddingThemeId) => void;
  onSwitchToDashboard?: () => void;
}

export const InvitationView: React.FC<InvitationViewProps> = ({
  config,
  currentGuest,
  wishes,
  onSaveRsvp,
  onLikeWish,
  onAddWish,
  onSelectTheme,
  onSwitchToDashboard,
}) => {
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [showPetals, setShowPetals] = useState(true);

  const activeTheme = WEDDING_THEMES[config.theme] || WEDDING_THEMES.champagne;
  const guestDisplayName = currentGuest ? currentGuest.name : '';

  const handleOpenInvitation = () => {
    setIsCoverOpen(true);
    setIsPlayingMusic(true);
  };

  return (
    <div
      className="min-h-screen relative selection:bg-[#8a724d] selection:text-white transition-colors duration-500"
      style={{
        backgroundColor: activeTheme.bgColor,
        color: activeTheme.textColor,
      }}
    >
      {/* Floating gentle romantic floral petals */}
      <FallingPetals
        enabled={showPetals && isCoverOpen}
        color={
          config.theme === 'emerald'
            ? '#a3c9a8'
            : config.theme === 'rose'
            ? '#f4a5ae'
            : config.theme === 'navy'
            ? '#b8c9e8'
            : config.theme === 'heritage'
            ? '#d4a373'
            : '#e8d5b5'
        }
      />

      {/* Cover Envelope Overlay */}
      <AnimatePresence>
        {!isCoverOpen && (
          <CoverEnvelope
            config={config}
            guestName={guestDisplayName}
            onOpen={handleOpenInvitation}
          />
        )}
      </AnimatePresence>

      {/* Floating Top Navigation Bar */}
      <header
        className="sticky top-0 z-30 backdrop-blur-md border-b px-6 py-3.5 transition-all shadow-xs"
        style={{
          backgroundColor: `${activeTheme.bgColor}F0`,
          borderColor: `${activeTheme.primaryColor}25`,
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-8">
          {/* Brand Wordmark (Zone 1) */}
          <a
            href="#"
            className="font-editorial text-xl font-medium tracking-wide whitespace-nowrap shrink-0 transition-colors"
            style={{ color: activeTheme.textColor }}
          >
            {config.groom.nickName} &amp; {config.bride.nickName}
          </a>

          {/* Nav Links (Zone 2) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-widest font-sans opacity-85">
            <a href="#mempelai" className="hover:opacity-100 transition-opacity whitespace-nowrap shrink-0">
              Mempelai
            </a>
            <a href="#acara" className="hover:opacity-100 transition-opacity whitespace-nowrap shrink-0">
              Acara
            </a>
            <a href="#kisah" className="hover:opacity-100 transition-opacity whitespace-nowrap shrink-0">
              Kisah
            </a>
            <a href="#galeri" className="hover:opacity-100 transition-opacity whitespace-nowrap shrink-0">
              Galeri
            </a>
            <a href="#rsvp" className="hover:opacity-100 transition-opacity whitespace-nowrap shrink-0">
              RSVP
            </a>
            <a href="#kado" className="hover:opacity-100 transition-opacity whitespace-nowrap shrink-0">
              Amplop
            </a>
            <a href="#doa" className="hover:opacity-100 transition-opacity whitespace-nowrap shrink-0">
              Doa Restu
            </a>
          </nav>

          {/* Action Zone (Zone 3) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Petal animation toggle button */}
            <button
              onClick={() => setShowPetals(!showPetals)}
              type="button"
              className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                showPetals ? 'bg-[#8a724d]/15 text-[#8a724d]' : 'bg-stone-200 text-stone-500'
              }`}
              title={showPetals ? 'Nonaktifkan Efek Kelopak Gugur' : 'Aktifkan Efek Kelopak Gugur'}
            >
              <Flower2 className="w-3.5 h-3.5" />
            </button>

            {/* Theme Selector Catalog Button (like undgn.id) */}
            <button
              onClick={() => setIsThemeModalOpen(true)}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-200/70 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-medium tracking-wider uppercase transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Pilih Desain Tema Lain (Seperti undgn.id)"
            >
              <Palette className="w-3.5 h-3.5 text-[#8a724d]" />
              <span className="hidden sm:inline">Tema:</span>
              <span className="font-semibold">{activeTheme.name.split(' ')[0]}</span>
            </button>

            {currentGuest && (
              <button
                onClick={() => setIsTicketOpen(true)}
                type="button"
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#f0e9dc] hover:bg-[#e4dcce] text-[#7a643e] rounded-lg text-xs font-medium tracking-wider uppercase transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Tiket Tamu</span>
              </button>
            )}

          </div>
        </div>
      </header>

      {/* Main Sections */}
      <main>
        <HeroSection config={config} guestName={guestDisplayName} />
        <CoupleSection config={config} />
        <EventSection config={config} />
        <LoveStorySection config={config} />
        <GallerySection photos={config.galleryPhotos} />
        <RsvpFormSection
          currentGuest={currentGuest}
          onSaveRsvp={onSaveRsvp}
          onOpenTicket={() => setIsTicketOpen(true)}
        />
        <DigitalGiftSection config={config} />
        <WishesGuestbookSection
          wishes={wishes}
          defaultSenderName={guestDisplayName}
          onLikeWish={onLikeWish}
          onAddWish={onAddWish}
        />
      </main>

      {/* Footer */}
      <footer className="py-16 px-6 bg-[#24201b] text-stone-300 text-center border-t border-stone-800">
        <div className="max-w-2xl mx-auto">
          <Heart className="w-5 h-5 text-[#8a724d] mx-auto mb-3 fill-[#8a724d]/30" />
          <h3 className="font-editorial text-3xl font-light text-white tracking-wide">
            {config.groom.nickName} &amp; {config.bride.nickName}
          </h3>
          <p className="text-xs text-stone-400 mt-2 max-w-md mx-auto leading-relaxed font-sans">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.
          </p>
          <div className="w-12 h-px bg-stone-700 mx-auto my-6" />
          <p className="text-[11px] text-stone-500 font-sans tracking-wider uppercase">
            The Wedding Celebration · {config.ceremony.dateFormatted}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-stone-500">
            <span>Tema Aktif: {activeTheme.name}</span>
            <span>·</span>
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="text-[#e6ca65] hover:underline cursor-pointer"
            >
              Ganti Tema Undangan
            </button>
          </div>
        </div>
      </footer>

      {/* Background Audio Player (Music automatically plays upon opening, speaker button removed) */}
      <BackgroundAudioPlayer isPlaying={isPlayingMusic} music={config.music} />

      {/* Digital Pass Modal */}
      <DigitalTicketModal
        guest={currentGuest}
        config={config}
        isOpen={isTicketOpen}
        onClose={() => setIsTicketOpen(false)}
      />

      {/* Theme Catalog Modal (undgn.id style) */}
      <ThemeCatalogModal
        currentThemeId={config.theme}
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        onSelectTheme={(themeId) => {
          onSelectTheme(themeId);
          setIsThemeModalOpen(false);
        }}
      />
    </div>
  );
};
