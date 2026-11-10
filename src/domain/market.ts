/**
 * Luật Chợ Phiên P2P (docs/03_KINH_TE KT-31): giá niêm yết bị kẹp trong [0.8x, 2.0x]
 * giá bán gốc và người bán chịu 5% Thuế Chợ (PO chốt 2026-11-01).
 * Hàm thuần — dùng chung cho Store, QC runner và (sau này) đối chiếu với RPC server.
 */
export const MARKET_TAX_RATE = 0.05;
export const MARKET_MIN_PRICE_RATIO = 0.8;
export const MARKET_MAX_PRICE_RATIO = 2.0;

export interface MarketListingQuote {
  minPrice: number;
  maxPrice: number;
  clampedPrice: number;
  netRevenueAfterTax: number;
}

export function quoteMarketListing(
  baseSellGold: number,
  quantity: number,
  requestedUnitPrice: number
): MarketListingQuote {
  const minPrice = Math.max(1, Math.floor(baseSellGold * MARKET_MIN_PRICE_RATIO));
  const maxPrice = Math.max(minPrice + 2, baseSellGold * MARKET_MAX_PRICE_RATIO);
  const clampedPrice = Math.min(maxPrice, Math.max(minPrice, requestedUnitPrice));
  const netRevenueAfterTax = Math.floor(clampedPrice * quantity * (1 - MARKET_TAX_RATE));
  return { minPrice, maxPrice, clampedPrice, netRevenueAfterTax };
}
