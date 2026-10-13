import React, { useState } from 'react';
import {
  ArrowLeft,
  Download,
  Eye,
  FileSpreadsheet,
  Megaphone,
  MessageSquare,
  QrCode,
  RotateCcw,
  Settings,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import { Guest, GuestCategory, WeddingConfig, WishComment } from '../../types/wedding';
import { StatCards } from './StatCards';
import { GuestTable } from './GuestTable';
import { AddGuestModal } from './AddGuestModal';
import { ShareInviteModal } from './ShareInviteModal';
import { QrScannerModal } from './QrScannerModal';
import { EventSettingsModal } from './EventSettingsModal';
import { WishesModerationTab } from './WishesModerationTab';
import { PromotionCenterModal } from './PromotionCenterModal';
import { DigitalTicketModal } from '../invitation/DigitalTicketModal';

interface DashboardViewProps {
  config: WeddingConfig;
  guests: Guest[];
  wishes: WishComment[];
  onAddGuest: (guest: Omit<Guest, 'id' | 'checkedIn' | 'updatedAt'>) => void;
  onBatchAddGuests: (names: string[], category: GuestCategory, table: string) => void;
  onToggleCheckIn: (guestId: string) => void;
  onDeleteGuest: (guestId: string) => void;
  onClearAllGuests: () => void;
  onClearAllWishes: () => void;
  onLoadDemoGuests: () => void;
  onLoadDemoWishes: () => void;
  onSaveConfig: (updated: WeddingConfig) => void;
  onReplyWish: (wishId: string, replyText: string) => void;
  onDeleteWish: (wishId: string) => void;
  onResetData: () => void;
  onSwitchToInvitation: (guestId?: string) => void;
  onBackToOrdersList?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  config,
  guests,
  wishes,
  onAddGuest,
  onBatchAddGuests,
  onToggleCheckIn,
  onDeleteGuest,
  onClearAllGuests,
  onClearAllWishes,
  onLoadDemoGuests,
  onLoadDemoWishes,
  onSaveConfig,
  onReplyWish,
  onDeleteWish,
  onResetData,
  onSwitchToInvitation,
  onBackToOrdersList,
}) => {
  const [activeTab, setActiveTab] = useState<'guests' | 'wishes'>('guests');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [shareTargetGuest, setShareTargetGuest] = useState<Guest | null>(null);
  const [ticketTargetGuest, setTicketTargetGuest] = useState<Guest | null>(null);

  // CSV Export utility
  const handleExportCSV = () => {
    const headers = ['ID', 'Nama Tamu', 'Kategori', 'Telepon', 'Meja', 'Status RSVP', 'Pax', 'Sesi', 'Sudah Check-In'];
    const rows = guests.map((g) => [
      g.id,
      `"${g.name.replace(/"/g, '""')}"`,
      g.category,
      `"${g.phone}"`,
      `"${g.table}"`,
      g.rsvpStatus,
      g.paxCount,
      `"${g.session}"`,
      g.checkedIn ? 'YA' : 'TIDAK',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Daftar_Tamu_${config.groom.nickName}_${config.bride.nickName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearAllDemoData = () => {
    if (
      window.confirm(
        'Kosongkan SEMUA data demo (Daftar Tamu dan Doa)? Anda akan memulai dengan buku tamu dan daftar undangan yang 100% bersih.'
      )
    ) {
      onClearAllGuests();
      onClearAllWishes();
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 pb-16">
      {/* Top Bar Contract (3 zones) */}
      <header className="sticky top-0 z-30 bg-white border-b border-stone-200 px-6 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single Brand Wordmark & Back Button */}
          <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
            {onBackToOrdersList && (
              <button
                type="button"
                onClick={onBackToOrdersList}
                className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer mr-1"
                title="Kembali ke Daftar Semua Pesanan"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Semua Acara</span>
              </button>
            )}
            <span className="font-editorial text-xl font-bold tracking-tight text-stone-900">
              {config.groom.nickName} &amp; {config.bride.nickName}
            </span>
            <span className="text-xs text-stone-400 font-light">/</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 font-sans hidden sm:inline">
              Dasbor Acara
            </span>
          </div>

          {/* Zone 2: Navigation Links (Single-line, no wrapping) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-stone-600">
            <button
              type="button"
              onClick={() => setActiveTab('guests')}
              className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'guests'
                  ? 'text-stone-900 font-semibold border-b-2 border-[#8a724d] pb-0.5'
                  : 'hover:text-stone-900'
              }`}
            >
              Daftar Tamu &amp; RSVP
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('wishes')}
              className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'wishes'
                  ? 'text-stone-900 font-semibold border-b-2 border-[#8a724d] pb-0.5'
                  : 'hover:text-stone-900'
              }`}
            >
              Doa &amp; Ucapan ({wishes.length})
            </button>
            <button
              type="button"
              onClick={() => setIsPromoModalOpen(true)}
              className="whitespace-nowrap shrink-0 text-emerald-800 hover:text-emerald-950 font-semibold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Panduan Promosi Jasa</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onSwitchToInvitation()}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Lihat tampilan dari sudut pandang tamu penerima"
            >
              <Eye className="w-3.5 h-3.5 text-stone-600" />
              <span>Tampilan Tamu</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-[#8a724d] hover:bg-[#735e3d] text-white rounded-lg text-xs font-medium uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Tambah Tamu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-6 pt-6 space-y-6">
        {/* Banner with Event summary and Quick Action Strip */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a724d] bg-[#f2ece1] px-2.5 py-0.5 rounded">
                Acara Aktif
              </span>
              <span className="text-xs text-stone-500 font-sans">
                {config.ceremony.dateFormatted}
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-[11px] text-stone-600 font-medium">
                Tema: <strong className="text-stone-900">{config.theme}</strong>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1 font-editorial">
              {config.eventTitle}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5 font-sans">
              Lokasi: {config.reception.venueName} · Real-time guest sync aktif
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPromoModalOpen(true)}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Cara promosi & copy link tamu"
            >
              <Megaphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Promosi &amp; Link Tamu</span>
            </button>

            <button
              type="button"
              onClick={() => setIsScannerModalOpen(true)}
              className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-[#e6ca65]" />
              <span>Check-In Hari H</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV</span>
            </button>

            {/* Quick Bulk Demo Data Clearance */}
            {(guests.length > 0 || wishes.length > 0) && (
              <button
                type="button"
                onClick={handleClearAllDemoData}
                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Hapus semua data tamu dan doa demo"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bersihkan Demo</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors cursor-pointer"
              title="Pengaturan Acara & Foto"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <StatCards guests={guests} />

        {/* Active View: Guest Table or Wishes Moderation */}
        {activeTab === 'guests' ? (
          <GuestTable
            guests={guests}
            onToggleCheckIn={onToggleCheckIn}
            onDeleteGuest={onDeleteGuest}
            onClearAllGuests={onClearAllGuests}
            onLoadDemoGuests={onLoadDemoGuests}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenShareModal={(guest) => setShareTargetGuest(guest)}
            onOpenTicketModal={(guest) => setTicketTargetGuest(guest)}
            onOpenEditModal={(guest) => {
              onSwitchToInvitation(guest.name);
            }}
          />
        ) : (
          <WishesModerationTab
            wishes={wishes}
            onReplyWish={onReplyWish}
            onDeleteWish={onDeleteWish}
            onClearAllWishes={onClearAllWishes}
            onLoadDemoWishes={onLoadDemoWishes}
          />
        )}
      </main>

      {/* Modals */}
      <AddGuestModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGuest={onAddGuest}
        onBatchAdd={onBatchAddGuests}
      />

      <ShareInviteModal
        guest={shareTargetGuest}
        config={config}
        isOpen={!!shareTargetGuest}
        onClose={() => setShareTargetGuest(null)}
      />

      <QrScannerModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
        guests={guests}
        onCheckIn={onToggleCheckIn}
      />

      <EventSettingsModal
        config={config}
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSaveConfig={onSaveConfig}
        onResetData={onResetData}
      />

      <PromotionCenterModal
        config={config}
        isOpen={isPromoModalOpen}
        onClose={() => setIsPromoModalOpen(false)}
      />

      <DigitalTicketModal
        guest={ticketTargetGuest}
        config={config}
        isOpen={!!ticketTargetGuest}
        onClose={() => setTicketTargetGuest(null)}
      />
    </div>
  );
};
