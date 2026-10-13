import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  HelpCircle,
  MessageCircle,
  MoreVertical,
  QrCode,
  RotateCcw,
  Search,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  UserX,
} from 'lucide-react';
import { Guest, GuestCategory, RsvpStatus } from '../../types/wedding';

interface GuestTableProps {
  guests: Guest[];
  onToggleCheckIn: (guestId: string) => void;
  onDeleteGuest: (guestId: string) => void;
  onClearAllGuests?: () => void;
  onLoadDemoGuests?: () => void;
  onOpenAddModal?: () => void;
  onOpenShareModal: (guest: Guest) => void;
  onOpenTicketModal: (guest: Guest) => void;
  onOpenEditModal: (guest: Guest) => void;
}

export const GuestTable: React.FC<GuestTableProps> = ({
  guests,
  onToggleCheckIn,
  onDeleteGuest,
  onClearAllGuests,
  onLoadDemoGuests,
  onOpenAddModal,
  onOpenShareModal,
  onOpenTicketModal,
  onOpenEditModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.phone.includes(searchTerm) ||
      g.table.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'checked_in'
        ? g.checkedIn
        : g.rsvpStatus === statusFilter;

    const matchesCategory =
      categoryFilter === 'all' ? true : g.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Top Filter and Search Bar */}
      <div className="p-4 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, meja, atau nomor telepon..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-stone-400"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Semua ({guests.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('confirmed')}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === 'confirmed'
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Hadir ({guests.filter((g) => g.rsvpStatus === 'confirmed').length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('tentative')}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === 'tentative'
                  ? 'bg-white text-amber-800 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Ragu ({guests.filter((g) => g.rsvpStatus === 'tentative').length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('declined')}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === 'declined'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tidak Hadir ({guests.filter((g) => g.rsvpStatus === 'declined').length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('pending')}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Pending ({guests.filter((g) => g.rsvpStatus === 'pending').length})
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            <option value="VIP">VIP</option>
            <option value="Keluarga">Keluarga</option>
            <option value="Sahabat">Sahabat</option>
            <option value="Rekan Kerja">Rekan Kerja</option>
            <option value="Umum">Umum</option>
          </select>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-medium text-[11px]">
            <tr>
              <th className="py-3 px-4">Tamu Undangan</th>
              <th className="py-3 px-4">Kategori &amp; Meja</th>
              <th className="py-3 px-4">Status RSVP</th>
              <th className="py-3 px-4 text-center">Pax</th>
              <th className="py-3 px-4">Sesi Acara</th>
              <th className="py-3 px-4">Check-In Hari H</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {guests.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 px-4">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                      <Users className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-stone-800 text-sm">
                      Daftar Tamu Masih Kosong
                    </h4>
                    <p className="text-stone-500 text-xs mt-1 mb-4 text-center leading-relaxed">
                      Semua data contoh telah dibersihkan. Anda dapat menambahkan daftar tamu asli Anda sekarang.
                    </p>
                    <div className="flex items-center gap-2">
                      {onOpenAddModal && (
                        <button
                          type="button"
                          onClick={onOpenAddModal}
                          className="px-4 py-2 bg-[#8a724d] hover:bg-[#735e3d] text-white rounded-lg font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Tambah Tamu Baru</span>
                        </button>
                      )}
                      {onLoadDemoGuests && (
                        <button
                          type="button"
                          onClick={onLoadDemoGuests}
                          className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Muat Data Contoh</span>
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ) : filteredGuests.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-stone-400">
                  Tidak ada tamu yang cocok dengan kata kunci atau filter pencarian.
                </td>
              </tr>
            ) : (
              filteredGuests.map((guest) => {
                return (
                  <tr key={guest.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Nama Tamu & Kontak */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-stone-900 text-sm">{guest.name}</div>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                        <span className="font-mono text-stone-400">{guest.id}</span>
                        <span>·</span>
                        <span className="font-mono">{guest.phone}</span>
                      </div>
                    </td>

                    {/* Kategori & Meja */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            guest.category === 'VIP'
                              ? 'bg-amber-100 text-amber-900'
                              : guest.category === 'Keluarga'
                              ? 'bg-blue-100 text-blue-900'
                              : guest.category === 'Sahabat'
                              ? 'bg-purple-100 text-purple-900'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {guest.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-600 mt-1 font-medium">
                        {guest.table}
                      </div>
                    </td>

                    {/* Status RSVP */}
                    <td className="py-3 px-4">
                      {guest.rsvpStatus === 'confirmed' && (
                        <div className="inline-flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Pasti Hadir</span>
                        </div>
                      )}
                      {guest.rsvpStatus === 'tentative' && (
                        <div className="inline-flex items-center gap-1 text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                          <HelpCircle className="w-3 h-3" />
                          <span>Ragu-ragu</span>
                        </div>
                      )}
                      {guest.rsvpStatus === 'declined' && (
                        <div className="inline-flex items-center gap-1 text-stone-700 font-medium bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                          <UserX className="w-3 h-3" />
                          <span>Tidak Hadir</span>
                        </div>
                      )}
                      {guest.rsvpStatus === 'pending' && (
                        <div className="inline-flex items-center gap-1 text-stone-500 font-medium bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                          <Clock className="w-3 h-3" />
                          <span>Belum Respon</span>
                        </div>
                      )}
                    </td>

                    {/* Pax Count */}
                    <td className="py-3 px-4 text-center font-tabular font-semibold text-stone-800">
                      {guest.rsvpStatus === 'declined' ? '-' : `${guest.paxCount} Org`}
                    </td>

                    {/* Sesi */}
                    <td className="py-3 px-4 text-stone-600 text-[11px]">
                      {guest.session}
                    </td>

                    {/* Check In Status Toggle */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => onToggleCheckIn(guest.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                          guest.checkedIn
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                        }`}
                        title="Klik untuk ubah status kehadiran di lokasi"
                      >
                        <UserCheck className="w-3 h-3" />
                        <span>{guest.checkedIn ? 'Sudah Masuk' : 'Check-In'}</span>
                      </button>
                    </td>

                    {/* Aksi */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* WhatsApp Invite */}
                        <button
                          type="button"
                          onClick={() => onOpenShareModal(guest)}
                          title="Bagikan Undangan WhatsApp"
                          className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>

                        {/* View QR Code */}
                        <button
                          type="button"
                          onClick={() => onOpenTicketModal(guest)}
                          title="Lihat Tiket Masuk & QR"
                          className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Hapus tamu "${guest.name}" dari daftar?`)) {
                              onDeleteGuest(guest.id);
                            }
                          }}
                          title="Hapus Tamu"
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer info with Delete All Dummy Guests Action */}
      <div className="p-3 border-t border-stone-200 bg-stone-50 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500">
        <span>Menampilkan {filteredGuests.length} dari total {guests.length} tamu</span>

        <div className="flex items-center gap-3">
          {guests.length > 0 && onClearAllGuests && (
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    'Apakah Anda yakin ingin MENGHAPUS SEMUA data tamu? Daftar tamu akan dikosongkan untuk memulai data baru.'
                  )
                ) {
                  onClearAllGuests();
                }
              }}
              className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua Tamu Demo</span>
            </button>
          )}

          {guests.length === 0 && onLoadDemoGuests && (
            <button
              type="button"
              onClick={onLoadDemoGuests}
              className="text-[#8a724d] hover:underline font-medium cursor-pointer"
            >
              Muat Kembali Data Demo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
