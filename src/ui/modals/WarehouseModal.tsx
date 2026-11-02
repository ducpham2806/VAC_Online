import { useState } from 'react';
import { GAME_CATALOG } from '../../data/masterData';
import { useGameStore } from '../../store/useGameStore';
import { GameIcon } from '../GameIcon';
import { flyCoins } from '../fx/flyCoins';

/** 🧺 Kho Nông Sản & Bán cho Hợp Tác Xã theo giá gốc (S1 — thu hoạch vào kho, tiền về khi bán). */
export function WarehouseModal() {
  const inventory = useGameStore((s) => s.inventory);
  const farmBusy = useGameStore((s) => s.farmBusy);
  const sellToHtx = useGameStore((s) => s.sellToHtx);
  const setActiveModal = useGameStore((s) => s.setActiveModal);
  const [qtyById, setQtyById] = useState<Record<string, number>>({});

  const items = GAME_CATALOG.filter((c) => (inventory[c.id] ?? 0) > 0);
  const extras = Object.entries(inventory).filter(
    ([id, q]) => q > 0 && !GAME_CATALOG.some((c) => c.id === id)
  );

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="vac-paper vac-pop-in bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-3xl w-full p-3 sm:p-4 max-h-[90dvh] overflow-y-auto shadow-2xl text-xs space-y-3">
        <div className="vac-wood bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex justify-between items-center text-sm sticky top-0">
          <span>🧺 KHO NÔNG SẢN &amp; BÁN CHO HỢP TÁC XÃ</span>
          <button
            onClick={() => setActiveModal(null)}
            className="touch-btn bg-[#b83224] text-white px-3 py-1 rounded-lg text-xs cursor-pointer"
          >
            ✕ Đóng
          </button>
        </div>

        {items.length === 0 && extras.length === 0 && (
          <p className="text-center text-[#664930] font-bold py-6">
            Kho đang trống. Thu hoạch cây trồng / vật nuôi để có hàng bán cho HTX nhé!
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {items.map((item) => {
            const have = inventory[item.id] ?? 0;
            const qty = Math.min(have, Math.max(1, qtyById[item.id] ?? have));
            const sellable = item.baseSellGold > 0;
            return (
              <div key={item.id} className="bg-white border-2 border-[#c88a4b] rounded-xl p-2 flex flex-col gap-1.5">
                <div className="font-extrabold text-[#2a180c]">
                  <GameIcon id={item.id} fallback={item.emoji} size={28} /> {item.name} <span className="text-[#664930]">× {have}</span>
                </div>
                {sellable ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={1}
                      max={have}
                      value={qty}
                      onChange={(e) =>
                        setQtyById((m) => ({ ...m, [item.id]: Math.max(1, Math.floor(Number(e.target.value) || 1)) }))
                      }
                      className="w-16 border-2 border-[#c88a4b] rounded-lg px-2 py-1 font-bold"
                      aria-label={`Số lượng bán ${item.name}`}
                    />
                    <button
                      disabled={farmBusy}
                      onClick={(e) => {
                        flyCoins(e.currentTarget, Math.min(8, 3 + Math.floor(qty / 3)));
                        sellToHtx(item.id, qty);
                      }}
                      className="touch-btn flex-1 min-h-[44px] bg-[#4e8222] text-white font-extrabold px-2 rounded-lg cursor-pointer disabled:opacity-60"
                    >
                      🏪 Bán HTX +{(item.baseSellGold * qty).toLocaleString()} 🪙
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] text-[#664930]">HTX không thu mua vật phẩm này.</div>
                )}
              </div>
            );
          })}
          {extras.map(([id, q]) => (
            <div key={id} className="bg-white border-2 border-[#c88a4b] rounded-xl p-2 font-extrabold text-[#2a180c]">
              {id === 'ITEM_BUN_PHU_SA' ? <><GameIcon id="mud" fallback="🪣" size={24} /> Bùn Phù Sa</> : id} × {q}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
