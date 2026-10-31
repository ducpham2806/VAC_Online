import { getSupabaseClient } from './supabaseClient';
import { GenderType, RegionType } from '../data/types';

/**
 * Dịch vụ xác thực — Supabase Auth là nguồn xác thực duy nhất (Sprint S0, 17_PROJECT_AUDIT B5).
 *
 * - KHÔNG lưu mật khẩu ở client dưới bất kỳ dạng nào.
 * - Mã OTP khôi phục do Supabase gửi qua email (template "Reset Password" phải có {{ .Token }}).
 * - Chế độ Khách chạy offline được; nếu có Supabase sẽ mở thêm phiên ẩn danh
 *   (Anonymous Sign-in) để có auth.uid() khi dùng Chợ / Lưu bút.
 */

export type AccountType = 'GUEST' | 'REGISTERED';

export interface UserAuthAccount {
  id: string;
  email: string;
  playerName: string;
  accountType: AccountType;
  gender: GenderType;
  region: RegionType;
  createdAt: string;
  isCloudSynced: boolean;
}

export interface AuthActionResult {
  success: boolean;
  message: string;
  account?: UserAuthAccount;
}

const SESSION_STORAGE_KEY = 'vac_online_auth_session_v1';
/** Các key cũ từng lưu mật khẩu/OTP dạng thô — bị xóa khi khởi động. */
export const LEGACY_PASSWORD_STORAGE_KEYS = ['vac_online_auth_users_v1', 'vac_online_auth_otp_v1'] as const;

const MIN_PASSWORD_LENGTH = 6;
const SERVER_UNAVAILABLE_MESSAGE =
  '⚠️ Máy chủ đăng nhập chưa sẵn sàng. Bạn có thể bấm [Chơi Khách] để vào ruộng ngay!';

function sanitizeText(raw: string): string {
  return raw.replace(/[<>]/g, '').trim();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function asGender(value: unknown): GenderType {
  return value === 'MALE' ? 'MALE' : 'FEMALE';
}

function asRegion(value: unknown): RegionType {
  return value === 'CENTRAL' || value === 'SOUTH' ? value : 'NORTH';
}

/** Xóa dữ liệu đăng nhập cũ có chứa mật khẩu thô (vault + OTP) khỏi localStorage. */
export function purgeLegacyLocalAuthData(): void {
  if (typeof window === 'undefined') return;
  try {
    for (const key of LEGACY_PASSWORD_STORAGE_KEYS) localStorage.removeItem(key);
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw && raw.includes('passwordHash')) {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      delete parsed.passwordHash;
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(parsed));
    }
  } catch {
    // Bỏ qua lỗi storage (chế độ riêng tư, hết dung lượng...)
  }
}

purgeLegacyLocalAuthData();

export function getSavedAuthSession(): UserAuthAccount | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<UserAuthAccount> & { passwordHash?: unknown };
    if (!parsed.id || !parsed.playerName) return null;
    return {
      id: String(parsed.id),
      email: String(parsed.email ?? ''),
      playerName: String(parsed.playerName),
      accountType: parsed.accountType === 'REGISTERED' ? 'REGISTERED' : 'GUEST',
      gender: asGender(parsed.gender),
      region: asRegion(parsed.region),
      createdAt: String(parsed.createdAt ?? new Date().toISOString()),
      isCloudSynced: Boolean(parsed.isCloudSynced),
    };
  } catch {
    return null;
  }
}

export function saveAuthSession(account: UserAuthAccount | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!account) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } else {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(account));
    }
  } catch {
    // Bỏ qua lỗi storage
  }
}

interface SupabaseUserLike {
  id: string;
  email?: string;
  created_at: string;
  user_metadata?: Record<string, unknown>;
}

