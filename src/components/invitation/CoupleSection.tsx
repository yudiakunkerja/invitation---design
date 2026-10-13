import React from 'react';
import { Heart, Instagram } from 'lucide-react';
import { WeddingConfig } from '../../types/wedding';

interface CoupleSectionProps {
  config: WeddingConfig;
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({ config }) => {
  return (
    <section id="mempelai" className="py-24 px-6 bg-[#faf8f5]">
      <div className="max-w-4xl mx-auto">
        {/* Sacred Quote / Blessing */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="font-editorial italic text-lg sm:text-xl text-stone-700 leading-relaxed">
            &ldquo;{config.quote.text}&rdquo;
          </p>
          <span className="inline-block mt-3 text-xs tracking-widest uppercase font-sans text-stone-500 font-medium">
            — {config.quote.source}
          </span>
        </div>

        {/* Section Heading */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#9c825a] font-sans font-medium block">
            Maha Suci Allah yang Menciptakan Makhluk-Nya Berpasangan
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl text-stone-900 mt-2 font-normal">
            Kedua Mempelai
          </h2>
          <div className="w-16 h-px bg-[#d6cebe] mx-auto mt-4" />
        </div>

        {/* Couple Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 items-center">
          {/* Groom Card */}
          <div className="flex flex-col items-center text-center">
            <div className="relative group mb-6">
              <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-[#e8dfcf] shadow-xl bg-stone-200">
                <img
                  src={config.groom.photoUrl?.trim() || '/src/assets/images/groom_portrait_1791869151086.jpg'}
                  alt={config.groom.fullName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/src/assets/images/groom_portrait_1791869151086.jpg';
                  }}
                />
              </div>
              <div className="absolute -bottom-2 right-6 bg-[#8a724d] text-white p-2 rounded-full shadow-md">
                <Heart className="w-4 h-4 fill-white" />
              </div>
            </div>

            <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-stone-900">
              {config.groom.fullName}
            </h3>
            <p className="text-sm font-medium text-[#8a724d] mt-1 font-sans">
              Mempelai Pria
            </p>
            <p className="text-xs text-stone-600 mt-3 max-w-xs leading-relaxed font-sans">
              {config.groom.parents}
            </p>

            <a
              href={`https://instagram.com/${config.groom.igHandle.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-stone-600 hover:text-[#8a724d] transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>{config.groom.igHandle}</span>
            </a>
          </div>

          {/* Bride Card */}
          <div className="flex flex-col items-center text-center">
            <div className="relative group mb-6">
              <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-[#e8dfcf] shadow-xl bg-stone-200">
                <img
                  src={config.bride.photoUrl?.trim() || '/src/assets/images/bride_portrait_1791869150747.jpg'}
                  alt={config.bride.fullName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/src/assets/images/bride_portrait_1791869150747.jpg';
                  }}
                />
              </div>
              <div className="absolute -bottom-2 right-6 bg-[#8a724d] text-white p-2 rounded-full shadow-md">
                <Heart className="w-4 h-4 fill-white" />
              </div>
            </div>

            <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-stone-900">
              {config.bride.fullName}
            </h3>
            <p className="text-sm font-medium text-[#8a724d] mt-1 font-sans">
              Mempelai Wanita
            </p>
            <p className="text-xs text-stone-600 mt-3 max-w-xs leading-relaxed font-sans">
              {config.bride.parents}
            </p>

            <a
              href={`https://instagram.com/${config.bride.igHandle.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-stone-600 hover:text-[#8a724d] transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>{config.bride.igHandle}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
