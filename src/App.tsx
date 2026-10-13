/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { initialOrders, initialWeddingConfig } from './data/initialData';
import {
  Guest,
  GuestCategory,
  RsvpStatus,
  WeddingConfig,
  WeddingOrder,
  WishComment,
} from './types/wedding';
import { InvitationView } from './components/invitation/InvitationView';
import { DashboardView } from './components/dashboard/DashboardView';
import { OrdersListView } from './components/dashboard/OrdersListView';
import { OrderLandingView } from './components/store/OrderLandingView';
import { EventSettingsModal } from './components/dashboard/EventSettingsModal';
import { ChevronUp, Compass, Eye, LayoutDashboard, Settings, Store } from 'lucide-react';
import { WeddingThemeId } from './types/theme';

const STORAGE_KEY_ORDERS = 'nitilestari_orders_v2';

export default function App() {
  // Load orders list from localStorage or seed initialOrders
  const [orders, setOrders] = useState<WeddingOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return initialOrders;
  });

  // Active selected order ID
  const [activeOrderId, setActiveOrderId] = useState<string>(() => {
    return initialOrders[0]?.id || 'ORD-101';
  });

  // Current view:
  // - 'portal': Menu tampilan untuk orang melihat & memesan undangan (seperti undgn.id)
  // - 'orders-list': Menu dasbor utama berupa list daftar pesanan/pernikahan
  // - 'wedding-dashboard': Dasbor admin spesifik pernikahan yang dipilih dari list
  // - 'invitation': Tampilan penerima undangan
  const [currentView, setCurrentView] = useState<
    'portal' | 'orders-list' | 'wedding-dashboard' | 'invitation'
  >('invitation');

  // Currently active order object
  const activeOrder: WeddingOrder =
    orders.find((o) => o.id === activeOrderId) || orders[0] || initialOrders[0];

  // Guest view states for the active order
  const [guestParamName, setGuestParamName] = useState<string>('');
  const [activeGuest, setActiveGuest] = useState<Guest | null>(null);

  // Global Event Settings Modal state (opened via navigation "Pengaturan Undangan")
  const [isGlobalSettingsOpen, setIsGlobalSettingsOpen] = useState(false);

  // Auto-hidden Navigation State
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isNavHovered, setIsNavHovered] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auto-hide navigation on scroll down, reveal on scroll up or mouse hover near top
  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Scroll down past 60px -> auto-hide navigation
      if (currentScrollY > 60 && currentScrollY > lastScrollY) {
        setIsNavVisible(false);
      } else if (currentScrollY < lastScrollY - 8) {
        // Scroll up -> reveal navigation
        setIsNavVisible(true);
      }

      setLastScrollY(currentScrollY);

      // Reset auto-hide idle timer (collapses if idle for 4 seconds after scrolling)
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (window.scrollY > 80 && !isNavHovered) {
          setIsNavVisible(false);
        }
      }, 4000);
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Hovering near the top edge of viewport smoothly reveals navigation
      if (e.clientY < 45) {
        setIsNavVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(idleTimer);
    };
  }, [lastScrollY, isNavHovered]);

  // Read URL query params on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const toParam = params.get('to');
    const guestIdParam = params.get('guest');
    const viewParam = params.get('view');
    const orderParam = params.get('order');
    const themeParam = params.get('theme') as WeddingThemeId | null;

    if (orderParam) {
      const matchedOrd = orders.find((o) => o.id === orderParam || o.weddingSlug === orderParam);
      if (matchedOrd) {
        setActiveOrderId(matchedOrd.id);
      }
    }

    if (viewParam === 'portal' || viewParam === 'store') {
      setCurrentView('portal');
    } else if (viewParam === 'dashboard' || viewParam === 'admin') {
      setCurrentView('orders-list');
    } else if (viewParam === 'invitation' || toParam) {
      setCurrentView('invitation');
    }

    // Set active guest for invitation preview
    const currentGuests = activeOrder.guests || [];
    if (toParam) {
      setGuestParamName(toParam);
      const matched = currentGuests.find(
        (g) => g.name.toLowerCase() === toParam.toLowerCase() || g.id === guestIdParam
      );
      if (matched) {
        setActiveGuest(matched);
      } else {
        setActiveGuest({
          id: `G-${Date.now().toString().slice(-4)}`,
          name: toParam,
          category: 'Umum',
          phone: '-',
          table: 'Meja Resepsi Utama',
          maxPax: 2,
          rsvpStatus: 'pending',
          paxCount: 0,
          session: 'Sesi 1 (10:00 - 12:30)',
          checkedIn: false,
          updatedAt: new Date().toISOString(),
        });
      }
    } else if (guestIdParam) {
      const matched = currentGuests.find((g) => g.id === guestIdParam);
      if (matched) {
        setActiveGuest(matched);
        setGuestParamName(matched.name);
      }
    } else {
      setActiveGuest(currentGuests[0] || null);
      setGuestParamName(currentGuests[0]?.name || 'Bpk. Faisal Basri');
    }

    if (themeParam && ['champagne', 'emerald', 'rose', 'navy', 'heritage'].includes(themeParam)) {
      handleSaveActiveConfig({ ...activeOrder.config, theme: themeParam });
    }
  }, []);

  // Save orders to localStorage when orders state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch {}
  }, [orders]);

  // Helper to update active order properties inside orders array
  const updateActiveOrder = (updater: (prev: WeddingOrder) => WeddingOrder) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === activeOrder.id) {
          return updater(ord);
        }
        return ord;
      })
    );
  };

  // Handler: Save wedding config for currently active order
  const handleSaveActiveConfig = (updatedConfig: WeddingConfig) => {
    updateActiveOrder((ord) => ({
      ...ord,
      config: updatedConfig,
    }));
  };

  // Handler: RSVP submission from Guest View
  const handleSaveRsvp = (data: {
    name: string;
    rsvpStatus: RsvpStatus;
    paxCount: number;
    session: string;
    wishes: string;
  }) => {
    const currentGuests = activeOrder.guests || [];
    const existingIndex = currentGuests.findIndex(
      (g) =>
        g.name.toLowerCase() === data.name.toLowerCase() ||
        (activeGuest && g.id === activeGuest.id)
    );

    let updatedGuest: Guest;
    let newGuestsList: Guest[];

    if (existingIndex >= 0) {
      updatedGuest = {
        ...currentGuests[existingIndex],
        rsvpStatus: data.rsvpStatus,
        paxCount: data.paxCount,
        session: data.session,
        wishes: data.wishes,
        updatedAt: new Date().toISOString(),
      };
      newGuestsList = [...currentGuests];
      newGuestsList[existingIndex] = updatedGuest;
    } else {
      updatedGuest = {
        id: `G-${100 + currentGuests.length + 1}`,
        name: data.name,
        category: 'Umum',
        phone: '-',
        table: 'Meja Resepsi',
        maxPax: 2,
        rsvpStatus: data.rsvpStatus,
        paxCount: data.paxCount,
        session: data.session,
        wishes: data.wishes,
        checkedIn: false,
        updatedAt: new Date().toISOString(),
      };
      newGuestsList = [updatedGuest, ...currentGuests];
    }

    setActiveGuest(updatedGuest);

    let newWishesList = activeOrder.wishes || [];
    if (data.wishes.trim()) {
      const newWish: WishComment = {
        id: `W-${Date.now()}`,
        guestId: updatedGuest.id,
        guestName: data.name,
        attendance:
          data.rsvpStatus === 'confirmed'
            ? 'hadir'
            : data.rsvpStatus === 'declined'
            ? 'tidak_hadir'
            : 'ragu',
        message: data.wishes.trim(),
        likes: 1,
        createdAt: new Date().toISOString(),
      };
      newWishesList = [newWish, ...newWishesList];
    }

    updateActiveOrder((ord) => ({
      ...ord,
      guests: newGuestsList,
      wishes: newWishesList,
    }));
  };

  // Handler: Like a wish
  const handleLikeWish = (id: string) => {
    updateActiveOrder((ord) => ({
      ...ord,
      wishes: (ord.wishes || []).map((w) =>
        w.id === id ? { ...w, likes: w.likes + 1 } : w
      ),
    }));
  };

  // Handler: Add direct wish
  const handleAddDirectWish = (newWishData: {
    guestName: string;
    attendance: 'hadir' | 'tidak_hadir' | 'ragu';
    message: string;
  }) => {
    const newWish: WishComment = {
      id: `W-${Date.now()}`,
      guestName: newWishData.guestName,
      attendance: newWishData.attendance,
      message: newWishData.message,
      likes: 1,
      createdAt: new Date().toISOString(),
    };
    updateActiveOrder((ord) => ({
      ...ord,
      wishes: [newWish, ...(ord.wishes || [])],
    }));
  };

  // Handler: Select theme
  const handleSelectTheme = (themeId: WeddingThemeId) => {
    handleSaveActiveConfig({ ...activeOrder.config, theme: themeId });
  };

  // Handler: Add single guest in dashboard
  const handleAddGuest = (newGuestData: Omit<Guest, 'id' | 'checkedIn' | 'updatedAt'>) => {
    const currentGuests = activeOrder.guests || [];
    const newGuest: Guest = {
      ...newGuestData,
      id: `G-${100 + currentGuests.length + 1}`,
      checkedIn: false,
      updatedAt: new Date().toISOString(),
    };
    updateActiveOrder((ord) => ({
      ...ord,
      guests: [newGuest, ...currentGuests],
    }));
  };

  // Handler: Batch add multiple guests
  const handleBatchAddGuests = (names: string[], category: GuestCategory, table: string) => {
    const currentGuests = activeOrder.guests || [];
    const newBatch: Guest[] = names.map((name, idx) => ({
      id: `G-${100 + currentGuests.length + idx + 1}`,
      name,
      category,
      phone: '-',
      table: table || 'Meja Resepsi',
      maxPax: 2,
      rsvpStatus: 'pending',
      paxCount: 0,
      session: 'Sesi 1 (10:00 - 12:30)',
      checkedIn: false,
      updatedAt: new Date().toISOString(),
    }));
    updateActiveOrder((ord) => ({
      ...ord,
      guests: [...newBatch, ...currentGuests],
    }));
  };

  // Handler: Toggle check in
  const handleToggleCheckIn = (guestId: string) => {
    updateActiveOrder((ord) => ({
      ...ord,
      guests: (ord.guests || []).map((g) => {
        if (g.id === guestId) {
          const nextChecked = !g.checkedIn;
          return {
            ...g,
            checkedIn: nextChecked,
            checkedInAt: nextChecked ? new Date().toISOString() : undefined,
          };
        }
        return g;
      }),
    }));
  };

  // Handler: Delete guest
  const handleDeleteGuest = (guestId: string) => {
    updateActiveOrder((ord) => ({
      ...ord,
      guests: (ord.guests || []).filter((g) => g.id !== guestId),
    }));
  };

  // Handler: Clear all guests of active order
  const handleClearAllGuests = () => {
    updateActiveOrder((ord) => ({
      ...ord,
      guests: [],
    }));
    setActiveGuest(null);
  };

  // Handler: Clear all wishes of active order
  const handleClearAllWishes = () => {
    updateActiveOrder((ord) => ({
      ...ord,
      wishes: [],
    }));
  };

  // Handler: Load demo guests
  const handleLoadDemoGuests = () => {
    const demo = initialOrders[0]?.guests || [];
    updateActiveOrder((ord) => ({
      ...ord,
      guests: demo,
    }));
    setActiveGuest(demo[0] || null);
  };

  // Handler: Load demo wishes
  const handleLoadDemoWishes = () => {
    const demo = initialOrders[0]?.wishes || [];
    updateActiveOrder((ord) => ({
      ...ord,
      wishes: demo,
    }));
  };

  // Handler: Reply wish
  const handleReplyWish = (wishId: string, replyText: string) => {
    updateActiveOrder((ord) => ({
      ...ord,
      wishes: (ord.wishes || []).map((w) =>
        w.id === wishId ? { ...w, reply: replyText } : w
      ),
    }));
  };

  // Handler: Delete wish
  const handleDeleteWish = (wishId: string) => {
    updateActiveOrder((ord) => ({
      ...ord,
      wishes: (ord.wishes || []).filter((w) => w.id !== wishId),
    }));
  };

  // Handler: Reset data for active wedding
  const handleResetData = () => {
    updateActiveOrder((ord) => ({
      ...ord,
      config: initialWeddingConfig,
      guests: initialOrders[0]?.guests || [],
      wishes: initialOrders[0]?.wishes || [],
    }));
  };

  // Handler: Switch to invitation for a specific guest
  const handleSwitchToGuestInvitation = (guestNameOrId?: string) => {
    if (guestNameOrId) {
      const found = (activeOrder.guests || []).find(
        (g) => g.name === guestNameOrId || g.id === guestNameOrId
      );
      if (found) {
        setActiveGuest(found);
        setGuestParamName(found.name);
      }
    }
    setCurrentView('invitation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ORDER MANAGEMENT HANDLERS (for OrdersListView)
  const handleSelectOrder = (orderId: string) => {
    setActiveOrderId(orderId);
    setCurrentView('wedding-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewInvitationForOrder = (orderId: string) => {
    setActiveOrderId(orderId);
    const ord = orders.find((o) => o.id === orderId);
    if (ord && ord.guests && ord.guests.length > 0) {
      setActiveGuest(ord.guests[0]);
    } else {
      setActiveGuest(null);
    }
    setCurrentView('invitation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteOrder = (orderId: string) => {
    const remaining = orders.filter((o) => o.id !== orderId);
    setOrders(remaining);
    if (activeOrderId === orderId && remaining.length > 0) {
      setActiveOrderId(remaining[0].id);
    }
  };

  const handleCreateNewOrder = (newOrder: WeddingOrder) => {
    setOrders([newOrder, ...orders]);
    setActiveOrderId(newOrder.id);
  };

  const handleClearAllOrders = () => {
    setOrders([]);
    localStorage.removeItem(STORAGE_KEY_ORDERS);
  };

  const handleLoadDemoOrders = () => {
    setOrders(initialOrders);
    setActiveOrderId(initialOrders[0].id);
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(initialOrders));
  };

  return (
    <div className="min-h-screen">
      {/* AUTO-HIDDEN FLOATING NAVIGATION DOCK */}
      {/* 1. Minimized trigger pill (shown when navigation is auto-hidden) */}
      <div
        className={`no-print fixed top-3 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 transform ${
          !isNavVisible && !isNavHovered
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
        }`}
      >
        <button
          type="button"
          onClick={() => setIsNavVisible(true)}
          className="bg-stone-900/90 hover:bg-stone-950 backdrop-blur-md text-stone-200 hover:text-white px-4 py-1.5 rounded-full shadow-xl border border-white/10 flex items-center gap-2 text-xs font-medium cursor-pointer transition-transform hover:scale-105 group"
          title="Tampilkan Menu Navigasi"
        >
          <Compass className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
          <span>Navigasi</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>

      {/* 2. Full Navigation Ribbon (smoothly auto-hides on scroll down, reveals on scroll up/hover) */}
      <div
        onMouseEnter={() => setIsNavHovered(true)}
        onMouseLeave={() => setIsNavHovered(false)}
        className={`no-print fixed top-3 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 transform ${
          isNavVisible || isNavHovered
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-12 pointer-events-none'
        }`}
      >
        <div className="bg-stone-900/95 hover:bg-stone-950 backdrop-blur-md text-white px-3.5 py-1.5 rounded-2xl shadow-2xl border border-white/15 flex items-center gap-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-[11px] text-stone-400 pr-2 border-r border-white/10 hidden sm:flex">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-stone-300">Navigasi</span>
          </div>

          {/* 1. Toko & Katalog Pemesanan */}
          <button
            type="button"
            onClick={() => {
              setCurrentView('portal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentView === 'portal'
                ? 'bg-[#8a724d] text-white shadow-xs'
                : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
            }`}
            title="Menu tampilan untuk melihat dan memesan undangan (seperti undgn.id)"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Toko Pemesanan</span>
          </button>

          {/* 2. Tombol Pengaturan Undangan (Menggantikan tombol Undangan sesuai permintaan) */}
          <button
            type="button"
            onClick={() => setIsGlobalSettingsOpen(true)}
            className="px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 hover:text-amber-200 border border-amber-500/30 shadow-xs group"
            title={`Buka Pengaturan Undangan: ${activeOrder.config.groom.nickName} & ${activeOrder.config.bride.nickName} (Tema, Musik YouTube, Foto Mempelai, Rangkaian Acara, Rekening/QRIS, Galeri, dll.)`}
          >
            <Settings className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-45 transition-transform" />
            <span className="font-semibold">Pengaturan Undangan</span>
            <span className="hidden md:inline-block text-[10px] text-amber-200/80 bg-stone-950/70 px-1.5 py-0.5 rounded-md font-mono">
              {activeOrder.config.groom.nickName} &amp; {activeOrder.config.bride.nickName}
            </span>
          </button>

          {/* 3. Dasbor Utama: Daftar Pesanan */}
          <button
            type="button"
            onClick={() => {
              setCurrentView('orders-list');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentView === 'orders-list' || currentView === 'wedding-dashboard'
                ? 'bg-[#8a724d] text-white shadow-xs'
                : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
            }`}
            title="Menu dasbor daftar seluruh pesanan & acara pernikahan"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dasbor Pesanan</span>
          </button>

          {/* 4. Tombol Sembunyikan Navigasi (Auto-hide toggle manual) */}
          <button
            type="button"
            onClick={() => setIsNavVisible(false)}
            className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800/80 transition-colors cursor-pointer ml-1"
            title="Sembunyikan navigasi otomatis"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* VIEW ROUTING */}
      {currentView === 'portal' ? (
        <OrderLandingView
          onOpenSampleInvitation={(themeId) => {
            if (themeId) {
              handleSelectTheme(themeId);
            }
            setCurrentView('invitation');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenDashboard={() => {
            setCurrentView('orders-list');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onCreateNewOrder={handleCreateNewOrder}
        />
      ) : currentView === 'orders-list' ? (
        <OrdersListView
          orders={orders}
          onSelectOrder={handleSelectOrder}
          onViewInvitation={handleViewInvitationForOrder}
          onDeleteOrder={handleDeleteOrder}
          onCreateOrder={handleCreateNewOrder}
          onClearAllOrders={handleClearAllOrders}
          onLoadDemoOrders={handleLoadDemoOrders}
          onOpenStorePortal={() => setCurrentView('portal')}
        />
      ) : currentView === 'wedding-dashboard' ? (
        <DashboardView
          config={activeOrder.config}
          guests={activeOrder.guests || []}
          wishes={activeOrder.wishes || []}
          onAddGuest={handleAddGuest}
          onBatchAddGuests={handleBatchAddGuests}
          onToggleCheckIn={handleToggleCheckIn}
          onDeleteGuest={handleDeleteGuest}
          onClearAllGuests={handleClearAllGuests}
          onClearAllWishes={handleClearAllWishes}
          onLoadDemoGuests={handleLoadDemoGuests}
          onLoadDemoWishes={handleLoadDemoWishes}
          onSaveConfig={handleSaveActiveConfig}
          onReplyWish={handleReplyWish}
          onDeleteWish={handleDeleteWish}
          onResetData={handleResetData}
          onSwitchToInvitation={handleSwitchToGuestInvitation}
          onBackToOrdersList={() => setCurrentView('orders-list')}
        />
      ) : (
        <InvitationView
          config={activeOrder.config}
          currentGuest={activeGuest}
          wishes={activeOrder.wishes || []}
          onSaveRsvp={handleSaveRsvp}
          onLikeWish={handleLikeWish}
          onAddWish={handleAddDirectWish}
          onSelectTheme={handleSelectTheme}
          onSwitchToDashboard={() => setCurrentView('orders-list')}
        />
      )}

      {/* Global Event Settings Modal: dapat diakses kapan saja dari tombol "Pengaturan Undangan" di navigasi */}
      <EventSettingsModal
        config={activeOrder.config}
        isOpen={isGlobalSettingsOpen}
        onClose={() => setIsGlobalSettingsOpen(false)}
        onSaveConfig={handleSaveActiveConfig}
        onResetData={handleResetData}
        onPreviewInvitation={() => {
          setIsGlobalSettingsOpen(false);
          setCurrentView('invitation');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
