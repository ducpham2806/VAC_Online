import { describe, expect, it } from 'vitest';
import { DOG_CATCH_CHANCE, GOOSE_CATCH_CHANCE, STEAL_WINDOW_MINUTES, combinedCatchChance } from './social';

describe('Hằng số hái trộm (PO chốt 2026-11-02)', () => {
  it('Chó giữ nhà 50%, cửa sổ trộm 2 phút', () => {
    expect(DOG_CATCH_CHANCE).toBe(0.5);
    expect(STEAL_WINDOW_MINUTES).toBe(2);
  });

  it('Chó + Ngỗng cùng thức: 1 − 0,5 × 0,6 = 70%', () => {
    expect(combinedCatchChance([DOG_CATCH_CHANCE, GOOSE_CATCH_CHANCE])).toBeCloseTo(0.7);
    expect(combinedCatchChance([])).toBe(0);
    expect(combinedCatchChance([1.5])).toBe(1);
  });
});
