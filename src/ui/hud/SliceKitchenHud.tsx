/**
 * P1-9 — Bếp Củi (GP-30) và bảng đơn HTX (GP-40) của bản thử `?p1`.
 * Chỉ đọc `useSliceStore` và gọi action; luật ở `src/domain/cooking.ts`, `src/domain/orders.ts`.
 */
import React, { useEffect, useState } from 'react';
import { findItem } from '../../domain/farm';
import { POT_MAX_INGREDIENTS, missingIngredients, recipeHint } from '../../domain/cooking';
import { boardOf } from '../../domain/orders';
import { isMaterial } from '../../domain/estate';
import { SLICE_KITCHEN_ID, SLICE_RECIPES, sliceUnlockLevel } from '../../data/sliceContent';
import { itemLabel, useSliceStore } from '../../store/useSliceStore';
import { Sheet, btn } from './sliceUi';
import { GameIcon } from '../GameIcon';

const mmss = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

/** Bảng đang mở theo store (chạm Bếp trên bản đồ, nút 📋 Đơn ở dock). */
export function SlicePanels() {
  const panel = useSliceStore((s) => s.panel);
  const close = useSliceStore((s) => s.openPanel);
  if (panel === 'KITCHEN') return <KitchenPanel onClose={() => close(null)} />;
  if (panel === 'ORDERS') return <OrdersPanel onClose={() => close(null)} />;
  return null;
}

function KitchenPanel({ onClose }: { onClose: () => void }) {
  const save = useSliceStore((s) => s.save);
  const now = useSliceStore((s) => s.now);
  const cook = useSliceStore((s) => s.cook);
  const collect = useSliceStore((s) => s.collectDish);
  const discover = useSliceStore((s) => s.discover);
  const [pot, setPot] = useState<string[]>([]);
  const machine = save.machines?.[SLICE_KITCHEN_ID];
  const known = save.discoveredRecipes ?? [];
  const inv = save.inventory;
  const potCount = (id: string) => pot.filter((p) => p === id).length;
  const foods = Object.entries(inv).filter(([id, n]) => n > 0 && !isMaterial(id) && findItem(id)?.category !== 'RECIPE');

  return (
    <Sheet title="🍲 Bếp Củi" onClose={onClose}>
      <div className="mb-2 text-xs" data-testid="kitchen-status">
        {!machine?.craftItemId && <span>Bếp đang rảnh — chọn món để nấu.</span>}
        {machine?.craftItemId && machine.readyAt !== null && now < machine.readyAt && (
          <span>
            🔥 Đang nấu {itemLabel(machine.craftItemId)} — còn <b>{mmss(machine.readyAt - now)}</b>
          </span>
        )}
        {machine?.craftItemId && machine.readyAt !== null && now >= machine.readyAt && (
          <button className={`${btn} px-3 !bg-[#ffe28a] font-bold`} onClick={collect} data-testid="collect-dish">
            Lấy {itemLabel(machine.craftItemId)}
          </button>
        )}
      </div>

      {SLICE_RECIPES.map((id, i) => {
        const it = findItem(id);
        if (!it) return null;
        const lv = sliceUnlockLevel(it);
        const isKnown = i === 0 || known.includes(id);
        const miss = missingIngredients(inv, it.recipe ?? []);
        const hint = recipeHint(it);
        return (
          <div key={id} className="flex min-h-[44px] items-center justify-between gap-2 border-b border-[#d8c49b] py-1 text-xs">
            <span>
              <GameIcon id={id} fallback={it.emoji} size={24} className="mr-1" />
              <b>{it.name}</b> · {it.growOrCraftMinutes} phút · +{it.staminaDelta} ⚡ khi ăn
              <br />
              {isKnown ? (
                <small>
                  Cần: {(it.recipe ?? []).map((r) => `${r.qty} ${itemLabel(r.itemId)} (có ${inv[r.itemId] ?? 0})`).join(', ')}
                </small>
              ) : (
                <small>
                  Chưa biết công thức — thử ở Nồi Đất: {hint.totalQty} nguyên liệu, có {hint.firstItemId ? itemLabel(hint.firstItemId) : '?'}
                </small>
              )}
            </span>
            {save.level < lv ? (
              <small>🔒 Lv.{lv}</small>
            ) : isKnown ? (
              <button className={`${btn} px-2`} disabled={!!machine?.craftItemId || miss.length > 0} onClick={() => cook(id)} data-testid={`cook-${id}`}>
                Nấu
              </button>
            ) : null}
          </div>
        );
      })}

      <div className="mt-2 text-xs" data-testid="pot">
        <b>🏺 Nồi Đất</b> — bỏ 1–{POT_MAX_INGREDIENTS} nguyên liệu để tìm món mới (nguyên liệu không mất).
        <div className="mt-1 flex flex-wrap gap-1">
          {foods.length === 0 && <small>Kho chưa có nông sản.</small>}
          {foods.map(([id, n]) => (
            <button
              key={id}
              className={`${btn} px-2 ${potCount(id) ? '!bg-[#ffe28a]' : ''}`}
              disabled={pot.length >= POT_MAX_INGREDIENTS || potCount(id) >= n}
              onClick={() => setPot([...pot, id])}
              data-testid={`pot-${id}`}
            >
              {findItem(id)?.emoji} {potCount(id) ? `×${potCount(id)}` : ''}
            </button>
          ))}
        </div>
        <div className="mt-1 flex gap-1">
          <button className={`${btn} px-2`} disabled={!pot.length} onClick={() => setPot([])}>
            Bỏ hết
          </button>
          <button
            className={`${btn} px-3 font-bold`}
            disabled={!pot.length}
            onClick={() => {
              discover(pot);
              setPot([]);
            }}
            data-testid="discover-btn"
          >
            Thử nấu ({pot.length})
          </button>
        </div>
      </div>
    </Sheet>
  );
}

