import React, { useState } from 'react';
import { Camera, ChevronLeft, ChevronRight, X, Image as ImageIcon } from 'lucide-react';
import { GalleryPhotoItem } from '../../types/wedding';

interface GallerySectionProps {
  photos?: GalleryPhotoItem[];
}

const defaultGalleryPhotos: GalleryPhotoItem[] = [
  {
    id: 'gal-1',
    url: '/src/assets/images/wedding_hero_couple_1791869150830.jpg',
    title: 'Ikrar Janji Suci',
    caption: 'Langkah pertama menapaki masa depan berdua dalam kehangatan cinta keluarga.',
  },
  {
    id: 'gal-2',
    url: '/src/assets/images/wedding_ring_exchange_1791869151205.jpg',
    title: 'Cincin & Janji Hati',
    caption: 'Simbol ikatan seumur hidup di atas sutra dan doa tulus.',
  },
  {
    id: 'gal-3',
    url: '/src/assets/images/bride_portrait_1791869150747.jpg',
    title: 'Anggun Dalam Balutan Kebaya',
    caption: 'Citra Ayu Lestari dalam balutan kebaya klasik dan roncean melati.',
  },
  {
    id: 'gal-4',
    url: '/src/assets/images/groom_portrait_1791869151086.jpg',
    title: 'Momen Penuh Keteguhan',
    caption: 'Raden Arya Kusuma bersiap menyambut hari paling bersejarah.',
  },
  {
    id: 'gal-5',
    url: '/src/assets/images/wedding_venue_glasshouse_1791869150973.jpg',
    title: 'Suasana The Heritage Glasshouse',
    caption: 'Gemerlap lampu temaram dan hangatnya jamuan untuk para sahabat.',
  },
];

export const GallerySection: React.FC<GallerySectionProps> = ({ photos }) => {
  const [activePhoto, setActivePhoto] = useState<GalleryPhotoItem | null>(null);

  const displayPhotos = photos && photos.length > 0 ? photos : defaultGalleryPhotos;

  const handleNext = () => {
    if (!activePhoto) return;
    const currentIndex = displayPhotos.findIndex((item) => item.id === activePhoto.id);
    const nextIndex = (currentIndex + 1) % displayPhotos.length;
    setActivePhoto(displayPhotos[nextIndex]);
  };

  const handlePrev = () => {
    if (!activePhoto) return;
    const currentIndex = displayPhotos.findIndex((item) => item.id === activePhoto.id);
    const prevIndex = (currentIndex - 1 + displayPhotos.length) % displayPhotos.length;
    setActivePhoto(displayPhotos[prevIndex]);
  };

  return (
    <section id="galeri" className="py-24 px-6 bg-[#f5f1ea] border-t border-[#e8dfcf]">
      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#9c825a] font-sans font-medium block">
            Potret Momen Berharga &amp; Pra-Wedding
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl text-stone-900 mt-2 font-normal">
            Galeri Kenangan
          </h2>
          <p className="text-xs text-stone-600 mt-2 max-w-lg mx-auto font-sans">
            Setiap detik yang terabadikan menjadi saksi bisu keindahan cinta dan harapan kami.
          </p>
          <div className="w-16 h-px bg-[#d6cebe] mx-auto mt-4" />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPhotos.map((item, idx) => {
            const isFirstLead = idx === 0 && displayPhotos.length >= 3;
            return (
              <div
                key={item.id || idx}
                onClick={() => setActivePhoto(item)}
                className={`${
                  isFirstLead ? 'sm:col-span-2 lg:col-span-2' : ''
                } h-72 sm:h-96 rounded-2xl overflow-hidden relative group cursor-pointer border border-[#e4dcce] shadow-sm bg-stone-200`}
              >
                <img
                  src={item.url?.trim() || '/src/assets/images/wedding_hero_couple_1791869150830.jpg'}
                  alt={item.title || 'Foto Galeri'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to placeholder gradient if external URL fails
                    (e.target as HTMLImageElement).src = '/src/assets/images/wedding_hero_couple_1791869150830.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-85 transition-opacity group-hover:opacity-100 flex flex-col justify-end p-6 text-white">
                  <span className="text-xs uppercase tracking-wider text-[#e6ca65] flex items-center gap-1.5 font-sans">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Lihat Foto Penuh</span>
                  </span>
                  <h3 className="font-editorial text-xl sm:text-2xl font-medium mt-1">{item.title}</h3>
                  {item.caption && (
                    <p className="text-xs text-stone-300 mt-0.5 line-clamp-1 font-sans">{item.caption}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Lightbox Modal */}
        {activePhoto && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer z-50"
              aria-label="Tutup Galeri"
            >
              <X className="w-6 h-6" />
            </button>

            {displayPhotos.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer z-50"
                  aria-label="Foto Sebelumnya"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer z-50"
                  aria-label="Foto Berikutnya"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
              <img
                src={activePhoto.url?.trim() || '/src/assets/images/wedding_hero_couple_1791869150830.jpg'}
                alt={activePhoto.title}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/src/assets/images/wedding_hero_couple_1791869150830.jpg';
                }}
              />
              <div className="text-center text-white mt-4 max-w-xl">
                <h4 className="font-editorial text-2xl font-normal">{activePhoto.title}</h4>
                {activePhoto.caption && (
                  <p className="text-xs text-stone-300 mt-1 font-sans">{activePhoto.caption}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
