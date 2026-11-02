import React, { useEffect, useState } from 'react';
import { PhaserGame } from './game/PhaserGame';
import { EventBus } from './game/EventBus';
import { useShallow } from 'zustand/react/shallow';
import { useGameStore } from './store/useGameStore';
import { GAME_CATALOG, REGION_INFO } from './data/masterData';
import { GenderType, RegionType } from './data/types';
import { QCTestResult, runFullQCTestSuite } from './services/qcTestRunner';
import { soundFX } from './services/soundEffects';
import { AuthTabMode, SplashAndAuthGate } from './components/SplashAndAuthGate';
import { getSavedAuthSession } from './services/authService';
import { GAME_STAGE, isStageOpen } from './config/features';
import { canPlant, maxUnlockedWave } from './domain/progression';
import { StaminaBadge } from './ui/hud/StaminaBadge';
import { XpBar } from './ui/hud/XpBar';
import { WarehouseModal } from './ui/modals/WarehouseModal';
import { ExpandLandModal } from './ui/modals/ExpandLandModal';
import { QcReportModal } from './ui/modals/QcReportModal';
import { SupabaseConfigModal } from './ui/modals/SupabaseConfigModal';
import { RegisterModal } from './ui/modals/RegisterModal';
import { FashionModal } from './ui/modals/FashionModal';
import { LiveOpsModal } from './ui/modals/LiveOpsModal';
import { MarketStealModal } from './ui/modals/MarketStealModal';
import { CookingModal } from './ui/modals/CookingModal';
import { BenchmarkModal } from './ui/modals/BenchmarkModal';
import { WorkersModal } from './ui/modals/WorkersModal';
import { CoopQuestsModal } from './ui/modals/CoopQuestsModal';
import { EncyclopediaModal } from './ui/modals/EncyclopediaModal';

/** Công cụ debug (tua nhanh, QC, cấu hình Supabase) chỉ hiện khi chạy `npm run dev`. */
const IS_DEV = import.meta.env.DEV;

