import React, { useState } from 'react';
import { CheckCircle2, QrCode, Search, UserCheck, X } from 'lucide-react';
import { Guest } from '../../types/wedding';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  guests: Guest[];
  onCheckIn: (guestId: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  guests,
  onCheckIn,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [lastCheckedGuest, setLastCheckedGuest] = useState<Guest | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleProcessCode = (code: string) => {
    setErrorMsg('');
    const trimmed = code.trim().toLowerCase();
    if (!trimmed) return;

    // Search by guest ID or Name or Phone
    const found = guests.find(
      (g) =>
        g.id.toLowerCase() === trimmed ||
        g.name.toLowerCase().includes(trimmed) ||
        g.phone.includes(trimmed)
    );

    if (found) {
      onCheckIn(found.id);
      setLastCheckedGuest(found);
      setInputCode('');
    } else {
      setErrorMsg(`Tamu dengan kode/nama "${code}" tidak ditemukan dalam daftar.`);
    }
  };

  const pendingArrivals = guests.filter((g) => !g.checkedIn && g.rsvpStatus === 'confirmed');

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#e6ca65]" />
            <div>
              <h3 className="font-semibold text-base font-sans">
                Meja Resepsionis · Check-In Tamu Hari H
              </h3>
              <p className="text-[11px] text-stone-300">
                Verifikasi kehadiran tamu secara instan menggunakan kode tiket QR
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

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs font-sans">
          {/* Quick Input Bar */}
          <div>
            <label className="block font-medium text-stone-700 mb-1.5">
              Scan Kode Tiket Tamu / Masukkan Nama:
            </label>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleProcessCode(inputCode);
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Contoh: G-101 atau nama tamu..."
                  className="w-full pl-9 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8a724d]/40 focus:border-[#8a724d]"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 bg-[#8a724d] hover:bg-[#735e3d] text-white rounded-xl font-medium tracking-wide transition-colors cursor-pointer"
              >
                Check-In
              </button>
            </form>
            {errorMsg && <p className="text-red-600 mt-2 text-xs">{errorMsg}</p>}
          </div>

          {/* Success Banner when guest checked in */}
          {lastCheckedGuest && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl animate-fadeIn">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                    Registrasi Berhasil · Tamu Telah Masuk
                  </span>
                  <h4 className="text-base font-bold text-emerald-950 mt-0.5">
                    {lastCheckedGuest.name}
                  </h4>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-emerald-900">
                    <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
                      <span className="text-[10px] text-stone-500 block uppercase">Alokasi Meja</span>
                      <strong className="text-stone-900">{lastCheckedGuest.table}</strong>
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
                      <span className="text-[10px] text-stone-500 block uppercase">Jumlah Rombongan</span>
                      <strong className="text-stone-900">{lastCheckedGuest.paxCount || 1} Pax</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pending Attendees Quick Check-in List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-stone-800">
                Tamu Terkonfirmasi Menunggu Kedatangan ({pendingArrivals.length})
              </span>
              <span className="text-[11px] text-stone-500">Klik untuk check-in manual</span>
            </div>

            <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
              {pendingArrivals.length === 0 ? (
                <div className="p-4 text-center text-stone-400">
                  Semua tamu terkonfirmasi telah selesai melakukan check-in!
                </div>
              ) : (
                pendingArrivals.map((guest) => (
                  <div
                    key={guest.id}
                    className="p-3 flex items-center justify-between hover:bg-stone-50 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-stone-900">{guest.name}</div>
                      <div className="text-[11px] text-stone-500">
                        {guest.table} · {guest.paxCount} Pax
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleProcessCode(guest.id)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-emerald-600 hover:text-white rounded-lg text-stone-700 font-medium transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Masuk</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg font-medium transition-colors cursor-pointer text-xs"
          >
            Selesai / Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
