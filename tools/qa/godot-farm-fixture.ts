import { GROWTH_STAGE_CUTS } from '../../src/domain/growth';
import type { FarmSave } from '../../src/domain/farm';
import { SEASON_EPOCH_MS, SEASON_ORDER, seasonAt } from '../../src/domain/season';
import { parseActions, serverApply } from '../../src/engine/sliceServer';
import { OBSTACLES, RECLAIM_REGIONS, STRUCTURE_IDS, plotId, plotPositions } from '../../src/domain/estate';
import { ANIMAL_SLOTS, SLICE_SPECIES } from '../../src/data/sliceContent';
import { BATCH_DRAG_MAX } from '../../src/domain/tools';

// Đồng hồ và nông trại riêng cho LT-14. Trạng thái chỉ sống trong tiến trình thử.
const season = Deno.args[0] ?? SEASON_ORDER[0];
const seasonIndex = SEASON_ORDER.findIndex((entry) => entry === season);
// Đối số thứ hai: `p1-9` là nông trại cấp 5 đã sửa xong hạng mục và đã qua cảnh mở đầu,
// để thử vật nuôi, Bếp Củi và đơn HTX. `fast` là người chơi mới với đồng hồ nhanh.
const preset = Deno.args[1] ?? '';
if (seasonIndex < 0 || Deno.args.length > 2 || !['', 'p1-9', 'fast'].includes(preset)) {
  throw new Error(`Chọn mùa thử: ${SEASON_ORDER.join(', ')}. Bộ dựng sẵn: p1-9, fast.`);
}
const seasonMs = seasonAt(SEASON_EPOCH_MS).nextSeasonAt - SEASON_EPOCH_MS;
const epoch = SEASON_EPOCH_MS + seasonIndex * seasonMs;
const startedAt = performance.now();
// Bộ dựng sẵn chạy nhanh hơn để gà, cá và món ăn kịp tới lứa trong một lần thử.
const clockRate = preset ? 60 : 8;
const plots = new Set([
  ...plotPositions({ cleared: [], repaired: [], reclaimed: RECLAIM_REGIONS.length }),
  ...ANIMAL_SLOTS,
].map(({ x, y }) => plotId(x, y)));
let save: FarmSave | null = null;
if (preset === 'p1-9') {
  const fresh = serverApply(null, [], epoch, () => 0.5).save;
  const ready = serverApply(
    { ...fresh, level: 5, gold: 5000, inventory: { MAT_GO: 20, MAT_DA: 20 } },
    [{ type: 'CHOOSE_PATH', path: 'EMP' }, ...STRUCTURE_IDS.map((structureId) => ({ type: 'REPAIR' as const, structureId }))], epoch, () => 0.5,
  );
  if (ready.results.some(({ ok }) => !ok)) throw new Error('Không dựng được nông trại p1-9.');
  save = ready.save;
}

Deno.serve({ hostname: '127.0.0.1', port: 8798 }, async (request) => {
  if (request.method !== 'POST' || new URL(request.url).pathname !== '/') {
    return Response.json({ error: 'NOT_FOUND' }, { status: 404 });
  }
  const payload: unknown = await request.json().catch(() => null);
  const actions = parseActions(payload && typeof payload === 'object' && 'actions' in payload ? payload.actions : null);
  if (!actions || actions.length > BATCH_DRAG_MAX || actions.some((action) => {
    switch (action.type) {
      case 'PLANT': return !plots.has(action.tileId) || !SLICE_SPECIES.includes(action.itemId);
      case 'WATER':
      case 'HARVEST': return !plots.has(action.tileId);
      case 'CLEAR': return !OBSTACLES.some(({ id }) => id === action.obstacleId);
      case 'REPAIR': return false;
      case 'RECLAIM': return action.regionIndex >= RECLAIM_REGIONS.length;
      case 'SELL':
      case 'COOK':
      case 'COLLECT_DISH':
      case 'EAT':
      case 'DISCOVER':
      case 'REFRESH_ORDERS':
      case 'DELIVER_ORDER':
      case 'SKIP_ORDER':
      case 'TALK':
      case 'GIFT':
      case 'CHOOSE_PATH':
      case 'CLAIM_CHAPTER': return false;
      default: return true;
    }
  })) {
    return Response.json({ error: 'BAD_REQUEST' }, { status: 400 });
  }
  const serverNow = epoch + Math.floor((performance.now() - startedAt) * clockRate);
  const output = serverApply(save, actions, serverNow, () => 0.5);
  save = output.save;
  return Response.json({
    state: output.save,
    results: output.results,
    serverNow,
    clockRate,
    growthCuts: GROWTH_STAGE_CUTS,
  });
});
