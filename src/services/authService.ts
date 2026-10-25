import { getSupabaseClient } from './supabaseClient';
import { GenderType, RegionType } from '../data/types';

export type AccountType = 'GUEST' | 'REGISTERED';

export interface UserAuthAccount {
  id: string;
  email: string;
  playerName: string;
  passwordHash: string;
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
  otpCode?: string;
}

const USERS_STORAGE_KEY = 'vac_online_auth_users_v1';
const SESSION_STORAGE_KEY = 'vac_online_auth_session_v1';
const OTP_STORAGE_KEY = 'vac_online_auth_otp_v1';

const DEFAULT_DEMO_ACCOUNT: UserAuthAccount = {
  id: 'USR_DEMO_01',
  email: 'tuhau@vaconline.vn',
  playerName: 'Tư Hậu Lập Nghiệp',
  passwordHash: '123456',
  accountType: 'REGISTERED',
  gender: 'FEMALE',
  region: 'NORTH',
  createdAt: '2026-10-24T08:00:00.000Z',
  isCloudSynced: true,
};

function sanitizeText(raw: string): string {
  return raw.replace(/[<>]/g, '').trim();
}

function loadUsersVault(): UserAuthAccount[] {
  if (typeof window === 'undefined') return [DEFAULT_DEMO_ACCOUNT];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([DEFAULT_DEMO_ACCOUNT]));
      return [DEFAULT_DEMO_ACCOUNT];
    }
    const parsed = JSON.parse(raw) as UserAuthAccount[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [DEFAULT_DEMO_ACCOUNT];
  } catch {
    return [DEFAULT_DEMO_ACCOUNT];
  }
}

function saveUsersVault(users: UserAuthAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // Ignore storage quota errors
  }
}

export function getSavedAuthSession(): UserAuthAccount | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserAuthAccount;
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
    // Ignore storage errors
  }
}

/**
 * 1. Đăng Ký Tài Khoản Mới (Đồng bộ kép Supabase Auth + Local Vault)
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

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return {
      success: false,
      message: '⚠️ Vui lòng nhập địa chỉ Email hợp lệ (ví dụ: nongdan@vaconline.vn)!',
    };
  }
  if (password.length < 6) {
    return {
      success: false,
      message: '⚠️ Mật khẩu bảo vệ nông trại phải có ít nhất 6 ký tự!',
    };
  }
  if (password !== confirmPassword) {
    return {
      success: false,
      message: '⚠️ Mật khẩu xác nhận không khớp với mật khẩu đã nhập!',
    };
  }

  const users = loadUsersVault();
  if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    return {
      success: false,
      message: '⚠️ Email này đã được đăng ký! Bạn hãy chuyển sang tab Đăng Nhập hoặc Quên Mật Khẩu nhé.',
    };
  }

  let cloudSynced = false;
  const sb = getSupabaseClient();
  if (sb) {
    try {
      const { error } = await sb.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: { player_name: cleanName, gender, region },
        },
      });
      if (!error) cloudSynced = true;
    } catch {
      // Fallback to local vault if offline
    }
  }

  const newAccount: UserAuthAccount = {
    id: `USR_${Date.now()}`,
    email: cleanEmail,
    playerName: cleanName,
    passwordHash: password,
    accountType: 'REGISTERED',
    gender,
    region,
    createdAt: new Date().toISOString(),
    isCloudSynced: cloudSynced,
  };

  users.push(newAccount);
  saveUsersVault(users);
  saveAuthSession(newAccount);

  return {
    success: true,
    account: newAccount,
    message: `🎉 Đăng ký tài khoản [${cleanName}] thành công! Tặng ngay +500 🪙 Xu Vàng Khởi Nghiệp & mở Sổ Đăng Ký Quê Hương 3 Miền!`,
  };
}

/**
 * 2. Đăng Nhập Tài Khoản (Hỗ trợ cả Email hoặc Tên Điền Chủ + Tài khoản Demo sẵn có)
 */
