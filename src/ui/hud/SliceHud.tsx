/**
 * P1-5 — HUD lai của bản thử `?p1` (docs/06_UI_UX.md UI-20, UI-30; wireframe docs/wireframes/hud-dieu-khien-lai.html).
 * Chỉ đọc `useSliceStore` và gọi action; không tính luật ở đây.
 */
import React, { useEffect, useState } from 'react';
import { findItem } from '../../domain/farm';
import { xpToNext } from '../../domain/progression';
import { SEASON_ORDER, seasonAt } from '../../domain/season';
import type { Tool } from '../../domain/tools';
import type { Season } from '../../data/types';
import { TOOL_EMOJI } from '../../game/slice/toolIcons';
import { sowableSeeds } from '../../game/slice/sliceSave';
import { itemLabel, selectActionTool, useSliceStore } from '../../store/useSliceStore';
import { GameIcon } from '../GameIcon';

const SEASON_LABEL: Record<Season, { icon: string; name: string }> = {
  XUAN: { icon: '🌸', name: 'Xuân' },
  HA: { icon: '☀️', name: 'Hạ' },
  THU: { icon: '🍂', name: 'Thu' },
  DONG: { icon: '❄️', name: 'Đông' },
};
const TOOL_LABEL: Record<Tool, string> = {
  HOE: 'Cuốc', SEED: 'Gieo', WATER: 'Tưới', SICKLE: 'Gặt', FEED: 'Cho ăn', ROD: 'Câu', AXE: 'Chặt', HAND: 'Sửa', NONE: '—',
};
/** Thanh công cụ 8 ô (UI-20): công cụ tự chọn theo đối tượng, ô ở đây chỉ để xem / mở túi hạt / túi đồ. */
const TOOLBAR: readonly (Tool | 'BAG')[] = ['HOE', 'SEED', 'WATER', 'SICKLE', 'AXE', 'FEED', 'ROD', 'BAG'];

const WOOD_D = '#3D2314';
type Panel = 'none' | 'seeds' | 'kho';

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

const btn = 'touch-btn touch-btn-44 vac-paper bg-[#f3e3c0] text-[#3D2314] pointer-events-auto select-none';

export const SliceHud: React.FC = () => {
  const save = useSliceStore((s) => s.save);
  const now = useSliceStore((s) => s.now);
  const seedId = useSliceStore((s) => s.seedId);
  const toasts = useSliceStore((s) => s.toasts);
  const actionTool = useSliceStore(selectActionTool);
  const actNear = useSliceStore((s) => s.actNear);
  const toast = useSliceStore((s) => s.toast);
  const [toolbarOpen, setToolbarOpen] = useState(false);
  const [panel, setPanel] = useState<Panel>('none');
  const short = useShort();

  const season = seasonAt(now);
  const daysLeft = Math.max(1, Math.ceil((season.nextSeasonAt - now) / 86_400_000));
  const next = SEASON_ORDER[(SEASON_ORDER.indexOf(season.season) + 1) % 4];
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
            {SEASON_LABEL[season.season].icon} {SEASON_LABEL[season.season].name}
          </b>{' '}
          · ngày {season.day}/7
          {!short && (
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
        <DockBtn icon="📋" label="Đơn" short={short} onClick={() => toast('📋 Bảng đơn HTX mở ở P1-9.', false)} />
        <DockBtn icon="📜" label="Gia Phả" short={short} onClick={() => toast('📜 Gia Phả mở ở P1-11.', false)} />
        <DockBtn icon="👥" label="Bạn" short={short} onClick={() => toast('👥 Bạn bè mở sau bản thử.', false)} />
        <DockBtn icon="⚙️" label="" short onClick={() => toast('⚙️ Cài đặt mở sau bản thử.', false)} />
      </div>

      {panel === 'seeds' && <SeedPanel onClose={() => setPanel('none')} />}
      {panel === 'kho' && <KhoPanel onClose={() => setPanel('none')} />}
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

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div
        className="vac-paper vac-pop-in max-h-[80vh] w-[min(420px,90vw)] overflow-y-auto bg-[#f3e3c0] p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-center justify-between">
          <b>{title}</b>
          <button className={`${btn}`} onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function SeedPanel({ onClose }: { onClose: () => void }) {
  const save = useSliceStore((s) => s.save);
  const now = useSliceStore((s) => s.now);
  const seedId = useSliceStore((s) => s.seedId);
  const setSeed = useSliceStore((s) => s.setSeed);
  const seeds = sowableSeeds(save, now);
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

function KhoPanel({ onClose }: { onClose: () => void }) {
  const inv = useSliceStore((s) => s.save.inventory);
  const sell = useSliceStore((s) => s.sell);
  const rows = Object.entries(inv).filter(([, n]) => n > 0);
  return (
    <Sheet title="📦 Kho" onClose={onClose}>
      {rows.length === 0 && <p className="text-xs">Kho trống — gặt lúa chín để có nông sản.</p>}
      {rows.map(([id, n]) => {
        const it = findItem(id);
        return (
          <div key={id} className="flex items-center justify-between gap-2 border-b border-[#d8c49b] py-1 text-xs">
            <span>
              {itemLabel(id)} × <b>{n}</b>
            </span>
            <button className={`${btn} px-2`} onClick={() => sell(id, n)} data-testid={`sell-${id}`}>
              Bán HTX +{(it?.baseSellGold ?? 0) * n} 🪙
            </button>
          </div>
        );
      })}
    </Sheet>
  );
}