function accountFromSupabaseUser(
  user: SupabaseUserLike,
  fallbackName: string,
  fallbackGender: GenderType,
  fallbackRegion: RegionType
): UserAuthAccount {
  const meta = user.user_metadata ?? {};
  const email = user.email ?? '';
  return {
    id: user.id,
    email,
    playerName:
      sanitizeText(typeof meta.player_name === 'string' ? meta.player_name : '') ||
      fallbackName ||
      email.split('@')[0] ||
      'Điền Chủ',
    accountType: 'REGISTERED',
    gender: meta.gender === undefined ? fallbackGender : asGender(meta.gender),
    region: meta.region === undefined ? fallbackRegion : asRegion(meta.region),
    createdAt: user.created_at,
    isCloudSynced: true,
  };
}

/**
 * 1. Đăng Ký Tài Khoản Mới (Supabase Auth)
 */
export async function registerNewAccount(
  playerName: string,
  email: string,
  password: string,
  confirmPassword: string,
  gender: GenderType = 'FEMALE',
  region: RegionType = 'NORTH'
): Promise<AuthActionResult> {
  const cleanName = sanitizeText(playerName) || 'Điền Chủ Mới';
  const cleanEmail = sanitizeText(email).toLowerCase();

  if (!isValidEmail(cleanEmail)) {
    return { success: false, message: '⚠️ Vui lòng nhập địa chỉ Email hợp lệ (ví dụ: nongdan@vaconline.vn)!' };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { success: false, message: '⚠️ Mật khẩu bảo vệ nông trại phải có ít nhất 6 ký tự!' };
  }
  if (password !== confirmPassword) {
    return { success: false, message: '⚠️ Mật khẩu xác nhận không khớp với mật khẩu đã nhập!' };
  }

  const sb = getSupabaseClient();
  if (!sb) return { success: false, message: SERVER_UNAVAILABLE_MESSAGE };

  try {
    const { data, error } = await sb.auth.signUp({
      email: cleanEmail,
      password,
      options: { data: { player_name: cleanName, gender, region } },
    });
    if (error) return { success: false, message: `⚠️ Không thể đăng ký: ${error.message}` };
    if (!data.user) return { success: false, message: '⚠️ Không thể đăng ký lúc này, vui lòng thử lại!' };
    if (!data.session) {
      return {
        success: false,
        message: `📩 Đã gửi email xác nhận tới [${cleanEmail}]. Hãy mở email, bấm xác nhận rồi quay lại tab Đăng Nhập nhé!`,
      };
    }
    const account = accountFromSupabaseUser(data.user, cleanName, gender, region);
    saveAuthSession(account);
    return {
      success: true,
      account,
      message: `🎉 Đăng ký tài khoản [${account.playerName}] thành công! Tặng ngay +500 🪙 Xu Vàng Khởi Nghiệp & mở Sổ Đăng Ký Quê Hương 3 Miền!`,
    };
  } catch {
    return { success: false, message: '⚠️ Mất kết nối máy chủ, vui lòng thử lại hoặc Chơi Khách!' };
  }
}

/**
 * 2. Đăng Nhập bằng Email + Mật khẩu (Supabase Auth)
 */
export async function loginWithCredentials(
  email: string,
  password: string,
  rememberMe = true
): Promise<AuthActionResult> {
  const cleanEmail = sanitizeText(email).toLowerCase();
  if (!cleanEmail || !password) {
    return { success: false, message: '⚠️ Vui lòng nhập đầy đủ Email và Mật khẩu!' };
  }
  if (!isValidEmail(cleanEmail)) {
    return { success: false, message: '⚠️ Vui lòng đăng nhập bằng địa chỉ Email đã đăng ký!' };
  }

  const sb = getSupabaseClient();
  if (!sb) return { success: false, message: SERVER_UNAVAILABLE_MESSAGE };

  try {
    const { data, error } = await sb.auth.signInWithPassword({ email: cleanEmail, password });
    if (error || !data.user) {
      return { success: false, message: '❌ Sai Email hoặc Mật khẩu!' };
    }
    const account = accountFromSupabaseUser(data.user, '', 'FEMALE', 'NORTH');
    if (rememberMe) saveAuthSession(account);
    return {
      success: true,
      account,
      message: `🌾 Chào mừng Điền chủ [${account.playerName}] trở về quê hương!`,
    };
  } catch {
    return { success: false, message: '⚠️ Mất kết nối máy chủ, vui lòng thử lại hoặc Chơi Khách!' };
  }
}