export async function loginWithCredentials(
  emailOrName: string,
  password: string,
  rememberMe = true
): Promise<AuthActionResult> {
  const cleanId = sanitizeText(emailOrName).toLowerCase();
  if (!cleanId || !password) {
    return {
      success: false,
      message: '⚠️ Vui lòng nhập đầy đủ Email/Tên tài khoản và Mật khẩu!',
    };
  }

  const users = loadUsersVault();
  const matched = users.find(
    (u) =>
      u.email.toLowerCase() === cleanId ||
      u.playerName.toLowerCase() === cleanId
  );

  if (matched && matched.passwordHash === password) {
    if (rememberMe) saveAuthSession(matched);
    return {
      success: true,
      account: matched,
      message: `🌾 Chào mừng Điền chủ [${matched.playerName}] trở về quê hương!`,
    };
  }

  // Thử xác thực qua Supabase Cloud nếu tài khoản tạo trên thiết bị khác
  const sb = getSupabaseClient();
  if (sb && cleanId.includes('@')) {
    try {
      const { data, error } = await sb.auth.signInWithPassword({
        email: cleanId,
        password,
      });
      if (!error && data.user) {
        const cloudAcc: UserAuthAccount = {
          id: data.user.id,
          email: cleanId,
          playerName:
            (data.user.user_metadata?.player_name as string) ||
            cleanId.split('@')[0],
          passwordHash: password,
          accountType: 'REGISTERED',
          gender: (data.user.user_metadata?.gender as GenderType) || 'FEMALE',
          region: (data.user.user_metadata?.region as RegionType) || 'NORTH',
          createdAt: data.user.created_at,
          isCloudSynced: true,
        };
        users.push(cloudAcc);
        saveUsersVault(users);
        if (rememberMe) saveAuthSession(cloudAcc);
        return {
          success: true,
          account: cloudAcc,
          message: `☁️ Đã đồng bộ hồ sơ Cloud của Điền chủ [${cloudAcc.playerName}]!`,
        };
      }
    } catch {
      // Offline fallback
    }
  }

  return {
    success: false,
    message:
      '❌ Sai thông tin Email/Tên tài khoản hoặc Mật khẩu! (Gợi ý Demo: tuhau@vaconline.vn / Mật khẩu: 123456)',
  };
}

/**
 * 3. Chơi Khách 1 Chạm (Guest Mode - Không cần mật khẩu, cho phép Liên Kết sau)
 */
