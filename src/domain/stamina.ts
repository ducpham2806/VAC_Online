/** Năng lượng Bát Cơm hồi +1 ⚡ mỗi 3 phút (docs/03_KINH_TE KT-20), không vượt trần. */
export const STAMINA_REGEN_MS = 180_000;

export function regenStamina(
  stamina: number,
  maxStamina: number,
  updatedAt: number,
  now: number
): { stamina: number; updatedAt: number } {
  if (stamina >= maxStamina) return { stamina, updatedAt: now };
  const elapsed = Math.max(0, now - updatedAt);
  const ticks = Math.floor(elapsed / STAMINA_REGEN_MS);
  if (ticks <= 0) return { stamina, updatedAt };
  const next = Math.min(maxStamina, stamina + ticks);
  // Giữ phần lẻ thời gian chưa đủ 1 tick để không "ăn mất" thời gian hồi.
  return { stamina: next, updatedAt: next >= maxStamina ? now : updatedAt + ticks * STAMINA_REGEN_MS };
}
