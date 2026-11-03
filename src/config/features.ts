/**
 * Giai đoạn phát hành đang mở (1..6) — quyết định tính năng & Đợt V-A-C nào hiện ra.
 * Production mặc định GĐ1; `npm run dev` mặc định 6 để thấy toàn bộ prototype.
 * Ghi đè bằng biến môi trường VITE_GAME_STAGE. Phía server: hàm SQL public.app_game_stage().
 */
function readStage(): number {
  const raw = Number(import.meta.env.VITE_GAME_STAGE);
  if (Number.isInteger(raw) && raw >= 1 && raw <= 6) return raw;
  return import.meta.env.DEV ? 6 : 1;
}

export const GAME_STAGE = readStage();

export function isStageOpen(stage: number): boolean {
  return GAME_STAGE >= stage;
}

/**
 * Bản chạy thử chơi ngay (Artifact / link xem trước): không kết nối Supabase, không service worker,
 * mọi thứ chạy chế độ Khách offline. Bật bằng VITE_OFFLINE_DEMO=1 (npm run build:preview).
 */
export const OFFLINE_DEMO = import.meta.env.VITE_OFFLINE_DEMO === '1';

/**
 * Save mẫu cho bản chạy thử (chỉ khi OFFLINE_DEMO): 'gd2' = Lv.15, có vàng + nông sản để thử Bếp Quê & Lán Thợ.
 * Không bao giờ bật ở bản thật (cần cả VITE_OFFLINE_DEMO=1).
 */
export const PREVIEW_PRESET = OFFLINE_DEMO ? (import.meta.env.VITE_PREVIEW_PRESET ?? '') : '';
