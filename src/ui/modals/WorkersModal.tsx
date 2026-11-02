import { useState } from 'react';
import { HiredWorkerState } from '../../data/types';
import { useGameStore } from '../../store/useGameStore';

/** MODAL 1: LÁN THỢ ĐỒNG QUÊ & QUẢN LÝ 6 GIA NHÂN (CÓ WORKER STATE MACHINE AUTO-TICK) — tách từ App.tsx (S2). */
export function WorkersModal() {
  const lodgeDiningTableMeals = useGameStore((s) => s.lodgeDiningTableMeals);
  const workerAutoTickEnabled = useGameStore((s) => s.workerAutoTickEnabled);
  const workerPantryCount = useGameStore((s) => s.workerPantryCount);
  const workers = useGameStore((s) => s.workers);
  const tickWorkerAutomation = useGameStore((s) => s.tickWorkerAutomation);
  const toggleWorkerAutoTick = useGameStore((s) => s.toggleWorkerAutoTick);
  const addMealsToLodgeTable = useGameStore((s) => s.addMealsToLodgeTable);
  const setActiveModal = useGameStore((s) => s.setActiveModal);
  const claimWorkerPantry = useGameStore((s) => s.claimWorkerPantry);
  const feedWorker = useGameStore((s) => s.feedWorker);
  const equipWorkerGear = useGameStore((s) => s.equipWorkerGear);
  const payWorkerSalary = useGameStore((s) => s.payWorkerSalary);
  const giveWorkerBonus = useGameStore((s) => s.giveWorkerBonus);
  const simulateOfflineWorkerProgress = useGameStore((s) => s.simulateOfflineWorkerProgress);
  const [selectedWorkerCode, setSelectedWorkerCode] = useState<HiredWorkerState['code']>('WORK_01');
  const currentWorker = workers.find((w) => w.code === selectedWorkerCode) ?? workers[0];

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="vac-paper vac-pop-in bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-5xl w-full p-3 sm:p-4 max-h-[88dvh] overflow-y-auto shadow-2xl">
        <div className="vac-wood bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex flex-wrap justify-between items-center gap-2 mb-3 text-xs sm:text-sm sticky top-0 z-10">
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
  );
}