/**
 * 3. Chơi Khách 1 Chạm (offline được, không mật khẩu). Gọi thêm ensureCloudGuestSession()
 *    để có phiên ẩn danh trên Supabase khi máy chủ sẵn sàng.
 */
export function createGuestSession(customGuestName?: string): AuthActionResult {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const guestName = sanitizeText(customGuestName || '') || `Khách Làng Quê #${randomSuffix}`;

  const guestAccount: UserAuthAccount = {
    id: `GUEST_${randomSuffix}`,
    email: '',
    playerName: guestName,
    accountType: 'GUEST',
    gender: 'FEMALE',
    region: 'NORTH',
    createdAt: new Date().toISOString(),
    isCloudSynced: false,
  };

  saveAuthSession(guestAccount);
  return {
    success: true,
    account: guestAccount,
    message: `⚡ Đang vào nhanh bằng chế độ Khách [${guestName}]! Bạn có thể bấm [🔗 Liên Kết Tài Khoản +50💎] trên thanh HUD bất kỳ lúc nào để bảo vệ trang trại!`,
  };
}

/** Mở phiên ẩn danh Supabase cho Khách (cần bật Anonymous Sign-ins trên dashboard). */
export async function ensureCloudGuestSession(guestName: string): Promise<boolean> {
  const sb = getSupabaseClient();
  if (!sb) return false;
  try {
    const { data: existing } = await sb.auth.getSession();
    if (existing.session) return true;
    const { error } = await sb.auth.signInAnonymously({
      options: { data: { player_name: sanitizeText(guestName) } },
    });
    return !error;
  } catch {
    return false;
  }
}

/**
 * 4. Liên Kết Tài Khoản Khách lên Chính thức. Nếu Khách đang có phiên ẩn danh Supabase thì gắn
 *    email/mật khẩu vào chính user đó (giữ nguyên auth.uid()); nếu không thì đăng ký mới.
 */
export async function upgradeGuestToRegistered(
  currentGuestName: string,
  email: string,
  password: string,
  newPlayerName?: string,
  gender: GenderType = 'FEMALE',
  region: RegionType = 'NORTH'
): Promise<AuthActionResult> {
  const cleanEmail = sanitizeText(email).toLowerCase();
  const cleanName = sanitizeText(newPlayerName || currentGuestName) || 'Điền Chủ Chính Thức';

  if (!isValidEmail(cleanEmail)) {
    return { success: false, message: '⚠️ Vui lòng nhập Email hợp lệ để liên kết bảo hộ trang trại!' };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { success: false, message: '⚠️ Mật khẩu liên kết phải có từ 6 ký tự trở lên!' };
  }

  const sb = getSupabaseClient();
  if (!sb) return { success: false, message: SERVER_UNAVAILABLE_MESSAGE };

  try {
    const { data: sessionData } = await sb.auth.getSession();
    const isAnonymous = Boolean(sessionData.session?.user.is_anonymous);

    if (isAnonymous) {
      const { data, error } = await sb.auth.updateUser({
        email: cleanEmail,
        password,
        data: { player_name: cleanName, gender, region },
      });
      if (error || !data.user) {
        return { success: false, message: `⚠️ Không thể liên kết: ${error?.message ?? 'thử lại sau'}` };
      }
      const account = { ...accountFromSupabaseUser(data.user, cleanName, gender, region), email: cleanEmail };
      saveAuthSession(account);
      return {
        success: true,
        account,
        message: `🛡️ LIÊN KẾT THÀNH CÔNG! Hãy mở email [${cleanEmail}] để xác nhận. Nhận thưởng nóng +50 💎 Ngọc & +1,000 🪙 Xu Vàng!`,
      };
    }

    const signUp = await registerNewAccount(cleanName, cleanEmail, password, password, gender, region);
    if (!signUp.success || !signUp.account) return signUp;
    return {
      success: true,
      account: signUp.account,
      message: `🛡️ LIÊN KẾT THÀNH CÔNG! Trang trại của [${cleanName}] đã được bảo hộ! Nhận thưởng nóng +50 💎 Ngọc & +1,000 🪙 Xu Vàng!`,
    };
  } catch {
    return { success: false, message: '⚠️ Mất kết nối máy chủ, vui lòng thử lại!' };
  }
}

