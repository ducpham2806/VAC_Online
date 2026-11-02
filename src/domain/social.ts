/**
 * Hằng số tương tác hàng xóm (GĐ3 — Hái trộm vui vẻ). PO chốt 2026-11-02.
 * Server: rpc_attempt_steal (0001) đang khóa với client từ 0003 và sẽ được viết lại ở S6 theo đúng các
 * hằng số này (bỏ tham số p_thief_id / p_dog_catch_chance). Sửa ở đây thì sửa cả SQL khi đó.
 */

/** Chó Phú Quốc (PET_01) bắt sống kẻ trộm. */
export const DOG_CATCH_CHANCE = 0.5;
/** Đàn Ngỗng (PET_02) mổ kẻ trộm. */
export const GOOSE_CATCH_CHANCE = 0.4;
/**
 * Cửa sổ trộm 2 phút (thay "3 phút ân huệ" ghi ở 03_MASTER_TECH). Cách áp cụ thể với mốc chín
 * và với Gia nhân thu gom (RULE C9) chốt khi làm tính năng trộm ở S6.
 */
export const STEAL_WINDOW_MINUTES = 2;
/** Bảo hiểm: chủ vườn luôn giữ ≥ 80% sản lượng mỗi ô (PO chốt 2026-11-01). */
export const STEAL_INSURANCE_KEEP = 0.8;

/** Xác suất bị bắt khi nhiều vật canh cùng thức: 1 − Π(1 − p). */
export function combinedCatchChance(chances: readonly number[]): number {
  return 1 - chances.reduce((miss, p) => miss * (1 - Math.min(1, Math.max(0, p))), 1);
}
