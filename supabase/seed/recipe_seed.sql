-- =============================================================================
-- FILE SINH TỰ ĐỘNG — KHÔNG SỬA TAY. Nguồn: src/data/masterData.ts (machineId, recipe)
-- Sinh lại bằng: npm run seed:catalog
-- Chạy trong Supabase SQL Editor SAU migration 0009 và master_catalog_seed.sql.
-- Idempotent: UPDATE + INSERT ... ON CONFLICT DO UPDATE — không xóa dòng nào.
-- Số món có công thức: 16
-- =============================================================================

UPDATE public.master_catalog AS m
SET machine_id = v.machine_id, updated_at = NOW()
FROM (VALUES
  ('PROD_01', 'MAC_02'),
  ('PROD_02', 'MAC_02'),
  ('PROD_03', 'MAC_02'),
  ('PROD_04', 'MAC_02'),
  ('PROD_05', 'MAC_03'),
  ('PROD_06', 'MAC_03'),
  ('PROD_07', 'MAC_03'),
  ('PROD_08', 'MAC_02'),
  ('PROD_09', 'MAC_04'),
  ('PROD_10', 'MAC_04'),
  ('PROD_11', 'MAC_04'),
  ('PROD_12', 'MAC_02'),
  ('PROD_N01', 'MAC_03'),
  ('PROD_C01', 'MAC_04'),
  ('CRAFT_01', 'MAC_07'),
  ('CRAFT_02', 'MAC_08')
) AS v(id, machine_id)
WHERE m.id = v.id;

INSERT INTO public.recipe_ingredients (product_id, item_id, qty)
VALUES
  ('PROD_01', 'CROP_01', 3),
  ('PROD_02', 'CROP_06', 1),
  ('PROD_02', 'CROP_03', 1),
  ('PROD_02', 'CROP_04', 1),
  ('PROD_03', 'AQUA_01', 1),
  ('PROD_03', 'CROP_05', 2),
  ('PROD_03', 'CROP_04', 1),
  ('PROD_04', 'AQUA_02', 1),
  ('PROD_04', 'CROP_11', 1),
  ('PROD_04', 'CROP_09', 1),
  ('PROD_05', 'CROP_07', 3),
  ('PROD_06', 'CROP_01', 2),
  ('PROD_06', 'CROP_18', 1),
  ('PROD_06', 'CROP_06', 1),
  ('PROD_07', 'CROP_01', 2),
  ('PROD_07', 'ANI_05', 1),
  ('PROD_07', 'CROP_04', 1),
  ('PROD_08', 'CROP_16', 1),
  ('PROD_08', 'AQUA_02', 1),
  ('PROD_08', 'CROP_04', 1),
  ('PROD_09', 'CROP_09', 2),
  ('PROD_10', 'CROP_07', 2),
  ('PROD_10', 'CROP_03', 1),
  ('PROD_10', 'CROP_09', 1),
  ('PROD_11', 'CROP_N02', 1),
  ('PROD_11', 'CROP_10', 1),
  ('PROD_11', 'CROP_09', 1),
  ('PROD_12', 'AQUA_03', 1),
  ('PROD_12', 'CROP_11', 1),
  ('PROD_N01', 'CROP_15', 2),
  ('PROD_N01', 'CROP_19', 1),
  ('PROD_C01', 'CROP_C05', 1),
  ('PROD_C01', 'ANI_07', 1),
  ('PROD_C01', 'CROP_09', 1),
  ('CRAFT_01', 'CROP_24', 1),
  ('CRAFT_01', 'CROP_19', 1),
  ('CRAFT_02', 'ANI_06', 1),
  ('CRAFT_02', 'CROP_17', 1)
ON CONFLICT (product_id, item_id) DO UPDATE SET qty = EXCLUDED.qty;
