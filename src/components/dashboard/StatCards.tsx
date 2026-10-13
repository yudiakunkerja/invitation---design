import React from 'react';
import { CheckCircle2, Clock, HelpCircle, Users, UserX, UserCheck } from 'lucide-react';
import { Guest } from '../../types/wedding';

interface StatCardsProps {
  guests: Guest[];
}

export const StatCards: React.FC<StatCardsProps> = ({ guests }) => {
  const totalGuests = guests.length;
  const confirmed = guests.filter((g) => g.rsvpStatus === 'confirmed');
  const declined = guests.filter((g) => g.rsvpStatus === 'declined');
  const tentative = guests.filter((g) => g.rsvpStatus === 'tentative');
  const pending = guests.filter((g) => g.rsvpStatus === 'pending');
  const checkedIn = guests.filter((g) => g.checkedIn);

  const totalPaxConfirmed = confirmed.reduce((acc, g) => acc + (g.paxCount || 1), 0);
  const responseRate = totalGuests > 0 ? Math.round(((totalGuests - pending.length) / totalGuests) * 100) : 0;
  const checkInRate = confirmed.length > 0 ? Math.round((checkedIn.length / confirmed.length) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* Total Undangan */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between text-stone-500 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider font-sans">Total Undangan</span>
          <Users className="w-4 h-4 text-stone-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-tabular text-stone-900">{totalGuests}</span>
          <span className="text-[11px] text-stone-500 font-sans">kontak</span>
        </div>
        <p className="text-[11px] text-stone-500 mt-2 font-sans">
          Respon RSVP: <strong className="font-tabular text-stone-700">{responseRate}%</strong>
        </p>
      </div>

      {/* Konfirmasi Hadir */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between text-emerald-600 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider font-sans">Pasti Hadir</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-tabular text-emerald-700">{confirmed.length}</span>
          <span className="text-[11px] text-emerald-700 font-sans">undangan</span>
        </div>
        <p className="text-[11px] text-stone-600 mt-2 font-sans">
          Total estimasi: <strong className="font-tabular text-stone-900">{totalPaxConfirmed} Pax</strong>
        </p>
      </div>

      {/* Ragu-ragu */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between text-amber-600 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider font-sans">Ragu-ragu</span>
          <HelpCircle className="w-4 h-4 text-amber-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-tabular text-amber-700">{tentative.length}</span>
          <span className="text-[11px] text-stone-500 font-sans">undangan</span>
        </div>
        <p className="text-[11px] text-stone-500 mt-2 font-sans">
          Menunggu kepastian
        </p>
      </div>

      {/* Tidak Hadir */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between text-stone-500 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider font-sans">Berhalangan</span>
          <UserX className="w-4 h-4 text-stone-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-tabular text-stone-800">{declined.length}</span>
          <span className="text-[11px] text-stone-500 font-sans">undangan</span>
        </div>
        <p className="text-[11px] text-stone-500 mt-2 font-sans">
          Kirim doa restu
        </p>
      </div>

      {/* Belum Merespon */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between text-stone-500 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider font-sans">Belum Respon</span>
          <Clock className="w-4 h-4 text-stone-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-tabular text-stone-700">{pending.length}</span>
          <span className="text-[11px] text-stone-500 font-sans">undangan</span>
        </div>
        <p className="text-[11px] text-stone-500 mt-2 font-sans">
          Perlu difollow-up
        </p>
      </div>

      {/* Check-In di Hari H */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between text-[#8a724d] mb-2">
          <span className="text-xs font-medium uppercase tracking-wider font-sans">Telah Check-In</span>
          <UserCheck className="w-4 h-4 text-[#8a724d]" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-tabular text-[#8a724d]">{checkedIn.length}</span>
          <span className="text-[11px] text-stone-500 font-sans">hadir di venue</span>
        </div>
        <p className="text-[11px] text-stone-500 mt-2 font-sans">
          Progress: <strong className="font-tabular text-stone-800">{checkInRate}%</strong>
        </p>
      </div>
    </div>
  );
};