function OrdersPanel({ onClose }: { onClose: () => void }) {
  const save = useSliceStore((s) => s.save);
  const now = useSliceStore((s) => s.now);
  const refresh = useSliceStore((s) => s.refreshOrders);
  const deliver = useSliceStore((s) => s.deliverOrder);
  const skip = useSliceStore((s) => s.skipOrder);
  const board = boardOf(save);
  const due = board.slots.some((o, i) => !o && now >= board.readyAt[i]);
  // chỗ trống hết thời gian chờ → xin đơn mới (engine bỏ qua nếu chưa có hàng để đặt)
  useEffect(() => {
    if (due) refresh();
  }, [due, save.level, refresh]);

  return (
    <Sheet title="📋 Bảng đơn HTX" onClose={onClose}>
      <p className="mb-1 text-xs">Giao đủ hàng được thưởng cao hơn bán thẳng (×1,2 – ×1,5 theo số loại).</p>
      {board.slots.map((o, i) =>
        o ? (
          <div key={i} className="flex min-h-[44px] items-center justify-between gap-2 border-b border-[#d8c49b] py-1 text-xs" data-testid={`order-${i}`}>
            <span>
              {o.lines.map((l) => (
                <span key={l.itemId} className={(save.inventory[l.itemId] ?? 0) >= l.qty ? 'font-bold' : ''}>
                  {itemLabel(l.itemId)} {Math.min(save.inventory[l.itemId] ?? 0, l.qty)}/{l.qty}
                  <br />
                </span>
              ))}
              <small>
                Thưởng: +{o.gold} 🪙 · +{o.xp} XP
              </small>
            </span>
            <span className="flex flex-col gap-1">
              <button className={`${btn} px-2 font-bold`} onClick={() => deliver(i)} data-testid={`deliver-${i}`}>
                Giao
              </button>
              <button className={`${btn} px-2`} onClick={() => skip(i)} data-testid={`skip-${i}`}>
                Bỏ
              </button>
            </span>
          </div>
        ) : (
          <div key={i} className="flex min-h-[44px] items-center border-b border-[#d8c49b] py-1 text-xs" data-testid={`order-${i}`}>
            {now < board.readyAt[i] ? `⏳ Đơn mới sau ${mmss(board.readyAt[i] - now)}` : '🌾 Chưa có hàng để HTX đặt — trồng thêm hoặc lên cấp.'}
          </div>
        ),
      )}
    </Sheet>
  );
}
