import { isStageOpen } from '../../config/features';
import { useGameStore } from '../../store/useGameStore';

/** MODAL PHASE 1 + DLC 1: BẢNG ĐƠN HTX, GA TÀU THỐNG NHẤT BẮC NAM, CỐT TRUYỆN & 7 NGÀY TÂN THỦ — tách từ App.tsx (S2). */
export function CoopQuestsModal() {
  const trainVouchers = useGameStore((s) => s.trainVouchers);
  const rookieDaysClaimed = useGameStore((s) => s.rookieDaysClaimed);
  const inventory = useGameStore((s) => s.inventory);
  const coopOrders = useGameStore((s) => s.coopOrders);
  const trainCrates = useGameStore((s) => s.trainCrates);
  const storyQuests = useGameStore((s) => s.storyQuests);
  const fillTrainCrate = useGameStore((s) => s.fillTrainCrate);
  const setActiveModal = useGameStore((s) => s.setActiveModal);
  const deliverCoopOrder = useGameStore((s) => s.deliverCoopOrder);
  const claimStoryQuest = useGameStore((s) => s.claimStoryQuest);
  const claimRookieDayReward = useGameStore((s) => s.claimRookieDayReward);

  return (
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
          {isStageOpen(3) && (
          <>
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

          </>
          )}

          {/* Cột 3: Biên Niên Sử Cốt Truyện 10 Chương & Đối Thoại Phân Nhánh */}
          <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 space-y-2 max-h-[65dvh] overflow-y-auto">
            <h4 className="font-extrabold text-sm text-[#6e4121] sticky top-0 bg-white pb-1 border-b border-[#e0d4c0]">
              📜 3. Gia Phả 10 Chương ({storyQuests.filter((q) => q.completed).length}/10)
            </h4>
            {storyQuests.filter((q) => isStageOpen(q.unlockStage)).map((q) => (
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
              Mỗi ngày đăng nhập nhận <b>+1.000 🪙 &amp; +20 💎</b> (tối đa 7 ngày, mỗi ngày 1 lần).
            </p>
            <div className="grid grid-cols-1 gap-1 text-[11px]">
              {[1, 2, 3, 4, 5, 6, 7].map((d) => `Ngày ${d}: +1.000 🪙 & +20 💎`).map((label, idx) => (
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
  );
}
