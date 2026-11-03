import { FarmTileEntity, GenderType, RegionType } from '../data/types';
import { getSupabaseClient } from './supabaseClient';
import { BASE_PLOTS, createPlotTiles } from '../domain/farmGrid';

/**
 * Cầu nối tới các RPC nông trại (migration 0004). Ở chế độ online, mọi thao tác dính tới
 * vàng / XP / kho đều đi qua đây và state client chỉ là bản sao ảnh chụp từ server.
 */

export type FarmMode = 'local' | 'cloud';

export type FarmRpcName =
  | 'rpc_get_my_farm'
  | 'rpc_set_profile_basics'
  | 'rpc_plant'
  | 'rpc_water'
  | 'rpc_apply_mud'
  | 'rpc_harvest'
  | 'rpc_sell_to_htx'
  | 'rpc_dredge_pond'
  | 'rpc_expand_land'
  | 'rpc_claim_story_quest'
  | 'rpc_claim_rookie_day'
  | 'rpc_claim_account_bonus'
  | 'rpc_build_machine'
  | 'rpc_start_craft'
  | 'rpc_collect_craft'
  | 'rpc_eat_dish'
  | 'rpc_cook_pot'
  | 'rpc_hire_worker'
  | 'rpc_serve_lodge_meal'
  | 'rpc_claim_worker_pantry'
  | 'rpc_equip_worker_gear'
  | 'rpc_give_worker_bonus';

interface SnapshotTile {
  x: number;
  y: number;
  item_id: string;
  planted_at: number;
  mature_at: number;
  watered: boolean;
  mud_applied: boolean;
  is_golden: boolean;
  total_yield: number;
  remaining_yield: number;
  /** Số lứa còn lại (migration 0010). Server cũ chưa có → undefined = 1. */
  harvests_left?: number;
}

export interface FarmSnapshot {
  server_now: number;
  game_stage: number;
  profile: {
    username: string;
    gender: GenderType;
    region: RegionType;
    level: number;
    xp: number;
    gold: number;
    gems: number;
    stamina: number;
    max_stamina: number;
    stamina_updated_at: number;
    feng_shui_score: number;
    neighbor_points: number;
    wild_plots_unlocked: number;
    pond_mud_counter: number;
    rookie_days_claimed: number;
    rookie_claimed_today: boolean;
    account_bonus_claimed: boolean;
    created_as_guest: boolean;
  };
  inventory: Record<string, number>;
  tiles: SnapshotTile[];
  quests: Record<string, 'EMP' | 'PRAG'>;
  /** Bộ đếm hành động cho mục tiêu nhiệm vụ (migration 0007). Server cũ chưa có → undefined. */
  counters?: Record<string, number>;
  /** Xưởng Bếp Quê (migration 0009). Server cũ chưa có → undefined. */
  machines?: Record<string, { craft_item_id: string | null; ready_at: number | null }>;
  /** Món đã khám phá ở Nồi Đất (migration 0009). */
  recipes?: string[];
  /** Lán Thợ (migration 0011). Server cũ chưa có → undefined. */
  workers?: Record<string, { contract_until: number; belly: number; tick_at: number; gear_id?: string | null; gear_until?: number | null; bonus_until?: number | null }>;
  lodge_meals?: number;
  worker_pantry?: Record<string, number>;
}

export type RpcResult = { ok: true; snapshot: FarmSnapshot } | { ok: false; message: string; missing?: boolean };

function isSnapshot(value: unknown): value is FarmSnapshot {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.server_now === 'number' && typeof v.profile === 'object' && Array.isArray(v.tiles);
}

/** Thông báo lỗi thân thiện từ lỗi Postgres (RAISE EXCEPTION trong RPC). */
function friendlyError(message: string): string {
  const clean = message.replace(/^.*?ERROR:\s*/i, '').trim();
  return clean.startsWith('⚠️') || clean.startsWith('🔒') ? clean : `⚠️ ${clean}`;
}

/** Có phiên đăng nhập Supabase (tài khoản thật hoặc Khách ẩn danh) không. */
export async function hasCloudSession(): Promise<boolean> {
  const sb = getSupabaseClient();
  if (!sb) return false;
  try {
    const { data } = await sb.auth.getSession();
    return Boolean(data.session);
  } catch {
    return false;
  }
}

export async function callFarmRpc(name: FarmRpcName, args: Record<string, unknown> = {}): Promise<RpcResult> {
  const sb = getSupabaseClient();
  if (!sb) return { ok: false, message: '⚠️ Chưa kết nối máy chủ.' };
  try {
    const { data, error } = await sb.rpc(name, args);
    if (error) {
      // PGRST202 / 42883: máy chủ chưa chạy migration 0004 → client tự chuyển sang chế độ offline.
      const missing = error.code === 'PGRST202' || error.code === '42883';
      return { ok: false, message: friendlyError(error.message), missing };
    }
    if (!isSnapshot(data)) return { ok: false, message: '⚠️ Máy chủ trả dữ liệu không hợp lệ.' };
    return { ok: true, snapshot: data };
  } catch {
    return { ok: false, message: '⚠️ Mất kết nối máy chủ, vui lòng thử lại!' };
  }
}

/** Lưới 12 ô cố định của FarmScene: 4 cột × 3 hàng (Vườn / Vườn cây / Ao). */
/** 12 ô trống của người chơi mới (bố cục đầy đủ: src/domain/farmGrid.ts). */
export function createEmptyTiles(): FarmTileEntity[] {
  return createPlotTiles(BASE_PLOTS);
}

/** Ghép các ô có cây từ server vào lưới đã khai hoang (12 → 25 phân khu). */
export function tilesFromSnapshot(snapshot: FarmSnapshot): FarmTileEntity[] {
  return createPlotTiles(snapshot.profile.wild_plots_unlocked ?? BASE_PLOTS).map((t) => {
    const s = snapshot.tiles.find((e) => e.x === t.tileX && e.y === t.tileY);
    if (!s) return t;
    return {
      ...t,
      itemId: s.item_id,
      plantedAt: s.planted_at,
      matureAt: s.mature_at,
      watered: s.watered,
      mudApplied: s.mud_applied,
      isGolden: s.is_golden,
      totalYield: s.total_yield,
      remainingYield: s.remaining_yield,
      harvestsLeft: s.harvests_left ?? 1,
    };
  });
}
