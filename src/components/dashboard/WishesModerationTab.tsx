import React, { useState } from 'react';
import { Heart, MessageSquare, Reply, Send, Trash2 } from 'lucide-react';
import { WishComment } from '../../types/wedding';

interface WishesModerationTabProps {
  wishes: WishComment[];
  onReplyWish: (wishId: string, replyText: string) => void;
  onDeleteWish: (wishId: string) => void;
  onClearAllWishes?: () => void;
  onLoadDemoWishes?: () => void;
}

export const WishesModerationTab: React.FC<WishesModerationTabProps> = ({
  wishes,
  onReplyWish,
  onDeleteWish,
  onClearAllWishes,
  onLoadDemoWishes,
}) => {
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleSendReply = (wishId: string) => {
    if (!replyText.trim()) return;
    onReplyWish(wishId, replyText.trim());
    setActiveReplyId(null);
    setReplyText('');
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-200">
        <div>
          <h3 className="font-semibold text-base text-stone-900 font-sans">
            Moderasi Buku Doa &amp; Ucapan Tamu
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Kelola doa dari kerabat dan berikan balasan langsung dari kedua mempelai
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-3 py-1 rounded-full">
            Total {wishes.length} Ucapan
          </span>

          {wishes.length > 0 && onClearAllWishes && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Hapus SEMUA doa dan ucapan tamu? Tindakan ini akan mengosongkan buku tamu.')) {
                  onClearAllWishes();
                }
              }}
              className="text-xs text-red-600 hover:text-red-800 font-medium px-2.5 py-1 rounded-md hover:bg-red-50 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua Doa Demo</span>
            </button>
          )}

          {wishes.length === 0 && onLoadDemoWishes && (
            <button
              type="button"
              onClick={onLoadDemoWishes}
              className="text-xs text-[#8a724d] hover:underline font-medium cursor-pointer"
            >
              Muat Ucapan Contoh
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {wishes.length === 0 ? (
          <div className="text-center py-12 text-stone-400">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Belum ada ucapan doa yang masuk.</p>
          </div>
        ) : (
          wishes.map((wish) => (
            <div
              key={wish.id}
              className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-stone-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-xs text-stone-900">{wish.guestName}</h4>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        wish.attendance === 'hadir'
                          ? 'bg-emerald-100 text-emerald-800'
                          : wish.attendance === 'tidak_hadir'
                          ? 'bg-stone-200 text-stone-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {wish.attendance === 'hadir'
                        ? 'Hadir'
                        : wish.attendance === 'tidak_hadir'
                        ? 'Tidak Hadir'
                        : 'Ragu'}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 block mt-0.5 font-mono">
                    {new Date(wish.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-stone-500 flex items-center gap-1 mr-2">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>{wish.likes}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveReplyId(activeReplyId === wish.id ? null : wish.id);
                      setReplyText(wish.reply || '');
                    }}
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-md transition-colors cursor-pointer text-xs flex items-center gap-1"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>{wish.reply ? 'Edit Balasan' : 'Balas'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Hapus ucapan ini?')) {
                        onDeleteWish(wish.id);
                      }
                    }}
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-stone-700 mt-2.5 font-sans leading-relaxed">
                {wish.message}
              </p>

              {/* Existing Reply */}
              {wish.reply && activeReplyId !== wish.id && (
                <div className="mt-3 pl-3 border-l-2 border-[#8a724d] bg-white p-2.5 rounded-r-lg text-xs">
                  <span className="text-[10px] font-bold text-[#8a724d] uppercase block">
                    Balasan Pengantin:
                  </span>
                  <p className="text-stone-700 italic mt-0.5">{wish.reply}</p>
                </div>
              )}

              {/* Reply Input Form */}
              {activeReplyId === wish.id && (
                <div className="mt-3 pt-3 border-t border-stone-200 flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Tulis balasan ucapan terima kasih..."
                    className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8a724d]"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendReply(wish.id)}
                    className="px-3 py-1.5 bg-[#8a724d] hover:bg-[#735e3d] text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Kirim</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveReplyId(null)}
                    className="px-2.5 py-1.5 bg-stone-200 text-stone-700 rounded-lg text-xs cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
