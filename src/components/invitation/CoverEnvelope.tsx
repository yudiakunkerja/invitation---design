import React from 'react';
import { motion } from 'motion/react';
import { Heart, MailOpen, Sparkles } from 'lucide-react';
import { WeddingConfig } from '../../types/wedding';

interface CoverEnvelopeProps {
  config: WeddingConfig;
  guestName: string;
  onOpen: () => void;
}

export const CoverEnvelope: React.FC<CoverEnvelopeProps> = ({
  config,
  guestName,
  onOpen,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -80, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141210] overflow-hidden select-none"
    >
      {/* Background with subtle photo scrim */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-sm scale-105"
        style={{ backgroundImage: `url('${config.heroPhotoUrl?.trim() || '/src/assets/images/wedding_hero_couple_1791869150830.jpg'}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/80" />

      {/* Decorative floral botanical border & frame */}
      <div className="relative z-10 w-full max-w-lg mx-auto bg-[#faf8f5]/95 backdrop-blur-md rounded-2xl p-8 sm:p-12 shadow-2xl border border-[#e8dfcf] text-center">
        {/* Top Ornament */}
        <div className="flex items-center justify-center gap-2 mb-4 text-[#9c825a]">
          <span className="w-12 h-px bg-[#d6cebe]" />
          <Sparkles className="w-4 h-4 text-[#9c825a]" />
          <span className="text-xs uppercase tracking-[0.25em] font-sans font-medium">The Wedding Celebration</span>
          <Sparkles className="w-4 h-4 text-[#9c825a]" />
          <span className="w-12 h-px bg-[#d6cebe]" />
        </div>

        {/* Couple Title */}
        <h1 className="font-editorial text-4xl sm:text-5xl text-[#2c261e] font-normal tracking-wide leading-tight mt-2">
          {config.groom.nickName} &amp; {config.bride.nickName}
        </h1>

        <p className="text-xs uppercase tracking-[0.2em] text-[#786c5a] mt-3">
          {config.ceremony.dateFormatted}
        </p>

        {/* Divider */}
        <div className="my-8 flex items-center justify-center gap-3">
          <div className="h-px bg-[#dcd4c6] flex-1" />
          <Heart className="w-4 h-4 text-[#9c825a] fill-[#9c825a]/20" />
          <div className="h-px bg-[#dcd4c6] flex-1" />
        </div>

        {/* Guest Salutation Box */}
        <div className="bg-[#f2ece1] border border-[#e4dcce] rounded-xl p-5 mb-8">
          <p className="text-xs text-[#7a6f5e] tracking-wider uppercase font-sans">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </p>
          <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#251f18] mt-2">
            {guestName || 'Tamu Undangan'}
          </h2>
          <p className="text-xs text-[#8c806f] mt-1 italic">
            Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir dalam momen bahagia kami.
          </p>
        </div>

        {/* Open Button with Wax Seal motif */}
        <button
          onClick={onOpen}
          type="button"
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-[#8a724d] hover:bg-[#735e3d] active:scale-95 text-[#faf8f5] rounded-xl font-medium text-sm tracking-wider uppercase shadow-lg shadow-[#8a724d]/25 transition-all duration-200 cursor-pointer"
        >
          <MailOpen className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span>Buka Undangan</span>
        </button>

        <p className="text-[11px] text-[#9c9180] mt-4 font-sans">
          Sentuh untuk membuka lembar undangan dan memutar alunan musik
        </p>
      </div>
    </motion.div>
  );
};
