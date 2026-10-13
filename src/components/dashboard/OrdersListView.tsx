import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  FileSpreadsheet,
  HelpCircle,
  LayoutDashboard,
  Mail,
  MoreVertical,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Sparkles,
  Store,
  Trash2,
  Users,
} from 'lucide-react';
import { OrderStatus, PackageTier, WeddingOrder } from '../../types/wedding';
import { initialWeddingConfig } from '../../data/initialData';

interface OrdersListViewProps {
  orders: WeddingOrder[];
  onSelectOrder: (orderId: string) => void;
  onViewInvitation: (orderId: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onCreateOrder: (newOrder: WeddingOrder) => void;
  onClearAllOrders: () => void;
  onLoadDemoOrders: () => void;
  onOpenStorePortal: () => void;
}

export const OrdersListView: React.FC<OrdersListViewProps> = ({
  orders,
  onSelectOrder,
  onViewInvitation,
  onDeleteOrder,
  onCreateOrder,
  onClearAllOrders,
  onLoadDemoOrders,
  onOpenStorePortal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New quick order form modal state
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newPackage, setNewPackage] = useState<PackageTier>('Gold');
  const [newDate, setNewDate] = useState('2026-11-20');

  // Filtered orders
  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.config.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.clientPhone.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate high-level stats
  const totalOrders = orders.length;
  const activeOrders = orders.filter((o) => o.status === 'aktif').length;
  const newOrders = orders.filter((o) => o.status === 'baru').length;
  const totalGuestsAllOrders = orders.reduce((acc, curr) => acc + (curr.guests?.length || 0), 0);

  const handleQuickCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    const names = newClientName.split('&');
    const groom = names[0]?.trim() || newClientName;
    const bride = names[1]?.trim() || 'Pasangan';

    const newOrder: WeddingOrder = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      clientName: newClientName.trim(),
      clientPhone: newClientPhone.trim() || '0812000000',
      packageName: newPackage,
      priceFormatted:
        newPackage === 'Silver' ? 'Rp 149.000' : newPackage === 'Platinum' ? 'Rp 399.000' : 'Rp 249.000',
      status: 'baru',
      createdAt: new Date().toISOString(),
      weddingSlug: `${groom.toLowerCase()}-${bride.toLowerCase()}`.replace(/\s+/g, '-'),
      config: {
        ...initialWeddingConfig,
        eventTitle: `The Wedding of ${newClientName.trim()}`,
        groom: {
          ...initialWeddingConfig.groom,
          fullName: groom,
          nickName: groom,
        },
        bride: {
          ...initialWeddingConfig.bride,
          fullName: bride,
          nickName: bride,
        },
      },
      guests: [],
      wishes: [],
    };

