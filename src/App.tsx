import React, { useEffect, useState } from 'react';
import { PhaserGame } from './game/PhaserGame';
import { EventBus } from './game/EventBus';
import { useGameStore } from './store/useGameStore';
import { GAME_CATALOG, REGION_INFO } from './data/masterData';
import { GenderType, HiredWorkerState, RegionType } from './data/types';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
} from './services/supabaseClient';
import { QCTestResult, runFullQCTestSuite } from './services/qcTestRunner';
import { soundFX } from './services/soundEffects';
import { exportAchievementCertificate } from './services/certificateExporter';
import { AuthTabMode, SplashAndAuthGate } from './components/SplashAndAuthGate';
import { getSavedAuthSession } from './services/authService';

export const App: React.FC = () => {
  const {
    playerName,
    accountType,
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
    trainVouchers,
    dragonBoatMeters,
    npcHearts,
    isMarried,
    homestayLevel,
    lodgeDiningTableMeals,
    workerAutoTickEnabled,
    workerPantryCount,
    pondMudCounter,
    wildPlotsUnlocked,
    weather,
    dinhLangStage,
    mutantPityCount,
    activeTotemBuff,
    loaPhuongText,
    luckyPacketsLeft,
    onlineFarmersCount,
    dbTablesStatus,
    rookieDaysClaimed,
    lotteryTickets,
    transmogItemId,
    fashionContestEntered,
    toastMessage,
    activeModal,
    visitingFriendName,
    selectedSeedId,
    inventory,
    workers,
    marketListings,
    guestbookEntries,
    coopOrders,
    trainCrates,
    storyQuests,
    chatMessages,
    initSupabaseRealtimeSync,
    syncCatalogToSupabaseCloud,
    postItemToMarket,
    signFriendGuestbook,
    tickWorkerAutomation,
    toggleWorkerAutoTick,
    addMealsToLodgeTable,
    fillTrainCrate,
    rowDragonBoatDerby,
    giftNpcForMarriage,
    serveHomestayGuests,
    setToast,
    setActiveModal,
    setProfile,
    applyAuthAccount,
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
    craftOrBuyCatalogItem,
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
    fuseDuplicateFashion,
    setTransmogSlot,
    enterFashionContest,
    simulateOfflineWorkerProgress,
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
  const [guestbookInput, setGuestbookInput] = useState(
    'Vườn cây trĩu quả đẹp quá, chúc điền chủ vụ mùa đại thắng!'
  );
  const [tempName, setTempName] = useState(playerName);
  const [tempGender, setTempGender] = useState<GenderType>(gender);
  const [tempRegion, setTempRegion] = useState<RegionType>(region);
  const [qcResults, setQcResults] = useState<QCTestResult[]>([]);
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState<boolean>(true);
  const [authModalTab, setAuthModalTab] = useState<AuthTabMode>('LOGIN');

  const [isSeedDrawerOpen, setIsSeedDrawerOpen] = useState(true);
  const [seedFilterGroup, setSeedFilterGroup] = useState<
    'ALL' | 'CROP_COMMON' | 'TREE_COMMON' | 'REGIONAL' | 'MUTANT' | 'ANIMAL' | 'AQUA'
  >('ALL');

  const [encycCategory, setEncycCategory] = useState<string>('ALL');
  const [encycRegion, setEncycRegion] = useState<'ALL' | RegionType>('ALL');
  const [encycSearch, setEncycSearch] = useState<string>('');

  const [sellItemId, setSellItemId] = useState<string>('CROP_01');
  const [sellQty, setSellQty] = useState<number>(5);

  const [isPortraitMobile, setIsPortraitMobile] = useState(false);
  const [dismissPortraitWarning, setDismissPortraitWarning] = useState(false);

  const initialCreds = getSupabaseCredentials();
  const [sbUrl, setSbUrl] = useState(initialCreds.url);
  const [sbKey, setSbKey] = useState(initialCreds.anonKey);

  useEffect(() => {
    initSupabaseRealtimeSync();
    const checkOrientation = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setIsPortraitMobile(h > w && w < 768);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);

    // Vòng lặp tự động hóa của 6 Nhân công Lán Thợ mỗi 10 giây
    const workerTimer = window.setInterval(() => {
      useGameStore.getState().tickWorkerAutomation();
    }, 10_000);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.clearInterval(workerTimer);
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

  const filteredPlantableCatalog = allPlantableCatalog.filter((item) => {
    if (seedFilterGroup === 'ALL') return true;
    if (seedFilterGroup === 'CROP_COMMON') return item.subGroup === 'Crop_Common';
    if (seedFilterGroup === 'TREE_COMMON') return item.subGroup === 'Crop_Tree_Common';
    if (seedFilterGroup === 'REGIONAL') return item.subGroup === 'Crop_Regional';
    if (seedFilterGroup === 'MUTANT') return item.category === 'MUTANT_CROP';
    if (seedFilterGroup === 'ANIMAL') return item.category === 'ANIMAL';
    if (seedFilterGroup === 'AQUA') return item.category === 'AQUA';
    return true;
  });

  const machineList = GAME_CATALOG.filter((c) => c.category === 'MACHINE');
  const recipeList = GAME_CATALOG.filter((c) => c.category === 'RECIPE');
  const fashionList = GAME_CATALOG.filter((c) => c.category === 'FASHION');
  const iapList = GAME_CATALOG.filter((c) => c.category === 'IAP');

  const sellableInventoryItems = GAME_CATALOG.filter(
    (c) => (inventory[c.id] ?? 0) > 0 && c.baseSellGold > 0
  );
  const currentSellSpec =
    GAME_CATALOG.find((c) => c.id === sellItemId) ?? sellableInventoryItems[0] ?? GAME_CATALOG[0];

  const filteredEncyclopedia = GAME_CATALOG.filter((item) => {
    const matchCat =
      encycCategory === 'ALL'
        ? true
        : encycCategory === 'CROPS_TREES'
        ? item.category === 'CROP' || item.category === 'TREE' || item.category === 'MUTANT_CROP'
        : encycCategory === 'ANIMALS_PETS'
        ? item.category === 'ANIMAL' || item.category === 'PET'
        : encycCategory === 'AQUA'
        ? item.category === 'AQUA'
        : encycCategory === 'MACHINES'
        ? item.category === 'MACHINE'
        : encycCategory === 'RECIPES_CRAFT'
        ? item.category === 'RECIPE' || item.category === 'CRAFT_GEAR'
        : encycCategory === 'FASHION'
        ? item.category === 'FASHION'
        : item.category === 'WORKER' ||
          item.category === 'BENCHMARK_FEATURE' ||
          item.category === 'DEFENSE' ||
          item.category === 'IAP';

    const matchReg = encycRegion === 'ALL' ? true : item.region === encycRegion;
    const matchSearch =
      !encycSearch.trim() ||
      item.name.toLowerCase().includes(encycSearch.toLowerCase()) ||
      item.id.toLowerCase().includes(encycSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(encycSearch.toLowerCase());

    return matchCat && matchReg && matchSearch;
  });

  const currentWorker = workers.find((w) => w.code === selectedWorkerCode) ?? workers[0];
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
      <header className="fixed top-0 left-0 right-0 z-20 safe-top safe-left safe-right pointer-events-none flex flex-wrap items-center justify-between gap-1.5 px-2 py-1">
        {/* Cụm Trái: Hồ sơ Điền chủ + Năng lượng ⚡ + Thời tiết */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#321b0d]/92 border-2 border-[#c88a4b] rounded-full px-2.5 py-1 text-[#fff8eb] shadow-lg backdrop-blur-xs">
          <button
            onClick={() => setActiveModal('REGISTER')}
            className="touch-btn bg-[#c88a4b] text-[#2a180c] font-extrabold px-2.5 py-0.5 rounded-full text-xs cursor-pointer"
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
            {accountType === 'GUEST' ? '👤 Khách [🔗 Liên Kết +50💎]' : '🛡️ Tài Khoản'}
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

        {/* Cụm Giữa: Loa Phường Toàn Server Realtime + Xin Vía */}
        <div className="pointer-events-auto bg-gradient-to-r from-[#8b1e1e]/95 to-[#b82828]/95 border-2 border-[#f5b82e] px-3 py-1 rounded-full text-[11px] md:text-xs text-white flex items-center gap-2 shadow-lg">
          <span className="truncate max-w-[170px] sm:max-w-[270px] md:max-w-none">
            📢 <b>LOA:</b> {loaPhuongText}
          </span>
          <button
            onClick={claimLoaPhuongLucky}
            className="touch-btn bg-[#f5b82e] text-[#2a180c] font-extrabold px-2 py-0.5 rounded-full text-[11px] cursor-pointer shrink-0"
          >
            🧧 Xin Vía ({luckyPacketsLeft})
          </button>
        </div>

        {/* Cụm Phải: Vàng, Ngọc, Tua x60, Fullscreen PWA & Supabase Realtime */}
        <div className="pointer-events-auto flex items-center gap-1 bg-[#321b0d]/92 border-2 border-[#c88a4b] rounded-full px-2 py-1 text-[#fff8eb] shadow-lg">
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
              setToast(
                playing
                  ? '🎵 Đã bật Nhạc Nền Ngũ Cung Đồng Quê (Sáo Trúc & Đàn Tranh)!'
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
            {isBgmPlaying ? '🎵 Nhạc: BẬT' : '🎵 Nhạc Quê'}
          </button>
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
            🌱 Đang chọn: {selectedSeedObj.emoji} {selectedSeedObj.name} ({allPlantableCatalog.length} loài) {isSeedDrawerOpen ? '◀' : '▶'}
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
          <div className="pointer-events-auto bg-[#fff8eb]/95 border-2 border-[#6e4121] rounded-r-xl p-1.5 shadow-xl flex flex-col gap-1 max-w-[94vw] sm:max-w-[740px]">
            {/* Thanh lọc nhanh 81 giống Vườn - Ao - Chuồng */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[11px]">
              {[
                { id: 'ALL', label: `🌾 Tất cả (${allPlantableCatalog.length})` },
                { id: 'CROP_COMMON', label: '🌱 22 Cây Ruộng' },
                { id: 'TREE_COMMON', label: '🌳 8 Cây Lâu Năm' },
                { id: 'REGIONAL', label: '🌸 15 Đặc Sản 3 Miền' },
                { id: 'MUTANT', label: '🧬 3 Đột Biến' },
                { id: 'ANIMAL', label: '🐄 14 Vật Nuôi Chuồng' },
                { id: 'AQUA', label: '🐟 19 Thủy Sản Ao' },
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
              {filteredPlantableCatalog.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedSeed(item.id)}
                  className={`touch-btn px-2.5 py-1 rounded-lg font-bold border text-xs shrink-0 cursor-pointer ${
                    selectedSeedId === item.id
                      ? 'bg-[#4e8222] text-white border-[#2a180c] shadow-inner'
                      : 'bg-white text-[#2a180c] border-[#c88a4b]'
                  }`}
                >
                  {item.emoji} {item.name} ({item.buyCostGold}🪙 • Lv.{item.unlockLevel})
                </button>
              ))}
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
      <footer className="fixed bottom-0 left-0 right-0 z-20 safe-bottom safe-left safe-right pointer-events-none flex flex-wrap items-center justify-between gap-1.5 px-2 py-1">
        {/* Ngón cái trái: Khung Chat Làng Xóm Realtime */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#321b0d]/92 border-2 border-[#c88a4b] rounded-full px-2.5 py-1 text-[#fff8eb] shadow-lg max-w-full sm:max-w-[300px] flex-1">
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
            className="bg-[#fff8eb] text-[#2a180c] text-xs px-2 py-0.5 rounded-full border border-[#c88a4b] w-20"
          />
        </div>

        {/* Ngón cái phải: 8 Nút Action Dock chuẩn Ergonomic */}
        <div className="pointer-events-auto flex items-center gap-1 overflow-x-auto max-w-full bg-[#321b0d]/92 border-2 border-[#c88a4b] rounded-full px-2 py-1 shadow-lg">
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
            🚂 Tàu Hỏa &amp; HTX
          </button>
          <button
            onClick={() => setActiveModal('WORKERS')}
            className="touch-btn bg-[#b83224] border border-[#ffeb3b] text-white text-xs font-bold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            🛖 Lán Thợ ({workerAutoTickEnabled ? '🟢Auto' : '⏸️'})
          </button>
          <button
            onClick={() => setActiveModal('BENCHMARK')}
            className="touch-btn bg-[#f5b82e] text-[#2a180c] text-xs font-extrabold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            ⛩️ Đình Làng &amp; Lễ Cưới
          </button>
          <button
            onClick={() => setActiveModal('COOKING')}
            className="touch-btn bg-[#388e3c] text-white text-xs font-bold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            🍲 8 Xưởng &amp; Bếp
          </button>
          <button
            onClick={() => setActiveModal('MARKET_STEAL')}
            className="touch-btn bg-[#2e8b8d] text-white text-xs font-bold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            📰 Chợ &amp; Lưu Bút
          </button>
          <button
            onClick={() => setActiveModal('LIVEOPS')}
            className="touch-btn bg-[#9b5de5] text-white text-xs font-bold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            🏮 Lịch, Vé Số &amp; IAP
          </button>
          <button
            onClick={() => setActiveModal('FASHION')}
            className="touch-btn bg-[#6e4121] border border-[#c88a4b] text-[#fff8eb] text-xs font-bold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            🪞 12 Slots
          </button>
          <button
            onClick={() => {
              setAuthModalTab('LOGIN');
              setActiveModal('AUTH_GATE');
            }}
            className="touch-btn bg-[#b83224] border border-[#f5b82e] text-white text-xs font-extrabold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            ⛩️ Cổng Đăng Nhập
          </button>
          <button
            onClick={() => {
              const results = runFullQCTestSuite();
              setQcResults(results);
              setActiveModal('QC_REPORT');
            }}
            className="touch-btn bg-[#0f766e] border border-[#5eead4] text-white text-xs font-extrabold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            🧪 QC Test (25 TC)
          </button>
        </div>
      </footer>

      {/* ===================================================================== */}
      {/* CÁC CỬA SỔ MODAL GỖ / TRE / GIẤY DÓ                                   */}
      {/* ===================================================================== */}

      {/* MODAL ĐẠI TỪ ĐIỂN BÁCH KHOA 155 THỰC THỂ & ĐỒNG BỘ SUPABASE CLOUD */}
      {activeModal === 'ENCYCLOPEDIA' && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-6xl w-full p-3 sm:p-4 max-h-[90dvh] overflow-y-auto shadow-2xl text-xs">
            <div className="bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex flex-wrap justify-between items-center gap-2 mb-3 text-xs sm:text-sm sticky top-0 z-10">
              <span>
                📖 ĐẠI TỪ ĐIỂN BÁCH KHOA TOÀN THƯ VAC ONLINE ({filteredEncyclopedia.length}/{GAME_CATALOG.length} THỰC THỂ ĐÃ NẠP)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={syncCatalogToSupabaseCloud}
                  className="touch-btn bg-[#2e8b8d] border border-[#80deea] text-white px-3 py-1 rounded-lg text-xs font-extrabold cursor-pointer"
                >
                  ☁️ Đẩy 155 Thực Thể Lên Supabase
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="touch-btn bg-[#b83224] text-white px-3 py-1 rounded-lg text-xs cursor-pointer"
                >
                  ✕ Đóng
                </button>
              </div>
            </div>

            {/* Bộ lọc Danh mục + Vùng miền + Tìm kiếm */}
            <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-2.5 mb-3 space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'ALL', label: `🌟 Tất cả (${GAME_CATALOG.length})` },
                  { id: 'CROPS_TREES', label: '🌱 48 Cây Trồng, Lâu Năm & Đột Biến' },
                  { id: 'ANIMALS_PETS', label: '🐄 19 Vật Nuôi Chuồng & Thú Cưng' },
                  { id: 'AQUA', label: '🐟 19 Thủy Sản Ao & Đầm Nước' },
                  { id: 'MACHINES', label: '🏭 8 Xưởng Máy Chế Biến Sâu' },
                  { id: 'RECIPES_CRAFT', label: '🍲 31 Món Ăn 3 Miền & Đồ Bảo Hộ' },
                  { id: 'FASHION', label: '🪞 12 Slots Thời Trang Truyền Thống' },
                  { id: 'FEATURES', label: '🛖 6 Nhân Công, Đình Làng & Sự Kiện' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setEncycCategory(c.id)}
                    className={`px-2.5 py-1 rounded-lg font-extrabold cursor-pointer border ${
                      encycCategory === c.id
                        ? 'bg-[#4e8222] text-white border-[#2a180c]'
                        : 'bg-[#fffdf7] text-[#2a180c] border-[#c88a4b]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#6e4121]">Vùng miền:</span>
                  {(['ALL', 'NORTH', 'CENTRAL', 'SOUTH'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setEncycRegion(r)}
                      className={`px-2.5 py-0.5 rounded-full font-bold cursor-pointer border ${
                        encycRegion === r
                          ? 'bg-[#f5b82e] text-[#2a180c] border-[#6e4121]'
                          : 'bg-[#fffdf7] text-[#664930] border-[#c88a4b]'
                      }`}
                    >
                      {r === 'ALL'
                        ? 'Toàn Quốc'
                        : r === 'NORTH'
                        ? '🎋 Miền Bắc'
                        : r === 'CENTRAL'
                        ? '⛰️ Miền Trung'
                        : '🥥 Miền Nam'}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={encycSearch}
                  onChange={(e) => setEncycSearch(e.target.value)}
                  placeholder="🔍 Tìm tên cây, cá, món ăn, mã ID (VD: CROP_S05, Cá Kho)..."
                  className="border-2 border-[#c88a4b] rounded-lg px-3 py-1 bg-[#fffdf7] w-full sm:w-80 font-bold"
                />
              </div>
            </div>

            {/* Lưới hiển thị chi tiết từng thực thể */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {filteredEncyclopedia.map((item) => {
                const isPlantable =
                  item.category === 'CROP' ||
                  item.category === 'TREE' ||
                  item.category === 'MUTANT_CROP' ||
                  item.category === 'ANIMAL' ||
                  item.category === 'AQUA';
                return (
                  <div
                    key={item.id}
                    className="bg-white border-2 border-[#c88a4b] rounded-xl p-2.5 flex flex-col justify-between gap-1.5 shadow-xs"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-extrabold text-[#2a180c] text-xs">
                          {item.emoji} {item.name}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#fff3e0] border border-[#c88a4b] shrink-0">
                          {item.id} • Lv.{item.unlockLevel}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 my-1 text-[10px] font-bold">
                        <span className="px-1.5 py-0.2 rounded bg-[#e8f5e9] text-[#1b5e20]">
                          {item.region === 'ALL' ? '3 Miền Chung' : `Đặc sản ${REGION_INFO[item.region].shortName}`}
                        </span>
                        {item.growOrCraftMinutes > 0 && (
                          <span className="px-1.5 py-0.2 rounded bg-[#e3f2fd] text-[#0d47a1]">
                            ⏱️ {item.growOrCraftMinutes} phút
                          </span>
                        )}
                        <span className="px-1.5 py-0.2 rounded bg-[#fff8e1] text-[#6e4121]">
                          🎒 Kho: {inventory[item.id] ?? 0}
                        </span>
                      </div>

                      {item.inputIngredients && (
                        <div className="text-[11px] text-[#b83224] font-semibold">
                          🔹 Nguyên liệu: {item.inputIngredients}
                        </div>
                      )}
                      <p className="text-[11px] text-[#664930] mt-0.5">{item.description}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#f0e6d2] pt-1.5 mt-1">
                      <div className="text-[11px] font-bold text-[#2a180c]">
                        Mua: <b>{item.buyCostGold.toLocaleString()}🪙</b> | Bán:{' '}
                        <b className="text-[#4e8222]">{item.baseSellGold.toLocaleString()}🪙</b>
                      </div>
                      <button
                        onClick={() => craftOrBuyCatalogItem(item.id)}
                        className={`touch-btn px-2.5 py-1 rounded-lg font-extrabold text-[11px] cursor-pointer ${
                          isPlantable
                            ? 'bg-[#4e8222] text-white'
                            : 'bg-[#f5b82e] text-[#2a180c]'
                        }`}
                      >
                        {isPlantable ? '🌱 Chọn Gieo/Nuôi' : '⚡ Chế Biến / Sở Hữu'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL PHASE 1 + DLC 1: BẢNG ĐƠN HTX, GA TÀU THỐNG NHẤT BẮC NAM, CỐT TRUYỆN & 7 NGÀY TÂN THỦ */}
      {activeModal === 'COOP_QUESTS' && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-6xl w-full p-3 sm:p-4 max-h-[90dvh] overflow-y-auto shadow-2xl text-xs">
            <div className="bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex justify-between items-center mb-3 text-xs sm:text-sm sticky top-0 z-10">
              <span>🚂 GA TÀU THỐNG NHẤT BẮC – NAM, ĐƠN HỢP TÁC XÃ, CỐT TRUYỆN &amp; 7 NGÀY TÂN THỦ</span>
              <button
                onClick={() => setActiveModal(null)}
                className="touch-btn bg-[#b83224] text-white px-3 py-1 rounded-lg text-xs cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Cột 1: Ga Tàu Thống Nhất Bắc - Nam */}
              <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-sm text-[#b83224]">
                    🚂 1. Ga Tàu Thống Nhất
                  </h4>
                  <span className="bg-[#fff3e0] border border-[#c88a4b] px-2 py-0.5 rounded font-extrabold text-[11px]">
                    🎟️ Voucher: {trainVouchers}
                  </span>
                </div>
                <p className="text-[11px] text-[#664930]">
                  Đóng thùng Đặc sản 3 Miền lên 3 Toa Tàu để nhận <b>Voucher Tàu Hỏa</b> đổi <b>🐃 Trâu Đen Cày Ruộng (-10% t/g chín)</b>!
                </p>
                {trainCrates.map((cr) => (
                  <div key={cr.id} className="p-2 rounded-lg border border-[#c88a4b] bg-[#fffdf7] space-y-1">
                    <div className="font-extrabold text-[#2a180c]">{cr.carriageName}</div>
                    <div className="text-[11px] text-[#664930]">
                      Cần: <b>{cr.emoji} {cr.requiredQty} {cr.itemName}</b> (Kho: {inventory[cr.itemId] ?? 0})
                    </div>
                    <div className="text-[11px] font-bold text-[#4e8222]">
                      Thưởng: +{cr.rewardGold} 🪙 | +{cr.rewardVoucher} 🎟️ Voucher
                    </div>
                    <button
                      disabled={cr.filled}
                      onClick={() => fillTrainCrate(cr.id)}
                      className={`touch-btn w-full font-extrabold py-1 rounded-lg cursor-pointer ${
                        cr.filled ? 'bg-gray-300 text-gray-600' : 'bg-[#b83224] text-white'
                      }`}
                    >
                      {cr.filled ? '✅ Đã Đóng Toa' : '🚂 Đóng Toa Tàu Ngay'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Cột 2: Bảng Đơn Hàng Hợp Tác Xã */}
              <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 space-y-2">
                <h4 className="font-extrabold text-sm text-[#4e8222]">
                  🚚 2. Bảng Đơn Hợp Tác Xã
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
                        ord.completed ? 'bg-gray-300 text-gray-600' : 'bg-[#4e8222] text-white'
                      }`}
                    >
                      {ord.completed ? '✅ Đã Giao Hàng' : '📦 Giao Đơn Hàng Ngay'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Cột 3: Biên Niên Sử Cốt Truyện 10 Chương & Đối Thoại Phân Nhánh */}
              <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 space-y-2 max-h-[65dvh] overflow-y-auto">
                <h4 className="font-extrabold text-sm text-[#6e4121] sticky top-0 bg-white pb-1 border-b border-[#e0d4c0]">
                  📜 3. Gia Phả 10 Chương ({storyQuests.filter((q) => q.completed).length}/10)
                </h4>
                {storyQuests.map((q) => (
                  <div key={q.id} className="p-2.5 rounded-lg border border-[#c88a4b] bg-[#fff3e0] space-y-1.5">
                    <div className="font-extrabold text-[#b83224]">{q.chapter}</div>
                    <div className="font-bold text-[#2a180c]">{q.title}</div>
                    <div className="bg-white/90 border-l-4 border-[#6e4121] px-2 py-1 rounded text-[11px] italic text-[#3e2413]">
                      <b>{q.npcSpeaker}:</b> {q.npcQuote}
                    </div>
                    <p className="text-[11px] text-[#664930]">{q.desc}</p>
                    <div className="text-[11px] font-extrabold text-[#4e8222]">
                      Thưởng chương: +{q.rewardGold.toLocaleString()} 🪙 &amp; +{q.rewardGems} 💎 Ngọc
                    </div>
                    {q.completed ? (
                      <div className="bg-[#e8f5e9] border border-[#4e8222] text-[#1b5e20] font-extrabold text-center py-1 rounded-lg text-[11px]">
                        ✅ Đã Mở Trang Gia Phả ({q.selectedChoice === 'PRAG' ? 'Nhánh Thực Dụng' : 'Nhánh Nghĩa Tình'})
                      </div>
                    ) : (
                      <div className="space-y-1 pt-0.5">
                        <button
                          onClick={() => claimStoryQuest(q.id, 'EMP')}
                          className="touch-btn w-full bg-[#4e8222] text-white font-extrabold py-1 px-2 rounded-lg cursor-pointer text-[11px] text-left"
                        >
                          {q.choiceEmpLabel}
                        </button>
                        <button
                          onClick={() => claimStoryQuest(q.id, 'PRAG')}
                          className="touch-btn w-full bg-[#f5b82e] text-[#2a180c] font-extrabold py-1 px-2 rounded-lg cursor-pointer text-[11px] text-left"
                        >
                          {q.choicePragLabel}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Cột 4: 7 Ngày Tân Thủ */}
              <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 space-y-2">
                <h4 className="font-extrabold text-sm text-[#2e8b8d]">
                  🎁 4. Quà 7 Ngày Tân Thủ ({rookieDaysClaimed}/7)
                </h4>
                <p className="text-[11px] text-[#664930]">
                  Điểm danh đủ 7 ngày nhận miễn phí <b>🐕 Chó Phú Quốc Giữ Nhà (Bắt trộm 70%)</b> &amp; <b>Áo Bà Ba Lụa Hà Đông</b>!
                </p>
                <div className="grid grid-cols-1 gap-1 text-[11px]">
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

      {/* MODAL 1: LÁN THỢ ĐỒNG QUÊ & QUẢN LÝ 6 GIA NHÂN (CÓ WORKER STATE MACHINE AUTO-TICK) */}
      {activeModal === 'WORKERS' && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-5xl w-full p-3 sm:p-4 max-h-[88dvh] overflow-y-auto shadow-2xl">
            <div className="bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex flex-wrap justify-between items-center gap-2 mb-3 text-xs sm:text-sm sticky top-0 z-10">
              <span>🛖 LÁN THỢ ĐỒNG QUÊ &amp; VÒNG LẶP TỰ ĐỘNG HÓA 6 GIA NHÂN (WORKER STATE MACHINE)</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleWorkerAutoTick}
                  className={`touch-btn px-2.5 py-1 rounded-lg text-xs font-extrabold cursor-pointer ${
                    workerAutoTickEnabled ? 'bg-[#4e8222] text-white' : 'bg-gray-500 text-white'
                  }`}
                >
                  {workerAutoTickEnabled ? '🟢 Auto-Tick: ĐANG BẬT' : '⏸️ Auto-Tick: TẠM DỪNG'}
                </button>
                <button
                  onClick={tickWorkerAutomation}
                  className="touch-btn bg-[#f5b82e] text-[#2a180c] px-2.5 py-1 rounded-lg text-xs font-extrabold cursor-pointer"
                >
                  ⚡ Chạy Ca Thợ Ngay
                </button>
                <button
                  onClick={() => simulateOfflineWorkerProgress(4)}
                  className="touch-btn bg-[#2e8b8d] border border-[#80deea] text-white px-2.5 py-1 rounded-lg text-xs font-extrabold cursor-pointer"
                >
                  🌙 Giả Lập Offline 4h (Lazy-Tick)
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="touch-btn bg-[#b83224] text-white px-3 py-1 rounded-lg text-xs cursor-pointer"
                >
                  ✕ Đóng
                </button>
              </div>
            </div>

            {/* Thanh trạng thái Bàn Ăn Chung Lán Thợ & Giỏ Kho Thợ */}
            <div className="bg-[#fff3e0] border-2 border-[#c88a4b] rounded-xl p-2.5 mb-3 flex flex-wrap justify-between items-center gap-2 text-xs">
              <div>
                🍚 <b>BÀN ĂN CHUNG LÁN THỢ:</b> Đang có <b className="text-[#b83224]">{lodgeDiningTableMeals} suất cơm nóng</b> (Khi Độ No &lt; 35%, thợ tự động đi bộ về bàn ăn hồi 100% Độ No!)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => addMealsToLodgeTable(4, 160)}
                  className="touch-btn bg-[#4e8222] text-white font-extrabold px-3 py-1 rounded-lg cursor-pointer"
                >
                  ➕ Dọn Thêm 4 Suất Cơm Lên Bàn (-160 🪙)
                </button>
                <button
                  onClick={claimWorkerPantry}
                  className="touch-btn bg-[#f5b82e] text-[#2a180c] font-extrabold px-3 py-1 rounded-lg cursor-pointer"
                >
                  📥 Thu Giỏ Kho Thợ ({workerPantryCount}/120)
                </button>
              </div>
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
                      👒 Cấp Nón Lá + Rổ Tre (-96 🪙)
                    </button>
                    <button
                      onClick={() => equipWorkerGear(currentWorker.code, 'CRAFT_02')}
                      className="touch-btn bg-[#4e8222] text-white font-bold px-2.5 py-1 rounded-lg cursor-pointer"
                    >
                      👚 Cấp Áo Cánh Nâu (-120 🪙)
                    </button>
                    <button
                      onClick={() => equipWorkerGear(currentWorker.code, 'CRAFT_03')}
                      className="touch-btn bg-[#c88a4b] text-white font-bold px-2.5 py-1 rounded-lg cursor-pointer"
                    >
                      🧥 Cấp Áo Tơi + Ủng (-150 🪙)
                    </button>
                    <button
                      onClick={() => equipWorkerGear(currentWorker.code, 'CRAFT_04')}
                      className="touch-btn bg-[#9b5de5] text-white font-bold px-2.5 py-1 rounded-lg cursor-pointer"
                    >
                      ✨ Đồng Phục Lụa Tân Châu (-216 🪙)
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

      {/* MODAL 2: ĐÌNH LÀNG, VƯỜN ƯƠM ĐỘT BIẾN, ĐUA THUYỀN RỒNG, LỄ CƯỚI QUÊ & HOMESTAY (DLC 2, 3, 4) */}
      {activeModal === 'BENCHMARK' && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-6xl w-full p-3 sm:p-4 max-h-[90dvh] overflow-y-auto shadow-2xl">
            <div className="bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex justify-between items-center mb-3 text-xs sm:text-sm sticky top-0 z-10">
              <span>⛩️ TRUNG TÂM ĐÌNH LÀNG, ĐUA THUYỀN RỒNG, LỄ CƯỚI QUÊ, HOMESTAY &amp; ĐỘT BIẾN (DLC 1 ➔ DLC 4)</span>
              <button
                onClick={() => setActiveModal(null)}
                className="touch-btn bg-[#b83224] text-white px-3 py-1 rounded-lg text-xs cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Cột 1: Vườn Ươm Đột Biến */}
              <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 space-y-2">
                <h4 className="font-extrabold text-sm text-[#6e4121]">
                  🧬 1. Vườn Ươm Đột Biến (Lv.17)
                </h4>
                <p className="text-[#664930]">
                  Bảo hiểm Pity: <b>{mutantPityCount} lần</b> (Thành công tự động phát Loa Phường Realtime!)
                </p>
                <button
                  onClick={() => breedMutantCrop('CROP_MUT_01', 2000, 0.35, 3)}
                  className="touch-btn w-full bg-[#9b5de5] text-white font-bold py-1.5 rounded-lg cursor-pointer"
                >
                  🟣 Ghép Lúa Tím Thảo Dược (-2,000 🪙 | 35%)
                </button>
                <button
                  onClick={() => breedMutantCrop('CROP_MUT_02', 4000, 0.25, 4)}
                  className="touch-btn w-full bg-[#4e8222] text-white font-bold py-1.5 rounded-lg cursor-pointer"
                >
                  🟩 Ghép Dưa Hấu Vuông (-4,000 🪙 | 25%)
                </button>
                <button
                  onClick={() => breedMutantCrop('CROP_MUT_03', 8000, 0.15, 6)}
                  className="touch-btn w-full bg-[#b83224] text-white font-bold py-1.5 rounded-lg cursor-pointer"
                >
                  🏮 Ghép Bưởi Hồ Lô SSR (-8,000 🪙 | 15%)
                </button>
              </div>

              {/* Cột 2: Đình Làng & Đua Thuyền Rồng Hợp Tác Xã */}
              <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 space-y-2">
                <h4 className="font-extrabold text-sm text-[#b83224]">
                  ⛩️ 2. Đình Làng ({dinhLangStage}/3) &amp; Đua Thuyền
                </h4>
                <p className="text-[#664930]">
                  Quẻ đầu ngày: <b className="text-[#4e8222]">{activeTotemBuff}</b>
                </p>
                <button
                  onClick={prayAtTotem}
                  className="touch-btn w-full bg-[#f5b82e] text-[#2a180c] font-extrabold py-1.5 rounded-lg cursor-pointer"
                >
                  🙏 Xin Quẻ Thần Nông (-80 🪙)
                </button>
                <button
                  onClick={contributeDinhLang}
                  className="touch-btn w-full bg-[#b83224] text-white font-extrabold py-1.5 rounded-lg cursor-pointer"
                >
                  🧱 Công Đức Đình Làng Cấp {Math.min(3, dinhLangStage + 1)}/3
                </button>
                <div className="p-2 bg-[#fff3e0] rounded border border-[#c88a4b]">
                  🚣 <b>Hội Đua Thuyền Rồng:</b> Đã chèo <b>{dragonBoatMeters}/1,000m</b>
                  <button
                    onClick={rowDragonBoatDerby}
                    className="touch-btn w-full bg-[#2e8b8d] text-white font-bold py-1 rounded mt-1 cursor-pointer"
                  >
                    🚣 Chèo Thuyền Rồng (-4 ⚡ ➔ +120m &amp; +5 💎)
                  </button>
                </div>
              </div>

              {/* Cột 3: Thương Lái, Rừng Trúc & Chợ Đêm */}
              <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 space-y-2">
                <h4 className="font-extrabold text-sm text-[#2e8b8d]">
                  🏮 3. Thương Lái, Rừng Trúc &amp; Chợ Đêm
                </h4>
                <div className="p-2 bg-[#e0f2f1] rounded border border-[#2e8b8d]">
                  🚚 <b>Thương Lái Đột Xuất:</b> Thu mua <b>Sầu Riêng Ri6 giá x2.5</b>!
                </div>
                <button
                  onClick={sellToTraderBoom}
                  className="touch-btn w-full bg-[#2e8b8d] text-white font-extrabold py-1.5 rounded-lg cursor-pointer"
                >
                  🚚 Bán Giá x2.5 (+1,450 🪙 &amp; +5% Hoa Hồng)
                </button>
                <button
                  onClick={runBambooExpedition}
                  className="touch-btn w-full bg-[#4e8222] text-white font-bold py-1.5 rounded-lg cursor-pointer"
                >
                  🎋 Thám Hiểm Rừng Trúc (-6 ⚡ ➔ Cổ Vật +5 💎)
                </button>
                <button
                  onClick={playNightMarketMinigame}
                  className="touch-btn w-full bg-[#6e4121] text-[#f5b82e] font-extrabold py-1.5 rounded-lg cursor-pointer"
                >
                  🏮 Mở Quầy Chợ Đêm (Giá x1.8, Miễn Thuế!)
                </button>
              </div>

              {/* Cột 4: DLC 4 - Lễ Cưới Quê, Con Cái Truyền Nghề & Homestay Sinh Thái */}
              <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 space-y-2">
                <h4 className="font-extrabold text-sm text-[#9b5de5]">
                  💒 4. Lễ Cưới Quê &amp; Homestay (DLC 4)
                </h4>
                <div className="p-2 bg-[#fce4ec] rounded border border-[#f48fb1]">
                  ❤️ <b>Hẹn Hò Tri Kỷ Làng Quê:</b> <b>{npcHearts}/10 Tim</b>{' '}
                  {isMarried ? '💍 (Đã Kết Hôn!)' : ''}
                </div>
                <button
                  onClick={giftNpcForMarriage}
                  className="touch-btn w-full bg-[#d81b60] text-white font-extrabold py-1.5 rounded-lg cursor-pointer"
                >
                  {isMarried
                    ? '🍱 Nhận Cơm Sáng Vợ/Chồng Nấu (+30 ⚡)'
                    : '💝 Biếu Cau Trầu & Cốm Làng Vòng (+1 ❤️)'}
                </button>

                <div className="p-2 bg-[#e8f5e9] rounded border border-[#4e8222]">
                  🏡 <b>Homestay Đầm Sen (Cấp {homestayLevel}):</b> Mỹ quan hiện tại <b>{fengShuiScore} điểm</b>
                </div>
                <button
                  onClick={serveHomestayGuests}
                  className="touch-btn w-full bg-[#4e8222] text-white font-extrabold py-1.5 rounded-lg cursor-pointer"
                >
                  🍵 Đón Đoàn Khách Phố Thị (+650 🪙 &amp; +10 💎)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: 8 XƯỞNG CHẾ BIẾN SÂU & 27 MÓN ĂN BẾP CỦI QUÊ MẸ */}
      {activeModal === 'COOKING' && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-5xl w-full p-3 sm:p-4 max-h-[88dvh] overflow-y-auto shadow-2xl text-xs">
            <div className="bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex justify-between items-center mb-3 text-xs sm:text-sm sticky top-0 z-10">
              <span>🍲 HỆ THỐNG 8 XƯỞNG CHẾ BIẾN SÂU &amp; 27 MÓN ĂN BẾP CỦI QUÊ MẸ</span>
              <button
                onClick={() => setActiveModal(null)}
                className="touch-btn bg-[#b83224] text-white px-3 py-1 rounded-lg text-xs cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 space-y-2">
                <h4 className="font-extrabold text-[#6e4121]">
                  📜 Gợi ý Ca Dao Món Ẩn (#18/60):
                </h4>
                <div className="bg-[#fffdf7] border-l-4 border-[#4e8222] p-2 italic">
                  &ldquo;Cá trắm miền Bắc thịt thơm, Gặp tiêu miền Trung, nước dừa miền Nam...&rdquo;
                </div>
                <p className="font-bold">🎒 Chọn Nguyên Liệu Bỏ Vào Nồi Đất Thử Nghiệm:</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '🐟 Cá Trắm Đen [Bắc]',
                    '🌶️ Hồ Tiêu [Trung]',
                    '🥥 Nước Dừa Xiêm [Nam]',
                    '🦀 Cua Đồng',
                    '🍐 Bầu Sao',
                    '🪷 Hạt Sen',
                  ].map((ing) => (
                    <button
                      key={ing}
                      onClick={() => setCookingPot([...cookingPot, ing])}
                      className="touch-btn bg-[#4e8222] text-white px-2.5 py-1 rounded-lg font-bold cursor-pointer"
                    >
                      + {ing}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#fff3e0] border-2 border-[#b83224] rounded-xl p-3 text-center space-y-2">
                <h4 className="font-extrabold text-[#b83224]">🔥 NỒI ĐẤT PHỐI MÓN TỰ DO</h4>
                <div className="flex flex-wrap justify-center gap-1 min-h-8">
                  {cookingPot.map((item, idx) => (
                    <span
                      key={idx}
                      className="bg-white border border-[#c88a4b] px-2 py-0.5 rounded font-bold"
                    >
                      {idx + 1}. {item}
                    </span>
                  ))}
                </div>
                <div className="text-3xl">🥘🔥</div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => cookRandomDish(cookingPot)}
                    className="touch-btn bg-[#b83224] text-white font-extrabold px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    🔥 Nổi Lửa Nấu Thử (+10 💎 Mở Khóa)
                  </button>
                  <button
                    onClick={() => setCookingPot([])}
                    className="touch-btn bg-[#f5b82e] text-[#2a180c] font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    🔄 Làm Trống
                  </button>
                </div>
              </div>
            </div>

            {/* Danh sách 8 Xưởng Máy Chế Biến */}
            <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 mb-3">
              <h4 className="font-extrabold text-[#6e4121] mb-2">
                🏭 8 XƯỞNG CHẾ BIẾN SÂU TRONG TRANG TRẠI ({machineList.length} Máy):
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {machineList.map((mac) => (
                  <div key={mac.id} className="p-2 rounded-lg border border-[#c88a4b] bg-[#fffdf7] flex flex-col justify-between">
                    <div>
                      <div className="font-extrabold text-[#2a180c]">
                        {mac.emoji} {mac.name} (Lv.{mac.unlockLevel})
                      </div>
                      <p className="text-[11px] text-[#664930] my-1">{mac.description}</p>
                    </div>
                    <button
                      onClick={() => craftOrBuyCatalogItem(mac.id)}
                      className="touch-btn w-full bg-[#6e4121] text-[#f5b82e] font-bold py-1 rounded cursor-pointer mt-1"
                    >
                      {inventory[mac.id] ? `✅ Đang vận hành (${inventory[mac.id]})` : `🔨 Xây Xưởng (${mac.buyCostGold}🪙)`}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Danh sách 27 Món Ăn Bếp Quê & Đặc Sản Giao Thoa 3 Miền */}
            <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3">
              <h4 className="font-extrabold text-[#4e8222] mb-2">
                🍜 SỔ TAY 27 CÔNG THỨC MÓN ĂN BẾP QUÊ &amp; ĐẠI TIỆC 3 MIỀN:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {recipeList.map((rec) => (
                  <div key={rec.id} className="p-2 rounded-lg border border-[#e0d4c0] bg-[#fffdf7] flex flex-col justify-between">
                    <div>
                      <div className="font-extrabold text-[#2a180c]">
                        {rec.emoji} {rec.name} (Lv.{rec.unlockLevel})
                      </div>
                      <div className="text-[11px] text-[#b83224] font-semibold">
                        Nguyên liệu: {rec.inputIngredients}
                      </div>
                      <div className="text-[11px] text-[#664930]">
                        Hồi: <b>+{rec.staminaDelta} ⚡</b> | Giá bán: <b>{rec.baseSellGold} 🪙</b> (Chợ 2x: {rec.maxMarketGold} 🪙) | Kho: <b>{inventory[rec.id] ?? 0}</b>
                      </div>
                    </div>
                    <button
                      onClick={() => craftOrBuyCatalogItem(rec.id)}
                      className="touch-btn w-full bg-[#4e8222] text-white font-extrabold py-1 rounded cursor-pointer mt-1.5"
                    >
                      🍲 Nấu Ngay (-{rec.buyCostGold}🪙 ➔ +{rec.baseSellGold}🪙 &amp; +{rec.staminaDelta}⚡)
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: BÁO CHỢ PHIÊN 3 MIỀN, ĐĂNG BÁN CLOUD, THĂM NHÀ HÁI TRỘM & SỔ LƯU BÚT CỔNG LÀNG */}
      {activeModal === 'MARKET_STEAL' && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-5xl w-full p-3 sm:p-4 max-h-[88dvh] overflow-y-auto shadow-2xl text-xs">
            <div className="bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex justify-between items-center mb-3 text-xs sm:text-sm sticky top-0 z-10">
              <span>📰 NHẬT BÁO CHỢ PHIÊN 3 MIỀN ({marketListings.length} SẠP CLOUD), HÁI TRỘM &amp; SỔ LƯU BÚT</span>
              <button
                onClick={() => setActiveModal(null)}
                className="touch-btn bg-[#b83224] text-white px-3 py-1 rounded-lg text-xs cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 space-y-2 max-h-[68dvh] overflow-y-auto">
                <h4 className="font-extrabold text-[#6e4121]">
                  📰 Sạp Hàng Liên Vùng (Khung giá 0.8x - 2.0x | Thuế đốt tiền 10%):
                </h4>
                {marketListings.map((m) => (
                  <div
                    key={m.id}
                    className="p-2 rounded-lg border border-[#c88a4b] bg-[#fffdf7] flex justify-between items-center gap-2"
                  >
                    <div>
                      <div className="font-extrabold">
                        [{REGION_INFO[m.sellerRegion].shortName}] {m.sellerName} (Lv.{m.sellerLevel})
                      </div>
                      <div>
                        Bán: <b>{m.emoji} {m.quantity} {m.itemName}</b> — Giá: <b>{m.unitPrice} 🪙/món</b>
                      </div>
                      <div className="text-[11px] text-[#b83224]">{m.stealTargetName}</div>
                    </div>
                    <button
                      onClick={() => buyMarketAndVisit(m)}
                      className="touch-btn bg-[#f5b82e] text-[#2a180c] font-extrabold px-2.5 py-1.5 rounded-lg cursor-pointer shrink-0"
                    >
                      🏃 Mua &amp; Ghé Nhà
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5">
                {/* Khung Đăng Bán Nông Sản Lên Supabase Cloud */}
                <div className="bg-[#fff3e0] border-2 border-[#c88a4b] rounded-xl p-2.5 space-y-1.5">
                  <h4 className="font-extrabold text-[#b83224]">
                    ➕ ĐĂNG BÁN NÔNG SẢN TỪ KHO LÊN CHỢ CLOUD (REALTIME):
                  </h4>
                  <div className="flex flex-wrap gap-2 items-center">
                    <select
                      value={sellItemId}
                      onChange={(e) => setSellItemId(e.target.value)}
                      className="flex-1 border-2 border-[#c88a4b] rounded-lg px-2 py-1 bg-white font-bold text-xs"
                    >
                      {sellableInventoryItems.map((it) => (
                        <option key={it.id} value={it.id}>
                          {it.emoji} {it.name} (Kho: {inventory[it.id] ?? 0} • Trần 2x: {it.baseSellGold * 2}🪙)
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={sellQty}
                      onChange={(e) => setSellQty(Math.max(1, Number(e.target.value)))}
                      className="w-16 border-2 border-[#c88a4b] rounded-lg px-2 py-1 bg-white font-bold text-center"
                    />
                  </div>
                  <button
                    onClick={() =>
                      postItemToMarket(
                        currentSellSpec.id,
                        sellQty,
                        Math.round(currentSellSpec.baseSellGold * 1.6)
                      )
                    }
                    className="touch-btn w-full bg-[#4e8222] text-white font-extrabold py-1.5 rounded-xl cursor-pointer"
                  >
                    📤 Đăng Sạp Lên Chợ Cloud (Giá 1.6x = {Math.round(currentSellSpec.baseSellGold * 1.6)} 🪙/món)
                  </button>
                </div>

                {/* Khung Thăm Nhà & Hái Trộm */}
                <div className="bg-[#e8f5e9] border-2 border-[#4e8222] rounded-xl p-2.5 space-y-2">
                  <h4 className="font-extrabold text-[#1b5e20]">
                    🏘️ ĐANG ĐỨNG TẠI SÂN NHÀ: [{visitingFriendName ?? 'Út Nhỏ Miền Tây'}]
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => attemptStealFromFriend(visitingFriendName ?? 'Út Nhỏ Miền Tây')}
                      className="touch-btn bg-[#388e3c] text-white p-2 rounded-xl font-extrabold cursor-pointer"
                    >
                      🥭 Sầu Riêng Ri6 (Chín!)
                      <div className="text-[#ffeb3b] text-[11px]">[🤏 Hái Trộm (-1 ⚡)]</div>
                    </button>
                    <button
                      onClick={() => attemptStealFromFriend(visitingFriendName ?? 'Út Nhỏ Miền Tây')}
                      className="touch-btn bg-[#2e8b8d] text-white p-2 rounded-xl font-extrabold cursor-pointer"
                    >
                      🦐 Ao Tôm Càng (Chín!)
                      <div className="text-[#ffeb3b] text-[11px]">[🎣 Câu Trộm (-2 ⚡)]</div>
                    </button>
                  </div>
                  <button
                    onClick={helpFriendAfterStorm}
                    className="touch-btn w-full bg-[#f5b82e] text-[#2a180c] font-extrabold py-1.5 rounded-xl cursor-pointer"
                  >
                    🤝 Dựng Giúp Giàn Cây Sau Mưa Bão (0 ⚡ ➔ Nhận +30 🪙 &amp; +2 Điểm Nghĩa Xóm)
                  </button>
                </div>

                {/* Khung Cột Mốc Check-in & Sổ Lưu Bút Cổng Làng (NEW_GUEST_01) */}
                <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-2.5 space-y-1.5">
                  <h4 className="font-extrabold text-[#6e4121]">
                    📖 CỘT MỐC CHECK-IN &amp; SỔ LƯU BÚT CỔNG LÀNG (+10 Mỹ Quan):
                  </h4>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={guestbookInput}
                      onChange={(e) => setGuestbookInput(e.target.value)}
                      className="flex-1 border border-[#c88a4b] rounded-lg px-2 py-1 bg-[#fffdf7]"
                    />
                    <button
                      onClick={() => signFriendGuestbook(guestbookInput)}
                      className="touch-btn bg-[#6e4121] text-[#f5b82e] font-extrabold px-2.5 py-1 rounded-lg cursor-pointer shrink-0"
                    >
                      📸 Check-in &amp; Ký
                    </button>
                  </div>
                  <div className="max-h-24 overflow-y-auto space-y-1 text-[11px]">
                    {guestbookEntries.slice(0, 4).map((gb) => (
                      <div key={gb.id} className="bg-[#fffdf7] border border-[#e0d4c0] px-2 py-1 rounded">
                        <b>{gb.visitorName}</b> ({gb.timestamp}): &ldquo;{gb.message}&rdquo;
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: LỊCH BLOC, ĐẬP NIÊU GACHA, XỔ SỐ 18:00 & CỬA HÀNG 4 GÓI IAP CHIẾN LƯỢC */}
      {activeModal === 'LIVEOPS' && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-5xl w-full p-3 sm:p-4 max-h-[88dvh] overflow-y-auto shadow-2xl text-xs">
            <div className="bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex justify-between items-center mb-3 text-xs sm:text-sm sticky top-0 z-10">
              <span>🏮 LỊCH BLOC, ĐẬP NIÊU GACHA, XỔ SỐ KIẾN THIẾT 18:00 &amp; CỬA HÀNG GÓI KHUYẾN NÔNG (IAP)</span>
              <button
                onClick={() => setActiveModal(null)}
                className="touch-btn bg-[#b83224] text-white px-3 py-1 rounded-lg text-xs cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center mb-3">
              <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 space-y-2">
                <h4 className="font-extrabold text-[#b83224]">📅 LỊCH BLOC QUÊ NỘI</h4>
                <div className="text-3xl font-black text-[#b83224]">24/10</div>
                <p className="text-[11px] italic">&ldquo;Đêm tháng năm chưa nằm đã sáng...&rdquo;</p>
                <button
                  onClick={tearBlocCalendar}
                  className="touch-btn w-full bg-[#b83224] text-white font-extrabold py-1.5 rounded-xl cursor-pointer"
                >
                  👋 Vuốt Tay Xé Lịch Nhận Quà (+30 ⚡)
                </button>
              </div>

              <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 space-y-2">
                <h4 className="font-extrabold text-[#6e4121]">🏺 ĐẬP NIÊU ĐẤT ĐÌNH LÀNG</h4>
                <div className="text-3xl">🏺 🏺 🏺 🔨</div>
                <p className="text-[11px]">Rơi trang phục Áo Dài Ngũ Thân, Khăn Đóng, Dép Tổ Ong Vàng SSR!</p>
                <button
                  onClick={smashClayPotGacha}
                  className="touch-btn w-full bg-[#f5b82e] text-[#2a180c] font-extrabold py-1.5 rounded-xl cursor-pointer"
                >
                  🔨 Đập Niêu Thử Vận May (-400 🪙)
                </button>
              </div>

              <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 space-y-2">
                <h4 className="font-extrabold text-[#2e8b8d]">🎟️ XỔ SỐ KIẾN THIẾT 18:00</h4>
                <p className="text-[11px]">
                  Độc Đắc: <b>50,000 🪙 + 200 💎</b> | Vé đang giữ: <b>{lotteryTickets.join(', ')}</b>
                </p>
                <button
                  onClick={() => buyLotteryTicket(false)}
                  className="touch-btn w-full bg-[#f5b82e] text-[#2a180c] font-extrabold py-1.5 rounded-xl cursor-pointer"
                >
                  + Mua Vé Số Tự Chọn (-500 🪙)
                </button>
                <button
                  onClick={() => buyLotteryTicket(true)}
                  className="touch-btn w-full bg-[#4e8222] text-white font-extrabold py-1.5 rounded-xl cursor-pointer"
                >
                  🎁 Mua Vé Tặng Bạn (-300 🪙 ➔ Cùng Nổ Hũ!)
                </button>
              </div>
            </div>

            {/* Cửa hàng 4 Gói IAP Chiến Lược (Tích hợp miễn phí lương Quản Gia Cửu) */}
            <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3">
              <h4 className="font-extrabold text-[#6e4121] mb-2">
                💎 GÓI KHUYẾN NÔNG &amp; THẺ THÁNG BÁC NÔNG DÂN MẪU MỰC (MIỄN PHÍ LƯƠNG QUẢN GIA CỬU WORK_06):
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {iapList.map((pack) => (
                  <div key={pack.id} className="p-2.5 rounded-xl border-2 border-[#f5b82e] bg-[#fffdf7] flex flex-col justify-between">
                    <div>
                      <div className="font-extrabold text-[#b83224]">
                        {pack.emoji} {pack.name}
                      </div>
                      <p className="text-[11px] text-[#664930] my-1">{pack.description}</p>
                    </div>
                    <button
                      onClick={() => {
                        setToast(`🎉 Đã kích hoạt thử nghiệm [${pack.name}]! Nhận thưởng Ngọc & Miễn phí lương Quản Gia Cửu!`);
                      }}
                      className="touch-btn w-full bg-gradient-to-r from-[#b83224] to-[#f5b82e] text-white font-extrabold py-1.5 rounded-lg cursor-pointer mt-1"
                    >
                      🎁 Kích Hoạt Thử ({pack.inputIngredients})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: TỦ ĐỒ 12 SLOTS THỜI TRANG & TRANSMOG */}
      {activeModal === 'FASHION' && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-5xl w-full p-3 sm:p-4 max-h-[88dvh] overflow-y-auto shadow-2xl text-xs space-y-3">
            <div className="bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex flex-wrap justify-between items-center gap-2 text-xs sm:text-sm sticky top-0 z-10">
              <span>🪞 GƯƠNG SOI 12 SLOTS THỜI TRANG &amp; TRANSMOG (ĐIỂM PHONG CÁCH: {styleScore} ✨)</span>
              <button
                onClick={() => setActiveModal(null)}
                className="touch-btn bg-[#b83224] text-white px-3 py-1 rounded-lg text-xs cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            {/* Thanh Công Cụ Khâu Ghép 3->1, Hội Thi Duyên Dáng & Xuất Ảnh Bằng Khen PNG */}
            <div className="bg-[#fff3e0] border-2 border-[#c88a4b] rounded-xl p-2.5 flex flex-wrap justify-between items-center gap-2">
              <div className="space-y-0.5">
                <div className="font-extrabold text-[#3e2413]">
                  🎭 Ngoại hình Transmog đang khóa:{' '}
                  <span className="text-[#b83224]">
                    {GAME_CATALOG.find((c) => c.id === transmogItemId)?.name ?? 'Chưa chọn'}
                  </span>
                </div>
                <div className="text-[11px] text-[#664930]">
                  💡 May đủ 3 món trùng nhau để bấm <b>🧵 Ghép 3➔1 (+150✨)</b> hoặc xuất ảnh <b>Bằng Khen Điền Chủ (.PNG)</b> khoe Zalo/FB!
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    soundFX.playCelebrationGong();
                    enterFashionContest();
                  }}
                  className="touch-btn bg-[#9b5de5] text-white font-extrabold px-3 py-1.5 rounded-xl cursor-pointer"
                >
                  {fashionContestEntered ? '🏆 Đã Thi Duyên Dáng Tuần' : '📸 Đăng Ký Thi Duyên Dáng Tuần'}
                </button>
                <button
                  onClick={() => {
                    soundFX.playCelebrationGong();
                    exportAchievementCertificate({
                      playerName,
                      region,
                      level,
                      styleScore,
                      fengShuiScore,
                      neighborPoints,
                      dinhLangStage,
                      isMarried,
                    });
                    setToast('🏆 Đã xuất ảnh [Bằng Khen Điền Chủ Mẫu Mực Ba Miền (.PNG)] về máy để chia sẻ Zalo/Facebook!');
                  }}
                  className="touch-btn bg-[#b83224] border border-[#f5b82e] text-white font-extrabold px-3 py-1.5 rounded-xl cursor-pointer"
                >
                  🏆 Xuất Ảnh Bằng Khen (.PNG)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {fashionList.map((f) => {
                const ownedQty = inventory[f.id] ?? 0;
                return (
                  <div
                    key={f.id}
                    className="bg-white border-2 border-[#c88a4b] p-2.5 rounded-xl flex flex-col justify-between gap-1.5"
                  >
                    <div>
                      <div className="font-extrabold text-[#2a180c] flex justify-between items-center">
                        <span>
                          {f.emoji} {f.name}
                        </span>
                        <span className="bg-[#f3e5ab] text-[#6e4121] px-2 py-0.5 rounded text-[10px]">
                          Đang có: {ownedQty}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#664930] mt-0.5">{f.description}</p>
                    </div>
                    <div className="border-t border-[#f0e6d2] pt-1.5 mt-1 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#6e4121]">Giá may: {f.buyCostGold} 🪙</span>
                        <button
                          onClick={() => craftOrBuyCatalogItem(f.id)}
                          className="touch-btn bg-[#f5b82e] text-[#2a180c] font-extrabold px-2.5 py-1 rounded-lg cursor-pointer"
                        >
                          {ownedQty > 0 ? '🧵 May Thêm (+1)' : '🧵 May & Mặc Ngay'}
                        </button>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => fuseDuplicateFashion(f.id)}
                          className={`touch-btn flex-1 font-bold py-1 rounded-lg cursor-pointer text-[11px] ${
                            ownedQty >= 3
                              ? 'bg-[#4e8222] text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          ✨ Ghép 3➔1 ({ownedQty}/3)
                        </button>
                        <button
                          onClick={() => setTransmogSlot(f.id)}
                          className={`touch-btn px-2 py-1 rounded-lg font-bold cursor-pointer text-[11px] ${
                            transmogItemId === f.id
                              ? 'bg-[#6e4121] text-[#f5b82e]'
                              : 'bg-[#fff3e0] border border-[#c88a4b] text-[#3e2413]'
                          }`}
                        >
                          {transmogItemId === f.id ? '🎭 Đang Transmog' : '🎭 Transmog'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: GIẤY ĐĂNG KÝ VỀ QUÊ LẬP NGHIỆP (CHỌN NHÂN VẬT & 3 MIỀN) */}
      {activeModal === 'REGISTER' && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-xl w-full p-3 sm:p-4 max-h-[88dvh] overflow-y-auto shadow-2xl text-xs space-y-3">
            <div className="bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex justify-between items-center text-xs sm:text-sm">
              <span>📜 GIẤY ĐĂNG KÝ VỀ QUÊ LẬP NGHIỆP (CHỌN NHÂN VẬT &amp; 3 MIỀN)</span>
              <button
                onClick={() => setActiveModal(null)}
                className="touch-btn bg-[#b83224] text-white px-3 py-1 rounded-lg text-xs cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="space-y-2">
              <label className="font-extrabold block">1. Họ Tên Điền Chủ &amp; Giới Tính:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="flex-1 border-2 border-[#c88a4b] rounded-lg px-3 py-1.5 font-bold bg-white"
                />
                <button
                  onClick={() => setTempGender('MALE')}
                  className={`touch-btn px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                    tempGender === 'MALE' ? 'bg-[#4e8222] text-white' : 'bg-white border border-[#c88a4b]'
                  }`}
                >
                  👦 Nam
                </button>
                <button
                  onClick={() => setTempGender('FEMALE')}
                  className={`touch-btn px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                    tempGender === 'FEMALE' ? 'bg-[#4e8222] text-white' : 'bg-white border border-[#c88a4b]'
                  }`}
                >
                  👧 Nữ
                </button>
              </div>

              <label className="font-extrabold block mt-2">
                2. Chọn Vùng Quê Hương Khởi Nghiệp (10 Đặc Sản Độc Quyền Mỗi Miền):
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['NORTH', 'CENTRAL', 'SOUTH'] as RegionType[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTempRegion(r)}
                    className={`touch-btn p-2 rounded-xl font-extrabold border-2 cursor-pointer ${
                      tempRegion === r
                        ? 'bg-[#f5b82e] border-[#b83224] text-[#2a180c]'
                        : 'bg-white border-[#c88a4b]'
                    }`}
                  >
                    {REGION_INFO[r].shortName}
                  </button>
                ))}
              </div>
              <div className="bg-white border border-[#c88a4b] p-2.5 rounded-lg">
                <b>🎁 Nội tại {REGION_INFO[tempRegion].name}:</b> {REGION_INFO[tempRegion].buffName}
                <div className="text-[11px] text-[#664930] mt-1">
                  • <b>10 Đặc sản Vùng:</b> {REGION_INFO[tempRegion].specialties.join(', ')}
                </div>
              </div>
            </div>

            <button
              onClick={() => setProfile(tempName, tempGender, tempRegion)}
              className="touch-btn w-full bg-[#b83224] text-white font-extrabold py-2.5 rounded-xl cursor-pointer"
            >
              💮 ĐÓNG DẤU ĐỎ &amp; CẬP NHẬT QUÊ HƯƠNG!
            </button>
          </div>
        </div>
      )}

      {/* MODAL 8: TRẠNG THÁI SUPABASE CLOUD & REALTIME */}
      {activeModal === 'SUPABASE_CONFIG' && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-lg w-full p-4 space-y-3 text-xs shadow-2xl">
            <div className="bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex justify-between items-center text-sm">
              <span>🟢 TRẠNG THÁI SUPABASE CLOUD &amp; ĐỒNG BỘ 155 THỰC THỂ</span>
              <button
                onClick={() => setActiveModal(null)}
                className="touch-btn bg-[#b83224] text-white px-2.5 py-1 rounded-lg text-xs cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="bg-[#e8f5e9] border-2 border-[#4e8222] rounded-xl p-2.5 space-y-1">
              <div className="font-extrabold text-[#1b5e20]">
                📡 Nông dân đang trực tuyến (Realtime Presence): {onlineFarmersCount} người
              </div>
              <div className="text-[11px] text-[#2a180c]">
                🗄️ <b>Trạng thái Database &amp; Dữ liệu:</b> {dbTablesStatus}
              </div>
            </div>

            <button
              onClick={syncCatalogToSupabaseCloud}
              className="touch-btn w-full bg-[#2e8b8d] border-2 border-[#80deea] text-white font-extrabold py-2 rounded-xl cursor-pointer"
            >
              ☁️ Đồng Bộ Trọn Bộ 155 Thực Thể &amp; 8 Sạp Chợ Lên Supabase Cloud
            </button>

            <div className="space-y-1.5">
              <label className="font-bold block">Supabase Project URL:</label>
              <input
                type="text"
                value={sbUrl}
                onChange={(e) => setSbUrl(e.target.value)}
                placeholder="https://znabynzbcimpesrxxxsz.supabase.co"
                className="w-full border-2 border-[#c88a4b] rounded-lg px-3 py-1.5 bg-white font-mono text-[11px]"
              />
              <label className="font-bold block mt-2">Supabase Publishable / Anon Key:</label>
              <input
                type="text"
                value={sbKey}
                onChange={(e) => setSbKey(e.target.value)}
                placeholder="sb_publishable_..."
                className="w-full border-2 border-[#c88a4b] rounded-lg px-3 py-1.5 bg-white font-mono text-[11px]"
              />
            </div>

            <button
              onClick={() => {
                saveSupabaseCredentials(sbUrl, sbKey);
                setToast('✅ Đã lưu cấu hình Supabase! Đang tải lại để đồng bộ Realtime...');
                setTimeout(() => window.location.reload(), 800);
              }}
              className="touch-btn w-full bg-[#4e8222] text-white font-extrabold py-2 rounded-xl cursor-pointer"
            >
              💾 Lưu Cấu Hình &amp; Kết Nối Lại
            </button>
          </div>
        </div>
      )}

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

      {activeModal === 'QC_REPORT' && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-[#fff8eb] border-4 border-[#0f766e] rounded-2xl max-w-4xl w-full max-h-[88vh] flex flex-col p-4 space-y-3 text-xs shadow-2xl">
            <div className="bg-[#0f766e] text-white px-3 py-2 rounded-xl font-extrabold flex justify-between items-center text-sm">
              <span>🧪 BÁO CÁO AUTOMATED QC TEST SUITE (10 EPICS / 25 TEST CASES)</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQcResults(runFullQCTestSuite())}
                  className="touch-btn bg-[#f5b82e] text-[#2a180c] px-2.5 py-1 rounded-lg text-xs font-extrabold cursor-pointer"
                >
                  🔄 Chạy Lại 25 Test Cases
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="touch-btn bg-[#b83224] text-white px-2.5 py-1 rounded-lg text-xs cursor-pointer"
                >
                  ✕ Đóng
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#e8f5e9] border-2 border-[#2e7d32] rounded-xl p-2">
                <div className="text-[11px] font-bold text-[#1b5e20]">TỔNG SỐ TEST CASES</div>
                <div className="text-lg font-extrabold text-[#1b5e20]">{qcResults.length} TC</div>
              </div>
              <div className="bg-[#e0f2f1] border-2 border-[#0f766e] rounded-xl p-2">
                <div className="text-[11px] font-bold text-[#0f766e]">ĐẠT CHUẨN (PASSED)</div>
                <div className="text-lg font-extrabold text-[#0f766e]">
                  {qcResults.filter((r) => r.passed).length} / {qcResults.length}
                </div>
              </div>
              <div className="bg-[#fff3e0] border-2 border-[#e65100] rounded-xl p-2">
                <div className="text-[11px] font-bold text-[#e65100]">TỔNG THỜI GIAN CHẠY</div>
                <div className="text-lg font-extrabold text-[#e65100]">
                  {qcResults.reduce((acc, r) => acc + r.durationMs, 0).toFixed(2)} ms
                </div>
              </div>
            </div>

            <div className="text-[11px] bg-[#f3e5ab] border border-[#c88a4b] rounded-lg px-3 py-1.5 text-[#3b210e]">
              🛡️ <b>Cơ chế Snapshot An Toàn:</b> Bộ kiểm thử tự động chụp trạng thái nông trại trước khi chạy và khôi phục nguyên trạng 100% sau khi hoàn tất 15 bài kiểm thử biên (Boundary &amp; Anti-Cheat).
            </div>

            <div className="overflow-y-auto flex-1 space-y-2 pr-1">
              {qcResults.map((tc) => (
                <div
                  key={tc.id}
                  className={`border-2 rounded-xl p-2.5 flex flex-col gap-1 ${
                    tc.passed
                      ? 'bg-white border-[#4e8222]'
                      : 'bg-[#ffebee] border-[#c62828]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="font-extrabold text-[#2a180c] flex items-center gap-1.5">
                      <span>{tc.passed ? '✅ PASS' : '❌ FAIL'}</span>
                      <span className="bg-[#6e4121] text-[#f5b82e] px-2 py-0.5 rounded text-[10px]">
                        {tc.epic}
                      </span>
                      <span className="text-[#0f766e]">[{tc.id}]</span>
                      <span>{tc.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-600">
                      ⏱️ {tc.durationMs} ms
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] mt-0.5">
                    <div className="bg-[#f5f5f5] px-2 py-1 rounded border border-gray-300">
                      <b>Kỳ vọng (Expected):</b> {tc.expected}
                    </div>
                    <div className="bg-[#e8f5e9] px-2 py-1 rounded border border-[#81c784]">
                      <b>Thực tế (Actual):</b> {tc.actual}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
