-- Test migration 0016 (P1-8, QD-89, ADR-002): khóa lạc quan, sổ cái atomic, chặn số dư âm, quyền, nhật ký chơi thử.
-- Dùng tiện ích t.eq / t.expect_error tạo ở farm_core.test.sql (chạy trước).
\set ON_ERROR_STOP 1
\set QUIET 1
\o /dev/null

INSERT INTO auth.users (id) VALUES
  ('00000000-0000-0000-0000-0000000001a1'), ('00000000-0000-0000-0000-0000000001b2')
ON CONFLICT DO NOTHING;

-- 1) Commit: tạo mới → version 1; tạo trùng / version cũ → NULL, không ghi sổ cái; đúng version → 2
SELECT t.eq(public._commit_farm_state('00000000-0000-0000-0000-0000000001a1', 0, '{"gold":2498}', 4,
  '[{"currency":"GOLD","delta":-2,"balance_after":2498,"reason":"PLANT","ref":"CROP_01"}]'), 1::bigint, 'tạo mới ra version 1');
SELECT t.eq(public._commit_farm_state('00000000-0000-0000-0000-0000000001a1', 0, '{}', 4, '[]') IS NULL, true, 'tạo trùng trả NULL');
SELECT t.eq(public._commit_farm_state('00000000-0000-0000-0000-0000000001a1', 7, '{"gold":1}', 4,
  '[{"currency":"GOLD","delta":-2497,"balance_after":1,"reason":"X","ref":""}]') IS NULL, true, 'version cũ trả NULL');
SELECT t.eq((SELECT count(*) FROM public.ledger WHERE user_id = '00000000-0000-0000-0000-0000000001a1'), 1::bigint, 'xung đột không ghi sổ cái');
SELECT t.eq(public._commit_farm_state('00000000-0000-0000-0000-0000000001a1', 1, '{"gold":2506}', 4,
  '[{"currency":"GOLD","delta":8,"balance_after":2506,"reason":"SELL","ref":"CROP_01"}]'), 2::bigint, 'đúng version ra 2');
SELECT t.eq((SELECT schema_version FROM public.farm_states WHERE user_id = '00000000-0000-0000-0000-0000000001a1'), 4, 'lưu schema_version');

-- 2) Số dư âm bị chặn, cả lần ghi lùi lại (state không đổi)
SELECT t.expect_error($$SELECT public._commit_farm_state('00000000-0000-0000-0000-0000000001a1', 2, '{"gold":-1}', 4,
  '[{"currency":"GOLD","delta":-2507,"balance_after":-1,"reason":"X","ref":""}]')$$, '%ledger_balance_after_check%');
SELECT t.eq((SELECT version FROM public.farm_states WHERE user_id = '00000000-0000-0000-0000-0000000001a1'), 2::bigint, 'sổ cái lỗi thì state không đổi');
SELECT t.expect_error($$SELECT public._commit_farm_state('00000000-0000-0000-0000-0000000001a1', 2, '[1]', 4, '[]')$$, '%không hợp lệ%');

-- 3) Quyền: người chơi chỉ đọc dòng của mình; không ghi thẳng bảng, không gọi hàm commit
SELECT t.eq(has_function_privilege('authenticated', 'public._commit_farm_state(uuid,bigint,jsonb,int,jsonb)', 'EXECUTE'), false, 'authenticated không gọi commit');
SELECT t.eq(has_function_privilege('anon', 'public._commit_farm_state(uuid,bigint,jsonb,int,jsonb)', 'EXECUTE'), false, 'anon không gọi commit');
SELECT t.eq(has_table_privilege('authenticated', 'public.farm_states', 'UPDATE'), false, 'không UPDATE farm_states');
SELECT t.eq(has_table_privilege('authenticated', 'public.ledger', 'INSERT'), false, 'không INSERT ledger');
SELECT t.eq(has_table_privilege('anon', 'public.farm_states', 'SELECT'), false, 'anon không đọc farm_states');
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000001b2', false);
SET ROLE authenticated;
SELECT t.eq((SELECT count(*) FROM public.farm_states), 0::bigint, 'B không thấy trạng thái của A');
SELECT t.eq((SELECT count(*) FROM public.ledger), 0::bigint, 'B không thấy sổ cái của A');
RESET ROLE;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000001a1', false);
SET ROLE authenticated;
SELECT t.eq((SELECT count(*) FROM public.farm_states), 1::bigint, 'A thấy trạng thái của mình');
RESET ROLE;

-- 4) Nhật ký chơi thử: thêm dòng của mình được; giả user khác / anon / đọc lại đều bị chặn; dữ liệu sai dạng bị chặn
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000001b2', false);
SET ROLE authenticated;
INSERT INTO public.playtest_events (player, session, t, type, name, value)
VALUES ('p-b2', 1, '2026-11-12 02:00+00', 'SESSION', NULL, NULL),
       ('p-b2', 1, '2026-11-12 02:01+00', 'ACTION', 'PLANT', 3);
SELECT t.expect_error($$INSERT INTO public.playtest_events (user_id, player, session, t, type)
  VALUES ('00000000-0000-0000-0000-0000000001a1', 'x', 1, now(), 'SESSION')$$, '%row-level security%');
SELECT t.expect_error($$INSERT INTO public.playtest_events (player, session, t, type) VALUES ('x', 1, now(), 'HACK')$$, '%check%');
SELECT t.expect_error($$SELECT count(*) FROM public.playtest_events$$, '%permission denied%');
SELECT t.expect_error($$SELECT count(*) FROM public.playtest_logs$$, '%permission denied%');
RESET ROLE;
SET ROLE anon;
SELECT t.expect_error($$INSERT INTO public.playtest_events (player, session, t, type) VALUES ('x', 1, now(), 'SESSION')$$, '%permission denied%');
RESET ROLE;
SELECT t.eq((SELECT user_id FROM public.playtest_events WHERE player = 'p-b2' LIMIT 1), '00000000-0000-0000-0000-0000000001b2'::uuid, 'user_id lấy từ JWT');

-- 5) View gom đúng dạng PlaytestLog
SELECT t.eq((SELECT log->>'player' FROM public.playtest_logs WHERE player = 'p-b2'), 'p-b2', 'view: player');
SELECT t.eq((SELECT jsonb_array_length(log->'events') FROM public.playtest_logs WHERE player = 'p-b2'), 2, 'view: 2 sự kiện');
SELECT t.eq((SELECT log->'events'->1 FROM public.playtest_logs WHERE player = 'p-b2'),
  '{"t":1794448860000,"s":1,"type":"ACTION","name":"PLANT","value":3}'::jsonb, 'view: sự kiện theo ms, bỏ trường rỗng');
SELECT t.eq((SELECT log->'events'->0 ? 'name' FROM public.playtest_logs WHERE player = 'p-b2'), false, 'view: SESSION không có name');

\o
\echo 'p1_state.test.sql: TẤT CẢ PASS'
