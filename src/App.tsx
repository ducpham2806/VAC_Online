import React, { useEffect, useState } from 'react';
import { PhaserGame } from './game/PhaserGame';
import { EventBus } from './game/EventBus';
import { useGameStore } from './store/useGameStore';
import { GAME_CATALOG, REGION_INFO } from './data/masterData';
import { GenderType, HiredWorkerState, RegionType } from './data/types';
import {
  getSupabaseCredentials,
  isSupabaseConfigured,
  saveSupabaseCredentials,
} from './services/supabaseClient';

export const App: React.FC = () => {
  const {
    playerName,
    gender,
    region,
    level,
    gold,
    gems,
    stamina,
    maxStamina,
    styleScore,
    fengShuiScore,
    neighborPoints,
    workerPantryCount,
    pondMudCounter,
    wildPlotsUnlocked,
    weather,
    dinhLangStage,
    mutantPityCount,
    activeTotemBuff,
    luckyPacketsLeft,
    rookieDaysClaimed,
    lotteryTickets,
    toastMessage,
    activeModal,
    visitingFriendName,
    selectedSeedId,
    inventory,
    workers,
    marketListings,
    coopOrders,
    storyQuests,
    chatMessages,
    setToast,
    setActiveModal,
    setProfile,
    setSelectedSeed,
    cycleWeather,
    dredgePondMud,
    expandWildLand,
    deliverCoopOrder,
    claimStoryQuest,
    claimRookieDayReward,
    claimWorkerPantry,
    feedWorker,
    equipWorkerGear,
    payWorkerSalary,
    giveWorkerBonus,
    cookRandomDish,
    prayAtTotem,
    contributeDinhLang,
    breedMutantCrop,
    sellToTraderBoom,
    runBambooExpedition,
    playNightMarketMinigame,
    buyMarketAndVisit,
    attemptStealFromFriend,
    helpFriendAfterStorm,
    returnHomeFarm,
    claimLoaPhuongLucky,
    tearBlocCalendar,
    smashClayPotGacha,
    buyLotteryTicket,
    sendChatMessage,
    fastForwardTime,
  } = useGameStore();

  const [selectedWorkerCode, setSelectedWorkerCode] = useState<HiredWorkerState['code']>('WORK_01');
  const [cookingPot, setCookingPot] = useState<string[]>([
    '🐟 Cá Trắm Đen [Bắc]',
    '🌶️ Hồ Tiêu [Trung]',
    '🥥 Nước Dừa Xiêm [Nam]',
  ]);
  const [chatInput, setChatInput] = useState('');
  const [tempName, setTempName] = useState(playerName);
  const [tempGender, setTempGender] = useState<GenderType>(gender);
  const [tempRegion, setTempRegion] = useState<RegionType>(region);

  const [isSeedDrawerOpen, setIsSeedDrawerOpen] = useState(true);
  const [isPortraitMobile, setIsPortraitMobile] = useState(false);
  const [dismissPortraitWarning, setDismissPortraitWarning] = useState(false);

  const initialCreds = getSupabaseCredentials();
  const [sbUrl, setSbUrl] = useState(initialCreds.url);
  const [sbKey, setSbKey] = useState(initialCreds.anonKey);

  useEffect(() => {
    const checkOrientation = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setIsPortraitMobile(h > w && w < 768);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  const toggleFullScreenPWA = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        if ('orientation' in screen && typeof (screen.orientation as unknown as { lock?: (o: string) => Promise<void> }).lock === 'function') {
          await (screen.orientation as unknown as { lock: (o: string) => Promise<void> }).lock('landscape').catch(() => {});
        }
        setToast('⛶ Đã bật chế độ Toàn Màn Hình Ngang (Mobile PWA / iPad Fullscreen)!');
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setToast('📱 Mẹo iOS/iPadOS: Bấm nút "Chia sẻ" -> "Thêm vào Màn hình chính" (Add to Home Screen) để chơi Fullscreen!');
    }
  };

  const plantableCatalog = GAME_CATALOG.filter(
    (c) =>
      c.category === 'CROP' ||
      c.category === 'TREE' ||
      c.category === 'AQUA' ||
      c.category === 'MUTANT_CROP'
  );
  const currentWorker = workers.find((w) => w.code === selectedWorkerCode) ?? workers[0];
  const selectedSeedObj = plantableCatalog.find((s) => s.id === selectedSeedId) ?? plantableCatalog[0];

  const weatherBadge =
    weather === 'SUNNY'
      ? '☀️ Nắng Vàng'
      : weather === 'RAINY'
      ? '🌧️ Mưa Rào (Tự tưới 100%)'
      : '🌙 Đêm Đom Đóm';

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* 0. LỚP NỀN ENGINE PHASER 3 FULL-SCREEN (100dvw x 100dvh) */}
      <PhaserGame />

      {/* MÀN HÌNH NHẮC XOAY NGANG THÔNG MINH CHO MOBILE */}
      {isPortraitMobile && !dismissPortraitWarning && (
        <div className="fixed inset-0 bg-[#1a120c]/95 z-50 flex flex-col items-center justify-center p-6 text-center text-[#fff8eb]">
          <div className="text-6xl mb-3 animate-bounce">📱🔄</div>
          <h2 className="text-lg font-extrabold text-[#f5b82e] mb-2">
            XOAY NGANG ĐIỆN THOẠI ĐỂ NGẮM TRỌN CÁNH ĐỒNG BA MIỀN!
          </h2>
          <p className="text-xs text-[#ffe8c2] max-w-xs mb-5 leading-relaxed">
            Giao diện <b>Hương Đồng Gió Nội</b> được thiết kế tối ưu theo chiều ngang (2-Thumb Landscape) cho Mobile PWA, iOS, Android &amp; iPad.
          </p>
          <div className="flex flex-col gap-2.5 w-full max-w-xs">
            <button
              onClick={toggleFullScreenPWA}
              className="touch-btn bg-[#4e8222] border-2 border-[#b8f272] text-white font-extrabold px-4 py-2.5 rounded-xl cursor-pointer"
            >
              ⛶ Bật Toàn Màn Hình &amp; Khóa Ngang
            </button>
            <button
              onClick={() => setDismissPortraitWarning(true)}
              className="touch-btn bg-[#6e4121] border border-[#c88a4b] text-[#fff8eb] font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
            >
              Vẫn tiếp tục ở màn hình dọc ➔
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 1. FLOATING TOP HUD BAR (GỌN GÀNG, TRÁNH TAI THỎ / DYNAMIC ISLAND)  */}
      {/* =================================================================== */}
      <header className="fixed top-0 left-0 right-0 z-20 safe-top safe-left safe-right pointer-events-none flex flex-wrap items-center justify-between gap-1.5 px-2 py-1">
        {/* Cụm Trái: Hồ sơ Điền chủ + Năng lượng ⚡ + Thời tiết */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#321b0d]/92 border-2 border-[#c88a4b] rounded-full px-2.5 py-1 text-[#fff8eb] shadow-lg backdrop-blur-xs">
          <button
            onClick={() => setActiveModal('REGISTER')}
            className="touch-btn bg-[#c88a4b] text-[#2a180c] font-extrabold px-2.5 py-0.5 rounded-full text-xs cursor-pointer"
          >
            {gender === 'FEMALE' ? '👧' : '👦'} {playerName} (Lv.{level}) • {REGION_INFO[region].shortName}
          </button>
          <span className="text-xs font-extrabold text-[#b8f272] px-1">
            ⚡ {stamina}/{maxStamina}
          </span>
          <button
            onClick={cycleWeather}
            className="touch-btn bg-[#2e8b8d] text-white text-[11px] font-bold px-2 py-0.5 rounded-full cursor-pointer"
            title="Bấm thử đổi Thời tiết 3 miền"
          >
            {weatherBadge}
          </button>
        </div>

        {/* Cụm Giữa: Loa Phường Toàn Server + Xin Vía */}
        <div className="pointer-events-auto bg-gradient-to-r from-[#8b1e1e]/95 to-[#b82828]/95 border-2 border-[#f5b82e] px-3 py-1 rounded-full text-[11px] md:text-xs text-white flex items-center gap-2 shadow-lg">
          <span className="truncate max-w-[170px] sm:max-w-[270px] md:max-w-none">
            📢 <b>LOA:</b> [Minh Râu] trúng Độc Đắc 18h nhận 50,000 🪙!
          </span>
          <button
            onClick={claimLoaPhuongLucky}
            className="touch-btn bg-[#f5b82e] text-[#2a180c] font-extrabold px-2 py-0.5 rounded-full text-[11px] cursor-pointer shrink-0"
          >
            🧧 Xin Vía ({luckyPacketsLeft})
          </button>
        </div>

        {/* Cụm Phải: Vàng, Ngọc, Tua x60, Fullscreen PWA & Supabase */}
        <div className="pointer-events-auto flex items-center gap-1 bg-[#321b0d]/92 border-2 border-[#c88a4b] rounded-full px-2 py-1 text-[#fff8eb] shadow-lg">
          <span className="bg-[#3e2723] border border-[#f5b82e] px-2 py-0.5 rounded-full text-xs font-extrabold">
            🪙 {gold.toLocaleString()}
          </span>
          <span className="bg-[#1a3a3a] border border-[#4dd0e1] px-2 py-0.5 rounded-full text-xs font-extrabold">
            💎 {gems}
          </span>
          <button
            onClick={fastForwardTime}
            className="touch-btn bg-[#b83224] border border-[#ffeb3b] text-white text-[11px] font-bold px-2 py-0.5 rounded-full cursor-pointer"
            title="Tua nhanh x60"
          >
            ⏩ x60
          </button>
          <button
            onClick={toggleFullScreenPWA}
            className="touch-btn bg-[#4e8222] text-white text-[11px] font-bold px-2 py-0.5 rounded-full cursor-pointer"
            title="Toàn màn hình Mobile PWA / iPad"
          >
            ⛶
          </button>
          <button
            onClick={() => setActiveModal('SUPABASE_CONFIG')}
            className="touch-btn bg-[#2e8b8d] text-white text-[11px] font-bold px-2 py-0.5 rounded-full cursor-pointer"
          >
            🔌 {isSupabaseConfigured ? 'Online' : 'Supabase'}
          </button>
        </div>
      </header>

      {/* =================================================================== */}
      {/* 2. VÙNG NGÓN CÁI TRÁI (KHAY HẠT GIỐNG + GIỎ THỢ + VÉT AO + KHAI HOANG) */}
      {/* =================================================================== */}
      <aside className="fixed left-0 top-14 z-20 safe-left pointer-events-none flex flex-col gap-1.5">
        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setIsSeedDrawerOpen(!isSeedDrawerOpen)}
            className="touch-btn bg-[#321b0d]/95 border-2 border-[#f5b82e] text-[#fff8eb] font-extrabold px-3 py-1 rounded-r-xl text-xs shadow-lg cursor-pointer"
          >
            🌱 Giống: {selectedSeedObj.emoji} {selectedSeedObj.name} {isSeedDrawerOpen ? '◀' : '▶'}
          </button>

          <button
            onClick={claimWorkerPantry}
            className="touch-btn bg-[#f5b82e] border-2 border-[#6e4121] text-[#2a180c] font-extrabold px-2.5 py-1 rounded-xl text-xs shadow-lg cursor-pointer"
          >
            🧺 Giỏ Thợ: {workerPantryCount}/120
          </button>

          <button
            onClick={dredgePondMud}
            className="touch-btn bg-[#2e8b8d] border-2 border-[#80deea] text-white font-extrabold px-2.5 py-1 rounded-xl text-xs shadow-lg cursor-pointer"
          >
            🪣 Vét Bùn Ao ({pondMudCounter}/10 • -3⚡) [Kho: {inventory.ITEM_BUN_PHU_SA ?? 0}]
          </button>

          <button
            onClick={expandWildLand}
            className="touch-btn bg-[#6e4121] border-2 border-[#c88a4b] text-[#fff8eb] font-bold px-2.5 py-1 rounded-xl text-xs shadow-lg cursor-pointer"
          >
            🪓 Khai Hoang ({wildPlotsUnlocked}/25 • -5⚡)
          </button>

          {visitingFriendName && (
            <button
              onClick={returnHomeFarm}
              className="touch-btn bg-[#b83224] border-2 border-white text-white font-extrabold px-2.5 py-1 rounded-xl text-xs shadow-lg cursor-pointer"
            >
              🏘️ Nhà {visitingFriendName} [⬅ Về]
            </button>
          )}
        </div>

        {isSeedDrawerOpen && (
          <div className="pointer-events-auto bg-[#fff8eb]/95 border-2 border-[#6e4121] rounded-r-xl p-1.5 shadow-xl flex items-center gap-1.5 overflow-x-auto max-w-[92vw] sm:max-w-[620px]">
            {plantableCatalog.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedSeed(item.id)}
                className={`touch-btn px-2.5 py-1 rounded-lg font-bold border text-xs shrink-0 cursor-pointer ${
                  selectedSeedId === item.id
                    ? 'bg-[#4e8222] text-white border-[#2a180c] shadow-inner'
                    : 'bg-white text-[#2a180c] border-[#c88a4b]'
                }`}
              >
                {item.emoji} {item.name} ({item.buyCostGold}🪙)
              </button>
            ))}
          </div>
        )}
      </aside>

      {/* =================================================================== */}
      {/* 3. CỤM ĐIỀU KHIỂN CAMERA CHO MOBILE / IPAD (GÓC PHẢI GIỮA)          */}
      {/* =================================================================== */}
      <div className="fixed right-2 top-1/2 -translate-y-1/2 z-20 safe-right flex flex-col gap-1.5">
        <button
          onClick={() => EventBus.emit('camera-zoom', 0.15)}
          className="touch-btn w-10 h-10 bg-[#321b0d]/90 border-2 border-[#c88a4b] text-[#fff8eb] rounded-full font-extrabold text-base shadow-lg cursor-pointer"
          title="Phóng to bản đồ"
        >
          ➕
        </button>
        <button
          onClick={() => EventBus.emit('camera-center')}
          className="touch-btn w-10 h-10 bg-[#321b0d]/90 border-2 border-[#f5b82e] text-[#f5b82e] rounded-full font-extrabold text-sm shadow-lg cursor-pointer"
          title="Về giữa trang trại"
        >
          🎯
        </button>
        <button
          onClick={() => EventBus.emit('camera-zoom', -0.15)}
          className="touch-btn w-10 h-10 bg-[#321b0d]/90 border-2 border-[#c88a4b] text-[#fff8eb] rounded-full font-extrabold text-base shadow-lg cursor-pointer"
          title="Thu nhỏ bản đồ"
        >
          ➖
        </button>
      </div>

      {/* =================================================================== */}
      {/* 4. THÔNG BÁO TOAST NỔI (KHÔNG CHE KHUẤT BẢN ĐỒ)                     */}
      {/* =================================================================== */}
      {toastMessage && (
        <div className="fixed bottom-14 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-[92vw] max-w-2xl">
          <div className="bg-[#2b4c1b]/95 text-[#fff8eb] border-2 border-[#f5b82e] px-3 py-1.5 rounded-full text-xs font-bold text-center shadow-xl truncate">
            {toastMessage}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 5. FLOATING BOTTOM 2-THUMB DOCK (CHAT TRÁI + 7 NÚT TÍNH NĂNG PHẢI)  */}
      {/* =================================================================== */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 safe-bottom safe-left safe-right pointer-events-none flex flex-wrap items-center justify-between gap-1.5 px-2 py-1">
        {/* Ngón cái trái: Khung Chat Làng Xóm */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#321b0d]/92 border-2 border-[#c88a4b] rounded-full px-2.5 py-1 text-[#fff8eb] shadow-lg max-w-full sm:max-w-[340px] flex-1">
          <span className="text-[11px] truncate flex-1">
            💬 <b>{chatMessages[chatMessages.length - 1]?.sender}:</b>{' '}
            {chatMessages[chatMessages.length - 1]?.content}
          </span>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendChatMessage(chatInput);
                setChatInput('');
              }
            }}
            placeholder="Chat..."
            className="bg-[#fff8eb] text-[#2a180c] text-xs px-2 py-0.5 rounded-full border border-[#c88a4b] w-20 sm:w-24"
          />
        </div>

        {/* Ngón cái phải: 7 Nút Action Dock chuẩn Ergonomic */}
        <div className="pointer-events-auto flex items-center gap-1 overflow-x-auto max-w-full bg-[#321b0d]/92 border-2 border-[#c88a4b] rounded-full px-2 py-1 shadow-lg">
          <button
            onClick={() => setActiveModal('COOP_QUESTS')}
            className="touch-btn bg-[#4e8222] border border-[#b8f272] text-white text-xs font-extrabold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            📋 Nhiệm Vụ &amp; HTX
          </button>
          <button
            onClick={() => setActiveModal('WORKERS')}
            className="touch-btn bg-[#b83224] border border-[#ffeb3b] text-white text-xs font-bold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            🛖 Lán Thợ (4/6)
          </button>
          <button
            onClick={() => setActiveModal('BENCHMARK')}
            className="touch-btn bg-[#f5b82e] text-[#2a180c] text-xs font-extrabold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            ⛩️ Đình Làng &amp; Đột Biến
          </button>
          <button
            onClick={() => setActiveModal('COOKING')}
            className="touch-btn bg-[#388e3c] text-white text-xs font-bold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            🍲 Bếp Quê
          </button>
          <button
            onClick={() => setActiveModal('MARKET_STEAL')}
            className="touch-btn bg-[#2e8b8d] text-white text-xs font-bold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            📰 Chợ &amp; Đi Trộm
          </button>
          <button
            onClick={() => setActiveModal('LIVEOPS')}
            className="touch-btn bg-[#9b5de5] text-white text-xs font-bold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            🏮 Lịch &amp; Vé Số 18h
          </button>
          <button
            onClick={() => setActiveModal('FASHION')}
            className="touch-btn bg-[#6e4121] border border-[#c88a4b] text-[#fff8eb] text-xs font-bold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            🪞 12 Slots
          </button>
        </div>
      </footer>

      {/* ===================================================================== */}
      {/* CÁC CỬA SỔ MODAL GỖ / TRE / GIẤY DÓ (TỐI ƯU MOBILE LANDSCAPE & IPAD)  */}
      {/* ===================================================================== */}

      {/* MODAL MỚI PHASE 1: BẢNG ĐƠN HỢP TÁC XÃ, NHIỆM VỤ CỐT TRUYỆN & 7 NGÀY TÂN THỦ */}
      {activeModal === 'COOP_QUESTS' && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-5xl w-full p-3 sm:p-4 max-h-[88dvh] overflow-y-auto shadow-2xl text-xs">
            <div className="bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex justify-between items-center mb-3 text-xs sm:text-sm sticky top-0 z-10">
              <span>📋 BẢNG ĐƠN HÀNG HỢP TÁC XÃ, CỐT TRUYỆN ÔNG BẢY &amp; QUÀ 7 NGÀY TÂN THỦ (CORE MVP v1.0)</span>
              <button
                onClick={() => setActiveModal(null)}
                className="touch-btn bg-[#b83224] text-white px-3 py-1 rounded-lg text-xs cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Cột 1: Bảng Đơn Hàng Hợp Tác Xã */}
              <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 space-y-2">
                <h4 className="font-extrabold text-sm text-[#4e8222]">
                  🚚 1. Bảng Đơn Hàng Hợp Tác Xã
                </h4>
                {coopOrders.map((ord) => (
                  <div key={ord.id} className="p-2 rounded-lg border border-[#e0d4c0] bg-[#fffdf7] space-y-1">
                    <div className="font-extrabold text-[#2a180c]">
                      {ord.emoji} {ord.title} ({ord.requester})
                    </div>
                    <div className="text-[11px] text-[#664930]">
                      Cần: <b>{ord.requiredQty} {ord.itemName}</b> (Kho có: {inventory[ord.itemId] ?? 0})
                    </div>
                    <div className="text-[11px] font-bold text-[#b83224]">
                      Thưởng: +{ord.rewardGold} 🪙 | +{ord.rewardXp} XP
                    </div>
                    <button
                      disabled={ord.completed}
                      onClick={() => deliverCoopOrder(ord.id)}
                      className={`touch-btn w-full font-extrabold py-1 rounded-lg cursor-pointer ${
                        ord.completed
                          ? 'bg-gray-300 text-gray-600'
                          : 'bg-[#4e8222] text-white'
                      }`}
                    >
                      {ord.completed ? '✅ Đã Giao Hàng' : '📦 Giao Đơn Hàng Ngay'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Cột 2: Nhiệm vụ Cốt truyện Chương 1-2 */}
              <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 space-y-2">
                <h4 className="font-extrabold text-sm text-[#b83224]">
                  📜 2. Kịch Bản Cốt Truyện Ông Bảy
                </h4>
                {storyQuests.map((q) => (
                  <div key={q.id} className="p-2.5 rounded-lg border border-[#c88a4b] bg-[#fff3e0] space-y-1.5">
                    <div className="font-extrabold text-[#b83224]">{q.chapter}</div>
                    <div className="font-bold">{q.title}</div>
                    <p className="text-[11px] text-[#664930]">{q.desc}</p>
                    <div className="text-[11px] font-extrabold text-[#4e8222]">
                      Thưởng: +{q.rewardGold} 🪙 &amp; +{q.rewardGems} 💎 Ngọc
                    </div>
                    <button
                      disabled={q.completed}
                      onClick={() => claimStoryQuest(q.id)}
                      className={`touch-btn w-full font-extrabold py-1 rounded-lg cursor-pointer ${
                        q.completed
                          ? 'bg-gray-300 text-gray-600'
                          : 'bg-[#f5b82e] text-[#2a180c]'
                      }`}
                    >
                      {q.completed ? '✅ Đã Nhận Thưởng' : '🎁 Hoàn Thành & Nhận Thưởng'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Cột 3: Quà 7 Ngày Tân Thủ Về Quê */}
              <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 space-y-2">
                <h4 className="font-extrabold text-sm text-[#2e8b8d]">
                  🎁 3. Lộ Trình 7 Ngày Tân Thủ ({rookieDaysClaimed}/7)
                </h4>
                <p className="text-[11px] text-[#664930]">
                  Điểm danh đủ 7 ngày nhận miễn phí <b>🐕 Chó Phú Quốc Giữ Nhà (Bắt trộm 70%)</b> &amp; <b>Áo Bà Ba Lụa Hà Đông</b>!
                </p>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  {[
                    'Ngày 1: +500 🪙 & Giống Lúa',
                    'Ngày 2: +20 💎 & Giống Sen',
                    'Ngày 3: Áo Bà Ba Lụa Đỏ',
                    'Ngày 4: +1,000 🪙 & Bùn Ao',
                    'Ngày 5: Nón Lá Bài Thơ',
                    'Ngày 6: +50 💎 & Vé Đập Niêu',
                    'Ngày 7: 🐕 Chó Phú Quốc SSR!',
                  ].map((label, idx) => (
                    <div
                      key={idx}
                      className={`p-1.5 rounded border font-bold ${
                        idx < rookieDaysClaimed
                          ? 'bg-[#d4f8d4] border-[#4e8222] text-[#1b5e20]'
                          : 'bg-[#fffdf7] border-[#c88a4b]'
                      }`}
                    >
                      {idx < rookieDaysClaimed ? '✅ ' : '🔒 '} {label}
                    </div>
                  ))}
                </div>
                <button
                  onClick={claimRookieDayReward}
                  className="touch-btn w-full bg-[#b83224] text-white font-extrabold py-2 rounded-xl cursor-pointer mt-2"
                >
                  🎁 Nhận Quà Tân Thủ Ngày Tiếp Theo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: LÁN THỢ ĐỒNG QUÊ & QUẢN LÝ 6 GIA NHÂN */}
      {activeModal === 'WORKERS' && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-4xl w-full p-3 sm:p-4 max-h-[88dvh] overflow-y-auto shadow-2xl">
            <div className="bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex justify-between items-center mb-3 text-xs sm:text-sm sticky top-0 z-10">
              <span>🛖 LÁN THỢ ĐỒNG QUÊ &amp; QUẢN LÝ 6 GIA NHÂN (LƯƠNG + CƠM + ÁO QUẦN + PHỤ CẤP)</span>
              <button
                onClick={() => setActiveModal(null)}
                className="touch-btn bg-[#b83224] text-white px-3 py-1 rounded-lg text-xs cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-xs text-[#6e4121]">
                  👷 Danh sách 6 Nhân công (Chừa 2 phút cửa sổ vàng cho bạn bè trộm trước khi thu!):
                </h4>
                {workers.map((w) => (
                  <div
                    key={w.code}
                    onClick={() => setSelectedWorkerCode(w.code)}
                    className={`p-2 rounded-xl border-2 cursor-pointer flex justify-between items-center ${
                      selectedWorkerCode === w.code
                        ? 'border-[#b83224] bg-[#fff3e0]'
                        : 'border-[#c88a4b] bg-white'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold text-xs">
                        {w.emoji} {w.name} — <span className="text-[#6e4121]">{w.role}</span> (Lv.{w.unlockLevel})
                      </div>
                      <div className="text-[11px] text-[#664930]">{w.statusText}</div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 ${
                        w.isHired ? 'bg-[#d4f8d4] text-[#1b5e20]' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {w.isHired ? `No: ${w.belly}%` : 'Chưa thuê'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-[#fffdf7] border-2 border-[#c88a4b] rounded-xl p-3 space-y-2.5 text-xs">
                <div className="flex justify-between items-center border-b border-[#c88a4b] pb-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#b83224]">
                      {currentWorker.emoji} {currentWorker.name}
                    </h3>
                    <p className="text-[#664930]">
                      Lương: <b>{currentWorker.dailySalaryGold} 🪙/ngày</b> | Hợp đồng còn:{' '}
                      <b>{currentWorker.contractDaysLeft} ngày</b>
                    </p>
                  </div>
                  <div className="text-right font-bold">
                    <div>🍚 Độ No: {currentWorker.belly}/100</div>
                    <div>😊 Tinh thần: {currentWorker.morale}/100</div>
                  </div>
                </div>

                <div className="bg-[#f1f8e9] border-l-4 border-[#4e8222] p-2 rounded">
                  <b>1. 🍚 BÀN ĂN LÁN THỢ (Food Sink - Tiêu thụ món ăn Bếp Quê):</b>
                  <p className="text-[11px] my-1">Món khoái khẩu: <b>{currentWorker.favoriteMeal}</b> (+25% Tinh thần)</p>
                  <div className="flex gap-1.5 flex-wrap mt-1">
                    <button
                      onClick={() => feedWorker(currentWorker.code, 'Cơm Trắng & Canh Cá Rô', 45)}
                      className="touch-btn bg-[#4e8222] text-white font-bold px-2.5 py-1 rounded-lg cursor-pointer"
                    >
                      🍲 Dọn Cơm + Canh Cá (+45 Độ No)
                    </button>
                    <button
                      onClick={() => feedWorker(currentWorker.code, currentWorker.favoriteMeal, 85)}
                      className="touch-btn bg-[#2e8b8d] text-white font-bold px-2.5 py-1 rounded-lg cursor-pointer"
                    >
                      🍜 Đãi Món Khoái Khẩu (+85 Độ No)
                    </button>
                  </div>
                </div>

                <div className="bg-[#fff8e1] border-l-4 border-[#f5b82e] p-2 rounded">
                  <b>2. 👕 ÁO QUẦN &amp; ĐỒ BẢO HỘ LAO ĐỘNG (Cloth Sink - Độ bền 72h):</b>
                  <p className="text-[11px] my-1">
                    Đang mặc: <b>{currentWorker.equippedGearId ?? 'Chưa có đồ bảo hộ'}</b> (Còn{' '}
                    {currentWorker.gearHoursLeft}/72 giờ)
                  </p>
                  <div className="flex gap-1.5 flex-wrap mt-1">
                    <button
                      onClick={() => equipWorkerGear(currentWorker.code, 'CRAFT_01')}
                      className="touch-btn bg-[#f5b82e] text-[#2a180c] font-extrabold px-2.5 py-1 rounded-lg cursor-pointer"
                    >
                      👒 Cấp Nón Lá + Áo Cánh Nâu (-120 🪙)
                    </button>
                    <button
                      onClick={() => equipWorkerGear(currentWorker.code, 'CRAFT_03')}
                      className="touch-btn bg-[#c88a4b] text-white font-bold px-2.5 py-1 rounded-lg cursor-pointer"
                    >
                      🧥 Cấp Áo Tơi Lá Cọ + Ủng (-150 🪙)
                    </button>
                  </div>
                </div>

                <div className="bg-[#fbe9e7] border-l-4 border-[#b83224] p-2 rounded">
                  <b>3. 🪙 TRẢ LƯƠNG HỢP ĐỒNG &amp; THƯỞNG PHỤ CẤP NGÀY MÙA (Gold Sink):</b>
                  <div className="flex gap-1.5 flex-wrap mt-1.5">
                    <button
                      onClick={() => payWorkerSalary(currentWorker.code)}
                      className="touch-btn bg-[#f5b82e] text-[#2a180c] font-extrabold px-3 py-1 rounded-lg cursor-pointer"
                    >
                      🪙 Gia Hạn Hợp Đồng 3 Ngày (-12%)
                    </button>
                    <button
                      onClick={() => giveWorkerBonus(currentWorker.code)}
                      className="touch-btn bg-[#b83224] text-white font-bold px-3 py-1 rounded-lg cursor-pointer"
                    >
                      🧧 Thưởng Phụ Cấp Ngày Mùa (-300 🪙 ➔ 100% Hăng Say!)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: TRUNG TÂM 12 TÍNH NĂNG BENCHMARK & ĐỀ XUẤT MỚI */}
      {activeModal === 'BENCHMARK' && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-5xl w-full p-3 sm:p-4 max-h-[88dvh] overflow-y-auto shadow-2xl">
            <div className="bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex justify-between items-center mb-3 text-xs sm:text-sm sticky top-0 z-10">
              <span>⛩️ TRUNG TÂM ĐÌNH LÀNG, VƯỜN ƯƠM ĐỘT BIẾN, THƯƠNG LÁI, CHỢ ĐÊM &amp; RỪNG TRÚC</span>
              <button
                onClick={() => setActiveModal(null)}
                className="touch-btn bg-[#b83224] text-white px-3 py-1 rounded-lg text-xs cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 space-y-2">
                <h4 className="font-extrabold text-sm text-[#6e4121]">
                  🧬 1. Vườn Ươm Chiết Cành Đột Biến (Lv.17)
                </h4>
                <p className="text-[#664930]">
                  Tích điểm Bảo hiểm Pity hiện tại: <b>{mutantPityCount} lần</b> (Trượt vẫn nhận Phù Sa Siêu Tốc +40%!).
                </p>
                <div className="space-y-1.5">
                  <button
                    onClick={() => breedMutantCrop('CROP_MUT_01', 2000, 0.35, 3)}
                    className="touch-btn w-full bg-[#9b5de5] text-white font-bold py-1.5 px-2 rounded-lg cursor-pointer text-left"
                  >
                    🟣 Ghép Lúa Tím Thảo Dược (-2,000 🪙 | 35%, Pity 3)
                  </button>
                  <button
                    onClick={() => breedMutantCrop('CROP_MUT_02', 4500, 0.25, 4)}
                    className="touch-btn w-full bg-[#4e8222] text-white font-bold py-1.5 px-2 rounded-lg cursor-pointer text-left"
                  >
                    🟩 Ghép Dưa Hấu Vuông Tài Lộc (-4,500 🪙 | 25%, Pity 4)
                  </button>
                  <button
                    onClick={() => breedMutantCrop('CROP_MUT_03', 8000, 0.15, 6)}
                    className="touch-btn w-full bg-[#b83224] text-white font-bold py-1.5 px-2 rounded-lg cursor-pointer text-left"
                  >
                    🏮 Ghép Bưởi Hồ Lô &amp; Sen Nghìn Cánh (-8,000 🪙 | Pity 6)
                  </button>
                </div>
              </div>

              <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 space-y-2">
                <h4 className="font-extrabold text-sm text-[#b83224]">
                  ⛩️ 2. Trùng Tu Đình Làng &amp; Miếu Thần Nông
                </h4>
                <p>
                  Tiến độ Đình Làng: <b>Giai đoạn {dinhLangStage}/3</b> (Đạt Cấp 3 nhận vĩnh viễn <b>+5% Sản lượng</b> &amp; ghi tên lên Bia Đá Công Đức!).
                </p>
                <button
                  onClick={contributeDinhLang}
                  className="touch-btn w-full bg-[#f5b82e] text-[#2a180c] font-extrabold py-1.5 px-2 rounded-lg cursor-pointer"
                >
                  ⛩️ Công Đức Trùng Tu Đình Làng (Cấp {Math.min(3, dinhLangStage + 1)})
                </button>
                <hr className="border-[#e0d4c0]" />
                <p className="text-[11px]">
                  🙏 <b>Miếu Thần Nông (Lv.8):</b> Đang kích hoạt <i>{activeTotemBuff}</i>
                </p>
                <button
                  onClick={prayAtTotem}
                  className="touch-btn w-full bg-[#4e8222] text-white font-bold py-1.5 px-2 rounded-lg cursor-pointer"
                >
                  🙏 Dâng Lễ Rút Quẻ Đại Cát Hôm Nay (-80 🪙)
                </button>
              </div>

              <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 space-y-2">
                <h4 className="font-extrabold text-sm text-[#2e8b8d]">
                  🚚 3. Thương Lái, Chợ Đêm &amp; Rừng Trúc
                </h4>
                <div className="bg-[#fff3e0] p-2 rounded border border-[#f5b82e]">
                  <b>🔥 Thương Lái Đột Xuất (09:00 &amp; 20:00):</b> Thu mua <b>Cá Kho &amp; Sầu Riêng giá x2.5</b>! Bạn bè bán ké giúp chủ nhà nhận <b>+5% Hoa hồng</b>!
                  <button
                    onClick={sellToTraderBoom}
                    className="touch-btn mt-1.5 w-full bg-[#b83224] text-white font-bold py-1 rounded-lg cursor-pointer"
                  >
                    🚚 Bán Hàng Giá Sốt x2.5 (+1,450 🪙)
                  </button>
                </div>

                <button
                  onClick={playNightMarketMinigame}
                  className="touch-btn w-full bg-[#9b5de5] text-white font-bold py-1.5 px-2 rounded-lg cursor-pointer"
                >
                  🏮 Mở Quầy Chợ Đêm Cuối Tuần (Bán x1.8 Giá, 0% Thuế!)
                </button>

                <button
                  onClick={runBambooExpedition}
                  className="touch-btn w-full bg-[#2e8b8d] text-white font-bold py-1.5 px-2 rounded-lg cursor-pointer"
                >
                  🎋 Thám Hiểm Rừng Trúc &amp; Bãi Bồi (-6 ⚡ ➔ Cổ Vật + Phấn Hoa)
                </button>

                <button
                  onClick={helpFriendAfterStorm}
                  className="touch-btn w-full bg-[#6e4121] text-[#fff8eb] font-bold py-1.5 px-2 rounded-lg cursor-pointer"
                >
                  🌈 Cứu Trợ Sau Mưa Bão Nhà Bạn (0 ⚡ ➔ +30 🪙 &amp; Nghĩa Xóm)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: BẾP CỦI QUÊ MẸ — SÁNG TẠO MÓN ĂN NGẪU NHIÊN */}
      {activeModal === 'COOKING' && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-3xl w-full p-3 sm:p-4 max-h-[88dvh] overflow-y-auto shadow-2xl">
            <div className="bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex justify-between items-center mb-3 text-xs sm:text-sm">
              <span>🍲 BẾP CỦI QUÊ MẸ — PHỐI NGUYÊN LIỆU NGẪU NHIÊN MỞ KHÓA 60 CÔNG THỨC ẨN</span>
              <button
                onClick={() => setActiveModal(null)}
                className="touch-btn bg-[#b83224] text-white px-3 py-1 rounded-lg text-xs cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 space-y-2">
                <h4 className="font-extrabold text-[#6e4121]">📜 Gợi ý Ca Dao Món Ẩn (#18/60):</h4>
                <p className="italic bg-[#fff3e0] p-2 rounded border-l-4 border-[#f5b82e]">
                  "Cá trắm miền Bắc thịt thơm, Gặp tiêu miền Trung, nước dừa miền Nam..."
                </p>
                <p className="font-bold mt-2">🎒 Chạm chọn nguyên liệu bỏ vào Nồi Đất:</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '🐟 Cá Trắm Đen [Bắc]',
                    '🌶️ Hồ Tiêu [Trung]',
                    '🥥 Nước Dừa Xiêm [Nam]',
                    '🦀 Cua Đồng',
                    '🪷 Hạt Sen',
                  ].map((ing) => (
                    <button
                      key={ing}
                      onClick={() => setCookingPot([...cookingPot, ing])}
                      className="touch-btn bg-[#4e8222] text-white font-bold px-2.5 py-1 rounded-lg cursor-pointer"
                    >
                      + {ing}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#fff3e0] border-2 border-[#b83224] rounded-xl p-3 text-center space-y-2">
                <h4 className="font-extrabold text-[#b83224]">🔥 NỒI ĐẤT PHỐI MÓN TỰ DO</h4>
                <div className="flex flex-wrap gap-1.5 justify-center min-h-[36px]">
                  {cookingPot.map((item, i) => (
                    <span key={i} className="bg-white border border-[#c88a4b] px-2 py-0.5 rounded font-bold">
                      {i + 1}. {item}
                    </span>
                  ))}
                </div>
                <div className="text-4xl my-1">🥘🔥</div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => cookRandomDish(cookingPot)}
                    className="touch-btn bg-[#b83224] text-white font-extrabold px-4 py-1.5 rounded-lg cursor-pointer"
                  >
                    🔥 Nổi Lửa Nấu Thử!
                  </button>
                  <button
                    onClick={() => setCookingPot([])}
                    className="touch-btn bg-[#f5b82e] text-[#2a180c] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    🔄 Làm Trống Nồi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: NHẬT BÁO CHỢ PHIÊN 3 MIỀN & SANG NHÀ BẠN HÁI TRỘM */}
      {activeModal === 'MARKET_STEAL' && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-4xl w-full p-3 sm:p-4 max-h-[88dvh] overflow-y-auto shadow-2xl">
            <div className="bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex justify-between items-center mb-3 text-xs sm:text-sm">
              <span>📰 NHẬT BÁO CHỢ PHIÊN 3 MIỀN (THUẾ 10%) &amp; CỬA SỔ VÀNG 2 PHÚT HÁI TRỘM</span>
              <button
                onClick={() => setActiveModal(null)}
                className="touch-btn bg-[#b83224] text-white px-3 py-1 rounded-lg text-xs cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {marketListings.map((m) => (
                <div key={m.id} className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-sm">{m.sellerName} (Lv.{m.sellerLevel})</span>
                      <span className="bg-[#d4f8d4] text-[#1b5e20] px-2 py-0.5 rounded font-bold">
                        {REGION_INFO[m.sellerRegion].shortName}
                      </span>
                    </div>
                    <div className="my-2 text-sm font-bold text-[#b83224]">
                      {m.emoji} {m.quantity}x {m.itemName} — {m.unitPrice} 🪙/món
                    </div>
                    <p className="text-[11px] text-[#664930]">📍 Tình trạng vườn: {m.stealTargetName}</p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => buyMarketAndVisit(m)}
                      className="touch-btn w-full bg-[#f5b82e] text-[#2a180c] font-extrabold py-1.5 rounded-lg cursor-pointer"
                    >
                      🛒 Mua Lô Hàng &amp; Bay Sang Nhà ({m.unitPrice * m.quantity} 🪙)
                    </button>
                    <button
                      onClick={() => attemptStealFromFriend(m.sellerName)}
                      className="touch-btn w-full bg-[#2e8b8d] text-white font-bold py-1.5 rounded-lg cursor-pointer"
                    >
                      🥷 Rón Rén Hái Trộm (-1 ⚡ | Cẩn thận Chó!)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: LỊCH BLOC QUÊ NỘI, ĐẬP NIÊU ĐẤT GACHA & XỔ SỐ KIẾN THIẾT 18:00 */}
      {activeModal === 'LIVEOPS' && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-4xl w-full p-3 sm:p-4 max-h-[88dvh] overflow-y-auto shadow-2xl text-xs">
            <div className="bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex justify-between items-center mb-3 text-xs sm:text-sm">
              <span>🏮 LỊCH BLOC ĐIỂM DANH, ĐẬP NIÊU ĐẤT GACHA &amp; XỔ SỐ KIẾN THIẾT 18:00</span>
              <button
                onClick={() => setActiveModal(null)}
                className="touch-btn bg-[#b83224] text-white px-3 py-1 rounded-lg cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 text-center space-y-2">
                <h4 className="font-extrabold text-sm text-[#b83224]">📅 LỊCH BLOC QUÊ NỘI</h4>
                <div className="text-3xl font-black text-[#b83224] py-1">24 / 10</div>
                <p className="text-[11px] italic">"Chớ bỏ ruộng hoang, Bao nhiêu tấc đất tấc vàng bấy nhiêu"</p>
                <button
                  onClick={tearBlocCalendar}
                  className="touch-btn w-full bg-[#b83224] text-white font-extrabold py-2 rounded-lg cursor-pointer"
                >
                  👋 Vuốt Tay Xé Lịch Nhận Lộc (+30 ⚡ &amp; Vé Số)
                </button>
              </div>

              <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 text-center space-y-2">
                <h4 className="font-extrabold text-sm text-[#6e4121]">🏺 ĐẬP NIÊU ĐẤT ĐÌNH LÀNG</h4>
                <div className="text-3xl py-1">🏺 🏺 🏺 🔨</div>
                <p className="text-[11px]">Cơ hội trúng Thời trang Áo Dài / Bà Ba bậc SR &amp; SSR!</p>
                <button
                  onClick={smashClayPotGacha}
                  className="touch-btn w-full bg-[#f5b82e] text-[#2a180c] font-extrabold py-2 rounded-lg cursor-pointer"
                >
                  🔨 Đập Niêu Đất (-400 🪙)
                </button>
              </div>

              <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 text-center space-y-2">
                <h4 className="font-extrabold text-sm text-[#2e8b8d]">🎟️ XỔ SỐ KIẾN THIẾT 18:00</h4>
                <p>Độc Đắc: <b>50,000 🪙 + 200 💎</b> (Trích từ Quỹ Thuế Chợ 10%)</p>
                <p className="font-bold text-[#b83224]">Vé đang giữ: [{lotteryTickets.join('], [')}]</p>
                <button
                  onClick={() => buyLotteryTicket(false)}
                  className="touch-btn w-full bg-[#4e8222] text-white font-bold py-1.5 rounded-lg cursor-pointer"
                >
                  + Mua 1 Tờ Vé Số (-500 🪙)
                </button>
                <button
                  onClick={() => buyLotteryTicket(true)}
                  className="touch-btn w-full bg-[#2e8b8d] text-white font-bold py-1.5 rounded-lg cursor-pointer"
                >
                  🎁 Mua Vé Tặng Bạn Bè (-300 🪙 ➔ Cùng Trúng!)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: TỦ ĐỒ 12 SLOTS THỜI TRANG & TRANSMOG */}
      {activeModal === 'FASHION' && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-3xl w-full p-3 sm:p-4 max-h-[88dvh] overflow-y-auto shadow-2xl text-xs">
            <div className="bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex justify-between items-center mb-3 text-xs sm:text-sm">
              <span>🪞 GƯƠNG SOI 12 SLOTS THỜI TRANG, TRANSMOG &amp; ĐỔI DÉP TỔ ONG</span>
              <button
                onClick={() => setActiveModal(null)}
                className="touch-btn bg-[#b83224] text-white px-3 py-1 rounded-lg text-xs cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-xl border border-[#c88a4b] space-y-1.5">
                <b>6 Slot Trang Phục Chính:</b>
                <div>1. 👒 Mũ: Nón Lá Bài Thơ (-4% ⚡)</div>
                <div>2. 💇 Tóc: Trâm Cài Hoa Bưởi (+15% Tim NPC)</div>
                <div>3. 👚 Áo: Áo Bà Ba Lụa Tơ Tằm (+8% XP)</div>
                <div>4. 👖 Quần: Quần Lĩnh Đen (+10% Tốc chạy)</div>
                <div className="text-[#b83224] font-bold">
                  5. 👞 Giày: Dép Tổ Ong Huyền Thoại SSR (+25% Né Chó!) [Đang có: {inventory.ITEM_DEP_TO_ONG ?? 0} chiếc]
                </div>
                <div>6. 👓 Mặt: Cọng Cỏ Non (+5% Mỹ Vị)</div>
              </div>
              <div className="bg-[#fff9c4] p-3 rounded-xl border-2 border-[#f5b82e] flex flex-col items-center justify-center text-center">
                <div className="font-extrabold text-sm">✨ ĐIỂM PHONG CÁCH: {styleScore}</div>
                <div className="text-5xl my-3">👒👧👞</div>
                <span className="bg-[#b83224] text-white px-3 py-1 rounded-full font-bold">
                  Hội Thi Duyên Dáng Làng Quê: Top 3 Server
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#c88a4b] space-y-1.5">
                <b>6 Slot Trang Sức &amp; Hào Quang:</b>
                <div>7. 👂 Khuyên Tai: Ngọc Trai Sông (+6% Vàng Đơn)</div>
                <div>8. 📿 Vòng Cổ: Khăn Rằn Nam Bộ (-15% Hồi Giếng)</div>
                <div>9. ⌚ Vòng Tay: Lắc Bạc Chuông (+4% Rơi Vật tư)</div>
                <div>10. 💍 Nhẫn: Nhẫn Ngọc Bích (+10% Cây ⭐)</div>
                <div>11. 🎒 Cầm Tay: Đàn Tính Tây Bắc</div>
                <div>12. ✨ Hào Quang: Đom Đóm Đêm Trăng SSR</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: GIẤY ĐĂNG KÝ VỀ QUÊ LẬP NGHIỆP */}
      {activeModal === 'REGISTER' && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-2xl w-full p-3 sm:p-4 max-h-[88dvh] overflow-y-auto shadow-2xl text-xs space-y-3">
            <div className="bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex justify-between items-center">
              <span>📜 GIẤY ĐĂNG KÝ VỀ QUÊ LẬP NGHIỆP (CHỌN GIỚI TÍNH &amp; 3 VÙNG QUÊ HƯƠNG)</span>
              <button
                onClick={() => setActiveModal(null)}
                className="touch-btn bg-[#b83224] text-white px-3 py-1 rounded-lg cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="space-y-2">
              <label className="font-bold block">1. Tên Điền Chủ &amp; Giới tính:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="border-2 border-[#c88a4b] bg-white px-3 py-1.5 rounded-lg font-bold flex-1"
                />
                <button
                  onClick={() => setTempGender('MALE')}
                  className={`touch-btn px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                    tempGender === 'MALE' ? 'bg-[#4e8222] text-white' : 'bg-gray-200'
                  }`}
                >
                  👦 Nam
                </button>
                <button
                  onClick={() => setTempGender('FEMALE')}
                  className={`touch-btn px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                    tempGender === 'FEMALE' ? 'bg-[#4e8222] text-white' : 'bg-gray-200'
                  }`}
                >
                  👧 Nữ
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-bold block">2. Chọn Vùng Quê Hương Khởi Nghiệp (Mỗi miền có 10 Đặc sản Độc quyền):</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {(['NORTH', 'CENTRAL', 'SOUTH'] as RegionType[]).map((r) => (
                  <div
                    key={r}
                    onClick={() => setTempRegion(r)}
                    className={`p-2.5 rounded-xl border-2 cursor-pointer ${
                      tempRegion === r ? 'border-[#b83224] bg-[#fff3e0]' : 'border-[#c88a4b] bg-white'
                    }`}
                  >
                    <div className="font-extrabold text-sm text-[#b83224]">{REGION_INFO[r].shortName}</div>
                    <div className="text-[11px] font-bold text-[#4e8222] my-1">{REGION_INFO[r].buffName}</div>
                    <div className="text-[11px] text-[#664930]">
                      Đặc sản: {REGION_INFO[r].specialties.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setProfile(tempName, tempGender, tempRegion)}
              className="touch-btn w-full bg-[#b83224] text-white font-extrabold py-2.5 rounded-xl cursor-pointer text-sm"
            >
              💮 ĐÓNG DẤU ĐỎ &amp; LƯU HỒ SƠ ĐIỀN CHỦ!
            </button>
          </div>
        </div>
      )}

      {/* MODAL 8: CẤU HÌNH NHANH SUPABASE */}
      {activeModal === 'SUPABASE_CONFIG' && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-xl w-full p-3 sm:p-4 max-h-[88dvh] overflow-y-auto shadow-2xl text-xs space-y-3">
            <div className="bg-[#2e8b8d] text-white px-3 py-2 rounded-xl font-extrabold flex justify-between items-center">
              <span>🔌 KẾT NỐI SUPABASE DATABASE &amp; REALTIME (DÁN LIÊN KẾT BẤT KỲ LÚC NÀO)</span>
              <button
                onClick={() => setActiveModal(null)}
                className="touch-btn bg-[#b83224] text-white px-3 py-1 rounded-lg cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            <p className="text-[#664930]">
              Hiện tại game vẫn chạy mượt bằng <b>Local Demo Store</b>. Khi bạn tạo xong project trên{' '}
              <b>Supabase.com</b>, hãy chạy file{' '}
              <code>supabase/migrations/0001_init_huong_dong_gio_noi.sql</code> trong SQL Editor rồi dán{' '}
              <b>Project URL</b> và <b>Anon Key</b> vào đây:
            </p>

            <div className="space-y-2">
              <label className="font-bold block">1. Supabase Project URL:</label>
              <input
                type="text"
                value={sbUrl}
                onChange={(e) => setSbUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full border-2 border-[#c88a4b] bg-white px-3 py-1.5 rounded-lg"
              />
              <label className="font-bold block">2. Supabase Anon Public Key:</label>
              <input
                type="password"
                value={sbKey}
                onChange={(e) => setSbKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full border-2 border-[#c88a4b] bg-white px-3 py-1.5 rounded-lg"
              />
            </div>

            <button
              onClick={() => {
                saveSupabaseCredentials(sbUrl, sbKey);
                setActiveModal(null);
                setToast('🔌 Đã lưu thông tin kết nối Supabase! Tải lại trang để kích hoạt đồng bộ Cloud.');
              }}
              className="touch-btn w-full bg-[#4e8222] text-white font-extrabold py-2.5 rounded-xl cursor-pointer text-sm"
            >
              💾 Lưu Liên Kết Supabase
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
