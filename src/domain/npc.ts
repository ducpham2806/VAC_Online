/**
 * GP-50 / KT-19 (QD-84) — tim NPC: nói chuyện và tặng quà mỗi ngày, mốc 2 tim mở cảnh ngắn.
 * Hàm thuần trên `FarmSave`; engine (ADR-001) gọi. Ngày tính theo lịch giờ Việt Nam (KT-17).
 */
import { NPCS, type NpcId } from '../data/npcs';
import type { FarmResult, FarmSave } from './farm';
import { findItem } from './farm';
import { MATERIALS, isMaterial } from './estate';

export const HEART_POINTS = 100;
export const MAX_HEARTS = 10;
export const TALK_POINTS = 20;
export const GIFT_POINTS = { LIKED: 80, NEUTRAL: 30, DISLIKED: -20 } as const;
/** Mốc tim có cảnh ngắn ở bản thử. */
export const HEART_EVENT_AT = 2;

const VN_OFFSET_MS = 7 * 3_600_000;
/** Số ngày lịch (giờ Việt Nam) — "mỗi ngày một lần" tính theo số này. */
export const vnDay = (now: number) => Math.floor((now + VN_OFFSET_MS) / 86_400_000);

export interface NpcState {
  points: number;
  /** Ngày (vnDay) đã nói chuyện / tặng quà gần nhất; -1 = chưa. */
  talkDay: number;
  giftDay: number;
  /** Mốc tim đã xem cảnh. */
  seenEvents: number[];
  /** Sở thích người chơi đã phát hiện qua tặng quà. */
  knownLikes: string[];
  knownDislikes: string[];
}

export const emptyNpc = (): NpcState => ({ points: 0, talkDay: -1, giftDay: -1, seenEvents: [], knownLikes: [], knownDislikes: [] });

const num = (v: unknown, d: number) => (typeof v === 'number' && Number.isFinite(v) ? v : d);
const strs = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);

/** Đọc trạng thái một NPC; bản lưu thiếu/hỏng → ban đầu. */
export function npcOf(save: Pick<FarmSave, 'npcs'>, id: NpcId): NpcState {
  const raw = save.npcs?.[id] as Partial<NpcState> | undefined;
  if (!raw || typeof raw !== 'object') return emptyNpc();
  return {
    points: Math.max(0, Math.min(MAX_HEARTS * HEART_POINTS, num(raw.points, 0))),
    talkDay: num(raw.talkDay, -1),
    giftDay: num(raw.giftDay, -1),
    seenEvents: (Array.isArray(raw.seenEvents) ? raw.seenEvents : []).filter((x): x is number => typeof x === 'number'),
    knownLikes: strs(raw.knownLikes),
    knownDislikes: strs(raw.knownDislikes),
  };
}

export const heartsOf = (points: number) => Math.min(MAX_HEARTS, Math.floor(points / HEART_POINTS));

const isNpc = (id: string): id is NpcId => id in NPCS;
const fail = (message: string): FarmResult => ({ ok: false, message });

function withNpc(save: FarmSave, id: NpcId, st: NpcState): FarmSave {
  return { ...save, npcs: { ...save.npcs, [id]: st } };
}

/** Lời chào theo số tim. */
export function greeting(id: NpcId, hearts: number): string {
  const lines = NPCS[id].lines;
  return lines[Math.min(lines.length - 1, Math.floor(hearts / 2))];
}

/**
 * Nói chuyện: lần đầu trong ngày +TALK_POINTS. Đạt mốc 2 tim lần đầu → kể cảnh ngắn (GP-50).
 * Nói thêm trong ngày vẫn được (chỉ chào), không cộng tim.
 */
export function talk(save: FarmSave, id: string, now: number): FarmResult {
  if (!isNpc(id)) return fail('⚠️ Không có người này trong làng!');
  const def = NPCS[id];
  const st = npcOf(save, id);
  const day = vnDay(now);
  if (st.talkDay === day) return { ok: true, save, message: `${def.emoji} ${def.name}: "${greeting(id, heartsOf(st.points))}"` };
  const points = Math.min(MAX_HEARTS * HEART_POINTS, st.points + TALK_POINTS);
  const hearts = heartsOf(points);
  const event = hearts >= HEART_EVENT_AT && !st.seenEvents.includes(HEART_EVENT_AT);
  const next: NpcState = { ...st, points, talkDay: day, seenEvents: event ? [...st.seenEvents, HEART_EVENT_AT] : st.seenEvents };
  return {
    ok: true,
    save: withNpc(save, id, next),
    message: event ? `💞 ${def.event2}` : `${def.emoji} ${def.name}: "${greeting(id, hearts)}" (+${TALK_POINTS} ❤️)`,
  };
}

const itemName = (id: string) => (isMaterial(id) ? MATERIALS[id].name : (findItem(id)?.name ?? id));

/** Tặng 1 món trong Kho (1 quà có tác dụng mỗi ngày): thích +80, thường +30, ghét −20 (KT-19). */
export function giftItem(save: FarmSave, id: string, itemId: string, now: number): FarmResult {
  if (!isNpc(id)) return fail('⚠️ Không có người này trong làng!');
  const def = NPCS[id];
  if ((save.inventory[itemId] ?? 0) < 1) return fail('⚠️ Kho không còn món này để tặng!');
  const st = npcOf(save, id);
  const day = vnDay(now);
  if (st.giftDay === day) return fail(`🎁 Hôm nay đã tặng ${def.name} rồi — mai tặng tiếp nhé.`);
  const liked = def.likes.includes(itemId);
  const disliked = def.dislikes.includes(itemId);
  const delta = liked ? GIFT_POINTS.LIKED : disliked ? GIFT_POINTS.DISLIKED : GIFT_POINTS.NEUTRAL;
  const next: NpcState = {
    ...st,
    points: Math.max(0, Math.min(MAX_HEARTS * HEART_POINTS, st.points + delta)),
    giftDay: day,
    knownLikes: liked && !st.knownLikes.includes(itemId) ? [...st.knownLikes, itemId] : st.knownLikes,
    knownDislikes: disliked && !st.knownDislikes.includes(itemId) ? [...st.knownDislikes, itemId] : st.knownDislikes,
  };
  const saved = withNpc({ ...save, inventory: { ...save.inventory, [itemId]: save.inventory[itemId] - 1 } }, id, next);
  const react = liked ? 'thích lắm!' : disliked ? 'không ưng món này…' : 'cảm ơn nhé.';
  return { ok: true, save: saved, message: `🎁 ${def.name} ${react} (${itemName(itemId)}, ${delta > 0 ? '+' : ''}${delta} ❤️)` };
}
