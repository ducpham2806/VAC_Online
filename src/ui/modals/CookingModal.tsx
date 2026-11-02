import { useState } from 'react';
import { GAME_CATALOG } from '../../data/masterData';
import { useGameStore } from '../../store/useGameStore';

/** MODAL 3: 8 XƯỞNG CHẾ BIẾN SÂU & 27 MÓN ĂN BẾP CỦI QUÊ MẸ — tách từ App.tsx (S2). */
export function CookingModal() {
  const inventory = useGameStore((s) => s.inventory);
  const setActiveModal = useGameStore((s) => s.setActiveModal);
  const cookRandomDish = useGameStore((s) => s.cookRandomDish);
  const craftOrBuyCatalogItem = useGameStore((s) => s.craftOrBuyCatalogItem);
  const [cookingPot, setCookingPot] = useState<string[]>([
    '🐟 Cá Trắm Đen [Bắc]',
    '🌶️ Hồ Tiêu [Trung]',
    '🥥 Nước Dừa Xiêm [Nam]',
  ]);
  const machineList = GAME_CATALOG.filter((c) => c.category === 'MACHINE');
  const recipeList = GAME_CATALOG.filter((c) => c.category === 'RECIPE');

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="vac-paper vac-pop-in bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-5xl w-full p-3 sm:p-4 max-h-[88dvh] overflow-y-auto shadow-2xl text-xs">
        <div className="vac-wood bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex justify-between items-center mb-3 text-xs sm:text-sm sticky top-0 z-10">
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
  );
}
