import React from 'react';
import { Download, Printer, Sparkles, X } from 'lucide-react';
import { Guest, WeddingConfig } from '../../types/wedding';
import { QrCodeView } from '../common/QrCodeView';

interface DigitalTicketModalProps {
  guest: Guest | null;
  config: WeddingConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalTicketModal: React.FC<DigitalTicketModalProps> = ({
  guest,
  config,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const ticketCode = guest ? guest.id : 'G-VIP-ENTRY';
  const guestName = guest ? guest.name : 'Tamu Kehormatan';
  const tableAssignment = guest?.table || 'Meja Resepsi Utama';
  const session = guest?.session || 'Sesi 1 (10:00 - 12:30 WIB)';
  const pax = guest?.paxCount || 2;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#faf8f5] rounded-2xl shadow-2xl border border-[#ded5c5] overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="no-print absolute top-4 right-4 text-stone-400 hover:text-stone-800 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ticket Header */}
        <div className="bg-[#24201b] text-white p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#8a724d]/30 via-transparent to-[#8a724d]/30" />
          <div className="relative z-10">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#e6ca65] block font-sans">
              Pass Masuk Tamu Undangan
            </span>
            <h3 className="font-editorial text-2xl font-normal mt-1">
              {config.groom.nickName} &amp; {config.bride.nickName}
            </h3>
            <p className="text-xs text-stone-300 mt-1">
              {config.ceremony.dateFormatted}
            </p>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 text-center">
          <p className="text-xs text-stone-500 uppercase tracking-widest font-sans">
            Tamu Terdaftar
          </p>
          <h4 className="font-editorial text-2xl font-bold text-stone-900 mt-1">
            {guestName}
          </h4>

          {/* Details Pill Strip */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-left bg-[#f2ece1] p-3.5 rounded-xl border border-[#e4dcce] text-xs">
            <div>
              <span className="text-[10px] uppercase text-stone-500 tracking-wider block">
                Nomor Meja
              </span>
              <span className="font-semibold text-stone-900 block mt-0.5">
                {tableAssignment}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-stone-500 tracking-wider block">
                Kapasitas
              </span>
              <span className="font-semibold text-stone-900 block mt-0.5">
                {pax} Pax (Orang)
              </span>
            </div>
            <div className="col-span-2 pt-2 border-t border-[#dfd6c7]">
              <span className="text-[10px] uppercase text-stone-500 tracking-wider block">
                Jadwal Sesi
              </span>
              <span className="font-semibold text-stone-900 block mt-0.5">
                {session}
              </span>
            </div>
          </div>

          {/* QR Code Graphic */}
          <div className="mt-6 flex flex-col items-center">
            <QrCodeView value={ticketCode} size={150} sublabel={`KODE: ${ticketCode}`} />
            <p className="text-[11px] text-stone-500 mt-2 font-sans max-w-xs">
              Tunjukkan kode QR ini kepada penerima tamu di pintu masuk resepsi untuk proses registrasi kilat.
            </p>
          </div>

          {/* Actions */}
          <div className="no-print mt-6 pt-5 border-t border-[#e8dfcf] flex items-center justify-center gap-3">
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8a724d] hover:bg-[#735e3d] text-white rounded-xl text-xs font-medium uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Unduh PDF</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
