import { useEffect, useMemo, useState } from 'react';
import { GAME_STAGE } from '../../config/features';
import { GAME_CATALOG } from '../../data/masterData';
import type { CatalogItem } from '../../data/types';
import {
  CRAFT_RECIPES,
  KITCHEN_RECIPES,
  WORKSHOP_MACHINE_IDS,
  POT_MACHINE_ID,
  POT_MAX_INGREDIENTS,
  isRecipeDiscovered,
  kitchenItem,
  missingIngredients,
  recipeHint,
  recipeLock,
} from '../../domain/cooking';
import { CRAFT_MIN_STAGE } from '../../domain/progression';
import { useGameStore } from '../../store/useGameStore';
import { GameIcon } from '../GameIcon';

type Tab = 'MACHINES' | 'BOOK' | 'POT';

const nameOf = (id: string): string => {
  const it = kitchenItem(id);
  return it ? `${it.emoji} ${it.name}` : id;
};

function lockText(item: CatalogItem, level: number): string | null {
  const lock = recipeLock(item, level, GAME_STAGE);
  if (lock.ok) return null;
  if (lock.reason === 'INGREDIENT_LOCKED') return `🔒 Cần ${nameOf(lock.itemId)} – Đợt ${lock.wave}`;
  if (lock.reason === 'STAGE_LOCKED') return `🔒 Mở ở GĐ${lock.stage}`;
  return `🔒 Cần Lv.${item.unlockLevel}`;
}

const formatLeft = (ms: number): string => {
  const sec = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
};

