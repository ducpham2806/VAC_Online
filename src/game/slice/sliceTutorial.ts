/**
 * P1-11 — hướng dẫn 15 phút đầu của bản thử (GP-62, QD-84): Bác Bảy dẫn 8 bước.
 * Mỗi bước tự xong theo trạng thái game thật; không chặn người chơi làm việc khác; có thể ẩn.
 * Khác `src/domain/tutorial.ts` (game MVP cũ, không đổi).
 */
import { OBSTACLES, type ObstacleKind, REPAIRS, estateOf } from '../../domain/estate';
import type { FarmSave } from '../../domain/farm';
import { COUNTER } from '../../domain/quests';
import type { TilePos } from './estateMap';

export interface SliceTutorialView {
  save: FarmSave;
  /** Đã tự đi khỏi chỗ xuất hiện. */
  moved: boolean;
  /** Đã bán HTX ít nhất 1 lần. */
  sold: boolean;
}

export interface SliceTutorialStep {
  id: string;
  speech: string;
  hint: string;
  /** Ô để scene đặt mũi tên chỉ đường (nếu có); có thể đổi theo trạng thái (thiếu vật liệu → chỉ chỗ lấy). */
  target?: TilePos | ((v: SliceTutorialView) => TilePos | undefined);
  done: (v: SliceTutorialView) => boolean;
}

const c = (v: SliceTutorialView, k: string) => v.save.counters?.[k] ?? 0;
const repaired = (v: SliceTutorialView, id: 'WELL' | 'HOUSE') => estateOf(v.save).repaired.includes(id);
const has = (v: SliceTutorialView, mat: string) => v.save.inventory[mat] ?? 0;

/** Chướng ngại loại `kind` chưa dọn đầu tiên (ô trên-trái) — chỗ lấy thêm vật liệu. */
function nextObstacle(v: SliceTutorialView, kind: ObstacleKind): TilePos | undefined {
  const cleared = estateOf(v.save).cleared;
  return OBSTACLES.find((o) => o.kind === kind && !cleared.includes(o.id))?.tiles[0];
}

/** Đủ vật liệu thì chỉ vào hạng mục, thiếu thì chỉ chỗ lấy (đá trước, rồi gỗ). */
function repairTarget(v: SliceTutorialView, id: 'WELL' | 'HOUSE', at: TilePos): TilePos | undefined {
  const need = REPAIRS[id].mats;
  if (has(v, 'MAT_DA') < (need.MAT_DA ?? 0)) return nextObstacle(v, 'ROCK');
  if (has(v, 'MAT_GO') < (need.MAT_GO ?? 0)) return nextObstacle(v, 'TREE');
  return at;
}

export const SLICE_TUTORIAL: readonly SliceTutorialStep[] = [
  {
    id: 'MOVE',
    speech: 'Về tới quê rồi! Đi một vòng xem điền trang của ông nội cháu nào.',
    hint: '🕹️ Kéo cần điều khiển góc dưới trái, hoặc chạm đất để đi tới.',
    done: (v) => v.moved,
  },
  {
    id: 'PLANT',
    speech: 'Sáu ô ruộng này ông cháu cuốc sẵn. Gieo vụ lúa đầu mùa thôi cháu!',
    hint: '🌱 Chạm ô ruộng để gieo Lúa (kéo qua nhiều ô để gieo cả loạt).',
    target: { x: 6, y: 7 },
    done: (v) => v.save.tiles.some((t) => t.itemId) || c(v, COUNTER.WATER) > 0 || c(v, COUNTER.harvest('CROP_01')) > 0,
  },
  {
    id: 'WATER',
    speech: 'Lúa cần nước mới lên nhanh. Tưới đi cháu.',
    hint: '🚿 Chạm ô vừa gieo để tưới.',
    target: { x: 6, y: 7 },
    done: (v) => c(v, COUNTER.WATER) > 0,
  },
  {
    id: 'HARVEST',
    speech: 'Lúa chín vàng rồi kìa! Gặt về kẻo chim ăn.',
    hint: '🌾 Đợi lúa chín (khoảng 2 phút) rồi chạm để gặt.',
    target: { x: 6, y: 7 },
    done: (v) => c(v, COUNTER.harvest('CROP_01')) > 0,
  },
  {
    id: 'SELL',
    speech: 'Mang lúa ra HTX bán lấy ít vốn sửa sang nhà cửa.',
    hint: '📦 Mở Kho ở dưới màn hình, bấm "Bán HTX".',
    done: (v) => v.sold,
  },
  {
    id: 'CLEAR',
    speech: 'Đá với gốc cây chắn lối bao năm nay. Dọn đi thì có đá, có gỗ mà sửa nhà.',
    hint: '⛏️ Chạm tảng đá để dọn (tốn ⚡, được 🪨 Đá).',
    target: { x: 19, y: 10 },
    done: (v) => estateOf(v.save).cleared.length > 0,
  },
  {
    id: 'WELL',
    speech: 'Giếng đá ong này nuôi cả nhà mình mấy đời. Sửa lại thì tưới cả ruộng một lượt.',
    hint: '🪣 Dọn đá cho đủ 4 🪨, rồi chạm giếng để sửa (300 🪙).',
    target: (v) => repairTarget(v, 'WELL', { x: 18, y: 4 }),
    done: (v) => repaired(v, 'WELL'),
  },
  {
    id: 'HOUSE',
    speech: 'Còn ngôi nhà của ông. Sửa xong, bác trao cháu cuốn Sổ Gia Phả.',
    hint: '🏠 Chặt 2 gốc cây lấy 🪵 Gỗ, đủ 6 Gỗ + 2 Đá thì chạm nhà để sửa (500 🪙).',
    target: (v) => repairTarget(v, 'HOUSE', { x: 12, y: 4 }),
    done: (v) => repaired(v, 'HOUSE'),
  },
];

/** Ô mũi tên của bước (đã tính theo trạng thái). */
export function tutorialTarget(step: SliceTutorialStep, v: SliceTutorialView): TilePos | undefined {
  return typeof step.target === 'function' ? step.target(v) : step.target;
}

/** Bước đang làm (bước đầu chưa xong) và số thứ tự; `null` khi đã xong cả 8 bước. */
export function currentTutorialStep(v: SliceTutorialView): { step: SliceTutorialStep; index: number } | null {
  const index = SLICE_TUTORIAL.findIndex((s) => !s.done(v));
  return index < 0 ? null : { step: SLICE_TUTORIAL[index], index };
}
