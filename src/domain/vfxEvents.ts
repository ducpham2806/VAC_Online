/**
 * Sự kiện VFX nông trại suy ra từ 2 trạng thái liên tiếp của store (hàm thuần — chỉ hiển thị, không đổi luật).
 * Phần vẽ: src/game/vfx/farmVfx.ts. Màu lấy từ bảng 64 màu (art/palette/vac_base.gpl).
 */
import { GAME_CATALOG } from '../data/masterData';
import type { FarmTileEntity } from '../data/types';

export const VFX_COLORS = {
  soil: 0xa97b4f,
  soilDark: 0x6b4a32,
  water: 0x80deea,
  foam: 0xcdeff2,
  gold: 0xffd166,
  goldDeep: 0xffb703,
  leaf: 0x8ac926,
  leafDark: 0x4e8222,
  confetti: [0xd62828, 0xffb703, 0x8ac926, 0x2ec4b6, 0x9b5de5, 0xf15bb5],
} as const;

export interface VfxSnap {
  tiles: readonly FarmTileEntity[];
  level: number;
  inventory: Record<string, number>;
}

/** Các sự kiện VFX suy ra từ 2 trạng thái liên tiếp (hàm thuần, có test). */
export type VfxEvent =
  | { kind: 'plant' | 'water' | 'golden' | 'expand'; tileId: string }
  | { kind: 'harvest'; tileId: string; text: string }
  | { kind: 'levelUp'; level: number };

/** Mỗi thao tác của người chơi chỉ đổi 1–2 ô; nhiều hơn là đồng bộ hàng loạt. */
export const MAX_TILE_EVENTS_PER_UPDATE = 3;

export function diffVfxEvents(prev: VfxSnap, now: VfxSnap): VfxEvent[] {
  const events: VfxEvent[] = [];
  const before = new Map(prev.tiles.map((t) => [t.id, t]));
  for (const t of now.tiles) {
    const p: FarmTileEntity | undefined = before.get(t.id);
    if (!p) {
      events.push({ kind: 'expand', tileId: t.id });
      continue;
    }
    if (!p.itemId && t.itemId) events.push({ kind: 'plant', tileId: t.id });
    if (p.itemId && t.itemId === p.itemId && !p.watered && t.watered) events.push({ kind: 'water', tileId: t.id });
    if (p.itemId && t.itemId === p.itemId && !p.isGolden && t.isGolden) events.push({ kind: 'golden', tileId: t.id });
    if (p.itemId && !t.itemId) {
      const gained = (now.inventory[p.itemId] ?? 0) - (prev.inventory[p.itemId] ?? 0);
      const spec = GAME_CATALOG.find((c) => c.id === p.itemId);
      events.push({ kind: 'harvest', tileId: t.id, text: `+${Math.max(gained, 1)} ${spec?.emoji ?? '🌾'}` });
    }
  }
  // Nạp ảnh chụp server / save cũ đổi nhiều ô cùng lúc: không phải thao tác của người chơi → bỏ hiệu ứng ô.
  const tileEvents = events.length > MAX_TILE_EVENTS_PER_UPDATE ? [] : events;
  return now.level > prev.level ? [...tileEvents, { kind: 'levelUp', level: now.level }] : tileEvents;
}