/** 🍲 Bếp Quê & Xưởng (S4 — M04.1..M04.3): Xưởng / Sổ Tay / Nồi Đất. Luật ở src/domain/cooking.ts. */
export function CookingModal() {
  const inventory = useGameStore((s) => s.inventory);
  const level = useGameStore((s) => s.level);
  const gold = useGameStore((s) => s.gold);
  const machines = useGameStore((s) => s.machines);
  const discoveredRecipes = useGameStore((s) => s.discoveredRecipes);
  const clockOffsetMs = useGameStore((s) => s.clockOffsetMs);
  const farmBusy = useGameStore((s) => s.farmBusy);
  const setActiveModal = useGameStore((s) => s.setActiveModal);
  const buildKitchenMachine = useGameStore((s) => s.buildKitchenMachine);
  const startKitchenCraft = useGameStore((s) => s.startKitchenCraft);
  const collectKitchenCraft = useGameStore((s) => s.collectKitchenCraft);
  const tryCookingPot = useGameStore((s) => s.tryCookingPot);

  const [tab, setTab] = useState<Tab>('MACHINES');
  const [pot, setPot] = useState<string[]>([]);
  const [now, setNow] = useState(() => Date.now() + clockOffsetMs);
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now() + clockOffsetMs), 1000);
    return () => window.clearInterval(id);
  }, [clockOffsetMs]);

  const known = { discoveredRecipes };
  const stageOpen = GAME_STAGE >= CRAFT_MIN_STAGE;

  /** Nguyên liệu bỏ được vào Nồi Đất: mọi thứ đang có trong Kho thuộc công thức nào đó. */
  const potChoices = useMemo(() => {
    const ids = new Set(KITCHEN_RECIPES.flatMap((r) => (r.recipe ?? []).map((i) => i.itemId)));
    return GAME_CATALOG.filter((c) => ids.has(c.id) && (inventory[c.id] ?? 0) > 0);
  }, [inventory]);
  const inPot = (id: string) => pot.filter((x) => x === id).length;

  const tabBtn = (t: Tab, text: string) => (
    <button
      onClick={() => setTab(t)}
      className={`touch-btn min-h-[44px] flex-1 px-2 rounded-lg font-extrabold cursor-pointer ${
        tab === t ? 'bg-[#6e4121] text-[#f5b82e]' : 'bg-[#f3e2c4] text-[#6e4121]'
      }`}
    >
      {text}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="vac-paper vac-pop-in bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-4xl w-full p-3 sm:p-4 max-h-[88dvh] overflow-y-auto shadow-2xl text-xs space-y-3">
        <div className="vac-wood bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex justify-between items-center text-xs sm:text-sm sticky top-0 z-10">
          <span>🍲 BẾP QUÊ &amp; XƯỞNG</span>
          <button
            onClick={() => setActiveModal(null)}
            className="touch-btn bg-[#b83224] text-white px-3 py-1 rounded-lg text-xs cursor-pointer"
          >
            ✕ Đóng
          </button>
        </div>

        {!stageOpen && (
          <p className="text-center text-[#664930] font-bold py-6">🔒 Bếp Quê &amp; Xưởng mở ở Giai đoạn {CRAFT_MIN_STAGE}!</p>
        )}

        {stageOpen && (
          <>
            <div className="flex gap-1.5">
              {tabBtn('MACHINES', '🏭 Xưởng')}
              {tabBtn('BOOK', `📖 Sổ Tay (${KITCHEN_RECIPES.filter((r) => isRecipeDiscovered(known, r.id)).length}/${KITCHEN_RECIPES.length})`)}
              {tabBtn('POT', '🥘 Nồi Đất')}
            </div>

            {tab === 'MACHINES' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {WORKSHOP_MACHINE_IDS.map((id) => {
                  const mac = kitchenItem(id);
                  if (!mac) return null;
                  const m = machines[id];
                  const cookable = [...KITCHEN_RECIPES, ...CRAFT_RECIPES].filter(
                    (r) => r.machineId === id && isRecipeDiscovered(known, r.id)
                  );
                  return (
                    <div key={id} className="bg-white border-2 border-[#c88a4b] rounded-xl p-2 flex flex-col gap-1.5">
                      <div className="font-extrabold text-[#2a180c]">
                        {mac.emoji} {mac.name}
                      </div>
                      {!m && (
                        <button
                          disabled={farmBusy}
                          onClick={() => buildKitchenMachine(id)}
                          className="touch-btn min-h-[44px] bg-[#6e4121] text-[#f5b82e] font-bold rounded-lg cursor-pointer disabled:opacity-60"
                        >
                          {level < mac.unlockLevel
                            ? `🔒 Cần Lv.${mac.unlockLevel}`
                            : `🔨 Xây (${mac.buyCostGold.toLocaleString()} 🪙${gold < mac.buyCostGold ? ' – thiếu' : ''})`}
                        </button>
                      )}
                      {m?.craftItemId && (
                        <div className="bg-[#fff3e0] border border-[#b83224] rounded-lg p-2 text-center space-y-1">
                          <div className="font-bold">🔥 {nameOf(m.craftItemId)}</div>
                          {m.readyAt !== null && now < m.readyAt ? (
                            <div className="text-[#664930] font-bold">⏳ Còn {formatLeft(m.readyAt - now)}</div>
                          ) : (
                            <button
                              disabled={farmBusy}
                              onClick={() => collectKitchenCraft(id)}
                              className="touch-btn w-full min-h-[44px] bg-[#4e8222] text-white font-extrabold rounded-lg cursor-pointer disabled:opacity-60"
                            >
                              🍽️ Lấy món
                            </button>
                          )}
                        </div>
                      )}
                      {m && !m.craftItemId && cookable.length === 0 && (
                        <p className="text-[11px] text-[#664930]">Chưa biết món nào của xưởng này — thử phối ở Nồi Đất nhé!</p>
                      )}
                      {m &&
                        !m.craftItemId &&
                        cookable.map((r) => {
                          const locked = lockText(r, level);
                          const missing = missingIngredients(inventory, r.recipe ?? []);
                          return (
                            <button
                              key={r.id}
                              disabled={farmBusy || !!locked}
                              onClick={() => startKitchenCraft(id, r.id)}
                              className="touch-btn min-h-[44px] text-left bg-[#fffdf7] border border-[#c88a4b] rounded-lg px-2 py-1 cursor-pointer disabled:opacity-60"
                            >
                              <span className="font-bold">
                                {r.emoji} {r.name}
                              </span>
                              <span className="block text-[11px] text-[#664930]">
                                {locked ??
                                  (missing.length
                                    ? `🧺 Thiếu: ${missing.map((x) => `${x.qty} ${nameOf(x.itemId)}`).join(', ')}`
                                    : r.category === 'CRAFT_GEAR'
                                    ? `🧵 Làm ${r.growOrCraftMinutes} phút · đồ thợ 72h (Độ No hao chậm 25%)`
                                    : `🔥 Nấu ${r.growOrCraftMinutes} phút · +${r.staminaDelta}⚡ khi ăn`)}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  );
                })}
              </div>
            )}

            {tab === 'BOOK' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {KITCHEN_RECIPES.map((r) => {
                  const found = isRecipeDiscovered(known, r.id);
                  const locked = lockText(r, level);
                  const hint = recipeHint(r);
                  return (
                    <div key={r.id} className="bg-white border border-[#e0d4c0] rounded-lg p-2">
                      <div className="font-extrabold text-[#2a180c]">
                        {found ? (
                          <>
                            <GameIcon id={r.id} fallback={r.emoji} size={20} /> {r.name}
                          </>
                        ) : (
                          '❓ ???'
                        )}
                      </div>
                      <div className="text-[11px] text-[#664930]">
                        {kitchenItem(r.machineId ?? '')?.emoji} {kitchenItem(r.machineId ?? '')?.name}
                      </div>
                      <div className="text-[11px] text-[#b83224] font-semibold">
                        {found
                          ? (r.recipe ?? []).map((i) => `${i.qty} ${nameOf(i.itemId)}`).join(' + ')
                          : `Gợi ý: có ${hint.firstItemId ? nameOf(hint.firstItemId) : '?'} · ${hint.totalQty} nguyên liệu`}
                      </div>
                      <div className="text-[11px] text-[#664930]">
                        {locked ?? (
                          <>
                            Ăn: <b>+{r.staminaDelta} ⚡</b> · HTX: <b>{r.baseSellGold} 🪙</b> · Kho: <b>{inventory[r.id] ?? 0}</b>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {tab === 'POT' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-3 space-y-2">
                  <p className="font-bold">🎒 Chọn 1–{POT_MAX_INGREDIENTS} nguyên liệu trong Kho (nguyên liệu không bị mất):</p>
                  {potChoices.length === 0 && (
                    <p className="text-[#664930]">Kho chưa có nguyên liệu nấu ăn. Thu hoạch Lúa, Ngô, Khoai, Cá… trước nhé!</p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {potChoices.map((c) => {
                      const left = (inventory[c.id] ?? 0) - inPot(c.id);
                      return (
                        <button
                          key={c.id}
                          disabled={left <= 0 || pot.length >= POT_MAX_INGREDIENTS}
                          onClick={() => setPot([...pot, c.id])}
                          className="touch-btn min-h-[44px] bg-[#4e8222] text-white px-2.5 py-1 rounded-lg font-bold cursor-pointer disabled:opacity-50"
                        >
                          + {c.emoji} {c.name} ({left})
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-[#fff3e0] border-2 border-[#b83224] rounded-xl p-3 text-center space-y-2">
                  <h4 className="font-extrabold text-[#b83224]">🔥 NỒI ĐẤT PHỐI MÓN</h4>
                  {!machines[POT_MACHINE_ID] && <p className="font-bold text-[#664930]">Cần xây {nameOf(POT_MACHINE_ID)} trước.</p>}
                  <div className="flex flex-wrap justify-center gap-1 min-h-8">
                    {pot.map((id, idx) => (
                      <button
                        key={`${id}-${idx}`}
                        onClick={() => setPot(pot.filter((_, i) => i !== idx))}
                        className="bg-white border border-[#c88a4b] px-2 py-0.5 rounded font-bold cursor-pointer"
                        title="Bỏ ra"
                      >
                        {nameOf(id)} ✕
                      </button>
                    ))}
                  </div>
                  <div className="text-3xl">🥘</div>
                  <div className="flex gap-2 justify-center">
                    <button
                      disabled={farmBusy || pot.length === 0 || !machines[POT_MACHINE_ID]}
                      onClick={() => tryCookingPot(pot)}
                      className="touch-btn min-h-[44px] bg-[#b83224] text-white font-extrabold px-3 py-1.5 rounded-xl cursor-pointer disabled:opacity-60"
                    >
                      🔥 Nổi lửa thử
                    </button>
                    <button
                      onClick={() => setPot([])}
                      className="touch-btn min-h-[44px] bg-[#f5b82e] text-[#2a180c] font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      🔄 Làm trống
                    </button>
                  </div>
                  <p className="text-[11px] text-[#664930]">Lần đầu tìm ra món: +10 💎 +50 XP. Xem gợi ý ở Sổ Tay.</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
