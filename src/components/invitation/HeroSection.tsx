import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Clock } from 'lucide-react';
import { WeddingConfig } from '../../types/wedding';

interface HeroSectionProps {
  config: WeddingConfig;
  guestName: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ config, guestName }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(config.eventDateTimestamp).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [config.eventDateTimestamp]);

  const handleSaveToCalendar = () => {
    // Generate Google Calendar Link
    const startTime = '20261024T010000Z'; // 08:00 WIB is 01:00 UTC
    const endTime = '20261024T090000Z'; // 16:00 WIB is 09:00 UTC
    const title = encodeURIComponent(config.eventTitle);
    const details = encodeURIComponent(
      `Pernikahan ${config.groom.nickName} & ${config.bride.nickName}.\nLokasi: ${config.reception.venueName}, ${config.reception.address}`
    );
    const location = encodeURIComponent(`${config.reception.venueName}, ${config.reception.address}`);

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
    window.open(gcalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center text-center overflow-hidden">
      {/* Background Image with Measured Scrim */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-[0.78]"
        style={{ backgroundImage: `url('${config.heroPhotoUrl?.trim() || '/src/assets/images/wedding_hero_couple_1791869150830.jpg'}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/85" />

      {/* Main Content */}
      <div className="relative z-10 max-w-3xl px-6 py-20 mx-auto text-stone-100 flex flex-col items-center">
        {/* Top Kicker */}
        <p className="text-xs sm:text-sm tracking-[0.3em] uppercase font-sans text-stone-300 font-light mb-4">
          Walimatul Ursy · Undangan Pernikahan
        </p>

        {/* Couple Names */}
        <h1 className="font-editorial text-5xl sm:text-7xl md:text-8xl font-normal tracking-wide text-white drop-shadow-md">
          {config.groom.nickName} <span className="font-script text-4xl sm:text-6xl text-[#d4af37]">&amp;</span> {config.bride.nickName}
        </h1>

        {/* Date line */}
        <div className="mt-4 flex items-center gap-3 text-stone-200 text-sm sm:text-base font-light">
          <Calendar className="w-4 h-4 text-[#d4af37]" />
          <span>{config.ceremony.dateFormatted}</span>
          <span>·</span>
          <span>Bogor, Jawa Barat</span>
        </div>

        {guestName && (
          <div className="mt-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm text-stone-200 font-light">
            Tamu Istimewa: <strong className="font-medium text-white">{guestName}</strong>
          </div>
        )}

        {/* Live Countdown Box */}
        <div className="mt-10 w-full max-w-md">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-300 mb-3 flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Menghitung Hari Menuju Hari Bahagia</span>
          </p>

          <div className="grid grid-cols-4 gap-2.5 sm:gap-4 font-tabular">
            <div className="bg-black/40 backdrop-blur-md border border-white/15 rounded-xl p-3 sm:p-4 text-center">
              <span className="text-2xl sm:text-3xl font-bold text-white block">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-stone-300 uppercase tracking-wider font-sans mt-0.5 block">
                Hari
              </span>
            </div>
            <div className="bg-black/40 backdrop-blur-md border border-white/15 rounded-xl p-3 sm:p-4 text-center">
              <span className="text-2xl sm:text-3xl font-bold text-white block">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-stone-300 uppercase tracking-wider font-sans mt-0.5 block">
                Jam
              </span>
            </div>
            <div className="bg-black/40 backdrop-blur-md border border-white/15 rounded-xl p-3 sm:p-4 text-center">
              <span className="text-2xl sm:text-3xl font-bold text-white block">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-stone-300 uppercase tracking-wider font-sans mt-0.5 block">
                Menit
              </span>
            </div>
            <div className="bg-black/40 backdrop-blur-md border border-white/15 rounded-xl p-3 sm:p-4 text-center">
              <span className="text-2xl sm:text-3xl font-bold text-[#e6ca65] block">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-stone-300 uppercase tracking-wider font-sans mt-0.5 block">
                Detik
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: Save to Calendar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleSaveToCalendar}
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white rounded-lg text-xs tracking-wider uppercase font-medium transition-all duration-200 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Simpan ke Google Calendar</span>
          </button>
        </div>

        {/* Scroll Indicator */}
        <a
          href="#mempelai"
          className="mt-14 inline-flex flex-col items-center text-stone-400 hover:text-white transition-colors text-xs font-light tracking-widest uppercase"
        >
          <span>Gulir ke Bawah</span>
          <ChevronDown className="w-4 h-4 mt-1 animate-bounce" />
        </a>
      </div>
    </section>
  );
};
