import React from 'react';
import { Calendar, Clock, MapPin, Navigation } from 'lucide-react';
import { WeddingConfig } from '../../types/wedding';

interface EventSectionProps {
  config: WeddingConfig;
}

export const EventSection: React.FC<EventSectionProps> = ({ config }) => {
  return (
    <section id="acara" className="py-24 px-6 bg-[#f5f1ea] border-y border-[#e8dfcf]">
      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#9c825a] font-sans font-medium block">
            Waktu &amp; Tempat Pelaksanaan
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl text-stone-900 mt-2 font-normal">
            Rangkaian Acara
          </h2>
          <p className="text-xs text-stone-600 mt-2 max-w-lg mx-auto font-sans">
            Dengan penuh rasa syukur, kami mengundang kehadiran Bapak/Ibu/Saudara/i untuk menjadi saksi ikrar suci kami.
          </p>
          <div className="w-16 h-px bg-[#d6cebe] mx-auto mt-4" />
        </div>

        {/* Venue Showcase Banner */}
        <div className="mb-12 rounded-2xl overflow-hidden border border-[#ded5c5] shadow-lg relative h-64 sm:h-80">
          <img
            src={config.venuePhotoUrl?.trim() || '/src/assets/images/wedding_venue_glasshouse_1791869150973.jpg'}
            alt={config.reception.venueName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/src/assets/images/wedding_venue_glasshouse_1791869150973.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
            <span className="text-xs uppercase tracking-widest text-[#e8c872]">Lokasi Resmi Acara</span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-medium mt-1">
              {config.reception.venueName}
            </h3>
            <p className="text-xs text-stone-300 mt-1 max-w-xl">
              {config.reception.address}
            </p>
          </div>
        </div>

        {/* 2 Event Cards (Akad & Resepsi) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Akad Nikah */}
          <div className="bg-[#faf8f5] rounded-2xl p-8 border border-[#e4dcce] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#e8dfcf]">
                <h3 className="font-editorial text-2xl font-medium text-stone-900">
                  {config.ceremony.title}
                </h3>
                <span className="text-xs font-medium text-[#8a724d] bg-[#f2ece1] px-3 py-1 rounded-full">
                  Keluarga &amp; Sahabat Inti
                </span>
              </div>

              <div className="space-y-4 mt-6 text-sm text-stone-700 font-sans">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-[#8a724d] shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-medium text-stone-900">{config.ceremony.dateFormatted}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#8a724d] shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-medium text-stone-900">{config.ceremony.time}</span>
                    <span className="text-xs text-stone-500">Diharapkan hadir 15 menit sebelum acara dimulai</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#8a724d] shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-medium text-stone-900">{config.ceremony.venueName}</span>
                    <span className="text-xs text-stone-500 block mt-0.5">{config.ceremony.address}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#e8dfcf]">
              <a
                href={config.ceremony.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#8a724d] hover:bg-[#735e3d] text-white rounded-lg text-xs font-medium uppercase tracking-wider transition-colors shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Petunjuk Arah Google Maps</span>
              </a>
            </div>
          </div>

          {/* Card 2: Resepsi Pernikahan */}
          <div className="bg-[#faf8f5] rounded-2xl p-8 border border-[#e4dcce] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#e8dfcf]">
                <h3 className="font-editorial text-2xl font-medium text-stone-900">
                  {config.reception.title}
                </h3>
                <span className="text-xs font-medium text-[#8a724d] bg-[#f2ece1] px-3 py-1 rounded-full">
                  Undangan Umum &amp; Kolega
                </span>
              </div>

              <div className="space-y-4 mt-6 text-sm text-stone-700 font-sans">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-[#8a724d] shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-medium text-stone-900">{config.reception.dateFormatted}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#8a724d] shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-medium text-stone-900">{config.reception.time}</span>
                    <span className="text-xs text-stone-500">Terbagi atas 2 sesi sesuai undangan tamu</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#8a724d] shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-medium text-stone-900">{config.reception.venueName}</span>
                    <span className="text-xs text-stone-500 block mt-0.5">{config.reception.address}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#e8dfcf]">
              <a
                href={config.reception.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#8a724d] hover:bg-[#735e3d] text-white rounded-lg text-xs font-medium uppercase tracking-wider transition-colors shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Petunjuk Arah Google Maps</span>
              </a>
            </div>
          </div>
        </div>

        {/* Dresscode Guidance Box */}
        <div className="mt-8 p-6 bg-white/80 rounded-xl border border-[#ded5c5] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-stone-900">Dresscode &amp; Panduan Busana</h4>
            <p className="text-xs text-stone-600 mt-0.5">
              Tamu dipersilakan mengenakan busana bernuansa <strong className="text-stone-800">Earth Tone &amp; Formal Elegance</strong>.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-[#EAD8C0] border border-stone-300" title="Champagne Cream" />
              <span className="w-6 h-6 rounded-full bg-[#A2B29F] border border-stone-300" title="Sage Green" />
              <span className="w-6 h-6 rounded-full bg-[#BD8E62] border border-stone-300" title="Terracotta / Tan" />
              <span className="w-6 h-6 rounded-full bg-[#3F4E4F] border border-stone-300" title="Deep Slate" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
