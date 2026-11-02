import { describe, expect, it } from 'vitest';
import { growthFrame, growthStage } from './growth';

describe('Giai đoạn lớn (chọn khung sprite)', () => {
  const P = 1_000, M = 2_000;
  it('chia 0 / 1 / 2 theo 25% và 60% thời gian, 3 khi chín', () => {
    expect(growthStage(P, M, 1_000)).toBe(0);
    expect(growthStage(P, M, 1_249)).toBe(0);
    expect(growthStage(P, M, 1_250)).toBe(1);
    expect(growthStage(P, M, 1_599)).toBe(1);
    expect(growthStage(P, M, 1_600)).toBe(2);
    expect(growthStage(P, M, 1_999)).toBe(2);
    expect(growthStage(P, M, 2_000)).toBe(3);
  });
  it('dữ liệu thiếu / bón bùn chín ngay vẫn ra khung hợp lệ', () => {
    expect(growthStage(null, null, 5)).toBe(0);
    expect(growthStage(null, 10, 5)).toBe(2);
    expect(growthStage(10, 5, 1)).toBe(2);
    expect(growthStage(10, 5, 9)).toBe(3);
  });
  it('tên khung atlas', () => {
    expect(growthFrame('CROP_01', 3)).toBe('CROP_01_3');
  });
});
