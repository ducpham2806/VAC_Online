/**
 * Giai đoạn lớn để chọn khung sprite (art/source/<lô>/<ID>/<0..3>.png → atlas "<ID>_<stage>").
 * Chỉ dùng cho hiển thị — không ảnh hưởng luật chơi.
 *   0 mầm / trứng  : < 25% thời gian
 *   1 non          : 25% – 60%
 *   2 lớn          : 60% – 100%
 *   3 chín / thu   : đã chín (now ≥ matureAt)
 */
export type GrowthStage = 0 | 1 | 2 | 3;

export const GROWTH_STAGE_CUTS = [0.25, 0.6] as const;

export function growthStage(plantedAt: number | null, matureAt: number | null, now: number): GrowthStage {
  if (matureAt === null) return 0;
  if (now >= matureAt) return 3;
  if (plantedAt === null || matureAt <= plantedAt) return 2;
  const p = (now - plantedAt) / (matureAt - plantedAt);
  if (p < GROWTH_STAGE_CUTS[0]) return 0;
  if (p < GROWTH_STAGE_CUTS[1]) return 1;
  return 2;
}

export const growthFrame = (itemId: string, stage: GrowthStage) => `${itemId}_${stage}`;
