import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, CheckCircle2, QrCode, Send, Sparkles, UserCheck, XCircle } from 'lucide-react';
import { Guest, RsvpStatus } from '../../types/wedding';

interface RsvpFormSectionProps {
  currentGuest: Guest | null;
  onSaveRsvp: (data: {
    name: string;
    rsvpStatus: RsvpStatus;
    paxCount: number;
    session: string;
    wishes: string;
  }) => void;
  onOpenTicket: () => void;
}

export const RsvpFormSection: React.FC<RsvpFormSectionProps> = ({
  currentGuest,
  onSaveRsvp,
  onOpenTicket,
}) => {
  const [name, setName] = useState(currentGuest ? currentGuest.name : '');
  const [status, setStatus] = useState<RsvpStatus>(
    currentGuest?.rsvpStatus && currentGuest.rsvpStatus !== 'pending'
      ? currentGuest.rsvpStatus
      : 'confirmed'
  );
  const [pax, setPax] = useState<number>(currentGuest?.paxCount || 1);
  const [session, setSession] = useState<string>(
    currentGuest?.session || 'Sesi 1 (10:00 - 12:30)'
  );
  const [wishes, setWishes] = useState<string>(currentGuest?.wishes || '');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveRsvp({
      name: name.trim(),
      rsvpStatus: status,
      paxCount: status === 'declined' ? 0 : pax,
      session,
      wishes: wishes.trim(),
    });

    setIsSubmitted(true);

    if (status === 'confirmed') {
      // Trigger joyful celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#9c825a', '#2c261e', '#e6ca65'],
      });
    }
  };

  return (
    <section id="rsvp" className="py-24 px-6 bg-[#faf8f5]">
      <div className="max-w-2xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#9c825a] font-sans font-medium block">
            Konfirmasi Kehadiran
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl text-stone-900 mt-2 font-normal">
            RSVP Online
          </h2>
          <p className="text-xs text-stone-600 mt-2 max-w-md mx-auto font-sans">
            Mohon kesediaan Bapak/Ibu/Saudara/i untuk mengonfirmasi kehadiran demi kenyamanan pengaturan jamuan.
          </p>
          <div className="w-16 h-px bg-[#d6cebe] mx-auto mt-4" />
        </div>

        {/* Card Form */}
        <div className="bg-[#f7f4ee] rounded-2xl p-6 sm:p-10 border border-[#e8dfcf] shadow-sm">
          {isSubmitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-[#8a724d]/10 text-[#8a724d] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-editorial text-3xl font-medium text-stone-900">
                Terima Kasih Atas Konfirmasinya
              </h3>
              <p className="text-xs text-stone-600 mt-2 max-w-sm mx-auto font-sans">
                {status === 'confirmed'
                  ? 'Konfirmasi kehadiran Anda telah tercatat dengan baik dalam sistem dasbor kami. Sampai jumpa di hari bahagia!'
                  : status === 'declined'
                  ? 'Terima kasih atas kabar dan doa restunya. Semoga senantiasa dalam limpahan berkah.'
                  : 'Konfirmasi Anda tercatat sebagai ragu-ragu. Anda dapat memperbaruinya sewaktu-waktu.'}
              </p>

              {status === 'confirmed' && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={onOpenTicket}
                    type="button"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#8a724d] hover:bg-[#735e3d] text-white rounded-xl text-xs font-medium uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Lihat Tiket Masuk &amp; QR Code Meja</span>
                  </button>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    type="button"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-stone-200/80 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-medium uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <span>Ubah Konfirmasi</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nama Tamu */}
              <div>
                <label className="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-2">
                  Nama Lengkap Tamu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Bpk. Bambang Wijaya &amp; Istri"
                  className="w-full px-4 py-3 bg-white border border-[#d6cebe] rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8a724d]/40 focus:border-[#8a724d]"
                />
              </div>

              {/* Status Kehadiran Segmented Buttons */}
              <div>
                <label className="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-2">
                  Konfirmasi Kehadiran <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('confirmed')}
                    className={`py-3 px-3 rounded-xl border text-xs font-medium transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      status === 'confirmed'
                        ? 'bg-[#8a724d] text-white border-[#8a724d] shadow-sm'
                        : 'bg-white text-stone-700 border-[#d6cebe] hover:bg-stone-50'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Hadir</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus('tentative')}
                    className={`py-3 px-3 rounded-xl border text-xs font-medium transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      status === 'tentative'
                        ? 'bg-[#b89355] text-white border-[#b89355] shadow-sm'
                        : 'bg-white text-stone-700 border-[#d6cebe] hover:bg-stone-50'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Ragu-ragu</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus('declined')}
                    className={`py-3 px-3 rounded-xl border text-xs font-medium transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      status === 'declined'
                        ? 'bg-stone-800 text-white border-stone-800 shadow-sm'
                        : 'bg-white text-stone-700 border-[#d6cebe] hover:bg-stone-50'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Tidak Hadir</span>
                  </button>
                </div>
              </div>

              {/* Jumlah Hadir & Sesi (Jika hadir / ragu) */}
              {status !== 'declined' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-2">
                      Jumlah Tamu Hadir
                    </label>
                    <select
                      value={pax}
                      onChange={(e) => setPax(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white border border-[#d6cebe] rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8a724d]/40"
                    >
                      <option value={1}>1 Orang (Tunggal)</option>
                      <option value={2}>2 Orang (Bersama Pasangan)</option>
                      <option value={3}>3 Orang (Keluarga)</option>
                      <option value={4}>4 Orang (Keluarga Maksimal)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-2">
                      Sesi Kehadiran
                    </label>
                    <select
                      value={session}
                      onChange={(e) => setSession(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-[#d6cebe] rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8a724d]/40"
                    >
                      <option value="Sesi 1 (10:00 - 12:30)">Sesi 1 (10:00 - 12:30 WIB)</option>
                      <option value="Sesi 2 (13:00 - 15:30)">Sesi 2 (13:00 - 15:30 WIB)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Ucapan & Doa */}
              <div>
                <label className="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-2">
                  Ucapan &amp; Doa Restu
                </label>
                <textarea
                  rows={3}
                  value={wishes}
                  onChange={(e) => setWishes(e.target.value)}
                  placeholder="Tuliskan ucapan dan doa hangat untuk kedua mempelai..."
                  className="w-full px-4 py-3 bg-white border border-[#d6cebe] rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8a724d]/40 focus:border-[#8a724d]"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-[#8a724d] hover:bg-[#735e3d] active:scale-[0.99] text-white rounded-xl text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Konfirmasi Kehadiran</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