/**
 * 5. Quên Mật Khẩu — Bước 1: Supabase gửi Mã Khôi Phục OTP 6 số qua email.
 */
export async function requestPasswordReset(email: string): Promise<AuthActionResult> {
  const cleanEmail = sanitizeText(email).toLowerCase();
  if (!isValidEmail(cleanEmail)) {
    return { success: false, message: '⚠️ Vui lòng nhập đúng địa chỉ Email đã đăng ký tài khoản!' };
  }

  const sb = getSupabaseClient();
  if (!sb) return { success: false, message: SERVER_UNAVAILABLE_MESSAGE };

  try {
    const { error } = await sb.auth.resetPasswordForEmail(cleanEmail);
    if (error) return { success: false, message: `⚠️ Không gửi được mã: ${error.message}` };
  } catch {
    return { success: false, message: '⚠️ Mất kết nối máy chủ, vui lòng thử lại!' };
  }

  // Không tiết lộ email có tồn tại hay không.
  return {
    success: true,
    message: `📩 Nếu [${cleanEmail}] đã đăng ký, Mã Khôi Phục OTP 6 số vừa được gửi vào hộp thư. Mã có hiệu lực trong thời gian ngắn!`,
  };
}

/**
 * 6. Quên Mật Khẩu — Bước 2: Xác nhận OTP với Supabase và đặt mật khẩu mới.
 */
export async function confirmPasswordResetWithOtp(
  email: string,
  otpInput: string,
  newPassword: string
): Promise<AuthActionResult> {
  const cleanEmail = sanitizeText(email).toLowerCase();
  const token = otpInput.trim();
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return { success: false, message: '⚠️ Mật khẩu mới phải có ít nhất 6 ký tự!' };
  }
  if (!isValidEmail(cleanEmail) || !/^\d{6}$/.test(token)) {
    return { success: false, message: '❌ Mã xác thực OTP 6 số không chính xác hoặc đã hết hạn!' };
  }

  const sb = getSupabaseClient();
  if (!sb) return { success: false, message: SERVER_UNAVAILABLE_MESSAGE };

  try {
    const { data, error } = await sb.auth.verifyOtp({ email: cleanEmail, token, type: 'recovery' });
    if (error || !data.user) {
      return { success: false, message: '❌ Mã xác thực OTP 6 số không chính xác hoặc đã hết hạn!' };
    }
    const { data: updated, error: updateError } = await sb.auth.updateUser({ password: newPassword });
    if (updateError || !updated.user) {
      return { success: false, message: `⚠️ Không đặt được mật khẩu mới: ${updateError?.message ?? 'thử lại sau'}` };
    }
    const account = accountFromSupabaseUser(updated.user, '', 'FEMALE', 'NORTH');
    saveAuthSession(account);
    return {
      success: true,
      account,
      message: `✅ Đã đặt lại mật khẩu mới thành công cho tài khoản [${cleanEmail}]! Tự động đăng nhập vào nông trại...`,
    };
  } catch {
    return { success: false, message: '⚠️ Mất kết nối máy chủ, vui lòng thử lại!' };
  }
}
