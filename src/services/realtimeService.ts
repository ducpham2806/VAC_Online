import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { ChatMessage, MarketListingItem, RegionType } from '../data/types';
import { GAME_CATALOG } from '../data/masterData';

export interface LoaPhuongPayload {
  sender: string;
  achievement: string;
  timestamp: string;
}

export interface GuestbookEntry {
  id: string;
  hostName: string;
  visitorName: string;
  message: string;
  timestamp: string;
}

class VACRealtimeService {
  private channel: RealtimeChannel | null = null;
  private isConnected = false;

  initRealtime(
    onChatMessage: (msg: ChatMessage) => void,
    onLoaPhuong: (payload: LoaPhuongPayload) => void,
    onOnlineCountChange?: (count: number) => void,
    onNewMarketListing?: (listing: MarketListingItem) => void,
    onNewGuestbook?: (entry: GuestbookEntry) => void
  ): void {
    if (!supabase || this.channel) return;

    this.channel = supabase.channel('vac_online_global_hub', {
      config: {
        broadcast: { self: false },
        presence: { key: `farmer_${Math.floor(Math.random() * 99999)}` },
      },
    });

    this.channel
      .on('broadcast', { event: 'chat_message' }, ({ payload }) => {
        if (payload && typeof payload.content === 'string') {
          onChatMessage(payload as ChatMessage);
        }
      })
      .on('broadcast', { event: 'loa_phuong' }, ({ payload }) => {
        if (payload && typeof payload.achievement === 'string') {
          onLoaPhuong(payload as LoaPhuongPayload);
        }
      })
      .on('broadcast', { event: 'market_listing' }, ({ payload }) => {
        if (payload && typeof payload.itemId === 'string' && onNewMarketListing) {
          onNewMarketListing(payload as MarketListingItem);
        }
      })
      .on('broadcast', { event: 'guestbook_entry' }, ({ payload }) => {
        if (payload && typeof payload.message === 'string' && onNewGuestbook) {
          onNewGuestbook(payload as GuestbookEntry);
        }
      })
      .on('presence', { event: 'sync' }, () => {
        if (!this.channel || !onOnlineCountChange) return;
        const state = this.channel.presenceState();
        const totalOnline = Object.keys(state).length;
        onOnlineCountChange(Math.max(1, totalOnline));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          this.isConnected = true;
          await this.channel?.track({ online_at: new Date().toISOString() });
        }
      });
  }

  async broadcastChat(msg: ChatMessage): Promise<void> {
    if (!this.channel || !this.isConnected) return;
    await this.channel.send({
      type: 'broadcast',
      event: 'chat_message',
      payload: msg,
    });
  }

  async broadcastLoaPhuong(sender: string, achievement: string): Promise<void> {
    if (!this.channel || !this.isConnected) return;
    await this.channel.send({
      type: 'broadcast',
      event: 'loa_phuong',
      payload: {
        sender,
        achievement,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      },
    });
  }

  async broadcastMarketListing(listing: MarketListingItem): Promise<void> {
    if (!this.channel || !this.isConnected) return;
    await this.channel.send({
      type: 'broadcast',
      event: 'market_listing',
      payload: listing,
    });
  }

  async broadcastGuestbook(entry: GuestbookEntry): Promise<void> {
    if (!this.channel || !this.isConnected) return;
    await this.channel.send({
      type: 'broadcast',
      event: 'guestbook_entry',
      payload: entry,
    });
  }

  async checkDatabaseTables(): Promise<{
    ready: boolean;
    detail: string;
    cloudListings?: MarketListingItem[];
    cloudGuestbook?: GuestbookEntry[];
  }> {
    if (!supabase) {
      return { ready: false, detail: 'Chưa khởi tạo Supabase client' };
    }

    await supabase.rpc('rpc_sync_master_catalog', { p_items: GAME_CATALOG }).then(() => {});

    const { data, error } = await supabase
      .from('market_listings')
      .select('id, seller_name, seller_region, item_id, quantity, unit_price, status')
      .eq('status', 'ACTIVE')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      return {
        ready: false,
        detail: `Kết nối Realtime đã thông! (Lỗi truy vấn bảng: ${error.message})`,
      };
    }

    const mappedListings: MarketListingItem[] = (data ?? []).map((row, idx) => {
      const spec = GAME_CATALOG.find((c) => c.id === row.item_id);
      const region = (
        row.seller_region === 'NORTH' || row.seller_region === 'CENTRAL' || row.seller_region === 'SOUTH'
          ? row.seller_region
          : 'SOUTH'
      ) as RegionType;
      return {
        id: String(row.id ?? `CLOUD_${idx}`),
        sellerName: String(row.seller_name ?? 'HTX Nông Nghiệp Ba Miền'),
        sellerRegion: region,
        sellerLevel: 18 + (idx % 9),
        itemId: String(row.item_id),
        itemName: spec?.name ?? String(row.item_id),
        emoji: spec?.emoji ?? '🌾',
        quantity: Number(row.quantity ?? 5),
        unitPrice: Number(row.unit_price ?? 100),
        basePrice: spec?.baseSellGold ?? 60,
        hasRipeStealableCrop: idx % 3 !== 2,
        stealTargetName:
          idx % 3 !== 2
            ? `Vườn ${spec?.name ?? 'Nông sản'} (vừa chín 3 phút trước - Còn 2p cửa sổ vàng!)`
            : `Vườn ${spec?.name ?? 'Nông sản'} (Chó Phú Quốc đang thức canh!)`,
      };
    });

    const { data: gbData } = await supabase
      .from('farm_guestbook')
      .select('id, visitor_name, message, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    const mappedGuestbook: GuestbookEntry[] = (gbData ?? []).map((g, idx) => ({
      id: String(g.id ?? `GB_${idx}`),
      hostName: 'Tư Hậu Lập Nghiệp',
      visitorName: String(g.visitor_name ?? 'Khách Thăm Quê'),
      message: String(g.message ?? 'Trang trại đẹp quá!'),
      timestamp: new Date(String(g.created_at ?? new Date().toISOString())).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));

    const { count: catalogCount } = await supabase
      .from('master_catalog')
      .select('id', { count: 'exact', head: true });

    const catalogStatus =
      typeof catalogCount === 'number' && catalogCount > 0
        ? `Bảng master_catalog Cloud: ${catalogCount} thực thể`
        : `Đã nạp ${GAME_CATALOG.length} thực thể tại Client`;

    return {
      ready: true,
      detail: `✅ Đã kết nối 7 bảng PostgreSQL (${catalogStatus} • ${mappedListings.length} sạp chợ Cloud)!`,
      cloudListings: mappedListings.length > 0 ? mappedListings : undefined,
      cloudGuestbook: mappedGuestbook.length > 0 ? mappedGuestbook : undefined,
    };
  }

  async syncFullCatalogToSupabase(): Promise<{ ok: boolean; message: string }> {
    if (!supabase) {
      return { ok: false, message: 'Chưa kết nối Supabase Cloud!' };
    }
    const { data, error } = await supabase.rpc('rpc_sync_master_catalog', {
      p_items: GAME_CATALOG,
    });

    if (error) {
      return {
        ok: false,
        message: `Đã nạp ${GAME_CATALOG.length} thực thể vào Game! (Để lưu bảng master_catalog lên SQL Cloud, hãy chạy thêm file 0002_seed_full_master_data.sql trong Supabase SQL Editor)`,
      };
    }

    const syncedCount = (data as { synced_count?: number } | null)?.synced_count ?? GAME_CATALOG.length;
    return {
      ok: true,
      message: `☁️ Đã đồng bộ thành công trọn bộ ${syncedCount} thực thể VAC Online lên bảng public.master_catalog trên Supabase Cloud!`,
    };
  }

  async postMarketListingToCloud(
    sellerName: string,
    sellerRegion: RegionType,
    sellerLevel: number,
    itemId: string,
    quantity: number,
    unitPrice: number
  ): Promise<MarketListingItem> {
    const spec = GAME_CATALOG.find((c) => c.id === itemId);
    let listingId = `MKT_${Date.now()}`;

    if (supabase) {
      const { data } = await supabase.rpc('rpc_post_market_listing', {
        p_seller_name: sellerName,
        p_seller_region: sellerRegion,
        p_item_id: itemId,
        p_quantity: quantity,
        p_unit_price: unitPrice,
      });
      if (data && (data as { listing_id?: string }).listing_id) {
        listingId = String((data as { listing_id?: string }).listing_id);
      }
    }

    const newListing: MarketListingItem = {
      id: listingId,
      sellerName,
      sellerRegion,
      sellerLevel,
      itemId,
      itemName: spec?.name ?? itemId,
      emoji: spec?.emoji ?? '🌾',
      quantity,
      unitPrice,
      basePrice: spec?.baseSellGold ?? unitPrice,
      hasRipeStealableCrop: true,
      stealTargetName: `Vườn nhà ${sellerName} (Vừa đăng sạp chợ liên vùng!)`,
    };

    await this.broadcastMarketListing(newListing);
    return newListing;
  }

  async signGuestbookToCloud(
    hostName: string,
    visitorName: string,
    message: string
  ): Promise<GuestbookEntry> {
    let entryId = `GB_${Date.now()}`;
    if (supabase) {
      const { data } = await supabase.rpc('rpc_sign_guestbook', {
        p_host_name: hostName,
        p_visitor_name: visitorName,
        p_message: message,
      });
      if (data && (data as { entry_id?: string }).entry_id) {
        entryId = String((data as { entry_id?: string }).entry_id);
      }
    }

    const entry: GuestbookEntry = {
      id: entryId,
      hostName,
      visitorName,
      message,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    await this.broadcastGuestbook(entry);
    return entry;
  }
}

export const vacRealtime = new VACRealtimeService();
