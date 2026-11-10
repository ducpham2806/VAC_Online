-- Test ADR-002: khóa lạc quan + sổ cái atomic + quyền.
INSERT INTO auth.users (id) VALUES ('00000000-0000-0000-0000-0000000000a1') ON CONFLICT DO NOTHING;
DO $$
DECLARE v bigint; n int;
BEGIN
  v := public._commit_farm_state('00000000-0000-0000-0000-0000000000a1', 0, '{"gold":2498}', 1,
        '[{"currency":"GOLD","delta":-2,"balance_after":2498,"reason":"PLANT","ref":"CROP_01"}]');
  IF v <> 1 THEN RAISE EXCEPTION 'tạo mới phải ra version 1, ra %', v; END IF;
  -- tạo lần 2 với expected 0 → xung đột
  v := public._commit_farm_state('00000000-0000-0000-0000-0000000000a1', 0, '{}', 1, '[]');
  IF v IS NOT NULL THEN RAISE EXCEPTION 'tạo trùng phải trả NULL'; END IF;
  -- version cũ → xung đột, KHÔNG ghi sổ cái
  v := public._commit_farm_state('00000000-0000-0000-0000-0000000000a1', 7, '{"gold":1}', 1,
        '[{"currency":"GOLD","delta":-2497,"balance_after":1,"reason":"X","ref":""}]');
  IF v IS NOT NULL THEN RAISE EXCEPTION 'version sai phải trả NULL'; END IF;
  SELECT count(*) INTO n FROM public.ledger; IF n <> 1 THEN RAISE EXCEPTION 'sổ cái phải còn 1 dòng, có %', n; END IF;
  -- version đúng → 2
  v := public._commit_farm_state('00000000-0000-0000-0000-0000000000a1', 1, '{"gold":2506}', 1,
        '[{"currency":"GOLD","delta":8,"balance_after":2506,"reason":"SELL","ref":"CROP_01"}]');
  IF v <> 2 THEN RAISE EXCEPTION 'cập nhật phải ra version 2'; END IF;
  -- số dư âm bị chặn, cả transaction lùi lại
  BEGIN
    PERFORM public._commit_farm_state('00000000-0000-0000-0000-0000000000a1', 2, '{"gold":-1}', 1,
        '[{"currency":"GOLD","delta":-2507,"balance_after":-1,"reason":"X","ref":""}]');
    RAISE EXCEPTION 'số dư âm phải bị chặn';
  EXCEPTION WHEN check_violation THEN NULL; END;
  SELECT version INTO v FROM public.farm_states; IF v <> 2 THEN RAISE EXCEPTION 'state không được đổi khi sổ cái lỗi'; END IF;
END $$;
-- authenticated không gọi được hàm commit, không ghi thẳng bảng
DO $$ BEGIN
  IF has_function_privilege('authenticated', 'public._commit_farm_state(uuid,bigint,jsonb,int,jsonb)', 'EXECUTE') THEN
    RAISE EXCEPTION 'authenticated không được gọi _commit_farm_state'; END IF;
  IF has_table_privilege('authenticated', 'public.farm_states', 'UPDATE') THEN
    RAISE EXCEPTION 'authenticated không được UPDATE farm_states'; END IF;
END $$;
SELECT 'commit.test.sql PASS';
