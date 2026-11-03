-- =============================================================================
-- FILE SINH TỰ ĐỘNG — KHÔNG SỬA TAY. Nguồn: src/data/quests.ts (STORY_QUESTS)
-- Sinh lại bằng: npm run seed:catalog
-- Chạy trong Supabase SQL Editor SAU migration 0007 (cột objectives). Idempotent (ON CONFLICT DO UPDATE).
-- =============================================================================

INSERT INTO public.quest_catalog (id, chapter_no, unlock_stage, min_level, reward_gold, reward_gems, title, objectives)
VALUES
  ('Q_CH1', 1, 1, 1, 600, 15, 'Chương 1 (Lv.1): Bức Thư Trong Chiếc Tráp Gỗ Lim', '[{"counter":"WATER","target":1,"label":"💧 Tưới nước Giếng Làng"},{"counter":"HARVEST:CROP_01","target":1,"label":"🌾 Thu hoạch Lúa Nước"}]'::jsonb),
  ('Q_CH2', 2, 1, 3, 900, 20, 'Chương 2 (Lv.3): Mùi Khói Bếp Của Mẹ & Bí Mật Đáy Ao', '[{"counter":"DREDGE","target":1,"label":"🪣 Vét bùn đáy ao"},{"counter":"APPLY_MUD","target":1,"label":"🟫 Bón bùn phù sa cho 1 ô"}]'::jsonb),
  ('Q_CH3', 3, 2, 9, 1200, 25, 'Chương 3 (Lv.9): Chuyến Xe Hợp Tác Xã & Đêm Mưa Giông', '[{"counter":"BUILD:MAC_02","target":1,"label":"🍲 Xây Bếp Củi Quê Mẹ"},{"counter":"COOK","target":1,"label":"🍚 Nấu xong 1 món ở Bếp Quê"}]'::jsonb),
  ('Q_CH4', 4, 3, 9, 1500, 30, 'Chương 4 (Lv.9): Bóng Đêm Rình Rập & Chó Phú Quốc', '[]'::jsonb),
  ('Q_CH5', 5, 3, 12, 2000, 35, 'Chương 5 (Lv.12): Tiếng Còi Tàu Thống Nhất Bắc – Nam', '[]'::jsonb),
  ('Q_CH6', 6, 2, 13, 2500, 40, 'Chương 6 (Lv.13): Lán Thợ Đồng Quê & Giọt Mồ Hôi Chú Tư', '[{"counter":"HIRE:WORK_01","target":1,"label":"👨‍🌾 Thuê Chú Tư Cày"},{"counter":"SERVE_MEAL","target":1,"label":"🍚 Dọn 1 món lên Bàn Ăn Chung"}]'::jsonb),
  ('Q_CH7', 7, 2, 15, 3200, 45, 'Chương 7 (Lv.15): Bí Truyền Khung Cửi Lụa & Áo Mới', '[{"counter":"EQUIP_GEAR","target":1,"label":"👕 Cấp 1 đồ bảo hộ cho thợ"}]'::jsonb),
  ('Q_CH8', 8, 4, 18, 4000, 50, 'Chương 8 (Lv.18): Hạt Giống Ngũ Sắc Trong Rừng Trúc Cổ', '[]'::jsonb),
  ('Q_CH9', 9, 4, 22, 6000, 60, 'Chương 9 (Lv.22): Đại Tiệc Tiến Vua Cảm Hóa Bá Kiến', '[]'::jsonb),
  ('Q_CH10', 10, 5, 25, 10000, 100, 'Chương 10 (Lv.25+): Trầu Cau Nên Duyên & Gia Bảo Truyền Đời', '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  chapter_no = EXCLUDED.chapter_no,
  unlock_stage = EXCLUDED.unlock_stage,
  min_level = EXCLUDED.min_level,
  reward_gold = EXCLUDED.reward_gold,
  reward_gems = EXCLUDED.reward_gems,
  title = EXCLUDED.title,
  objectives = EXCLUDED.objectives;
