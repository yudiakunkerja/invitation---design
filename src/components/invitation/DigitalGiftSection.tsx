import React, { useState } from 'react';
import { Check, Copy, CreditCard, Gift, MapPin } from 'lucide-react';
import { WeddingConfig } from '../../types/wedding';
import { QrCodeView } from '../common/QrCodeView';

interface DigitalGiftSectionProps {
  config: WeddingConfig;
}

export const DigitalGiftSection: React.FC<DigitalGiftSectionProps> = ({ config }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showQris, setShowQris] = useState<boolean>(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="kado" className="py-24 px-6 bg-[#f5f1ea] border-t border-[#e8dfcf]">
      <div className="max-w-4xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#9c825a] font-sans font-medium block">
            Tanda Kasih &amp; Doa Restu
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl text-stone-900 mt-2 font-normal">
            Amplop Digital &amp; Kado
          </h2>
          <p className="text-xs text-stone-600 mt-2 max-w-md mx-auto font-sans">
            Doa restu Anda merupakan hadiah terindah bagi kami. Namun jika Anda bermaksud memberi tanda kasih dalam bentuk lain, kami menyediakan fitur di bawah ini:
          </p>
          <div className="w-16 h-px bg-[#d6cebe] mx-auto mt-4" />
        </div>

        {/* Bank Transfer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {config.bankAccounts.map((account) => {
            const isCopied = copiedId === account.id;
            return (
              <div
                key={account.id}
                className="bg-[#faf8f5] p-6 rounded-2xl border border-[#e4dcce] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-stone-800 tracking-wider">
                      {account.bankName}
                    </span>
                    <CreditCard className="w-4 h-4 text-[#8a724d]" />
                  </div>

                  <div className="bg-[#f0e9dc] p-3 rounded-xl border border-[#ded5c5] mb-3">
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-sans">
                      Nomor Rekening
                    </span>
                    <span className="font-tabular text-lg font-bold text-stone-900 tracking-wider">
                      {account.accountNumber}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 font-sans">
                    a.n. <strong className="text-stone-800">{account.accountHolder}</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(account.accountNumber, account.id)}
                  className={`mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isCopied
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#8a724d] hover:bg-[#735e3d] text-white shadow-sm'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Nomor Rekening Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin No. Rekening</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* QRIS & Physical Gift Accordion/Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* QRIS card */}
          <div className="bg-[#faf8f5] p-6 rounded-2xl border border-[#e4dcce] shadow-sm flex flex-col items-center text-center">
            <h3 className="font-editorial text-2xl font-medium text-stone-900 mb-1">
              QRIS Standar Pembayaran
            </h3>
            <p className="text-xs text-stone-600 mb-2 font-sans">
              Menerima transfer dari seluruh m-Banking &amp; e-Wallet (BCA, Mandiri, BRI, BNI, GoPay, OVO, ShopeePay, DANA).
            </p>
            <div className="text-[11px] text-[#8a724d] bg-[#f2ece1] px-3 py-1 rounded-full mb-4 font-medium">
              Terkoneksi langsung ke rekening / e-Wallet pengantin
            </div>

            <button
              onClick={() => setShowQris(!showQris)}
              type="button"
              className="py-2 px-4 rounded-lg bg-stone-200/80 hover:bg-stone-300 text-stone-800 text-xs font-medium uppercase tracking-wider mb-4 transition-colors cursor-pointer"
            >
              {showQris ? 'Sembunyikan QRIS' : 'Tampilkan Kode QRIS'}
            </button>

            {showQris && (
              <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-sm flex flex-col items-center animate-fadeIn w-full max-w-xs">
                {Boolean(config.qrisImageUrl?.trim()) ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={config.qrisImageUrl!.trim()}
                      alt="QRIS Barcode"
                      referrerPolicy="no-referrer"
                      className="w-48 h-48 object-contain rounded-lg border border-stone-200 p-1 bg-white"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <a
                      href={config.qrisImageUrl!.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      download="QRIS_Pernikahan.jpg"
                      className="mt-2 text-[11px] text-[#8a724d] hover:underline font-medium"
                    >
                      Buka / Simpan Gambar QRIS
                    </a>
                  </div>
                ) : (
                  <QrCodeView
                    value={`00020101021126580014ID.LINKAJA.WWW01189360091438927402015204581253033605802ID5919${encodeURIComponent(
                      config.qrisMerchantName || config.groom.nickName + ' ' + config.bride.nickName
                    )}6005BOGOR6304ABCD`}
                    size={170}
                  />
                )}
                <span className="text-[11px] font-sans text-stone-700 mt-2 font-semibold">
                  {config.qrisMerchantName || `${config.groom.nickName} & ${config.bride.nickName} Wedding`}
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  NMID: {config.qrisNmid || 'ID102938472910'}
                </span>
              </div>
            )}
          </div>

          {/* Kirim Kado Fisik */}
          <div className="bg-[#faf8f5] p-6 rounded-2xl border border-[#e4dcce] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#8a724d] mb-2">
                <Gift className="w-4 h-4" />
                <h3 className="font-editorial text-2xl font-medium text-stone-900">
                  Kirim Kado Fisik
                </h3>
              </div>
              <p className="text-xs text-stone-600 font-sans mb-4">
                Bagi kerabat yang ingin mengirimkan bingkisan kado pernikahan ke alamat tempat tinggal:
              </p>

              <div className="bg-[#f0e9dc] p-3.5 rounded-xl border border-[#ded5c5] text-xs text-stone-800 space-y-1">
                <div className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#8a724d]" />
                  <span>Penerima: {config.giftAddress.recipient} ({config.giftAddress.phone})</span>
                </div>
                <p className="text-stone-700 pl-5 leading-relaxed">
                  {config.giftAddress.fullAddress}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(config.giftAddress.fullAddress, 'addr-gift')}
              className={`mt-4 w-full py-2.5 px-4 rounded-xl text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                copiedId === 'addr-gift'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-800 hover:bg-stone-900 text-white shadow-sm'
              }`}
            >
              {copiedId === 'addr-gift' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Alamat Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Alamat Lengkap</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
