import type { CatalogItem, Season } from './types';

/**
 * Nội dung bản thử P1 (LT-03, P1-9, QD-86, QD-87): 8 loài Bắc Bộ, hai mùa chính Xuân + Thu.
 * Mã lấy nguyên từ `GAME_CATALOG`; giá, thời gian, sản lượng, XP giữ nguyên dữ liệu.
 * Chỉ cấp mở là riêng của bản thử (`SLICE_UNLOCK_LEVEL`, KT-21) — `catalog.csv` không đổi.
 */
export const SLICE_CROPS: readonly string[] = ['CROP_01', 'CROP_02', 'CROP_03', 'CROP_04', 'CROP_05'];
export const SLICE_LIVESTOCK: readonly string[] = ['ANI_01', 'ANI_03'];
export const SLICE_AQUA: readonly string[] = ['AQUA_01'];
export const SLICE_SPECIES: readonly string[] = [...SLICE_CROPS, ...SLICE_LIVESTOCK, ...SLICE_AQUA];

/** Bếp Củi (Nồi Đất) và hai món của bản thử: Cơm Trắng (biết sẵn), Canh Cải Cá Rô Đồng (tìm ở Nồi Đất). */
export const SLICE_KITCHEN_ID = 'MAC_02';
export const SLICE_RECIPES: readonly string[] = ['PROD_01', 'PROD_03'];

/** Hai mùa trọng tâm của bản thử; lịch thật vẫn chạy đủ 4 mùa (KT-17). */
export const SLICE_SEASONS: readonly Season[] = ['XUAN', 'THU'];

/**
 * KT-21 (QD-87): cấp mở riêng của bản thử, để người chơi thử thấy Bếp và Vịt trong vài buổi đầu.
 * Mã không có ở đây giữ cấp mở trong dữ liệu (Lúa 1, Rau Muống 2, Ngô 2).
 */
export const SLICE_UNLOCK_LEVEL: Readonly<Record<string, number>> = {
  ANI_01: 2,
  AQUA_01: 3,
  CROP_04: 3,
  CROP_05: 3,
  MAC_02: 3,
  PROD_01: 3,
  PROD_03: 4,
  ANI_03: 5,
};

/** Cấp mở áp dụng trong bản thử. */
export const sliceUnlockLevel = (item: Pick<CatalogItem, 'id' | 'unlockLevel'>): number =>
  SLICE_UNLOCK_LEVEL[item.id] ?? item.unlockLevel;

// ---------------------------------------------------------------- chỗ nuôi (KT-21, QD-87)
export type SlotKind = 'HEN' | 'DUCK' | 'FISH';
export interface AnimalSlot {
  kind: SlotKind;
  x: number;
  y: number;
}

/** Loài nuôi ở từng loại chỗ: gà trong sân chuồng, vịt mép ao, cá giữa ao. */
export const SLOT_SPECIES: Readonly<Record<SlotKind, string>> = { HEN: 'ANI_01', DUCK: 'ANI_03', FISH: 'AQUA_01' };

/**
 * 4 chỗ gà (sân chuồng `,`, mở khi sửa Chuồng gà), 2 chỗ vịt ở mép trái ao, 3 chỗ cá ở mép dưới ao (`P`).
 * Ô ao không đi được; người chơi đứng ở ô cỏ kề bên để thả/thu (GP-02).
 */
export const ANIMAL_SLOTS: readonly AnimalSlot[] = [
  { kind: 'HEN', x: 20, y: 13 },
  { kind: 'HEN', x: 21, y: 13 },
  { kind: 'HEN', x: 20, y: 14 },
  { kind: 'HEN', x: 21, y: 14 },
  { kind: 'DUCK', x: 24, y: 6 },
  { kind: 'DUCK', x: 24, y: 7 },
  { kind: 'FISH', x: 25, y: 8 },
  { kind: 'FISH', x: 26, y: 8 },
  { kind: 'FISH', x: 27, y: 8 },
];

export const slotAt = (x: number, y: number): AnimalSlot | undefined => ANIMAL_SLOTS.find((s) => s.x === x && s.y === y);
