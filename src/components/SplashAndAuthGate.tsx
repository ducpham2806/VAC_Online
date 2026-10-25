import React, { useEffect, useState } from 'react';
import {
  confirmPasswordResetWithOtp,
  createGuestSession,
  loginWithCredentials,
  registerNewAccount,
  requestPasswordReset,
  upgradeGuestToRegistered,
  UserAuthAccount,
} from '../services/authService';
import { useGameStore } from '../store/useGameStore';
import { soundFX } from '../services/soundEffects';

export type AuthTabMode = 'LOGIN' | 'REGISTER' | 'GUEST' | 'FORGOT';

interface SplashAndAuthGateProps {
  mode: 'SPLASH' | 'AUTH_MODAL';
  initialTab?: AuthTabMode;
  onFinishSplash: () => void;
  onAuthSuccess: (account: UserAuthAccount, isNewSignupOrGuest: boolean, isGuestUpgrade: boolean) => void;
  onCloseModal?: () => void;
}

const FOLK_PROVERBS = [
  '💡 Ca dao: "Chuồn chuồn bay thấp thì mưa, bay cao thì nắng, bay vừa thì râm" — Trời Mưa Rào tự động tưới ướt 100% ô ruộng!',
  '💡 Mẹo Nhà Nông: Tưới nước Giếng Làng giảm ngay 15% thời gian chín hoàn toàn miễn phí ⚡ Năng lượng!',
  '💡 Tuần hoàn VAC: Thu đủ 10 mẻ cá dưới Ao rồi bấm Vét Bùn Ao sẽ nhận 3 Xô Bùn Phù Sa kích nổ Nông sản Hoàng Kim ⭐ (x3 giá)!',
  '💡 Lán Thợ Đồng Quê: Khi Độ No của 6 Nhân công giảm dưới 35%, họ sẽ tự đi bộ về Bàn Ăn Lán Thợ ăn cơm hồi 100% sức!',
];

const LOADING_STEPS = [
  { pct: 22, label: 'Bước 1/4: Khởi tạo Phaser 3 WebGL & Bộ Pixel Art Atlas 64 Màu...' },
  { pct: 52, label: 'Bước 2/4: Nạp Đại Từ Điển 155 Thực Thể Vườn – Ao – Chuồng 3 Miền...' },
  { pct: 80, label: 'Bước 3/4: Kết nối Supabase Cloud & Kênh Loa Phường Làng Xóm...' },
  { pct: 100, label: 'Bước 4/4: Kiểm tra Sổ Định Danh & Đồng bộ Điền Trang...' },
];

