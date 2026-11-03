import { useState } from 'react';
import { GAME_STAGE } from '../../config/features';
import { GAME_CATALOG } from '../../data/masterData';
import { HiredWorkerState } from '../../data/types';
import {
  BELLY_PER_MEAL,
  HUNGRY_BELLY,
  PANTRY_CAP,
  WORKER_SPECS,
  contractCost,
  mealPortions,
  workerStage,
} from '../../domain/workers';
import { CRAFT_MIN_STAGE } from '../../domain/progression';
import { useGameStore } from '../../store/useGameStore';
import { GameIcon } from '../GameIcon';

const JOB_TEXT: Record<string, string> = {
  WORK_01: 'Tưới + thu Cây ruộng / Cây lâu năm',
  WORK_02: 'Cho ăn + thu Vật nuôi (nhiều lứa)',
  WORK_03: 'Chăm + thu Ao cá',
};

/** 🛖 Lán Thợ (S5c — M05.1, M05.2, M05.4, M05.5). Luật ở src/domain/workers.ts; UI chỉ đọc store và gọi action. */
export function WorkersModal() {
  const lodgeDiningTableMeals = useGameStore((s) => s.lodgeDiningTableMeals);
  const workerPantry = useGameStore((s) => s.workerPantry);
  const workerPantryCount = useGameStore((s) => s.workerPantryCount);
  const workers = useGameStore((s) => s.workers);
  const inventory = useGameStore((s) => s.inventory);
  const level = useGameStore((s) => s.level);
  const gold = useGameStore((s) => s.gold);
  const farmBusy = useGameStore((s) => s.farmBusy);
  const farmMode = useGameStore((s) => s.farmMode);
  const setActiveModal = useGameStore((s) => s.setActiveModal);
  const claimWorkerPantry = useGameStore((s) => s.claimWorkerPantry);
  const payWorkerSalary = useGameStore((s) => s.payWorkerSalary);
  const serveLodgeMeal = useGameStore((s) => s.serveLodgeMeal);
  const equipWorkerGear = useGameStore((s) => s.equipWorkerGear);
  const simulateOfflineWorkerProgress = useGameStore((s) => s.simulateOfflineWorkerProgress);
  const [selected, setSelected] = useState<HiredWorkerState['code']>('WORK_01');
  const current = workers.find((w) => w.code === selected) ?? workers[0];

  const dishes = GAME_CATALOG.filter((c) => c.category === 'RECIPE' && c.staminaDelta > 0 && (inventory[c.id] ?? 0) > 0);
  const pantryItems = Object.entries(workerPantry ?? {}).filter(([, n]) => n > 0);
  const gears = GAME_CATALOG.filter((c) => c.category === 'CRAFT_GEAR' && (inventory[c.id] ?? 0) > 0);
  const stageOpen = GAME_STAGE >= CRAFT_MIN_STAGE;

  const lockOf = (code: string): string | null => {
    const item = GAME_CATALOG.find((c) => c.id === code);
    if (!item || !WORKER_SPECS[code]) return '🔒 Về làng ở bản sau';
    const stage = workerStage(item);
    if (GAME_STAGE < stage) return `🔒 Về làng ở GĐ${stage}`;
    if (level < item.unlockLevel) return `🔒 Cần Lv.${item.unlockLevel}`;
    return null;
  };
  const currentItem = GAME_CATALOG.find((c) => c.id === current.code);
  const currentLock = lockOf(current.code);
  const cost = currentItem ? contractCost(currentItem) : 0;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="vac-paper vac-pop-in bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-5xl w-full p-3 sm:p-4 max-h-[88dvh] overflow-y-auto shadow-2xl text-xs space-y-3">
        <div className="vac-wood bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex flex-wrap justify-between items-center gap-2 text-xs sm:text-sm sticky top-0 z-10">
          <span>🛖 LÁN THỢ ĐỒNG QUÊ</span>
          <div className="flex items-center gap-2">
            {import.meta.env.DEV && farmMode === 'local' && (
              <button
                onClick={() => simulateOfflineWorkerProgress(4)}
                className="touch-btn bg-[#2e8b8d] text-white px-2.5 py-1 rounded-lg text-xs font-extrabold cursor-pointer"
              >
                🌙 [DEV] Offline 4h
              </button>
            )}
            <button
              onClick={() => setActiveModal(null)}
              className="touch-btn bg-[#b83224] text-white px-3 py-1 rounded-lg text-xs cursor-pointer"
            >
              ✕ Đóng
            </button>
          </div>
        </div>

        {!stageOpen && <p className="text-center text-[#664930] font-bold py-6">🔒 Lán Thợ mở ở Giai đoạn {CRAFT_MIN_STAGE}!</p>}

        {stageOpen && (
          <>
            <p className="text-[#664930]">
              Thợ chỉ <b>tưới</b> và <b>thu ô đã chín ≥ 5 phút</b> vào Giỏ Thợ — bạn vẫn tự gieo. Độ No dưới {HUNGRY_BELLY} thì
              thợ nghỉ; dọn món Bếp Quê lên Bàn Ăn để thợ tự về ăn (1 suất = {BELLY_PER_MEAL} Độ No).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-[#fff3e0] border-2 border-[#c88a4b] rounded-xl p-2.5 space-y-1.5">
                <div className="font-extrabold text-[#6e4121]">
                  🍚 BÀN ĂN CHUNG: <span className="text-[#b83224]">{lodgeDiningTableMeals} suất</span>
                </div>
                {dishes.length === 0 && <p className="text-[#664930]">Kho chưa có món ăn. Nấu ở 🍲 Bếp Quê trước nhé!</p>}
                <div className="flex flex-wrap gap-1.5">
                  {dishes.map((d) => (
                    <button
                      key={d.id}
                      disabled={farmBusy}
                      onClick={() => serveLodgeMeal(d.id)}
                      className="touch-btn min-h-[44px] bg-[#4e8222] text-white font-bold px-2.5 py-1 rounded-lg cursor-pointer disabled:opacity-60"
                    >
                      {d.emoji} {d.name} ×{inventory[d.id]} → +{mealPortions(d)} suất
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#fffdf7] border-2 border-[#c88a4b] rounded-xl p-2.5 space-y-1.5">
                <div className="font-extrabold text-[#6e4121]">
                  🧺 GIỎ THỢ: {workerPantryCount}/{PANTRY_CAP}
                </div>
                <div className="flex flex-wrap gap-1">
                  {pantryItems.length === 0 && <span className="text-[#664930]">Đang trống.</span>}
                  {pantryItems.map(([id, n]) => {
                    const it = GAME_CATALOG.find((c) => c.id === id);
                    return (
                      <span key={id} className="bg-white border border-[#c88a4b] rounded px-1.5 py-0.5 font-bold">
                        <GameIcon id={id} fallback={it?.emoji ?? '📦'} size={16} /> {it?.name ?? id} ×{n}
                      </span>
                    );
                  })}
                </div>
                <button
                  disabled={farmBusy}
                  onClick={claimWorkerPantry}
                  className="touch-btn w-full min-h-[44px] bg-[#f5b82e] text-[#2a180c] font-extrabold rounded-lg cursor-pointer disabled:opacity-60"
                >
                  📥 Thu Giỏ Thợ về Kho
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                {workers.map((w) => {
                  const lock = lockOf(w.code);
                  return (
                    <button
                      key={w.code}
                      onClick={() => setSelected(w.code)}
                      className={`touch-btn w-full text-left p-2 rounded-xl border-2 cursor-pointer flex justify-between items-center gap-2 ${
                        selected === w.code ? 'border-[#b83224] bg-[#fff3e0]' : 'border-[#c88a4b] bg-white'
                      } ${lock ? 'opacity-60' : ''}`}
                    >
                      <span className="flex-1 text-left">
                        <span className="font-extrabold block">
                          {w.emoji} {w.name} <span className="text-[#6e4121]">(Lv.{w.unlockLevel})</span>
                        </span>
                        <span className="text-[11px] text-[#664930]">{lock ?? w.statusText}</span>
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 ${
                          w.isHired ? 'bg-[#d4f8d4] text-[#1b5e20]' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {w.isHired ? `No ${w.belly}` : 'Chưa thuê'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="bg-[#fffdf7] border-2 border-[#c88a4b] rounded-xl p-3 space-y-2">
                <h3 className="text-sm font-extrabold text-[#b83224]">
                  {current.emoji} {current.name}
                </h3>
                <p className="text-[#664930]">
                  Việc: <b>{JOB_TEXT[current.code] ?? '—'}</b>
                  <br />
                  Lương: <b>{current.dailySalaryGold} 🪙/ngày</b> · Hợp đồng còn: <b>{current.contractDaysLeft} ngày</b>
                  <br />
                  Độ No: <b>{current.belly}/100</b>
                </p>
                <div className="h-2 bg-[#e0d4c0] rounded">
                  <div
                    className={`h-2 rounded ${current.belly < HUNGRY_BELLY ? 'bg-[#b83224]' : 'bg-[#4e8222]'}`}
                    style={{ width: `${Math.max(0, Math.min(100, current.belly))}%` }}
                  />
                </div>
                <button
                  disabled={farmBusy || !!currentLock || gold < cost}
                  onClick={() => payWorkerSalary(current.code)}
                  className="touch-btn w-full min-h-[44px] bg-[#f5b82e] text-[#2a180c] font-extrabold rounded-lg cursor-pointer disabled:opacity-60"
                >
                  {currentLock ??
                    `🪙 ${current.isHired ? 'Gia hạn' : 'Thuê'} 3 ngày (-${cost.toLocaleString()} 🪙, rẻ 12%)${gold < cost ? ' – thiếu vàng' : ''}`}
                </button>
                <div className="bg-[#fff8e1] border-l-4 border-[#f5b82e] p-2 rounded space-y-1">
                  <div className="font-bold">
                    👕 Đồ bảo hộ:{' '}
                    {current.equippedGearId
                      ? `${GAME_CATALOG.find((c) => c.id === current.equippedGearId)?.name ?? current.equippedGearId} — còn ${current.gearHoursLeft} giờ (Độ No hao chậm 25%)`
                      : 'chưa mặc'}
                  </div>
                  {gears.length === 0 && (
                    <p className="text-[11px] text-[#664930]">Làm Nón Lá / Áo Cánh Nâu ở 🍲 Bếp Quê &amp; Xưởng (Đan Lát, Khung Cửi).</p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {gears.map((g) => (
                      <button
                        key={g.id}
                        disabled={farmBusy || !current.isHired}
                        onClick={() => equipWorkerGear(current.code, g.id)}
                        className="touch-btn min-h-[44px] bg-[#f5b82e] text-[#2a180c] font-bold px-2.5 py-1 rounded-lg cursor-pointer disabled:opacity-60"
                      >
                        {g.emoji} Cấp {g.name} ×{inventory[g.id]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
