import { describe, expect, it } from 'vitest';
import {
  confirmPasswordResetWithOtp,
  createGuestSession,
  getSavedAuthSession,
  loginWithCredentials,
  registerNewAccount,
  requestPasswordReset,
} from './authService';
import { supabase } from './supabaseClient';

describe('authService (không có Supabase trong môi trường test)', () => {
  it('test chạy ở chế độ offline', () => {
    expect(supabase).toBeNull();
  });

  it('kiểm tra đầu vào trước khi gọi máy chủ', async () => {
    expect((await registerNewAccount('A', 'sai-email', '123456', '123456')).success).toBe(false);
    expect((await registerNewAccount('A', 'a@b.vn', '123', '123')).success).toBe(false);
    expect((await registerNewAccount('A', 'a@b.vn', '123456', '654321')).success).toBe(false);
    expect((await confirmPasswordResetWithOtp('a@b.vn', 'abc', '123456')).success).toBe(false);
  });

  it('không có máy chủ thì không đăng nhập/đăng ký được (không còn kho mật khẩu cục bộ)', async () => {
    expect((await loginWithCredentials('tuhau@vaconline.vn', '123456')).success).toBe(false);
    expect((await registerNewAccount('A', 'a@b.vn', '123456', '123456')).success).toBe(false);
    const reset = await requestPasswordReset('a@b.vn');
    expect(reset.success).toBe(false);
    expect(JSON.stringify(reset)).not.toMatch(/\d{6}/);
  });

  it('Chơi Khách chạy offline và phiên lưu không chứa mật khẩu', () => {
    const res = createGuestSession('<b>Út</b>');
    expect(res.success).toBe(true);
    expect(res.account?.playerName).toBe('bÚt/b');
    const saved = getSavedAuthSession();
    expect(saved?.accountType).toBe('GUEST');
    expect(JSON.stringify(localStorage)).not.toContain('passwordHash');
  });
});
