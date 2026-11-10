import { describe, expect, it } from 'vitest';
import { GIFT_POINTS, TALK_POINTS, giftItem, heartsOf, npcOf, talk, vnDay } from './npc';
import type { FarmSave } from './farm';
import { newSliceSave } from '../game/slice/sliceSave';

const NOW = new Date('2026-11-10T08:00:00+07:00').getTime();
const NEXT_DAY = NOW + 86_400_000;
const fresh = (patch: Partial<FarmSave> = {}): FarmSave => ({ ...newSliceSave(NOW), ...patch });
const ok = (r: ReturnType<typeof talk>) => {
  if (!r.ok) throw new Error(r.message);
  return r.save;
};

describe('GP-50 / KT-19 tim NPC', () => {
  it('ngày tính theo giờ Việt Nam: 23:59 và 00:00 giờ VN là hai ngày khác nhau', () => {
    const a = new Date('2026-11-10T23:59:00+07:00').getTime();
    const b = new Date('2026-11-11T00:00:00+07:00').getTime();
    expect(vnDay(b) - vnDay(a)).toBe(1);
  });

  it('nói chuyện: lần đầu trong ngày +20, nói lại trong ngày không cộng, sang ngày mới cộng tiếp', () => {
    const s1 = ok(talk(fresh(), 'BAC_BAY', NOW));
    expect(npcOf(s1, 'BAC_BAY').points).toBe(TALK_POINTS);
    const s2 = ok(talk(s1, 'BAC_BAY', NOW + 60_000));
    expect(npcOf(s2, 'BAC_BAY').points).toBe(TALK_POINTS);
    const s3 = ok(talk(s2, 'BAC_BAY', NEXT_DAY));
    expect(npcOf(s3, 'BAC_BAY').points).toBe(2 * TALK_POINTS);
  });

  it('đạt 2 tim lần đầu: kể cảnh ngắn đúng một lần', () => {
    const base = fresh({ npcs: { BAC_BAY: { ...npcOf({}, 'BAC_BAY'), points: 190 } } });
    const r = talk(base, 'BAC_BAY', NOW);
    expect(r.ok && r.message.startsWith('💞')).toBe(true);
    const again = talk(ok(r), 'BAC_BAY', NEXT_DAY);
    expect(again.ok && again.message.startsWith('💞')).toBe(false);
    expect(heartsOf(npcOf(ok(again), 'BAC_BAY').points)).toBe(2);
  });

  it('quà: thích +80, thường +30, ghét −20 (không dưới 0); trừ 1 món trong Kho; phát hiện sở thích', () => {
    const inv = { CROP_01: 2, CROP_02: 1, MAT_DA: 3 };
    const liked = ok(giftItem(fresh({ inventory: inv }), 'BAC_BAY', 'CROP_01', NOW));
    expect(npcOf(liked, 'BAC_BAY')).toMatchObject({ points: GIFT_POINTS.LIKED, knownLikes: ['CROP_01'] });
    expect(liked.inventory.CROP_01).toBe(1);
    const neutral = ok(giftItem(fresh({ inventory: inv }), 'CO_HUONG', 'CROP_01', NOW));
    expect(npcOf(neutral, 'CO_HUONG').points).toBe(GIFT_POINTS.NEUTRAL);
    const hated = ok(giftItem(fresh({ inventory: inv }), 'CO_HUONG', 'MAT_DA', NOW));
    expect(npcOf(hated, 'CO_HUONG')).toMatchObject({ points: 0, knownDislikes: ['MAT_DA'] });
    const likedHuong = ok(giftItem(fresh({ inventory: inv }), 'CO_HUONG', 'CROP_02', NOW));
    expect(npcOf(likedHuong, 'CO_HUONG').points).toBe(GIFT_POINTS.LIKED);
  });

  it('từ chối: NPC lạ, Kho không có món, đã tặng hôm nay', () => {
    expect(talk(fresh(), 'BA_KIEN', NOW).ok).toBe(false);
    expect(giftItem(fresh(), 'BA_KIEN', 'CROP_01', NOW).ok).toBe(false);
    expect(giftItem(fresh(), 'BAC_BAY', 'CROP_01', NOW)).toMatchObject({ ok: false, message: '⚠️ Kho không còn món này để tặng!' });
    const once = ok(giftItem(fresh({ inventory: { CROP_01: 2 } }), 'BAC_BAY', 'CROP_01', NOW));
    expect(giftItem(once, 'BAC_BAY', 'CROP_01', NOW + 1000).ok).toBe(false);
    expect(giftItem(once, 'BAC_BAY', 'CROP_01', NEXT_DAY).ok).toBe(true);
  });

  it('bản lưu hỏng → ban đầu; điểm kẹp trong 0…1000', () => {
    expect(npcOf({ npcs: { BAC_BAY: 'x' as never } }, 'BAC_BAY').points).toBe(0);
    expect(npcOf({ npcs: { BAC_BAY: { points: 5000 } as never } }, 'BAC_BAY').points).toBe(1000);
  });
});
