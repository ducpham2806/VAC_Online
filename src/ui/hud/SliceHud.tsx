/**
 * P1-5 — HUD lai của bản thử `?p1` (docs/06_UI_UX.md UI-20, UI-30; wireframe docs/wireframes/hud-dieu-khien-lai.html).
 * Chỉ đọc `useSliceStore` và gọi action; không tính luật ở đây.
 */
import React, { useEffect, useState } from 'react';
import { findItem } from '../../domain/farm';
import { isMaterial } from '../../domain/estate';
import { xpToNext } from '../../domain/progression';
import { SEASON_ORDER, seasonAt } from '../../domain/season';
import type { Tool } from '../../domain/tools';
import type { Season } from '../../data/types';
import { TOOL_EMOJI } from '../../game/slice/toolIcons';
import { sowableSeeds } from '../../game/slice/sliceSave';
import { effectiveSeason, itemLabel, selectActionTool, useSliceStore } from '../../store/useSliceStore';
import { GameIcon } from '../GameIcon';
import { Sheet, btn } from './sliceUi';
import { GiaPhaPanel, IntroScene, NpcDialogSheet, TutorialBar } from './SliceStoryHud';
import { SlicePanels } from './SliceKitchenHud';

const SEASON_LABEL: Record<Season, { icon: string; name: string }> = {
  XUAN: { icon: '🌸', name: 'Xuân' },
  HA: { icon: '☀️', name: 'Hạ' },
  THU: { icon: '🍂', name: 'Thu' },
  DONG: { icon: '❄️', name: 'Đông' },
};
const TOOL_LABEL: Record<Tool, string> = {
  HOE: 'Cuốc', SEED: 'Gieo', WATER: 'Tưới', SICKLE: 'Gặt', FEED: 'Cho ăn', ROD: 'Câu', AXE: 'Dọn', HAMMER: 'Sửa', HAND: 'Nói', NONE: '—',
};
/** Thanh công cụ 8 ô (UI-20): công cụ tự chọn theo đối tượng, ô ở đây chỉ để xem / mở túi hạt / túi đồ. */
const TOOLBAR: readonly (Tool | 'BAG')[] = ['HOE', 'SEED', 'WATER', 'SICKLE', 'AXE', 'HAMMER', 'ROD', 'BAG'];

const WOOD_D = '#3D2314';
type Panel = 'none' | 'seeds' | 'kho' | 'settings' | 'giapha';

