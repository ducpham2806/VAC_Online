import { describe, expect, it } from 'vitest';
import { quoteMarketListing } from './market';

describe('quoteMarketListing — luật Chợ Phiên P2P (02_MASTER_ECONOMY)', () => {
  it('kẹp giá trần 2.0x và trừ 10% thuế', () => {
    const q = quoteMarketListing(10, 5, 999);
    expect(q.clampedPrice).toBe(20);
    expect(q.netRevenueAfterTax).toBe(90);
  });

  it('kẹp giá sàn 0.8x', () => {
    expect(quoteMarketListing(10, 1, 1).clampedPrice).toBe(8);
  });

  it('giữ nguyên giá nằm trong khung', () => {
    expect(quoteMarketListing(10, 3, 15).clampedPrice).toBe(15);
  });

  it('giá gốc rất thấp vẫn có khung tối thiểu (sàn >= 1, trần >= sàn + 2)', () => {
    const q = quoteMarketListing(1, 1, 999);
    expect(q.minPrice).toBe(1);
    expect(q.maxPrice).toBe(3);
  });
});
