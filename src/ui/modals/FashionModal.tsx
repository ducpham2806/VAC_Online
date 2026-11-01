import { GAME_CATALOG } from '../../data/masterData';
import { soundFX } from '../../services/soundEffects';
import { exportAchievementCertificate } from '../../services/certificateExporter';
import { useGameStore } from '../../store/useGameStore';

/** MODAL 6: TỦ ĐỒ 12 SLOTS THỜI TRANG & TRANSMOG — tách từ App.tsx (S2). */
export function FashionModal() {
  const playerName = useGameStore((s) => s.playerName);
  const region = useGameStore((s) => s.region);
  const level = useGameStore((s) => s.level);
  const styleScore = useGameStore((s) => s.styleScore);
  const fengShuiScore = useGameStore((s) => s.fengShuiScore);
  const neighborPoints = useGameStore((s) => s.neighborPoints);
  const isMarried = useGameStore((s) => s.isMarried);
  const dinhLangStage = useGameStore((s) => s.dinhLangStage);
  const transmogItemId = useGameStore((s) => s.transmogItemId);
  const fashionContestEntered = useGameStore((s) => s.fashionContestEntered);
  const inventory = useGameStore((s) => s.inventory);
  const setToast = useGameStore((s) => s.setToast);
  const setActiveModal = useGameStore((s) => s.setActiveModal);
  const craftOrBuyCatalogItem = useGameStore((s) => s.craftOrBuyCatalogItem);
  const fuseDuplicateFashion = useGameStore((s) => s.fuseDuplicateFashion);
  const setTransmogSlot = useGameStore((s) => s.setTransmogSlot);
  const enterFashionContest = useGameStore((s) => s.enterFashionContest);
  const fashionList = GAME_CATALOG.filter((c) => c.category === 'FASHION');

  return (
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
  );
}