/** Màn thấp (< 420 px, điện thoại ngang): dock chỉ hiện icon (UI-20). */
function useShort(): boolean {
  const q = '(max-height: 420px)';
  const [short, setShort] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => setShort(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return short;
}


export const SliceHud: React.FC = () => {
  const save = useSliceStore((s) => s.save);
  const now = useSliceStore((s) => s.now);
  const seedId = useSliceStore((s) => s.seedId);
  const toasts = useSliceStore((s) => s.toasts);
  const actionTool = useSliceStore(selectActionTool);
  const actNear = useSliceStore((s) => s.actNear);
  const toast = useSliceStore((s) => s.toast);
  const openPanel = useSliceStore((s) => s.openPanel);
  const [toolbarOpen, setToolbarOpen] = useState(false);
  const [panel, setPanel] = useState<Panel>('none');
  const short = useShort();

  const override = useSliceStore((s) => s.seasonOverride);
  const cal = seasonAt(now);
  const season = effectiveSeason({ now, seasonOverride: override });
  const daysLeft = Math.max(1, Math.ceil((cal.nextSeasonAt - now) / 86_400_000));
  const next = SEASON_ORDER[(SEASON_ORDER.indexOf(cal.season) + 1) % 4];
  const xpPct = Math.min(100, Math.round((save.xp / Math.max(1, xpToNext(save.level))) * 100));
  const seed = seedId ? findItem(seedId) : undefined;

  const onToolSlot = (t: Tool | 'BAG') => {
    if (t === 'SEED') return setPanel('seeds');
    if (t === 'BAG') return setPanel('kho');
    toast(`${TOOL_EMOJI[t]} Công cụ tự đổi theo thứ anh chạm vào — không cần chọn tay.`);
  };

  return (
    <div className="pointer-events-none absolute inset-0 select-none text-[#3D2314]" style={{ fontSize: 13 }}>
      {/* Góc trên trái: chân dung, cấp, XP (UI-30) */}
      <div className="absolute flex items-center gap-1.5" style={{ top: 'max(8px, env(safe-area-inset-top))', left: 'max(8px, env(safe-area-inset-left))' }}>
        <div className="h-11 w-11 rounded-full border-[3px] bg-[#2E8B8D] text-center text-2xl leading-[38px]" style={{ borderColor: WOOD_D }}>
          👨‍🌾
        </div>
        <div className="vac-paper bg-[#f3e3c0] px-2 py-0.5">
          <div className="font-bold">Lv.{save.level}</div>
          <div className={`${short ? 'w-16' : 'w-24'} h-2 overflow-hidden rounded bg-[#d8c49b]`}>
            <div className="h-full bg-[#7FB800]" style={{ width: `${xpPct}%` }} />
          </div>
        </div>
      </div>

      {/* Góc trên giữa: mùa + còn N ngày (UI-30, GP-20) */}
      <div className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center text-center" style={{ top: 'max(8px, env(safe-area-inset-top))' }}>
        <div className="vac-paper whitespace-nowrap bg-[#f3e3c0] px-3 py-0.5 leading-tight" data-testid="season">
          <b>
            {SEASON_LABEL[season].icon} {SEASON_LABEL[season].name}
          </b>{' '}
          {override ? '· công tắc thử' : `· ngày ${cal.day}/7`}
          {!short && !override && (
            <div className="text-[11px]">
              còn {daysLeft} ngày sang {SEASON_LABEL[next].name}
            </div>
          )}
        </div>
        <div className="mt-1 flex flex-col items-center gap-1">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`vac-pop-in max-w-[min(520px,70vw)] rounded-md border-2 px-2 py-0.5 text-xs ${t.ok ? 'bg-[#f3e3c0]' : 'bg-[#f6d2b8]'}`}
              style={{ borderColor: WOOD_D }}
              data-testid="toast"
            >
              {t.text}
            </div>
          ))}
        </div>
      </div>

      {/* Góc trên phải: 🪙 💎 ⚡ (UI-30) */}
      <div className="absolute flex gap-1" style={{ top: 'max(8px, env(safe-area-inset-top))', right: 'max(8px, env(safe-area-inset-right))' }}>
        <Badge icon="gold" fallback="🪙" value={save.gold.toLocaleString('vi-VN')} testId="gold" />
        {!short && <Badge icon="gem" fallback="💎" value={String(save.gems)} />}
        <Badge icon="energy" fallback="⚡" value={`${save.stamina}/${save.maxStamina}`} />
      </div>

      {/* Góc dưới phải: thanh công cụ thu gọn + nút hành động (UI-20) */}
      <div
        className="absolute flex items-end gap-2"
        style={{ right: 'max(16px, env(safe-area-inset-right))', bottom: short ? 'max(56px, env(safe-area-inset-bottom))' : 'max(76px, env(safe-area-inset-bottom))' }}
      >
        <div className="flex flex-col items-end gap-1">
          {toolbarOpen && (
            <div className="vac-wood grid grid-cols-4 gap-1 bg-[#7a4a2a] p-1 pointer-events-auto" data-testid="toolbar">
              {TOOLBAR.map((t) => (
                <button
                  key={t}
                  className={`${btn} text-xl ${t === actionTool ? '!bg-[#ffe28a]' : ''}`}
                  onClick={() => onToolSlot(t)}
                  aria-label={t === 'BAG' ? 'Túi đồ' : TOOL_LABEL[t]}
                >
                  {t === 'BAG' ? '🎒' : TOOL_EMOJI[t]}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-1">
            <button className={`${btn} px-2 text-sm`} onClick={() => setPanel('seeds')} aria-label="Túi hạt" data-testid="seed-btn">
              🌱 {seed ? seed.emoji : '—'}
            </button>
            <button className={`${btn} text-xl`} onClick={() => setToolbarOpen((v) => !v)} aria-label="Thanh công cụ" aria-expanded={toolbarOpen}>
              {TOOL_EMOJI[actionTool] || '🧰'}
            </button>
          </div>
        </div>
        <button
          className={`touch-btn pointer-events-auto flex-col rounded-full border-4 ${actionTool === 'NONE' ? 'bg-[#d8c49b]' : 'bg-[#F5B700]'} ${short ? 'h-16 w-16' : 'h-[76px] w-[76px]'}`}
          style={{ borderColor: WOOD_D }}
          onClick={actNear}
          aria-label="Nút hành động"
          data-testid="action-btn"
        >
          <span className="text-2xl leading-none">{TOOL_EMOJI[actionTool] || '✋'}</span>
          <small className="text-[10px] font-bold">{TOOL_LABEL[actionTool]}</small>
        </button>
      </div>

      {/* Dock đáy (UI-30) */}
      <div
        className="vac-wood absolute left-1/2 flex -translate-x-1/2 gap-1 bg-[#7a4a2a] p-1"
        style={{ bottom: 'max(6px, env(safe-area-inset-bottom))' }}
      >
        <DockBtn icon="📦" label="Kho" short={short} onClick={() => setPanel('kho')} />
        <DockBtn icon="📋" label="Đơn" short={short} onClick={() => openPanel('ORDERS')} />
        <DockBtn icon="📜" label="Gia Phả" short={short} onClick={() => setPanel('giapha')} />
        <DockBtn icon="👥" label="Bạn" short={short} onClick={() => toast('👥 Bạn bè mở sau bản thử.', false)} />
        <DockBtn icon="⚙️" label="" short onClick={() => setPanel('settings')} />
      </div>

      {panel === 'seeds' && <SeedPanel onClose={() => setPanel('none')} />}
      {panel === 'kho' && <KhoPanel onClose={() => setPanel('none')} />}
      {panel === 'settings' && <SettingsPanel onClose={() => setPanel('none')} />}
      {panel === 'giapha' && <GiaPhaPanel onClose={() => setPanel('none')} />}
      <TutorialBar short={short} />
      <NpcDialogSheet />
      <IntroScene />
      <ConfirmEstate />
      <SlicePanels />
    </div>
  );
};

function Badge({ icon, fallback, value, testId }: { icon: string; fallback: string; value: string; testId?: string }) {
  return (
    <div className="vac-paper flex min-h-[32px] items-center gap-1 bg-[#f3e3c0] px-2 font-bold" data-testid={testId}>
      <GameIcon id={icon} fallback={fallback} size={18} />
      {value}
    </div>
  );
}

function DockBtn({ icon, label, short, onClick }: { icon: string; label: string; short: boolean; onClick: () => void }) {
  return (
    <button className={`${btn} px-2 text-xs`} onClick={onClick} aria-label={label || 'Cài đặt'}>
      <span className="text-base">{icon}</span>
      {!short && label}
    </button>
  );
}


function SeedPanel({ onClose }: { onClose: () => void }) {
  const save = useSliceStore((s) => s.save);
  const now = useSliceStore((s) => s.now);
  const seedId = useSliceStore((s) => s.seedId);
  const setSeed = useSliceStore((s) => s.setSeed);
  const override = useSliceStore((s) => s.seasonOverride);
  const seeds = sowableSeeds(save, effectiveSeason({ now, seasonOverride: override }));
  return (
    <Sheet title="🌱 Túi hạt — gieo được mùa này" onClose={onClose}>
      {seeds.length === 0 && <p className="text-xs">Chưa có giống nào gieo được trong mùa này.</p>}
      <div className="grid grid-cols-2 gap-1">
        {seeds.map((c) => (
          <button
            key={c.id}
            className={`${btn} justify-start px-2 text-left text-xs ${c.id === seedId ? '!bg-[#ffe28a]' : ''}`}
            onClick={() => {
              setSeed(c.id);
              onClose();
            }}
          >
            <span className="text-lg">{c.emoji}</span>
            <span>
              {c.name}
              <br />
              <small>{c.buyCostGold} 🪙</small>
            </span>
          </button>
        ))}
      </div>
    </Sheet>
  );
}

/** P1-10: hỏi lại trước khi tiêu vàng cho sửa hạng mục / khai hoang (GP-14, KT-15, KT-18). */
function ConfirmEstate() {
  const pending = useSliceStore((s) => s.pending);
  const confirm = useSliceStore((s) => s.confirmPending);
  const cancel = useSliceStore((s) => s.cancelPending);
  const gold = useSliceStore((s) => s.save.gold);
  const inv = useSliceStore((s) => s.save.inventory);
  if (!pending) return null;
  const have = `Đang có: ${gold.toLocaleString('vi-VN')} 🪙 · ${itemLabel('MAT_GO')} ${inv.MAT_GO ?? 0} · ${itemLabel('MAT_DA')} ${inv.MAT_DA ?? 0}`;
  return (
    <Sheet title={`${pending.action.type === 'RECLAIM' ? '⛏️' : '🔨'} ${pending.title}`} onClose={cancel}>
      <div className="text-xs" data-testid="confirm-estate">
        <p>
          Cần: <b>{pending.cost}</b>
        </p>
        <p>{pending.unlocks}</p>
        <p className="mt-1 opacity-80">{have}</p>
        <div className="mt-2 flex justify-end gap-2">
          <button className={`${btn} px-3`} onClick={cancel}>
            Thôi
          </button>
          <button className={`${btn} px-3 !bg-[#ffe28a] font-bold`} onClick={confirm} data-testid="confirm-yes">
            {pending.action.type === 'RECLAIM' ? 'Khai hoang' : 'Sửa'}
          </button>
        </div>
      </div>
    </Sheet>
  );
}

function KhoPanel({ onClose }: { onClose: () => void }) {
  const inv = useSliceStore((s) => s.save.inventory);
  const fengShui = useSliceStore((s) => s.save.fengShuiScore);
  const sell = useSliceStore((s) => s.sell);
  const eat = useSliceStore((s) => s.eat);
  const rows = Object.entries(inv).filter(([, n]) => n > 0);
  return (
    <Sheet title="📦 Kho" onClose={onClose}>
      <p className="mb-1 text-xs" data-testid="feng-shui">
        🏯 Phong Thủy điền trang: <b>{fengShui}</b>
      </p>
      {rows.length === 0 && <p className="text-xs">Kho trống — gặt lúa chín để có nông sản.</p>}
      {rows.map(([id, n]) => {
        if (isMaterial(id)) {
          return (
            <div key={id} className="flex min-h-[44px] items-center justify-between gap-2 border-b border-[#d8c49b] py-1 text-xs">
              <span>
                {itemLabel(id)} × <b>{n}</b>
              </span>
              <small>vật liệu sửa điền trang</small>
            </div>
          );
        }
        const it = findItem(id);
        return (
          <div key={id} className="flex items-center justify-between gap-2 border-b border-[#d8c49b] py-1 text-xs">
            <span>
              {itemLabel(id)} × <b>{n}</b>
            </span>
            <span className="flex gap-1">
              {it?.category === 'RECIPE' && it.staminaDelta > 0 && (
                <button className={`${btn} px-2`} onClick={() => eat(id)} data-testid={`eat-${id}`}>
                  Ăn +{it.staminaDelta} ⚡
                </button>
              )}
              <button className={`${btn} px-2`} onClick={() => sell(id, n)} data-testid={`sell-${id}`}>
                Bán HTX +{(it?.baseSellGold ?? 0) * n} 🪙
              </button>
            </span>
          </div>
        );
      })}
    </Sheet>
  );
}

/** Cài đặt bản thử: công tắc đổi mùa (LT-03, P1-6) và chơi lại từ đầu (xóa bản lưu P1-7). */
function SettingsPanel({ onClose }: { onClose: () => void }) {
  const override = useSliceStore((s) => s.seasonOverride);
  const setOverride = useSliceStore((s) => s.setSeasonOverride);
  const reset = useSliceStore((s) => s.reset);
  const toast = useSliceStore((s) => s.toast);
  const [confirm, setConfirm] = useState(false);
  return (
    <Sheet title="⚙️ Cài đặt bản thử" onClose={onClose}>
      <p className="mb-1 text-xs">
        Công tắc mùa (chỉ có ở bản thử): xem bản đồ và giống gieo được của từng mùa. Cây đang lớn không bị ảnh hưởng.
      </p>
      <div className="mb-2 grid grid-cols-5 gap-1" data-testid="season-switch">
        <button className={`${btn} text-xs ${override === null ? '!bg-[#ffe28a]' : ''}`} onClick={() => setOverride(null)}>
          Lịch thật
        </button>
        {SEASON_ORDER.map((se) => (
          <button
            key={se}
            className={`${btn} text-xs ${override === se ? '!bg-[#ffe28a]' : ''}`}
            onClick={() => setOverride(se)}
            aria-label={`Mùa ${SEASON_LABEL[se].name}`}
          >
            {SEASON_LABEL[se].icon} {SEASON_LABEL[se].name}
          </button>
        ))}
      </div>
      <p className="mb-1 text-xs">Tiến trình được lưu trên máy này (tải lại trang không mất).</p>
      {!confirm ? (
        <button className={`${btn} px-2 text-xs`} onClick={() => setConfirm(true)}>
          🔄 Chơi lại từ đầu
        </button>
      ) : (
        <div className="flex items-center gap-1 text-xs">
          Xóa hết tiến trình bản thử?
          <button
            className={`${btn} px-2 !bg-[#f6d2b8]`}
            onClick={() => {
              reset(Date.now());
              toast('Đã chơi lại từ đầu.');
              onClose();
            }}
          >
            Xóa
          </button>
          <button className={`${btn} px-2`} onClick={() => setConfirm(false)}>
            Thôi
          </button>
        </div>
      )}
    </Sheet>
  );
}