    onCreateOrder(newOrder);
    setIsAddModalOpen(false);
    setNewClientName('');
    setNewClientPhone('');
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 pb-16 font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-stone-200 px-6 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-editorial text-2xl font-bold tracking-tight text-stone-900">
              NitiLestari
            </span>
            <span className="text-xs text-stone-400 font-light">/</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-600">
              Daftar Pesanan &amp; Acara Pernikahan
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-[#8a724d] hover:bg-[#735e3d] text-white rounded-lg text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Undangan Baru</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-6 space-y-6">
        {/* KPI Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-[11px] uppercase font-bold text-stone-500 tracking-wider">
              Total Pesanan
            </span>
            <div className="text-3xl font-bold text-stone-900 mt-1 font-editorial">
              {totalOrders}
            </div>
            <span className="text-[11px] text-stone-500 mt-1 block">Seluruh proyek pernikahan</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-[11px] uppercase font-bold text-emerald-700 tracking-wider">
              Pesanan Aktif
            </span>
            <div className="text-3xl font-bold text-emerald-800 mt-1 font-editorial">
              {activeOrders}
            </div>
            <span className="text-[11px] text-stone-500 mt-1 block">Sedang berjalan &amp; disebarkan</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-[11px] uppercase font-bold text-amber-700 tracking-wider">
              Pesanan Baru
            </span>
            <div className="text-3xl font-bold text-amber-800 mt-1 font-editorial">
              {newOrders}
            </div>
            <span className="text-[11px] text-stone-500 mt-1 block">Menunggu kelengkapan data</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-[11px] uppercase font-bold text-[#8a724d] tracking-wider">
              Total Tamu Terdata
            </span>
            <div className="text-3xl font-bold text-[#8a724d] mt-1 font-editorial">
              {totalGuestsAllOrders}
            </div>
            <span className="text-[11px] text-stone-500 mt-1 block">Akumulasi seluruh acara</span>
          </div>
        </div>

        {/* Action & Filter Strip */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama mempelai, no WA, atau ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg text-xs"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg text-xs">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'baru', label: 'Baru' },
                { id: 'aktif', label: 'Aktif' },
                { id: 'selesai', label: 'Selesai' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer text-xs font-medium ${
                    statusFilter === tab.id
                      ? 'bg-white text-stone-900 font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Demo Cleanup & Reload Buttons */}
          <div className="flex items-center gap-2">
            {orders.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      'Hapus SEMUA daftar pesanan demo? Anda akan memulai dengan daftar pesanan yang bersih.'
                    )
                  ) {
                    onClearAllOrders();
                  }
                }}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Hapus semua pesanan demo"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bersihkan Demo</span>
              </button>
            )}

            <button
              type="button"
              onClick={onLoadDemoOrders}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Muat ulang contoh data pesanan"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Muat Demo</span>
            </button>
          </div>
        </div>

        {/* Orders Table / Cards */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
            <Mail className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-800">Belum Ada Pesanan Pernikahan</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Tidak ada data yang sesuai filter atau daftar pesanan masih kosong. Klik tombol di bawah untuk membuat undangan baru atau memuat data demo.
            </p>
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-[#8a724d] text-white rounded-lg text-xs font-medium"
              >
                + Buat Undangan Baru
              </button>
              <button
                type="button"
                onClick={onLoadDemoOrders}
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-xs font-medium"
              >
                Muat Contoh Demo
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((ord) => {
              const guestsCount = ord.guests?.length || 0;
              const confirmedCount = ord.guests?.filter((g) => g.rsvpStatus === 'confirmed').length || 0;
              const wishesCount = ord.wishes?.length || 0;

              return (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-stone-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-stone-500">
                        #{ord.id}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            ord.status === 'aktif'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'baru'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {ord.status}
                        </span>

                        <span className="text-[10px] font-semibold bg-[#f2ece1] text-[#8a724d] px-2 py-0.5 rounded-full">
                          {ord.packageName}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-editorial text-2xl font-bold text-stone-900 group-hover:text-[#8a724d] transition-colors">
                      {ord.config.eventTitle}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Klien: <strong>{ord.clientName}</strong> · {ord.clientPhone}
                    </p>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3 text-xs text-stone-600 bg-stone-50/50 flex-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#8a724d]" />
                      <span>{ord.config.ceremony.dateFormatted}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                        style={{
                          backgroundColor:
                            ord.config.theme === 'emerald'
                              ? '#2D6A4F'
                              : ord.config.theme === 'rose'
                              ? '#A84458'
                              : ord.config.theme === 'navy'
                              ? '#1E3A8A'
                              : ord.config.theme === 'heritage'
                              ? '#78350F'
                              : '#8A724D',
                        }}
                      />
                      <span className="capitalize">Tema: {ord.config.theme}</span>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-200/60 text-center">
                      <div className="bg-white p-2 rounded-lg border border-stone-200">
                        <span className="block font-bold text-stone-900">{guestsCount}</span>
                        <span className="text-[10px] text-stone-400">Total Tamu</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-stone-200">
                        <span className="block font-bold text-emerald-700">{confirmedCount}</span>
                        <span className="text-[10px] text-stone-400">Hadir</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-stone-200">
                        <span className="block font-bold text-stone-900">{wishesCount}</span>
                        <span className="text-[10px] text-stone-400">Doa Masuk</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-4 bg-white border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onViewInvitation(ord.id)}
                      className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Lihat undangan tamu untuk acara ini"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Undangan</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectOrder(ord.id)}
                        className="px-4 py-2 bg-[#8a724d] hover:bg-[#735e3d] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Buka Dasbor</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Hapus pesanan pernikahan "${ord.config.eventTitle}"? Tindakan ini tidak dapat dibatalkan.`
                            )
                          ) {
                            onDeleteOrder(ord.id);
                          }
                        }}
                        className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Hapus Pesanan Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add New Order Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg border border-stone-200 shadow-2xl p-6 space-y-4">
            <h3 className="font-editorial text-2xl font-bold text-stone-900">
              Buat Undangan / Pesanan Baru
            </h3>
            <p className="text-xs text-stone-500">
              Daftarkan acara pernikahan baru untuk langsung mengelola tamu dan undangan.
            </p>

            <form onSubmit={handleQuickCreateOrder} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Nama Kedua Mempelai (Contoh: Dimas &amp; Sarah) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Dimas & Sarah"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  No. WhatsApp Klien / Pemesan
                </label>
                <input
                  type="tel"
                  placeholder="081234567890"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Pilihan Paket</label>
                  <select
                    value={newPackage}
                    onChange={(e) => setNewPackage(e.target.value as PackageTier)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="Silver">Silver (Rp 149.000)</option>
                    <option value="Gold">Gold (Rp 249.000)</option>
                    <option value="Platinum">Platinum (Rp 399.000)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Tanggal Acara</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#8a724d] hover:bg-[#735e3d] text-white rounded-lg font-semibold"
                >
                  Simpan &amp; Buat Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
