import { useGameStore } from '../../store/useGameStore';

/** MODAL 2: ĐÌNH LÀNG, VƯỜN ƯƠM ĐỘT BIẾN, ĐUA THUYỀN RỒNG, LỄ CƯỚI QUÊ & HOMESTAY (DLC 2, 3, 4) — tách từ App.tsx (S2). */
export function BenchmarkModal() {
  const fengShuiScore = useGameStore((s) => s.fengShuiScore);
  const dragonBoatMeters = useGameStore((s) => s.dragonBoatMeters);
  const npcHearts = useGameStore((s) => s.npcHearts);
  const isMarried = useGameStore((s) => s.isMarried);
  const homestayLevel = useGameStore((s) => s.homestayLevel);
  const dinhLangStage = useGameStore((s) => s.dinhLangStage);
  const mutantPityCount = useGameStore((s) => s.mutantPityCount);
  const activeTotemBuff = useGameStore((s) => s.activeTotemBuff);
  const rowDragonBoatDerby = useGameStore((s) => s.rowDragonBoatDerby);
  const giftNpcForMarriage = useGameStore((s) => s.giftNpcForMarriage);
  const serveHomestayGuests = useGameStore((s) => s.serveHomestayGuests);
  const setActiveModal = useGameStore((s) => s.setActiveModal);
  const prayAtTotem = useGameStore((s) => s.prayAtTotem);
  const contributeDinhLang = useGameStore((s) => s.contributeDinhLang);
  const breedMutantCrop = useGameStore((s) => s.breedMutantCrop);
  const sellToTraderBoom = useGameStore((s) => s.sellToTraderBoom);
  const runBambooExpedition = useGameStore((s) => s.runBambooExpedition);
  const playNightMarketMinigame = useGameStore((s) => s.playNightMarketMinigame);

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="vac-paper vac-pop-in bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-6xl w-full p-3 sm:p-4 max-h-[90dvh] overflow-y-auto shadow-2xl">
        <div className="vac-wood bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex justify-between items-center mb-3 text-xs sm:text-sm sticky top-0 z-10">
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
  );
}
