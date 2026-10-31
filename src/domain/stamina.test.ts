import { describe, expect, it } from 'vitest';
import { STAMINA_REGEN_MS, regenStamina } from './stamina';

describe('regenStamina', () => {
  it('+1 mỗi 3 phút, giữ phần lẻ thời gian', () => {
    const r = regenStamina(10, 50, 0, STAMINA_REGEN_MS * 2 + 5_000);
    expect(r).toEqual({ stamina: 12, updatedAt: STAMINA_REGEN_MS * 2 });
  });
  it('chưa đủ 1 tick thì không đổi', () => {
    expect(regenStamina(10, 50, 1000, 1000 + STAMINA_REGEN_MS - 1)).toEqual({ stamina: 10, updatedAt: 1000 });
  });
  it('không vượt trần', () => {
    expect(regenStamina(49, 50, 0, STAMINA_REGEN_MS * 100).stamina).toBe(50);
  });
  it('đang đầy thì mốc thời gian chạy theo hiện tại', () => {
    expect(regenStamina(50, 50, 0, 999)).toEqual({ stamina: 50, updatedAt: 999 });
  });
});