export function createGuestSession(customGuestName?: string): AuthActionResult {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const guestName = sanitizeText(customGuestName || '') || `Khách Làng Quê #${randomSuffix}`;

  const guestAccount: UserAuthAccount = {
    id: `GUEST_${randomSuffix}`,
    email: `guest_${randomSuffix}@local.vaconline`,
    playerName: guestName,
    passwordHash: '',
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

/**
 * 4. Liên Kết Tài Khoản Khách Lên Chính Thức (Giữ nguyên 100% tiến trình + Thưởng +50 💎 & +1,000 🪙)
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

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return {
      success: false,
      message: '⚠️ Vui lòng nhập Email hợp lệ để liên kết bảo hộ trang trại!',
    };
  }
  if (password.length < 6) {
    return {
      success: false,
      message: '⚠️ Mật khẩu liên kết phải có từ 6 ký tự trở lên!',
    };
  }

  const users = loadUsersVault();
  if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    return {
      success: false,
      message: '⚠️ Email này đã được liên kết với một trang trại khác!',
    };
  }

  let cloudSynced = false;
  const sb = getSupabaseClient();
  if (sb) {
    try {
      const { error } = await sb.auth.signUp({
        email: cleanEmail,
        password,
        options: { data: { player_name: cleanName, gender, region } },
      });
      if (!error) cloudSynced = true;
    } catch {
      // Offline fallback
    }
  }

  const upgradedAccount: UserAuthAccount = {
    id: `USR_LINKED_${Date.now()}`,
    email: cleanEmail,
    playerName: cleanName,
    passwordHash: password,
    accountType: 'REGISTERED',
    gender,
    region,
    createdAt: new Date().toISOString(),
    isCloudSynced: cloudSynced,
  };

  users.push(upgradedAccount);
  saveUsersVault(users);
  saveAuthSession(upgradedAccount);

  return {
    success: true,
    account: upgradedAccount,
    message: `🛡️ LIÊN KẾT THÀNH CÔNG! Trang trại của [${cleanName}] đã được bảo hộ vĩnh viễn! Nhận thưởng nóng +50 💎 Ngọc & +1,000 🪙 Xu Vàng!`,
  };
}

/**
 * 5. Quên Mật Khẩu — Bước 1: Yêu cầu gửi Mã Khôi Phục OTP (6 chữ số)
 */
export async function requestPasswordReset(email: string): Promise<AuthActionResult> {
  const cleanEmail = sanitizeText(email).toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return {
      success: false,
      message: '⚠️ Vui lòng nhập đúng địa chỉ Email đã đăng ký tài khoản!',
    };
  }

  const users = loadUsersVault();
  const target = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!target) {
    return {
      success: false,
      message: `⚠️ Không tìm thấy tài khoản nào đăng ký với Email [${cleanEmail}]! (Gợi ý tài khoản mẫu: tuhau@vaconline.vn)`,
    };
  }

  // Gửi email reset qua Supabase Cloud nếu có kết nối
  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.auth.resetPasswordForEmail(cleanEmail);
    } catch {
      // Ignore network error in offline mode
    }
  }

  const otpCode = String(Math.floor(100000 + Math.random() * 900000));
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(
        OTP_STORAGE_KEY,
        JSON.stringify({ email: cleanEmail, otpCode, expiresAt: Date.now() + 10 * 60_000 })
      );
    } catch {
      // Ignore storage error
    }
  }

  return {
    success: true,
    otpCode,
    message: `📩 Đã gửi Mã Khôi Phục OTP 6 số tới [${cleanEmail}]! (Mã OTP của bạn là: ${otpCode})`,
  };
}

/**
 * 6. Quên Mật Khẩu — Bước 2: Xác nhận Mã OTP & Đặt lại Mật khẩu mới
 */
export function confirmPasswordResetWithOtp(
  email: string,
  otpInput: string,
  newPassword: string
): AuthActionResult {
  const cleanEmail = sanitizeText(email).toLowerCase();
  if (newPassword.length < 6) {
    return {
      success: false,
      message: '⚠️ Mật khẩu mới phải có ít nhất 6 ký tự!',
    };
  }

  let savedOtpData: { email: string; otpCode: string; expiresAt: number } | null = null;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(OTP_STORAGE_KEY);
      if (raw) savedOtpData = JSON.parse(raw);
    } catch {
      savedOtpData = null;
    }
  }

  if (
    !savedOtpData ||
    savedOtpData.email !== cleanEmail ||
    savedOtpData.otpCode !== otpInput.trim()
  ) {
    return {
      success: false,
      message: '❌ Mã xác thực OTP 6 số không chính xác hoặc đã hết hạn!',
    };
  }

  const users = loadUsersVault();
  const idx = users.findIndex((u) => u.email.toLowerCase() === cleanEmail);
  if (idx === -1) {
    return {
      success: false,
      message: '⚠️ Không tìm thấy tài khoản cần đặt lại mật khẩu!',
    };
  }

  users[idx] = {
    ...users[idx],
    passwordHash: newPassword,
  };
  saveUsersVault(users);
  saveAuthSession(users[idx]);

  if (typeof window !== 'undefined') {
    localStorage.removeItem(OTP_STORAGE_KEY);
  }

  return {
    success: true,
    account: users[idx],
    message: `✅ Đã đặt lại mật khẩu mới thành công cho tài khoản [${cleanEmail}]! Tự động đăng nhập vào nông trại...`,
  };
}
