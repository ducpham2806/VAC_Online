import type { Season } from './types';

/**
 * Nội dung bản thử P1 (LT-03, P1-9, QD-86): 8 loài Bắc Bộ, hai mùa chính Xuân + Thu.
 * Mã lấy nguyên từ `GAME_CATALOG`, không thêm số mới; luật gieo vẫn theo cấp, Đợt, miền, mùa (GP-61, GP-20).
 */
export const SLICE_CROPS: readonly string[] = ['CROP_01', 'CROP_02', 'CROP_03', 'CROP_04', 'CROP_05'];
export const SLICE_LIVESTOCK: readonly string[] = ['ANI_01', 'ANI_03'];
export const SLICE_AQUA: readonly string[] = ['AQUA_01'];
export const SLICE_SPECIES: readonly string[] = [...SLICE_CROPS, ...SLICE_LIVESTOCK, ...SLICE_AQUA];

/** Hai món của Bếp Củi trong bản thử: Cơm Trắng, Canh Cải Cá Rô Đồng. */
export const SLICE_RECIPES: readonly string[] = ['PROD_01', 'PROD_03'];

/** Hai mùa trọng tâm của bản thử; lịch thật vẫn chạy đủ 4 mùa (KT-17). */
export const SLICE_SEASONS: readonly Season[] = ['XUAN', 'THU'];
