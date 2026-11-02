-- =============================================================================
-- HƯƠNG ĐỒNG GIÓ NỘI (VAC ONLINE)
-- 0005_advisor_fixes.sql — xử lý cảnh báo Supabase Security Advisor sau khi chạy 0003/0004
-- (2026-11-01). Additive-only, chạy lại an toàn, không có lệnh DROP.
-- =============================================================================

-- 1. [ERROR security_definer_view] public_profile_cards chạy với quyền người tạo view nên
--    bỏ qua RLS và đọc được hồ sơ của mọi người. Chuyển sang security_invoker: view tôn trọng
--    RLS của người gọi (hiện chỉ thấy hồ sơ của chính mình). Client chưa dùng view này;
--    danh sách công khai cho tính năng xã hội (S3) sẽ làm bằng RPC riêng.
ALTER VIEW public.public_profile_cards SET (security_invoker = true);

-- 2. [WARN] handle_new_user() là hàm trigger, không được gọi qua API.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
