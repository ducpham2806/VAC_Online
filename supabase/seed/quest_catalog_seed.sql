-- =============================================================================
-- FILE SINH TỰ ĐỘNG — KHÔNG SỬA TAY. Nguồn: src/data/quests.ts (STORY_QUESTS)
-- Sinh lại bằng: npm run seed:catalog
-- Chạy trong Supabase SQL Editor SAU migration 0004. Idempotent (ON CONFLICT DO UPDATE).
-- =============================================================================

INSERT INTO public.quest_catalog (id, chapter_no, unlock_stage, min_level, reward_gold, reward_gems, title)
VALUES
  ('Q_CH1', 1, 1, 1, 600, 15, 'Chương 1 (Lv.1): Bức Thư Trong Chiếc Tráp Gỗ Lim'),
  ('Q_CH2', 2, 1, 3, 900, 20, 'Chương 2 (Lv.3): Mùi Khói Bếp Của Mẹ & Bí Mật Đáy Ao'),
  ('Q_CH3', 3, 2, 6, 1200, 25, 'Chương 3 (Lv.6): Chuyến Xe Hợp Tác Xã & Đêm Mưa Giông'),
  ('Q_CH4', 4, 3, 9, 1500, 30, 'Chương 4 (Lv.9): Bóng Đêm Rình Rập & Chó Phú Quốc'),
  ('Q_CH5', 5, 3, 12, 2000, 35, 'Chương 5 (Lv.12): Tiếng Còi Tàu Thống Nhất Bắc – Nam'),
  ('Q_CH6', 6, 2, 14, 2500, 40, 'Chương 6 (Lv.14): Lán Thợ Đồng Quê & Giọt Mồ Hôi Chú Tư'),
  ('Q_CH7', 7, 2, 16, 3200, 45, 'Chương 7 (Lv.16): Bí Truyền Khung Cửi Lụa & Áo Mới'),
  ('Q_CH8', 8, 4, 18, 4000, 50, 'Chương 8 (Lv.18): Hạt Giống Ngũ Sắc Trong Rừng Trúc Cổ'),
  ('Q_CH9', 9, 4, 22, 6000, 60, 'Chương 9 (Lv.22): Đại Tiệc Tiến Vua Cảm Hóa Bá Kiến'),
  ('Q_CH10', 10, 5, 25, 10000, 100, 'Chương 10 (Lv.25+): Trầu Cau Nên Duyên & Gia Bảo Truyền Đời')
ON CONFLICT (id) DO UPDATE SET
  chapter_no = EXCLUDED.chapter_no,
  unlock_stage = EXCLUDED.unlock_stage,
  min_level = EXCLUDED.min_level,
  reward_gold = EXCLUDED.reward_gold,
  reward_gems = EXCLUDED.reward_gems,
  title = EXCLUDED.title;
