import { describe, expect, it } from 'vitest';
import { GAME_CATALOG } from '../data/masterData';
import { applyXp, canCraftOrBuy, canPlant, maxUnlockedWave, xpToNext } from './progression';

const byId = (id: string) => GAME_CATALOG.find((c) => c.id === id)!;

describe('progression', () => {
  it('đường cong XP = round(60 × L^1.5)', () => {
    expect(xpToNext(1)).toBe(60);
    expect(xpToNext(5)).toBe(671);
    expect(xpToNext(10)).toBe(1897);
  });

  it('cộng XP lên được nhiều cấp và giữ phần dư', () => {
    expect(applyXp(1, 0, 59)).toEqual({ level: 1, xp: 59, levelsGained: 0 });
    expect(applyXp(1, 59, 1)).toEqual({ level: 2, xp: 0, levelsGained: 1 });
    // 60 (1→2) + 170 (2→3) = 230 → Lv.3 dư 10
    expect(applyXp(1, 0, 240)).toEqual({ level: 3, xp: 10, levelsGained: 2 });
    expect(applyXp(1, 0, -50)).toEqual({ level: 1, xp: 0, levelsGained: 0 });
  });

  it('GĐ → Đợt mở', () => {
    expect([0, 1, 2, 5, 6].map(maxUnlockedWave)).toEqual([1, 1, 2, 5, 5]);
  });

  it('canPlant kiểm tra nhóm, miền, Đợt và cấp', () => {
    expect(canPlant(byId('CROP_01'), 1, 1, 'NORTH')).toEqual({ ok: true });
    expect(canPlant(byId('CROP_02'), 1, 1, 'NORTH')).toEqual({ ok: false, reason: 'LEVEL_LOCKED' });
    expect(canPlant(byId('CROP_13'), 30, 1, 'NORTH')).toEqual({ ok: false, reason: 'WAVE_LOCKED' });
    expect(canPlant(byId('CROP_13'), 30, 2, 'NORTH')).toEqual({ ok: true });
    expect(canPlant(byId('CROP_N01'), 30, 1, 'SOUTH')).toEqual({ ok: false, reason: 'REGION_LOCKED' });
    expect(canPlant(byId('CROP_N01'), 30, 1, 'NORTH')).toEqual({ ok: true });
    expect(canPlant(byId('PROD_01'), 30, 6, 'NORTH')).toEqual({ ok: false, reason: 'NOT_PLANTABLE' });
  });

  it('canCraftOrBuy: món/máy không gieo được chỉ mở từ GĐ2, đúng Đợt và đủ cấp', () => {
    expect(canCraftOrBuy(byId('CROP_01'), 30, 5)).toEqual({ ok: false, reason: 'PLANTABLE' });
    // GĐ1: kể cả món Đợt 1 (Cơm Trắng) cũng khóa — chặn vòng "mua món rồi bán lại HTX".
    expect(canCraftOrBuy(byId('PROD_01'), 30, 1)).toEqual({ ok: false, reason: 'STAGE_LOCKED', stage: 2 });
    expect(canCraftOrBuy(byId('MAC_01'), 30, 1)).toEqual({ ok: false, reason: 'STAGE_LOCKED', stage: 2 });
    expect(canCraftOrBuy(byId('PROD_01'), 30, 2)).toEqual({ ok: true });
    expect(canCraftOrBuy(byId('PROD_01'), 3, 2)).toEqual({ ok: false, reason: 'LEVEL_LOCKED' });
    // Món Đợt 5 cần GĐ5.
    expect(canCraftOrBuy(byId('PROD_24'), 60, 4)).toEqual({ ok: false, reason: 'STAGE_LOCKED', stage: 5 });
    expect(canCraftOrBuy(byId('PROD_24'), 60, 5)).toEqual({ ok: true });
  });

  it('GĐ1: không vật phẩm chế biến/sở hữu nào mở (Bếp, Xưởng là GĐ2)', () => {
    expect(GAME_CATALOG.filter((c) => canCraftOrBuy(c, 60, 1).ok)).toHaveLength(0);
  });

  it('GĐ1 + Lv.30: đúng 23 loài V-A-C khả dụng trên cả 3 miền gộp lại', () => {
    const vac = GAME_CATALOG.filter((c) => /^(CROP|ANI|AQUA)_/.test(c.id));
    const open = vac.filter((c) =>
      (['NORTH', 'CENTRAL', 'SOUTH'] as const).some((r) => canPlant(c, 30, 1, r).ok)
    );
    expect(open).toHaveLength(23);
  });
});