export const App: React.FC = () => {
  const {
    playerName,
    accountType,
    gender,
    region,
    level,
    gold,
    gems,
    workerAutoTickEnabled,
    workerPantryCount,
    pondMudCounter,
    wildPlotsUnlocked,
    weather,
    loaPhuongText,
    luckyPacketsLeft,
    onlineFarmersCount,
    toastMessage,
    activeModal,
    visitingFriendName,
    selectedSeedId,
    inventory,
    chatMessages,
    initSupabaseRealtimeSync,
    setToast,
    setActiveModal,
    applyAuthAccount,
    setSelectedSeed,
    cycleWeather,
    dredgePondMud,
    expandWildLand,
    claimWorkerPantry,
    returnHomeFarm,
    claimLoaPhuongLucky,
    sendChatMessage,
    fastForwardTime,
  } = useGameStore(
    useShallow((s) => ({
      playerName: s.playerName,
      accountType: s.accountType,
      gender: s.gender,
      region: s.region,
      level: s.level,
      gold: s.gold,
      gems: s.gems,
      workerAutoTickEnabled: s.workerAutoTickEnabled,
      workerPantryCount: s.workerPantryCount,
      pondMudCounter: s.pondMudCounter,
      wildPlotsUnlocked: s.wildPlotsUnlocked,
      weather: s.weather,
      loaPhuongText: s.loaPhuongText,
      luckyPacketsLeft: s.luckyPacketsLeft,
      onlineFarmersCount: s.onlineFarmersCount,
      toastMessage: s.toastMessage,
      activeModal: s.activeModal,
      visitingFriendName: s.visitingFriendName,
      selectedSeedId: s.selectedSeedId,
      inventory: s.inventory,
      chatMessages: s.chatMessages,
      initSupabaseRealtimeSync: s.initSupabaseRealtimeSync,
      setToast: s.setToast,
      setActiveModal: s.setActiveModal,
      applyAuthAccount: s.applyAuthAccount,
      setSelectedSeed: s.setSelectedSeed,
      cycleWeather: s.cycleWeather,
      dredgePondMud: s.dredgePondMud,
      expandWildLand: s.expandWildLand,
      claimWorkerPantry: s.claimWorkerPantry,
      returnHomeFarm: s.returnHomeFarm,
      claimLoaPhuongLucky: s.claimLoaPhuongLucky,
      sendChatMessage: s.sendChatMessage,
      fastForwardTime: s.fastForwardTime,
    }))
  );

  const [chatInput, setChatInput] = useState('');
  const [tempName, setTempName] = useState(playerName);
  const [tempGender, setTempGender] = useState<GenderType>(gender);
  const [tempRegion, setTempRegion] = useState<RegionType>(region);
  const [qcResults, setQcResults] = useState<QCTestResult[]>([]);
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState<boolean>(true);
  const [authModalTab, setAuthModalTab] = useState<AuthTabMode>('LOGIN');

  // Màn hình ngang thấp (khớp variant `short:` trong index.css): khay giống đóng sẵn để không che ruộng.
  const isShortScreen = () => window.matchMedia?.('(max-height: 500px)').matches ?? false;
  const [isSeedDrawerOpen, setIsSeedDrawerOpen] = useState(() => !isShortScreen());
  const [seedFilterGroup, setSeedFilterGroup] = useState<
    'ALL' | 'CROP_COMMON' | 'TREE_COMMON' | 'REGIONAL' | 'MUTANT' | 'ANIMAL' | 'AQUA'
  >('ALL');



  const [isPortraitMobile, setIsPortraitMobile] = useState(false);
  const [dismissPortraitWarning, setDismissPortraitWarning] = useState(false);


  useEffect(() => {
    initSupabaseRealtimeSync();
    const checkOrientation = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setIsPortraitMobile(h > w && w < 768);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);

    // Vòng lặp tự động hóa của 6 Nhân công Lán Thợ mỗi 10 giây — chỉ từ GĐ2 (Lán Thợ).
    const workerTimer = isStageOpen(2)
      ? window.setInterval(() => {
          useGameStore.getState().tickWorkerAutomation();
        }, 10_000)
      : undefined;

    // Quay lại tab: đồng bộ lại nông trại từ server (chế độ online).
    const onVisible = () => {
      if (document.visibilityState === 'visible') void useGameStore.getState().syncFarmFromServer();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      document.removeEventListener('visibilitychange', onVisible);
      if (workerTimer !== undefined) window.clearInterval(workerTimer);
    };
  }, [initSupabaseRealtimeSync]);

  const toggleFullScreenPWA = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        if ('orientation' in screen && typeof (screen.orientation as unknown as { lock?: (o: string) => Promise<void> }).lock === 'function') {
          await (screen.orientation as unknown as { lock: (o: string) => Promise<void> }).lock('landscape').catch(() => {});
        }
        setToast('⛶ Đã bật chế độ Toàn Màn Hình Ngang (VAC Online Mobile PWA / iPad)!');
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setToast('📱 Mẹo iOS/iPadOS: Bấm nút "Chia sẻ" -> "Thêm vào Màn hình chính" (Add to Home Screen) để chơi Fullscreen!');
    }
  };

  const allPlantableCatalog = GAME_CATALOG.filter(
    (c) =>
      c.category === 'CROP' ||
      c.category === 'TREE' ||
      c.category === 'ANIMAL' ||
      c.category === 'AQUA' ||
      c.category === 'MUTANT_CROP'
  );

  // Khay giống theo Đợt đang mở + cấp + miền (src/domain/progression.ts canPlant)
  const openWave = maxUnlockedWave(GAME_STAGE);
  const seedTrayCatalog = allPlantableCatalog
    .filter((item) => (item.unlockWave ?? 99) <= openWave && (item.region === 'ALL' || item.region === region))
    .sort((a, b) => a.unlockLevel - b.unlockLevel || a.buyCostGold - b.buyCostGold);
  const filteredPlantableCatalog = seedTrayCatalog.filter((item) => {
    if (seedFilterGroup === 'ALL') return true;
    if (seedFilterGroup === 'CROP_COMMON') return item.subGroup === 'Crop_Common';
    if (seedFilterGroup === 'TREE_COMMON') return item.subGroup === 'Crop_Tree_Common';
    if (seedFilterGroup === 'REGIONAL') return item.subGroup === 'Crop_Regional';
    if (seedFilterGroup === 'MUTANT') return item.category === 'MUTANT_CROP';
    if (seedFilterGroup === 'ANIMAL') return item.category === 'ANIMAL';
    if (seedFilterGroup === 'AQUA') return item.category === 'AQUA';
    return true;
  });




  const selectedSeedObj =
    allPlantableCatalog.find((s) => s.id === selectedSeedId) ?? allPlantableCatalog[0];

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
            VAC ONLINE — XOAY NGANG ĐỂ NGẮM TRỌN NÔNG TRẠI 3 MIỀN!
          </h2>
          <p className="text-xs text-[#ffe8c2] max-w-xs mb-5 leading-relaxed">
            Giao diện <b>VAC Online — Game Nông Trại 3 Miền Việt Nam</b> được thiết kế tối ưu theo chiều ngang (2-Thumb Landscape) cho Mobile PWA, iOS, Android &amp; iPad.
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
      <header className="fixed top-0 left-0 right-0 z-20 safe-top safe-left safe-right pointer-events-none flex flex-nowrap items-center justify-between gap-1.5 px-2 py-1">
        {/* Cụm Trái: Hồ sơ Điền chủ + Năng lượng ⚡ + Thời tiết */}
        <div className="pointer-events-auto min-w-0 overflow-x-auto flex items-center [&>*]:shrink-0 gap-1.5 bg-[#321b0d]/92 border-2 border-[#c88a4b] rounded-full px-2.5 py-1 text-[#fff8eb] shadow-lg backdrop-blur-xs">
          <button
            onClick={() => setActiveModal('REGISTER')}
            className="touch-btn bg-[#c88a4b] text-[#2a180c] font-extrabold px-2.5 py-0.5 rounded-full text-xs cursor-pointer shrink-0 max-w-[220px] truncate"
            title="Đổi Tên & Quê Hương 3 Miền"
          >
            {gender === 'FEMALE' ? '👧' : '👦'} {playerName} (Lv.{level}) • {REGION_INFO[region].shortName}
          </button>
          <button
            onClick={() => {
              setAuthModalTab(accountType === 'GUEST' ? 'GUEST' : 'LOGIN');
              setActiveModal('AUTH_GATE');
            }}
            className={`touch-btn font-extrabold px-2 py-0.5 rounded-full text-[11px] cursor-pointer ${
              accountType === 'GUEST'
                ? 'bg-[#ff9800] text-[#2a180c] border border-white'
                : 'bg-[#4e8222] text-white border border-[#b8f272]'
            }`}
            title="Mở Cổng Tài Khoản: Đăng Nhập / Đăng Ký / Chơi Khách / Quên Mật Khẩu"
          >
            {accountType === 'GUEST' ? '👤 Khách 🔗+50💎' : '🛡️ Tài Khoản'}
          </button>
          <XpBar />
          <StaminaBadge />
          <button
            onClick={() => {
              cycleWeather();
              const nextWeather = useGameStore.getState().weather;
              soundFX.syncWithWeather(nextWeather);
            }}
            className="touch-btn bg-[#2e8b8d] text-white text-[11px] font-bold px-2 py-0.5 rounded-full cursor-pointer"
            title="Bấm thử đổi Thời tiết 3 miền (Tự động chuyển âm thanh thiên nhiên)"
          >
            {weatherBadge}
          </button>
        </div>

        {/* Cụm Giữa: Loa Phường Toàn Server Realtime + Xin Vía */}
        <div className="pointer-events-auto min-w-0 flex-1 hidden lg:flex bg-gradient-to-r from-[#8b1e1e]/95 to-[#b82828]/95 border-2 border-[#f5b82e] px-3 py-1 rounded-full text-[11px] md:text-xs text-white items-center gap-2 shadow-lg">
          <span className="truncate min-w-0">
            📢 <b>LOA:</b> {loaPhuongText}
          </span>
          {isStageOpen(4) && (
          <button
            onClick={() => {
              soundFX.playGoldenSparkle();
              claimLoaPhuongLucky();
            }}
            className="touch-btn bg-[#f5b82e] text-[#2a180c] font-extrabold px-2 py-0.5 rounded-full text-[11px] cursor-pointer shrink-0"
          >
            🧧 Xin Vía ({luckyPacketsLeft})
          </button>
          )}
        </div>

        {/* Cụm Phải: Vàng, Ngọc, Nhạc Nền 4 Chế Độ, Tua x60, Fullscreen PWA & Supabase Realtime */}
        <div className="pointer-events-auto shrink-0 flex items-center gap-1 bg-[#321b0d]/92 border-2 border-[#c88a4b] rounded-full px-2 py-1 text-[#fff8eb] shadow-lg">
          <span className="bg-[#3e2723] border border-[#f5b82e] px-2 py-0.5 rounded-full text-xs font-extrabold">
            🪙 {gold.toLocaleString()}
          </span>
          <span className="bg-[#1a3a3a] border border-[#4dd0e1] px-2 py-0.5 rounded-full text-xs font-extrabold">
            💎 {gems}
          </span>
          <button
            onClick={() => {
              const playing = soundFX.toggleFolkBgm();
              setIsBgmPlaying(playing);
              const meta = soundFX.getCurrentTrackMeta();
              setToast(
                playing
                  ? `🎵 Đang phát: ${meta.name} — ${meta.description}`
                  : '🔇 Đã tắt Nhạc Nền Đồng Quê.'
              );
            }}
            className={`touch-btn border text-[11px] font-bold px-2 py-0.5 rounded-full cursor-pointer ${
              isBgmPlaying
                ? 'bg-[#f5b82e] border-white text-[#2a180c]'
                : 'bg-[#3e2413] border-[#c88a4b] text-[#fff8eb]'
            }`}
            title="Bật / Tắt Nhạc Nền Ngũ Cung Đồng Quê"
          >
            {isBgmPlaying ? `🎵 ${soundFX.getCurrentTrackMeta().shortLabel}` : '🎵 Nhạc Quê'}
          </button>
          <button
            onClick={() => {
              const nextMeta = soundFX.cycleBgmTrack();
              setIsBgmPlaying(true);
              setToast(`🎶 Đổi giai điệu: ${nextMeta.name} — ${nextMeta.description}`);
            }}
            className="touch-btn bg-[#6e4121] border border-[#f5b82e] text-[#fff8eb] text-[11px] font-bold px-2 py-0.5 rounded-full cursor-pointer"
            title="Đổi qua 4 Bản Nhạc Nền Đồng Quê (Bình Minh / Trưa Hè / Đêm Trăng / Hội Làng)"
          >
            🎼 Đổi Nhạc
          </button>
          {IS_DEV && (
            <button
              onClick={fastForwardTime}
              className="touch-btn bg-[#b83224] border border-[#ffeb3b] text-white text-[11px] font-bold px-2 py-0.5 rounded-full cursor-pointer"
              title="Tua nhanh x60"
            >
              ⏩ x60
            </button>
          )}
          <button
            onClick={toggleFullScreenPWA}
            className="touch-btn bg-[#4e8222] text-white text-[11px] font-bold px-2 py-0.5 rounded-full cursor-pointer"
            title="Toàn màn hình Mobile PWA / iPad"
          >
            ⛶
          </button>
          <button
            onClick={() => setActiveModal('SUPABASE_CONFIG')}
            className="touch-btn bg-[#2e8b8d] border border-[#80deea] text-white text-[11px] font-bold px-2 py-0.5 rounded-full cursor-pointer"
          >
            🟢 Online ({onlineFarmersCount})
          </button>
        </div>
      </header>

      {/* =================================================================== */}
      {/* 2. VÙNG NGÓN CÁI TRÁI (KHAY 81 HẠT GIỐNG/VẬT NUÔI/CÁ + GIỎ THỢ + VÉT AO) */}
      {/* =================================================================== */}
      <aside className="fixed left-0 top-14 z-20 safe-left pointer-events-none flex flex-col gap-1.5">
        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setIsSeedDrawerOpen(!isSeedDrawerOpen)}
            className="touch-btn bg-[#321b0d]/95 border-2 border-[#f5b82e] text-[#fff8eb] font-extrabold px-3 py-1 rounded-r-xl text-xs shadow-lg cursor-pointer"
          >
            <span>
              <span className="short:hidden">🌱 Đang chọn: </span>
              {selectedSeedObj.emoji} {selectedSeedObj.name}
              <span className="short:hidden">
                {' '}({seedTrayCatalog.filter((i) => canPlant(i, level, GAME_STAGE, region).ok).length}/{seedTrayCatalog.length} loài)
              </span>{' '}
              {isSeedDrawerOpen ? '◀' : '▶'}
            </span>
          </button>

          {isStageOpen(2) && (
          <button
            onClick={claimWorkerPantry}
            className="touch-btn bg-[#f5b82e] border-2 border-[#6e4121] text-[#2a180c] font-extrabold px-2.5 py-1 rounded-xl text-xs shadow-lg cursor-pointer"
          >
            🧺 Giỏ Thợ: {workerPantryCount}/120
          </button>
          )}

          <button
            onClick={dredgePondMud}
            className="touch-btn bg-[#2e8b8d] border-2 border-[#80deea] text-white font-extrabold px-2.5 py-1 rounded-xl text-xs shadow-lg cursor-pointer"
          >
            <span>
              🪣 <span className="short:hidden">Vét Bùn Ao (</span>
              {pondMudCounter}/10
              <span className="short:hidden"> • -3⚡) [Kho: {inventory.ITEM_BUN_PHU_SA ?? 0}]</span>
              <span className="hidden short:inline"> • 🟫{inventory.ITEM_BUN_PHU_SA ?? 0}</span>
            </span>
          </button>

          <button
            onClick={expandWildLand}
            className="touch-btn bg-[#6e4121] border-2 border-[#c88a4b] text-[#fff8eb] font-bold px-2.5 py-1 rounded-xl text-xs shadow-lg cursor-pointer"
          >
            <span>
              🪓 <span className="short:hidden">Khai Hoang (</span>
              {wildPlotsUnlocked}/25
              <span className="short:hidden"> • -5⚡)</span>
            </span>
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
          <div className="pointer-events-auto bg-[#fff8eb]/95 border-2 border-[#6e4121] rounded-r-xl p-1.5 shadow-xl flex flex-col gap-1 max-w-[94vw] sm:max-w-[740px] short:max-h-[45dvh] short:overflow-y-auto">
            {/* Thanh lọc nhanh 81 giống Vườn - Ao - Chuồng */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[11px]">
              {[
                { id: 'ALL', label: `🌾 Tất cả (${seedTrayCatalog.length})` },
                { id: 'CROP_COMMON', label: '🌱 Cây Ruộng' },
                { id: 'TREE_COMMON', label: '🌳 Cây Lâu Năm' },
                { id: 'REGIONAL', label: '🌸 Đặc Sản Miền' },
                { id: 'MUTANT', label: '🧬 Đột Biến' },
                { id: 'ANIMAL', label: '🐄 Vật Nuôi' },
                { id: 'AQUA', label: '🐟 Thủy Sản' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSeedFilterGroup(tab.id as typeof seedFilterGroup)}
                  className={`px-2 py-0.5 rounded-full font-bold shrink-0 cursor-pointer border ${
                    seedFilterGroup === tab.id
                      ? 'bg-[#6e4121] text-[#f5b82e] border-[#2a180c]'
                      : 'bg-[#fffdf7] text-[#664930] border-[#c88a4b]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              {filteredPlantableCatalog.map((item) => {
                const locked = !canPlant(item, level, GAME_STAGE, region).ok;
                return (
                  <button
                    key={item.id}
                    disabled={locked}
                    onClick={() => {
                      setSelectedSeed(item.id);
                      if (isShortScreen()) setIsSeedDrawerOpen(false);
                    }}
                    title={locked ? `Mở ở Lv.${item.unlockLevel}` : undefined}
                    className={`touch-btn px-2.5 py-1 rounded-lg font-bold border text-xs shrink-0 ${
                      locked
                        ? 'bg-[#efe6d6] text-[#9a8a76] border-[#d8c8a8] cursor-not-allowed'
                        : selectedSeedId === item.id
                        ? 'bg-[#4e8222] text-white border-[#2a180c] shadow-inner cursor-pointer'
                        : 'bg-white text-[#2a180c] border-[#c88a4b] cursor-pointer'
                    }`}
                  >
                    {locked ? '🔒 ' : ''}
                    {item.emoji} {item.name} ({item.buyCostGold}🪙 • Lv.{item.unlockLevel})
                  </button>
                );
              })}
            </div>
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
      {/* 5. FLOATING BOTTOM 2-THUMB DOCK (CHAT TRÁI + 8 NÚT TÍNH NĂNG PHẢI)  */}
      {/* =================================================================== */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 safe-bottom safe-left safe-right pointer-events-none flex flex-wrap short:flex-nowrap items-center justify-between gap-1.5 px-2 py-1">
        {/* Ngón cái trái: Khung Chat Làng Xóm Realtime */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#321b0d]/92 border-2 border-[#c88a4b] rounded-full px-2.5 py-1 text-[#fff8eb] shadow-lg max-w-full sm:max-w-[300px] flex-1 short:flex-none short:max-w-[180px]">
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
            className="bg-[#fff8eb] text-[#2a180c] text-xs px-2 py-0.5 rounded-full border border-[#c88a4b] w-20 short:w-14"
          />
        </div>

        {/* Ngón cái phải: 8 Nút Action Dock chuẩn Ergonomic */}
        <div className="pointer-events-auto flex items-center gap-1 overflow-x-auto max-w-full bg-[#321b0d]/92 border-2 border-[#c88a4b] rounded-full px-2 py-1 shadow-lg short:flex-1 short:min-w-0">
          <button
            onClick={() => setActiveModal('ENCYCLOPEDIA')}
            className="touch-btn bg-gradient-to-r from-[#ff9800] to-[#f5b82e] border border-white text-[#2a180c] text-xs font-extrabold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            📖 {GAME_CATALOG.length} Thực Thể
          </button>
          <button
            onClick={() => setActiveModal('COOP_QUESTS')}
            className="touch-btn bg-[#4e8222] border border-[#b8f272] text-white text-xs font-extrabold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            {isStageOpen(3) ? '🚂 Tàu Hỏa & HTX' : '📜 Gia Phả & Quà'}
          </button>
          <button
            onClick={() => setActiveModal('WAREHOUSE')}
            className="touch-btn bg-[#6e4121] border border-[#f5b82e] text-[#fff8eb] text-xs font-extrabold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            🧺 Kho &amp; Bán HTX
          </button>
          {isStageOpen(2) && (
          <button
            onClick={() => setActiveModal('WORKERS')}
            className="touch-btn bg-[#b83224] border border-[#ffeb3b] text-white text-xs font-bold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            🛖 Lán Thợ ({workerAutoTickEnabled ? '🟢Auto' : '⏸️'})
          </button>
          )}
          {isStageOpen(4) && (
          <button
            onClick={() => setActiveModal('BENCHMARK')}
            className="touch-btn bg-[#f5b82e] text-[#2a180c] text-xs font-extrabold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            ⛩️ Đình Làng &amp; Lễ Cưới
          </button>
          )}
          {isStageOpen(2) && (
          <button
            onClick={() => setActiveModal('COOKING')}
            className="touch-btn bg-[#388e3c] text-white text-xs font-bold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            🍲 8 Xưởng &amp; Bếp
          </button>
          )}
          {isStageOpen(3) && (
          <button
            onClick={() => setActiveModal('MARKET_STEAL')}
            className="touch-btn bg-[#2e8b8d] text-white text-xs font-bold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            📰 Chợ &amp; Lưu Bút
          </button>
          )}
          {isStageOpen(4) && (
          <button
            onClick={() => setActiveModal('LIVEOPS')}
            className="touch-btn bg-[#9b5de5] text-white text-xs font-bold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            🏮 Lịch, Vé Số &amp; IAP
          </button>
          )}
          {isStageOpen(4) && (
          <button
            onClick={() => setActiveModal('FASHION')}
            className="touch-btn bg-[#6e4121] border border-[#c88a4b] text-[#fff8eb] text-xs font-bold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            🪞 12 Slots
          </button>
          )}
          <button
            onClick={() => {
              setAuthModalTab('LOGIN');
              setActiveModal('AUTH_GATE');
            }}
            className="touch-btn bg-[#b83224] border border-[#f5b82e] text-white text-xs font-extrabold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            ⛩️ Cổng Đăng Nhập
          </button>
          {IS_DEV && (
            <button
              onClick={() => {
                const results = runFullQCTestSuite();
                setQcResults(results);
                setActiveModal('QC_REPORT');
              }}
              className="touch-btn bg-[#0f766e] border border-[#5eead4] text-white text-xs font-extrabold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
            >
              🧪 QC Test (DEV)
            </button>
          )}
        </div>
      </footer>

      {/* ===================================================================== */}
      {/* CÁC CỬA SỔ MODAL GỖ / TRE / GIẤY DÓ                                   */}
      {/* ===================================================================== */}

      {/* MODAL ĐẠI TỪ ĐIỂN BÁCH KHOA 155 THỰC THỂ & ĐỒNG BỘ SUPABASE CLOUD */}
      {activeModal === 'ENCYCLOPEDIA' && <EncyclopediaModal />}

      {/* MODAL PHASE 1 + DLC 1: BẢNG ĐƠN HTX, GA TÀU THỐNG NHẤT BẮC NAM, CỐT TRUYỆN & 7 NGÀY TÂN THỦ */}
      {activeModal === 'COOP_QUESTS' && <CoopQuestsModal />}

      {activeModal === 'WAREHOUSE' && <WarehouseModal />}
      {activeModal === 'EXPAND_LAND' && <ExpandLandModal />}

      {/* MODAL 1: LÁN THỢ ĐỒNG QUÊ & QUẢN LÝ 6 GIA NHÂN (CÓ WORKER STATE MACHINE AUTO-TICK) */}
      {activeModal === 'WORKERS' && <WorkersModal />}

      {/* MODAL 2: ĐÌNH LÀNG, VƯỜN ƯƠM ĐỘT BIẾN, ĐUA THUYỀN RỒNG, LỄ CƯỚI QUÊ & HOMESTAY (DLC 2, 3, 4) */}
      {activeModal === 'BENCHMARK' && <BenchmarkModal />}

      {/* MODAL 3: 8 XƯỞNG CHẾ BIẾN SÂU & 27 MÓN ĂN BẾP CỦI QUÊ MẸ */}
      {activeModal === 'COOKING' && <CookingModal />}

      {/* MODAL 4: BÁO CHỢ PHIÊN 3 MIỀN, ĐĂNG BÁN CLOUD, THĂM NHÀ HÁI TRỘM & SỔ LƯU BÚT CỔNG LÀNG */}
      {activeModal === 'MARKET_STEAL' && <MarketStealModal />}

      {/* MODAL 5: LỊCH BLOC, ĐẬP NIÊU GACHA, XỔ SỐ 18:00 & CỬA HÀNG 4 GÓI IAP CHIẾN LƯỢC */}
      {activeModal === 'LIVEOPS' && <LiveOpsModal />}

      {/* MODAL 6: TỦ ĐỒ 12 SLOTS THỜI TRANG & TRANSMOG */}
      {activeModal === 'FASHION' && <FashionModal />}

      {/* MODAL 7: GIẤY ĐĂNG KÝ VỀ QUÊ LẬP NGHIỆP (CHỌN NHÂN VẬT & 3 MIỀN) */}
      {activeModal === 'REGISTER' && <RegisterModal tempName={tempName} setTempName={setTempName} tempGender={tempGender} setTempGender={setTempGender} tempRegion={tempRegion} setTempRegion={setTempRegion} />}

      {/* MODAL 8: TRẠNG THÁI SUPABASE CLOUD & REALTIME */}
      {activeModal === 'SUPABASE_CONFIG' && <SupabaseConfigModal />}

      {/* MODAL BÁO CÁO KIỂM THỬ QC TỰ ĐỘNG (EPIC 01 -> EPIC 10) */}
      {/* MÀN HÌNH 0A: SPLASH & LOADING 4 BƯỚC KHI MỞ GAME */}
      {showSplashScreen && (
        <SplashAndAuthGate
          mode="SPLASH"
          onFinishSplash={() => {
            setShowSplashScreen(false);
            const saved = getSavedAuthSession();
            if (saved) {
              applyAuthAccount(saved, false, false);
            } else {
              setAuthModalTab('LOGIN');
              setActiveModal('AUTH_GATE');
            }
          }}
          onAuthSuccess={(acc, isNew, isUpgrade) => {
            setShowSplashScreen(false);
            applyAuthAccount(acc, isNew, isUpgrade);
          }}
        />
      )}

      {/* MÀN HÌNH 0B: CỔNG LÀNG XÁC THỰC (ĐĂNG NHẬP / ĐĂNG KÝ / CHƠI KHÁCH / QUÊN MK OTP) */}
      {activeModal === 'AUTH_GATE' && (
        <SplashAndAuthGate
          mode="AUTH_MODAL"
          initialTab={authModalTab}
          onFinishSplash={() => setShowSplashScreen(false)}
          onAuthSuccess={(acc, isNew, isUpgrade) => {
            setTempName(acc.playerName);
            setTempGender(acc.gender);
            setTempRegion(acc.region);
            applyAuthAccount(acc, isNew, isUpgrade);
          }}
          onCloseModal={() => setActiveModal(null)}
        />
      )}

      {IS_DEV && activeModal === 'QC_REPORT' && <QcReportModal qcResults={qcResults} setQcResults={setQcResults} />}
    </div>
  );
};
