/**
 * Hướng dẫn tân thủ Chương 1–2 (S3, PO duyệt 2026-11-02) — hàm thuần, không đổi luật chơi.
 * Mỗi bước "xong" khi trạng thái game thật đã đạt (bộ đếm hành động, ô đất, nhiệm vụ, cấp),
 * nên chơi ở chế độ online hay offline đều đúng và không cần lưu thêm gì lên server.
 */
import type { FarmTileEntity } from '../data/types';
import type { Counters } from './quests';

export interface TutorialView {
  level: number;
  tiles: readonly Pick<FarmTileEntity, 'itemId'>[];
  progressCounters: Counters;
  completedQuestIds: readonly string[];
  /** Đã bán cho HTX ít nhất 1 lần (cờ riêng của tutorial, lưu ở client). */
  soldOnce: boolean;
}

export interface TutorialStep {
  id: string;
  /** Lời Bác Bảy. */
  speech: string;
  /** Việc cần làm, ngắn gọn (hiện cả ở màn hình nhỏ). */
  hint: string;
  done: (v: TutorialView) => boolean;
}

const count = (v: TutorialView, key: string) => v.progressCounters[key] ?? 0;
const harvestedAny = (v: TutorialView) =>
  Object.entries(v.progressCounters).some(([k, n]) => k.startsWith('HARVEST:') && n > 0);

export const TUTORIAL_STEPS: readonly TutorialStep[] = [
  {
    id: 'PLANT',
    speech: 'Về quê rồi thì gieo vụ lúa đầu mùa thôi cháu!',
    hint: '🌱 Chọn Lúa Nước trên Khay Giống rồi chạm 1 ô Ruộng để gieo.',
    done: (v) => v.tiles.some((t) => t.itemId !== null) || count(v, 'WATER') > 0 || harvestedAny(v),
  },
  {
    id: 'WATER',
    speech: 'Nước Giếng Làng mát lắm, tưới vào lúa lớn nhanh hơn đấy.',
    hint: '💧 Chạm lại ô vừa gieo để tưới nước (chín nhanh hơn 15%).',
    done: (v) => count(v, 'WATER') > 0,
  },
  {
    id: 'HARVEST',
    speech: 'Lúa sắp trổ bông rồi, chờ chút là gặt được!',
    hint: '🌾 Chờ lúa chín (khoảng 1,5 phút) rồi chạm ô để thu hoạch vào Kho.',
    done: harvestedAny,
  },
  {
    id: 'QUEST_1',
    speech: 'Giữ được đất tổ tiên rồi! Mở Gia Phả xem ông nội để lại gì nào.',
    hint: '📜 Bấm "Gia Phả & Quà" và nhận thưởng Chương 1.',
    done: (v) => v.completedQuestIds.includes('Q_CH1'),
  },
  {
    id: 'SELL',
    speech: 'Lúa thơm thế này, Hợp Tác Xã thu mua ngay đấy cháu.',
    hint: '🧺 Bấm "Kho & Bán HTX" và bán nông sản lấy Xu Vàng.',
    done: (v) => v.soldOnce,
  },
  {
    id: 'LEVEL_3',
    speech: 'Chăm chỉ vài vụ nữa là lên tay nghề, mở thêm giống mới!',
    hint: '⭐ Tiếp tục gieo – tưới – thu hoạch để đạt Lv.3.',
    done: (v) => v.level >= 3,
  },
  {
    id: 'MUD',
    speech: 'Bí mật đáy ao: bùn phù sa bón vào là cây chín ngay, có khi nổ Hoàng Kim!',
    hint: '🪣 Bấm "Vét Bùn Ao" (-3⚡), rồi chạm ô đang trồng để bón bùn.',
    done: (v) => count(v, 'DREDGE') > 0 && count(v, 'APPLY_MUD') > 0,
  },
  {
    id: 'QUEST_2',
    speech: 'Cháu giỏi lắm! Trang Gia Phả thứ hai đang chờ đấy.',
    hint: '📜 Mở "Gia Phả & Quà" và nhận thưởng Chương 2.',
    done: (v) => v.completedQuestIds.includes('Q_CH2'),
  },
];

/** Bước đầu tiên chưa xong (kèm số thứ tự 1-based), null khi đã hoàn thành cả hướng dẫn. */
export function currentTutorialStep(v: TutorialView): { step: TutorialStep; index: number } | null {
  const i = TUTORIAL_STEPS.findIndex((s) => !s.done(v));
  return i < 0 ? null : { step: TUTORIAL_STEPS[i], index: i + 1 };
}
