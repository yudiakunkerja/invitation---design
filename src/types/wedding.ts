import { WeddingThemeId } from './theme';

export type RsvpStatus = 'confirmed' | 'declined' | 'tentative' | 'pending';
export type GuestCategory = 'VIP' | 'Keluarga' | 'Sahabat' | 'Rekan Kerja' | 'Umum';

export interface Guest {
  id: string; // e.g. G-001
  name: string;
  category: GuestCategory;
  phone: string;
  email?: string;
  table: string; // e.g. "Meja A-01 (VIP)"
  maxPax: number;
  rsvpStatus: RsvpStatus;
  paxCount: number;
  session: string; // "Sesi 1 (10:00 - 12:30)" | "Sesi 2 (13:00 - 15:30)"
  wishes?: string;
  checkedIn: boolean;
  checkedInAt?: string;
  updatedAt: string;
}

export interface WishComment {
  id: string;
  guestId?: string;
  guestName: string;
  attendance: 'hadir' | 'tidak_hadir' | 'ragu';
  message: string;
  likes: number;
  createdAt: string;
  reply?: string;
}

export interface CoupleProfile {
  fullName: string;
  nickName: string;
  parents: string;
  igHandle: string;
  photoUrl: string;
  bio?: string;
}

export interface EventDetail {
  title: string;
  date: string;
  dateFormatted: string;
  time: string;
  venueName: string;
  address: string;
  mapsUrl: string;
  dresscode?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  qrCodeUrl?: string;
}

export interface StoryMilestone {
  year: string;
  title: string;
  story: string;
}

export interface GalleryPhotoItem {
  id: string;
  url: string;
  title: string;
  caption: string;
}

export interface MusicConfig {
  type: 'youtube' | 'synth' | 'audioUrl';
  youtubeUrl?: string; // Direct YouTube link for audio
  audioUrl?: string;
  title?: string;
}

export interface WeddingConfig {
  eventTitle: string;
  heroPhotoUrl: string; // Foto header utama di awal
  venuePhotoUrl: string; // Foto lokasi / tempat acara
  groom: CoupleProfile;
  bride: CoupleProfile;
  ceremony: EventDetail; // Akad Nikah / Pemberkatan
  reception: EventDetail; // Resepsi
  eventDateTimestamp: string; // ISO string for countdown
  loveStory: StoryMilestone[];
  galleryPhotos: GalleryPhotoItem[]; // Galeri kenangan & foto prewedding
  bankAccounts: BankAccount[];
  qrisImageUrl?: string; // Direct link gambar QRIS e-wallet / bank pemilik
  qrisMerchantName?: string;
  qrisNmid?: string;
  giftAddress: {
    recipient: string;
    phone: string;
    fullAddress: string;
  };
  theme: WeddingThemeId;
  music?: MusicConfig;
  quote: {
    text: string;
    source: string;
  };
}

export type OrderStatus = 'baru' | 'aktif' | 'selesai';
export type PackageTier = 'Silver' | 'Gold' | 'Platinum' | 'Custom';

export interface WeddingOrder {
  id: string; // e.g. "ORD-101"
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  packageName: PackageTier;
  priceFormatted: string;
  status: OrderStatus;
  createdAt: string;
  weddingSlug: string;
  config: WeddingConfig;
  guests: Guest[];
  wishes: WishComment[];
  notes?: string;
}
