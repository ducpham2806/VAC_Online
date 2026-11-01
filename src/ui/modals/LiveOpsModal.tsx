import { GAME_CATALOG } from '../../data/masterData';
import { useGameStore } from '../../store/useGameStore';

/** MODAL 5: LỊCH BLOC, ĐẬP NIÊU GACHA, XỔ SỐ 18:00 & CỬA HÀNG 4 GÓI IAP CHIẾN LƯỢC — tách từ App.tsx (S2). */
export function LiveOpsModal() {
  const lotteryTickets = useGameStore((s) => s.lotteryTickets);
  const setToast = useGameStore((s) => s.setToast);
  const setActiveModal = useGameStore((s) => s.setActiveModal);
  const tearBlocCalendar = useGameStore((s) => s.tearBlocCalendar);
  const smashClayPotGacha = useGameStore((s) => s.smashClayPotGacha);
  const buyLotteryTicket = useGameStore((s) => s.buyLotteryTicket);
  const iapList = GAME_CATALOG.filter((c) => c.category === 'IAP');

  return (
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
  );
}
