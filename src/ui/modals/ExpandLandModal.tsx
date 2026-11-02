import { EXPAND_GOLD, EXPAND_STAMINA, MAX_WILD_PLOTS } from '../../domain/farm';
import { nextLockedPlot } from '../../domain/farmGrid';
import { useGameStore } from '../../store/useGameStore';
import { GameIcon } from '../GameIcon';

const ZONE_NAME: Record<string, string> = {
  LAND: '🟫 Ruộng',
  ORCHARD: '🌳 Vườn cây ăn quả',
  POND: '🌊 Ao',
  WETLAND: '🌾 Đất trũng',
};

/** 🪓 Xác nhận Khai Hoang khi chạm ô Đất Hoang kế tiếp trên bản đồ (M02.4, lưới 5×5). */
export function ExpandLandModal() {
  const wildPlotsUnlocked = useGameStore((s) => s.wildPlotsUnlocked);
  const gold = useGameStore((s) => s.gold);
  const stamina = useGameStore((s) => s.stamina);
  const farmBusy = useGameStore((s) => s.farmBusy);
  const expandWildLand = useGameStore((s) => s.expandWildLand);
  const setActiveModal = useGameStore((s) => s.setActiveModal);

  const next = nextLockedPlot(wildPlotsUnlocked);
  const affordable = gold >= EXPAND_GOLD && stamina >= EXPAND_STAMINA;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="vac-paper vac-pop-in bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-md w-full p-3 sm:p-4 shadow-2xl text-xs space-y-3">
        <div className="vac-wood bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold text-sm">
          🪓 KHAI HOANG MỞ RỘNG ĐẤT
        </div>

        {next ? (
          <>
            <p className="text-[#2a180c] font-bold leading-relaxed">
              Mở phân khu thứ <b>{wildPlotsUnlocked + 1}/{MAX_WILD_PLOTS}</b>: {ZONE_NAME[next.zoneType] ?? next.zoneType} (cột{' '}
              {next.tileX + 1}, hàng {next.tileY + 1}).
            </p>
            <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-2 font-extrabold text-[#2a180c] flex justify-between">
              <span>Chi phí</span>
              <span>
                -{EXPAND_STAMINA} <GameIcon id="energy" fallback="⚡" size={16} /> &nbsp; -{EXPAND_GOLD} <GameIcon id="gold" fallback="🪙" size={16} />
              </span>
            </div>
            {!affordable && (
              <p className="text-[#b83224] font-bold">
                Cần {EXPAND_STAMINA} ⚡ và {EXPAND_GOLD} 🪙 (đang có {stamina} ⚡, {gold.toLocaleString()} 🪙).
              </p>
            )}
          </>
        ) : (
          <p className="text-[#2a180c] font-bold">
            🌾 Đã khai hoang tối đa {MAX_WILD_PLOTS}/{MAX_WILD_PLOTS} phân khu!
          </p>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setActiveModal(null)}
            className="touch-btn flex-1 min-h-[44px] bg-[#6e4121] border border-[#c88a4b] text-[#fff8eb] font-bold rounded-xl cursor-pointer"
          >
            Để sau
          </button>
          {next && (
            <button
              disabled={farmBusy}
              onClick={() => {
                expandWildLand();
                setActiveModal(null);
              }}
              className="touch-btn flex-1 min-h-[44px] bg-[#4e8222] border-2 border-[#b8f272] text-white font-extrabold rounded-xl cursor-pointer disabled:opacity-60"
            >
              🪓 Khai hoang
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
