import React, { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import { Guest, GuestCategory, RsvpStatus } from '../../types/wedding';

interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGuest: (newGuest: Omit<Guest, 'id' | 'checkedIn' | 'updatedAt'>) => void;
  onBatchAdd?: (names: string[], category: GuestCategory, table: string) => void;
}

export const AddGuestModal: React.FC<AddGuestModalProps> = ({
  isOpen,
  onClose,
  onAddGuest,
  onBatchAdd,
}) => {
  const [tab, setTab] = useState<'single' | 'batch'>('single');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<GuestCategory>('Sahabat');
  const [table, setTable] = useState('Meja Melati 01');
  const [maxPax, setMaxPax] = useState(2);
  const [session, setSession] = useState('Sesi 1 (10:00 - 12:30)');
  const [initialStatus, setInitialStatus] = useState<RsvpStatus>('pending');

  // Batch state
  const [batchText, setBatchText] = useState('');

  if (!isOpen) return null;

  const handleSubmitSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddGuest({
      name: name.trim(),
      category,
      phone: phone.trim() || '-',
      table,
      maxPax,
      rsvpStatus: initialStatus,
      paxCount: initialStatus === 'confirmed' ? maxPax : 0,
      session,
      wishes: '',
    });

    setName('');
    setPhone('');
    onClose();
  };

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const names = batchText
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (names.length === 0) return;

    if (onBatchAdd) {
      onBatchAdd(names, category, table);
    }
    setBatchText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg border border-stone-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#8a724d]" />
            <h3 className="font-semibold text-base text-stone-900 font-sans">
              Tambah Tamu Undangan
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs: Single vs Batch */}
        <div className="flex border-b border-stone-200 text-xs font-medium">
          <button
            type="button"
            onClick={() => setTab('single')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              tab === 'single'
                ? 'border-b-2 border-[#8a724d] text-[#8a724d] font-semibold bg-stone-50/50'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Satu Tamu
          </button>
          <button
            type="button"
            onClick={() => setTab('batch')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              tab === 'batch'
                ? 'border-b-2 border-[#8a724d] text-[#8a724d] font-semibold bg-stone-50/50'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Impor Cepat Banyak Tamu (Baris demi Baris)
          </button>
        </div>

        {/* Content */}
        {tab === 'single' ? (
          <form onSubmit={handleSubmitSingle} className="p-6 space-y-4 text-xs font-sans">
            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Nama Tamu / Pasangan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Bpk. Ir. Hendro &amp; Rekan"
                className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8a724d]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Nomor WhatsApp / HP
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812xxxxxxxx"
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8a724d]"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Kategori Tamu
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GuestCategory)}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8a724d]"
                >
                  <option value="VIP">VIP</option>
                  <option value="Keluarga">Keluarga</option>
                  <option value="Sahabat">Sahabat</option>
                  <option value="Rekan Kerja">Rekan Kerja</option>
                  <option value="Umum">Umum</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Alokasi Meja / Tempat Duduk
                </label>
                <input
                  type="text"
                  value={table}
                  onChange={(e) => setTable(e.target.value)}
                  placeholder="Contoh: VIP 01 atau Meja Melati 03"
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8a724d]"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Maksimal Pax
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={maxPax}
                  onChange={(e) => setMaxPax(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8a724d]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Sesi Undangan
                </label>
                <select
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8a724d]"
                >
                  <option value="Sesi 1 (10:00 - 12:30)">Sesi 1 (10:00 - 12:30)</option>
                  <option value="Sesi 2 (13:00 - 15:30)">Sesi 2 (13:00 - 15:30)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Status Awal RSVP
                </label>
                <select
                  value={initialStatus}
                  onChange={(e) => setInitialStatus(e.target.value as RsvpStatus)}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8a724d]"
                >
                  <option value="pending">Belum Konfirmasi (Pending)</option>
                  <option value="confirmed">Sudah Konfirmasi Hadir</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#8a724d] hover:bg-[#735e3d] text-white rounded-lg font-medium transition-colors cursor-pointer"
              >
                Simpan Tamu
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleBatchSubmit} className="p-6 space-y-4 text-xs font-sans">
            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Daftar Nama Tamu (Satu Nama per Baris)
              </label>
              <textarea
                rows={6}
                required
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                placeholder={"Bpk. Ridwan Kamil & Istri\nIbu Susi Pudjiastuti\nDr. Tirta Mandira Hudhi\nKak Raditya Dika"}
                className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8a724d]"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Setiap baris akan otomatis dibuatkan kartu undangan personal dan link unik.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Kategori Default
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GuestCategory)}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8a724d]"
                >
                  <option value="Sahabat">Sahabat</option>
                  <option value="VIP">VIP</option>
                  <option value="Keluarga">Keluarga</option>
                  <option value="Rekan Kerja">Rekan Kerja</option>
                  <option value="Umum">Umum</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Alokasi Meja Default
                </label>
                <input
                  type="text"
                  value={table}
                  onChange={(e) => setTable(e.target.value)}
                  placeholder="Contoh: Meja Sahabat 01"
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8a724d]"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#8a724d] hover:bg-[#735e3d] text-white rounded-lg font-medium transition-colors cursor-pointer"
              >
                Impor Semua Tamu
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