export const SplashAndAuthGate: React.FC<SplashAndAuthGateProps> = ({
  mode,
  initialTab = 'LOGIN',
  onFinishSplash,
  onAuthSuccess,
  onCloseModal,
}) => {
  const { playerName, gender, region, accountType, userEmail } = useGameStore();

  // State cho Splash & Loading 4 bước
  const [progress, setProgress] = useState(8);
  const [stepText, setStepText] = useState(LOADING_STEPS[0].label);
  const [proverbIdx, setProverbIdx] = useState(0);

  // State cho Auth Gate 4 Tabs
  const [activeTab, setActiveTab] = useState<AuthTabMode>(initialTab);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [showPass, setShowPass] = useState(false);

  // Form Đăng Nhập
  const [loginId, setLoginId] = useState('tuhau@vaconline.vn');
  const [loginPassword, setLoginPassword] = useState('123456');
  const [rememberMe, setRememberMe] = useState(true);

  // Form Đăng Ký Mới / Liên Kết Khách
  const [regName, setRegName] = useState('Tư Hậu Lập Nghiệp');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  // Form Chơi Khách
  const [guestCustomName, setGuestCustomName] = useState('');

  // Form Quên Mật Khẩu OTP 2 Bước
  const [forgotEmail, setForgotEmail] = useState('tuhau@vaconline.vn');
  const [otpSentCode, setOtpSentCode] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [newResetPassword, setNewResetPassword] = useState('');

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (mode !== 'SPLASH') return;
    let idx = 0;
    const timer = window.setInterval(() => {
      if (idx < LOADING_STEPS.length) {
        setProgress(LOADING_STEPS[idx].pct);
        setStepText(LOADING_STEPS[idx].label);
        setProverbIdx((prev) => (prev + 1) % FOLK_PROVERBS.length);
        idx++;
      } else {
        clearInterval(timer);
        setTimeout(() => onFinishSplash(), 350);
      }
    }, 480);
    return () => clearInterval(timer);
  }, [mode, onFinishSplash]);

  // 1. MÀN HÌNH 0A: SPLASH SCREEN & MULTI-STAGE PRELOADER
  if (mode === 'SPLASH') {
    return (
      <div className="fixed inset-0 z-[100] bg-gradient-to-b from-[#1b4332] via-[#2d6a4f] to-[#3e2413] flex flex-col justify-between p-4 sm:p-6 text-[#fff8eb] select-none overflow-hidden">
        {/* Trang trí nền trời & Cổng làng */}
        <div className="flex justify-between items-center text-xs sm:text-sm font-extrabold">
          <span className="bg-[#3e2413]/90 border-2 border-[#f5b82e] px-3 py-1 rounded-full text-[#f5b82e]">
            🌾 VAC ONLINE — HƯƠNG ĐỒNG GIÓ NỘI
          </span>
          <button
            onClick={onFinishSplash}
            className="touch-btn bg-[#f5b82e] text-[#2a180c] font-extrabold px-3 py-1 rounded-full text-xs cursor-pointer shadow-lg"
          >
            ⚡ Bỏ qua chờ ➔
          </button>
        </div>

        {/* Cụm Logo & Biểu tượng 3 Miền trung tâm */}
        <div className="my-auto max-w-2xl w-full mx-auto bg-[#fff8eb] text-[#2a180c] border-4 border-[#6e4121] rounded-3xl p-4 sm:p-6 shadow-2xl text-center space-y-3">
          <div className="text-3xl sm:text-5xl">⛩️ 🌾 🐃 🚂 🐕 🪷</div>
          <h1 className="text-xl sm:text-3xl font-black text-[#b83224] tracking-wide">
            VAC ONLINE — NÔNG TRẠI BA MIỀN
          </h1>
          <p className="text-xs sm:text-sm font-bold text-[#6e4121]">
            Vườn – Ao – Chuồng Tuần Hoàn • 155 Thực Thể Bản Địa • 6 Gia Nhân Lán Thợ • Chợ Phiên &amp; Hái Trộm
          </p>

          <div className="flex flex-wrap justify-center gap-2 text-[11px] font-extrabold">
            <span className="bg-[#ffd1dc] text-[#7a1c33] border border-[#d96b87] px-2.5 py-0.5 rounded-full">
              🎋 Bắc Bộ: Đất Phù Sa Cổ (-10% t/g Cây)
            </span>
            <span className="bg-[#e2d4ff] text-[#432371] border border-[#8e6bc4] px-2.5 py-0.5 rounded-full">
              ⛰️ Trung Bộ: Nắng Gió (-10% t/g Xưởng)
            </span>
            <span className="bg-[#d4f8d4] text-[#1b5e20] border border-[#5cb85c] px-2.5 py-0.5 rounded-full">
              🥥 Nam Bộ: Mùa Nước Nổi (+1 Thủy sản Ao)
            </span>
          </div>

          {/* Thanh Loading 4 bước */}
          <div className="pt-2 space-y-1.5 text-left">
            <div className="flex justify-between items-center text-xs font-extrabold text-[#3e2413]">
              <span>⏳ {stepText}</span>
              <span className="text-[#b83224] text-sm">{progress}%</span>
            </div>
            <div className="w-full h-4 bg-[#e0d4c0] border-2 border-[#6e4121] rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#4e8222] via-[#8fd14f] to-[#f5b82e] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Hộp Ca dao & Mẹo nhà nông */}
          <div className="bg-[#fff3e0] border-2 border-[#c88a4b] rounded-xl p-2.5 text-xs text-[#3b210e] font-semibold">
            {FOLK_PROVERBS[proverbIdx]}
          </div>
        </div>

        <div className="flex justify-between items-center text-[11px] text-[#ffe8c2]/90 font-bold">
          <span>Phiên bản: v2.0 Complete Edition (Mobile Landscape PWA &amp; CapacitorJS)</span>
          <span>☁️ Máy chủ: Supabase Realtime Cloud</span>
        </div>
      </div>
    );
  }

  // 2. MÀN HÌNH 0B: CỔNG LÀNG XÁC THỰC (ĐĂNG NHẬP / ĐĂNG KÝ / CHƠI KHÁCH / QUÊN MẬT KHẨU)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await loginWithCredentials(loginId, loginPassword, rememberMe);
    if (!res.success || !res.account) {
      setFeedback({ type: 'err', text: res.message });
      return;
    }
    soundFX.playCelebrationGong();
    setFeedback({ type: 'ok', text: res.message });
    onAuthSuccess(res.account, false, false);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await registerNewAccount(
      regName,
      regEmail,
      regPassword,
      regConfirm,
      gender,
      region
    );
    if (!res.success || !res.account) {
      setFeedback({ type: 'err', text: res.message });
      return;
    }
    soundFX.playCelebrationGong();
    setFeedback({ type: 'ok', text: res.message });
    onAuthSuccess(res.account, true, false);
  };

  const handlePlayGuest = () => {
    const res = createGuestSession(guestCustomName);
    if (res.account) {
      soundFX.playHarvestCoin();
      onAuthSuccess(res.account, true, false);
    }
  };

  const handleBindGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await upgradeGuestToRegistered(
      playerName,
      regEmail,
      regPassword,
      regName || playerName,
      gender,
      region
    );
    if (!res.success || !res.account) {
      setFeedback({ type: 'err', text: res.message });
      return;
    }
    soundFX.playCelebrationGong();
    setFeedback({ type: 'ok', text: res.message });
    onAuthSuccess(res.account, false, true);
  };

  const handleSendOtp = async () => {
    const res = await requestPasswordReset(forgotEmail);
    if (!res.success) {
      setFeedback({ type: 'err', text: res.message });
      return;
    }
    setOtpSentCode(res.otpCode ?? null);
    setOtpInput(res.otpCode ?? '');
    setFeedback({ type: 'ok', text: res.message });
  };

  const handleConfirmResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const res = confirmPasswordResetWithOtp(forgotEmail, otpInput, newResetPassword);
    if (!res.success || !res.account) {
      setFeedback({ type: 'err', text: res.message });
      return;
    }
    soundFX.playCelebrationGong();
    setFeedback({ type: 'ok', text: res.message });
    onAuthSuccess(res.account, false, false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-4xl w-full max-h-[92dvh] overflow-y-auto p-3 sm:p-5 shadow-2xl text-xs space-y-3">
        {/* Tiêu đề Cổng Làng Xác Thực */}
        <div className="bg-[#6e4121] text-[#f5b82e] px-3.5 py-2.5 rounded-xl font-extrabold flex flex-wrap justify-between items-center gap-2 text-xs sm:text-sm">
          <span>⛩️ CỔNG LÀNG VAC ONLINE — ĐĂNG NHẬP, ĐĂNG KÝ, CHƠI KHÁCH &amp; BẢO HỘ TÀI KHOẢN</span>
          <div className="flex items-center gap-2">
            {onCloseModal && (
              <button
                onClick={onCloseModal}
                className="touch-btn bg-[#b83224] text-white px-3 py-1 rounded-lg text-xs cursor-pointer"
              >
                ✕ Đóng &amp; Vào Ruộng
              </button>
            )}
          </div>
        </div>

        {/* Thanh 4 Tabs Chức Năng Xác Thực */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          <button
            onClick={() => {
              setActiveTab('LOGIN');
              setFeedback(null);
            }}
            className={`touch-btn py-2 rounded-xl font-extrabold cursor-pointer border-2 ${
              activeTab === 'LOGIN'
                ? 'bg-[#f5b82e] border-[#b83224] text-[#2a180c]'
                : 'bg-white border-[#c88a4b] text-[#3e2413]'
            }`}
          >
            🔑 1. Đăng Nhập
          </button>
          <button
            onClick={() => {
              setActiveTab('REGISTER');
              setFeedback(null);
            }}
            className={`touch-btn py-2 rounded-xl font-extrabold cursor-pointer border-2 ${
              activeTab === 'REGISTER'
                ? 'bg-[#f5b82e] border-[#b83224] text-[#2a180c]'
                : 'bg-white border-[#c88a4b] text-[#3e2413]'
            }`}
          >
            📝 2. Đăng Ký Mới (+500🪙)
          </button>
          <button
            onClick={() => {
              setActiveTab('GUEST');
              setFeedback(null);
            }}
            className={`touch-btn py-2 rounded-xl font-extrabold cursor-pointer border-2 ${
              activeTab === 'GUEST'
                ? 'bg-[#f5b82e] border-[#b83224] text-[#2a180c]'
                : 'bg-white border-[#c88a4b] text-[#3e2413]'
            }`}
          >
            ⚡ 3. Chơi Khách / Liên Kết (+50💎)
          </button>
          <button
            onClick={() => {
              setActiveTab('FORGOT');
              setFeedback(null);
            }}
            className={`touch-btn py-2 rounded-xl font-extrabold cursor-pointer border-2 ${
              activeTab === 'FORGOT'
                ? 'bg-[#f5b82e] border-[#b83224] text-[#2a180c]'
                : 'bg-white border-[#c88a4b] text-[#3e2413]'
            }`}
          >
            🔓 4. Quên Mật Khẩu (OTP)
          </button>
        </div>

        {/* Hộp Thông Báo Kết Quả / Lỗi */}
        {feedback && (
          <div
            className={`p-2.5 rounded-xl font-extrabold border-2 ${
              feedback.type === 'ok'
                ? 'bg-[#e8f5e9] border-[#2e7d32] text-[#1b5e20]'
                : 'bg-[#ffebee] border-[#c62828] text-[#b71c1c]'
            }`}
          >
            {feedback.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Cột Trái: Thông tin tài khoản hiện tại & Đặc quyền */}
          <div className="md:col-span-5 bg-[#fff3e0] border-2 border-[#c88a4b] rounded-xl p-3 flex flex-col justify-between space-y-2.5">
            <div className="space-y-2">
              <div className="font-extrabold text-[#b83224] text-sm">
                🌾 SỔ ĐỊNH DANH ĐIỀN CHỦ BA MIỀN
              </div>
              <div className="bg-white border border-[#c88a4b] rounded-lg p-2.5 space-y-1">
                <div>
                  👤 <b>Điền chủ hiện tại:</b> {playerName}
                </div>
                <div>
                  🏷️ <b>Loại tài khoản:</b>{' '}
                  {accountType === 'GUEST' ? (
                    <span className="bg-[#ff9800] text-white px-2 py-0.5 rounded font-bold">
                      👤 Tài Khoản Khách (Lưu Tạm)
                    </span>
                  ) : (
                    <span className="bg-[#4e8222] text-white px-2 py-0.5 rounded font-bold">
                      🛡️ Chính Thức ({userEmail})
                    </span>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-[#3e2413] space-y-1">
                <div className="font-extrabold text-[#6e4121]">
                  🎁 ĐẶC QUYỀN BẢO HỘ TÀI KHOẢN:
                </div>
                <div>• <b>Đăng ký mới:</b> Nhận ngay <b>+500 🪙 Xu Vàng</b> &amp; chọn Quê hương Bắc – Trung – Nam.</div>
                <div>• <b>Chơi Khách 1 chạm:</b> Vào thẳng trang trại không cần mật khẩu.</div>
                <div>• <b>Liên kết Khách ➔ Chính thức:</b> Giữ nguyên 100% Vàng, Ngọc, Ruộng vườn &amp; thưởng nóng <b>+50 💎 Ngọc + 1,000 🪙</b>!</div>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlayGuest}
              className="touch-btn w-full bg-[#2e8b8d] border-2 border-[#80deea] text-white font-extrabold py-2 rounded-xl cursor-pointer"
            >
              ⚡ Vào Chơi Khách Nhanh (1 Chạm Không Cần MK) ➔
            </button>
          </div>

          {/* Cột Phải: Biểu mẫu theo từng Tab */}
          <div className="md:col-span-7 bg-white border-2 border-[#c88a4b] rounded-xl p-3.5">
            {/* TAB 1: ĐĂNG NHẬP */}
            {activeTab === 'LOGIN' && (
              <form onSubmit={handleLoginSubmit} className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-[#3e2413] text-sm">
                    🔑 ĐĂNG NHẬP VÀO ĐIỀN TRANG
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginId('tuhau@vaconline.vn');
                      setLoginPassword('123456');
                      setFeedback({
                        type: 'ok',
                        text: '✨ Đã điền sẵn Tài khoản Mẫu (tuhau@vaconline.vn / 123456)!',
                      });
                    }}
                    className="text-[11px] bg-[#f3e5ab] border border-[#c88a4b] px-2 py-0.5 rounded font-bold text-[#6e4121] cursor-pointer"
                  >
                    ⚡ Điền TK Mẫu
                  </button>
                </div>

                <div>
                  <label className="font-bold block mb-1">
                    📧 Email hoặc Tên Điền Chủ:
                  </label>
                  <input
                    type="text"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="tuhau@vaconline.vn"
                    className="w-full border-2 border-[#c88a4b] rounded-lg px-3 py-1.5 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">🔒 Mật khẩu:</label>
                  <div className="flex gap-1.5">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••"
                      className="flex-1 border-2 border-[#c88a4b] rounded-lg px-3 py-1.5 font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="touch-btn bg-[#fff3e0] border border-[#c88a4b] px-3 rounded-lg font-bold cursor-pointer"
                    >
                      {showPass ? '🙈 Ẩn' : '👁️ Hiện'}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Ghi nhớ phiên đăng nhập trên máy này
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('FORGOT')}
                    className="text-[#b83224] font-extrabold underline cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <button
                  type="submit"
                  className="touch-btn w-full bg-[#4e8222] text-white font-extrabold py-2.5 rounded-xl cursor-pointer text-sm"
                >
                  🔑 ĐĂNG NHẬP VÀO NÔNG TRẠI NGAY ➔
                </button>
              </form>
            )}

            {/* TAB 2: ĐĂNG KÝ TÀI KHOẢN MỚI */}
            {activeTab === 'REGISTER' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-2">
                <h4 className="font-extrabold text-[#3e2413] text-sm">
                  📝 ĐĂNG KÝ TÀI KHOẢN ĐIỀN CHỦ MỚI (+500 🪙 LỘC KHỞI NGHIỆP)
                </h4>

                <div>
                  <label className="font-bold block mb-0.5">👤 Họ Tên Điền Chủ:</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ví dụ: Tư Hậu Lập Nghiệp"
                    className="w-full border-2 border-[#c88a4b] rounded-lg px-3 py-1.5 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-0.5">📧 Địa chỉ Email bảo hộ:</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="nongdan@vaconline.vn"
                    className="w-full border-2 border-[#c88a4b] rounded-lg px-3 py-1.5 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold block mb-0.5">
                      🔒 Mật khẩu (&gt;= 6 ký tự):
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Ít nhất 6 ký tự"
                      className="w-full border-2 border-[#c88a4b] rounded-lg px-3 py-1.5 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-0.5">
                      🔒 Nhập lại mật khẩu:
                    </label>
                    <input
                      type="password"
                      value={regConfirm}
                      onChange={(e) => setRegConfirm(e.target.value)}
                      placeholder="Nhập khớp mật khẩu"
                      className="w-full border-2 border-[#c88a4b] rounded-lg px-3 py-1.5 font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="touch-btn w-full bg-[#b83224] text-white font-extrabold py-2.5 rounded-xl cursor-pointer text-sm mt-1"
                >
                  📝 ĐĂNG KÝ &amp; CHỌN QUÊ HƯƠNG 3 MIỀN (+500 🪙) ➔
                </button>
              </form>
            )}

            {/* TAB 3: CHƠI KHÁCH & LIÊN KẾT TÀI KHOẢN KHÁCH LÊN CHÍNH THỨC */}
            {activeTab === 'GUEST' && (
              <div className="space-y-3">
                <div className="bg-[#e0f2f1] border-2 border-[#0f766e] rounded-xl p-2.5 space-y-2">
                  <div className="font-extrabold text-[#0f766e]">
                    ⚡ CÁCH 1: VÀO CHƠI KHÁCH NGAY (KHÔNG CẦN EMAIL / MẬT KHẨU)
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={guestCustomName}
                      onChange={(e) => setGuestCustomName(e.target.value)}
                      placeholder="Đặt tên Khách (Tùy chọn, VD: Út Nhỏ Miền Tây)..."
                      className="flex-1 border border-[#0f766e] rounded-lg px-2.5 py-1 bg-white"
                    />
                    <button
                      type="button"
                      onClick={handlePlayGuest}
                      className="touch-btn bg-[#0f766e] text-white font-extrabold px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      🏃 Vào Chơi Khách
                    </button>
                  </div>
                </div>

                <form
                  onSubmit={handleBindGuestSubmit}
                  className="bg-[#fff8eb] border-2 border-[#f5b82e] rounded-xl p-2.5 space-y-2"
                >
                  <div className="font-extrabold text-[#b83224]">
                    🔗 CÁCH 2: LIÊN KẾT TÀI KHOẢN KHÁCH LÊN CHÍNH THỨC (NHẬN +50 💎 &amp; +1,000 🪙)
                  </div>
                  <p className="text-[11px] text-[#664930]">
                    Giữ nguyên 100% Xu Vàng, Ngọc, Cấp độ &amp; 12 ô Vườn – Ao – Chuồng hiện tại của bạn và đồng bộ lên Supabase Cloud!
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="Nhập Email liên kết bảo hộ..."
                      className="border-2 border-[#c88a4b] rounded-lg px-2.5 py-1.5 bg-white font-semibold"
                    />
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Tạo mật khẩu mới (>= 6 ký tự)"
                      className="border-2 border-[#c88a4b] rounded-lg px-2.5 py-1.5 bg-white font-semibold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="touch-btn w-full bg-[#f5b82e] text-[#2a180c] font-extrabold py-2 rounded-xl cursor-pointer"
                  >
                    🛡️ XÁC NHẬN LIÊN KẾT BẢO HỘ &amp; NHẬN +50 💎 NGỌC
                  </button>
                </form>
              </div>
            )}

            {/* TAB 4: QUÊN MẬT KHẨU & KHÔI PHỤC OTP 2 BƯỚC */}
            {activeTab === 'FORGOT' && (
              <div className="space-y-2.5">
                <h4 className="font-extrabold text-[#3e2413] text-sm">
                  🔓 KHÔI PHỤC MẬT KHẨU BẰNG MÃ OTP (2 BƯỚC AN TOÀN)
                </h4>

                <div className="bg-[#fff3e0] border border-[#c88a4b] rounded-xl p-2.5 space-y-2">
                  <label className="font-bold block">
                    Bước 1: Nhập Email tài khoản cần khôi phục:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="tuhau@vaconline.vn"
                      className="flex-1 border-2 border-[#c88a4b] rounded-lg px-3 py-1.5 bg-white font-semibold"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="touch-btn bg-[#2e8b8d] text-white font-extrabold px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      📩 Gửi Mã OTP 6 Số
                    </button>
                  </div>
                  {otpSentCode && (
                    <div className="text-[11px] text-[#1b5e20] font-extrabold bg-[#e8f5e9] px-2.5 py-1 rounded border border-[#4e8222]">
                      📬 Hệ thống đã cấp Mã OTP khôi phục: <span className="underline">{otpSentCode}</span>
                    </div>
                  )}
                </div>

                <form
                  onSubmit={handleConfirmResetPassword}
                  className="bg-white border border-[#c88a4b] rounded-xl p-2.5 space-y-2"
                >
                  <label className="font-bold block">
                    Bước 2: Nhập Mã OTP 6 Số &amp; Đặt Mật Khẩu Mới:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="Nhập mã OTP 6 số..."
                      className="border-2 border-[#c88a4b] rounded-lg px-3 py-1.5 font-mono font-bold"
                    />
                    <input
                      type="password"
                      value={newResetPassword}
                      onChange={(e) => setNewResetPassword(e.target.value)}
                      placeholder="Mật khẩu mới (>= 6 ký tự)"
                      className="border-2 border-[#c88a4b] rounded-lg px-3 py-1.5 font-semibold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="touch-btn w-full bg-[#4e8222] text-white font-extrabold py-2 rounded-xl cursor-pointer"
                  >
                    🔄 XÁC NHẬN ĐẶT LẠI MẬT KHẨU &amp; ĐĂNG NHẬP
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
