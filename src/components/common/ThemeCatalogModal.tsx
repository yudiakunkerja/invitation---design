import React from 'react';
import { Check, Palette, Sparkles, X } from 'lucide-react';
import { WEDDING_THEMES, WeddingThemeId } from '../../types/theme';

interface ThemeCatalogModalProps {
  currentThemeId: WeddingThemeId;
  isOpen: boolean;
  onClose: () => void;
  onSelectTheme: (themeId: WeddingThemeId) => void;
}

export const ThemeCatalogModal: React.FC<ThemeCatalogModalProps> = ({
  currentThemeId,
  isOpen,
  onClose,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-[#8a724d]" />
            <div>
              <h3 className="font-semibold text-base text-stone-900 font-sans">
                Katalog Pilihan Tema Desain (Seperti undgn.id)
              </h3>
              <p className="text-[11px] text-stone-500 font-sans">
                Pilih konsep visual undangan favorit Anda. Tema dapat diganti sewaktu-waktu secara instan.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Catalog Grid */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.values(WEDDING_THEMES)).map((theme) => {
              const isSelected = theme.id === currentThemeId;
              return (
                <div
                  key={theme.id}
                  onClick={() => onSelectTheme(theme.id)}
                  className={`rounded-2xl border-2 p-5 flex flex-col justify-between transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-[#8a724d] bg-[#fbf9f5] ring-4 ring-[#8a724d]/15 shadow-md'
                      : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-xs'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-[#8a724d] text-white p-1 rounded-full shadow-xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div>
                    {/* Category tag */}
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-sans">
                      {theme.category}
                    </span>

                    {/* Palette Swatches Bar */}
                    <div className="flex items-center gap-1.5 mt-3 mb-2">
                      {theme.swatches.map((color, idx) => (
                        <span
                          key={idx}
                          className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>

                    <h4 className="font-editorial text-xl font-bold text-stone-900 mt-2">
                      {theme.name}
                    </h4>
                    <p className="text-xs text-[#8a724d] font-medium mt-0.5 font-sans">
                      {theme.tagline}
                    </p>
                    <p className="text-xs text-stone-600 mt-2 font-sans leading-relaxed">
                      {theme.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-stone-200 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-stone-500 font-sans">
                      {isSelected ? 'Tema Aktif Saat Ini' : 'Klik untuk Terapkan'}
                    </span>
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'bg-[#8a724d] text-white'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                      }`}
                    >
                      {isSelected ? 'Terpilih' : 'Pilih Tema'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-sans">
            Mendukung pemesanan multi-tema untuk klien atau pasangan berbeda
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#8a724d] hover:bg-[#735e3d] text-white rounded-lg text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
