import { useState } from 'react';
import { GAME_CATALOG, REGION_INFO } from '../../data/masterData';
import { useGameStore } from '../../store/useGameStore';

/** MODAL 4: BÁO CHỢ PHIÊN 3 MIỀN, ĐĂNG BÁN CLOUD, THĂM NHÀ HÁI TRỘM & SỔ LƯU BÚT CỔNG LÀNG — tách từ App.tsx (S2). */
export function MarketStealModal() {
  const visitingFriendName = useGameStore((s) => s.visitingFriendName);
  const inventory = useGameStore((s) => s.inventory);
  const marketListings = useGameStore((s) => s.marketListings);
  const guestbookEntries = useGameStore((s) => s.guestbookEntries);
  const postItemToMarket = useGameStore((s) => s.postItemToMarket);
  const signFriendGuestbook = useGameStore((s) => s.signFriendGuestbook);
  const setActiveModal = useGameStore((s) => s.setActiveModal);
  const buyMarketAndVisit = useGameStore((s) => s.buyMarketAndVisit);
  const attemptStealFromFriend = useGameStore((s) => s.attemptStealFromFriend);
  const helpFriendAfterStorm = useGameStore((s) => s.helpFriendAfterStorm);
  const [guestbookInput, setGuestbookInput] = useState(
    'Vườn cây trĩu quả đẹp quá, chúc điền chủ vụ mùa đại thắng!'
  );
  const [sellItemId, setSellItemId] = useState<string>('CROP_01');
  const [sellQty, setSellQty] = useState<number>(5);
  const sellableInventoryItems = GAME_CATALOG.filter(
    (c) => (inventory[c.id] ?? 0) > 0 && c.baseSellGold > 0
  );
  const currentSellSpec =
    GAME_CATALOG.find((c) => c.id === sellItemId) ?? sellableInventoryItems[0] ?? GAME_CATALOG[0];

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="vac-paper vac-pop-in bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-5xl w-full p-3 sm:p-4 max-h-[88dvh] overflow-y-auto shadow-2xl text-xs">
        <div className="vac-wood bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex justify-between items-center mb-3 text-xs sm:text-sm sticky top-0 z-10">
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
  );
}
