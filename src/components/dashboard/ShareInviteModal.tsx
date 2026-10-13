import React, { useState } from 'react';
import { Check, Copy, MessageCircle, Send, X } from 'lucide-react';
import { Guest, WeddingConfig } from '../../types/wedding';

interface ShareInviteModalProps {
  guest: Guest | null;
  config: WeddingConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareInviteModal: React.FC<ShareInviteModalProps> = ({
  guest,
  config,
  isOpen,
  onClose,
}) => {
  const [copiedType, setCopiedType] = useState<'text' | 'link' | null>(null);

  if (!isOpen || !guest) return null;

  // Base URL calculation
  const baseUrl = window.location.origin;
  const invitationLink = `${baseUrl}?to=${encodeURIComponent(guest.name)}&guest=${guest.id}`;

  const messageText = `Yth. Bapak/Ibu/Saudara/i ${guest.name},

Tanpa mengurangi rasa hormat, kami bermaksud mengundang Anda untuk hadir dalam momen bahagia pernikahan kami:

*${config.eventTitle}*
📅 Hari/Tanggal: ${config.reception.dateFormatted}
⏰ Waktu: ${guest.session || config.reception.time}
🏛️ Lokasi: ${config.reception.venueName}
📍 Meja Reservasi: ${guest.table}

Untuk melihat detail rangkaian acara serta konfirmasi kehadiran (RSVP), silakan buka undangan digital Anda melalui tautan resmi berikut:
${invitationLink}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Hormat kami yang berbahagia,
${config.groom.nickName} & ${config.bride.nickName}`;

  const handleCopy = (content: string, type: 'text' | 'link') => {
    navigator.clipboard.writeText(content);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleSendWhatsApp = () => {
    const cleanPhone = guest.phone.replace(/[^0-9]/g, '');
    let formattedPhone = cleanPhone;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.slice(1);
    }

    const waUrl = formattedPhone && formattedPhone.length > 8
      ? `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(messageText)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-base text-stone-900 font-sans">
              Bagikan Undangan WhatsApp
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs font-sans">
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
            <span className="text-[10px] text-stone-500 uppercase font-semibold block">
              Tamu Tujuan:
            </span>
            <span className="text-sm font-bold text-stone-900 block mt-0.5">
              {guest.name}
            </span>
            <span className="text-stone-500 font-mono text-[11px]">
              No. HP: {guest.phone} · Meja: {guest.table}
            </span>
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1.5">
              Pratinjau Pesan Personal:
            </label>
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 font-sans text-stone-800 whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto">
              {messageText}
            </div>
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1.5">
              Tautan Khusus Tamu:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={invitationLink}
                className="w-full px-3 py-2 bg-stone-100 border border-stone-200 rounded-lg font-mono text-[11px] text-stone-600 select-all"
              />
              <button
                type="button"
                onClick={() => handleCopy(invitationLink, 'link')}
                className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer"
              >
                {copiedType === 'link' ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-stone-200 bg-stone-50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={() => handleCopy(messageText, 'text')}
            className="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg font-medium inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            {copiedType === 'text' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>Pesan Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Pesan Lengkap</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium inline-flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
