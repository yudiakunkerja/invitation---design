export type WeddingThemeId =
  | 'champagne'
  | 'emerald'
  | 'rose'
  | 'navy'
  | 'heritage';

export interface WeddingTheme {
  id: WeddingThemeId;
  name: string;
  tagline: string;
  category: 'Modern Elegant' | 'Botanical Nature' | 'Romantic Blush' | 'Modern Prestige' | 'Tradisi Nusantara';
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  surfaceColor: string;
  textColor: string;
  goldColor: string;
  bannerGradient: string;
  swatches: string[];
  description: string;
}

export const WEDDING_THEMES: Record<WeddingThemeId, WeddingTheme> = {
  champagne: {
    id: 'champagne',
    name: 'Champagne Royal Gold',
    tagline: 'Kemewahan Klasik Abadi',
    category: 'Modern Elegant',
    primaryColor: '#8A724D',
    accentColor: '#B89355',
    bgColor: '#FAF8F5',
    surfaceColor: '#F2ECE1',
    textColor: '#1C1917',
    goldColor: '#D4AF37',
    bannerGradient: 'from-black/75 via-black/35 to-black/85',
    swatches: ['#8A724D', '#FAF8F5', '#F2ECE1', '#D4AF37'],
    description: 'Tema terlaris undgn.id dengan nuansa emas sampanye hangat, kain sutra ivory, dan tipografi editorial mewah.',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Botanical Garden',
    tagline: 'Pesona Alam Hijau Rindang',
    category: 'Botanical Nature',
    primaryColor: '#2D6A4F',
    accentColor: '#52B788',
    bgColor: '#F4F7F4',
    surfaceColor: '#E8F1E9',
    textColor: '#1B2A21',
    goldColor: '#C9A227',
    bannerGradient: 'from-[#081C15]/85 via-black/40 to-[#081C15]/90',
    swatches: ['#2D6A4F', '#52B788', '#F4F7F4', '#C9A227'],
    description: 'Sentuhan dedaunan eucalyptus dan kaca botanical garden yang asri, sejuk, dan membumi untuk pesta outdoor.',
  },
  rose: {
    id: 'rose',
    name: 'Rose Blush & Velvet',
    tagline: 'Romantisme Lembut Bunga Mawar',
    category: 'Romantic Blush',
    primaryColor: '#A84458',
    accentColor: '#D9778A',
    bgColor: '#FCF7F8',
    surfaceColor: '#F7E7EB',
    textColor: '#2B1B20',
    goldColor: '#E6A15C',
    bannerGradient: 'from-[#2B1B20]/80 via-black/35 to-[#2B1B20]/85',
    swatches: ['#A84458', '#D9778A', '#FCF7F8', '#E6A15C'],
    description: 'Nuansa kelopak mawar dusty rose dan sentuhan merah marun velvet yang manis dan penuh rasa cinta.',
  },
  navy: {
    id: 'navy',
    name: 'Midnight Sapphire & Stars',
    tagline: 'Keanggunan Bintang Malam',
    category: 'Modern Prestige',
    primaryColor: '#1E3A8A',
    accentColor: '#3B82F6',
    bgColor: '#F4F6F9',
    surfaceColor: '#E2E8F0',
    textColor: '#0F172A',
    goldColor: '#F59E0B',
    bannerGradient: 'from-[#0B132B]/85 via-black/40 to-[#0B132B]/90',
    swatches: ['#1E3A8A', '#3B82F6', '#F4F6F9', '#F59E0B'],
    description: 'Palet modern biru safir malam berbintang dan perak elegan untuk resepsi malam bertabur lampu temaram.',
  },
  heritage: {
    id: 'heritage',
    name: 'Jawa Sogan & Nusantara',
    tagline: 'Warisan Agung Tradisi Luhur',
    category: 'Tradisi Nusantara',
    primaryColor: '#78350F',
    accentColor: '#B45309',
    bgColor: '#F8F4EE',
    surfaceColor: '#EFE7DA',
    textColor: '#292524',
    goldColor: '#D97706',
    bannerGradient: 'from-[#29180C]/85 via-black/40 to-[#29180C]/90',
    swatches: ['#78350F', '#B45309', '#F8F4EE', '#D97706'],
    description: 'Nuansa klasik batik sogan, kayu jati berukir, dan ornamen keraton Jawa yang agung, khidmat, dan sakral.',
  },
};
