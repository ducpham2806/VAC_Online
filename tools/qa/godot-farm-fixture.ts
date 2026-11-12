import { GROWTH_STAGE_CUTS } from '../../src/domain/growth';
import type { FarmSave } from '../../src/domain/farm';
import { SEASON_EPOCH_MS, SEASON_ORDER, seasonAt } from '../../src/domain/season';
import { parseActions, serverApply } from '../../src/engine/sliceServer';

// Đồng hồ và nông trại riêng cho LT-14. Trạng thái chỉ sống trong tiến trình thử.
const season = Deno.args[0] ?? SEASON_ORDER[0];
const seasonIndex = SEASON_ORDER.findIndex((entry) => entry === season);
if (seasonIndex < 0 || Deno.args.length > 1) {
  throw new Error(`Chọn mùa thử: ${SEASON_ORDER.join(', ')}.`);
}
const seasonMs = seasonAt(SEASON_EPOCH_MS).nextSeasonAt - SEASON_EPOCH_MS;
const epoch = SEASON_EPOCH_MS + seasonIndex * seasonMs;
const startedAt = performance.now();
const clockRate = 8;
const rice = 'CROP_01';
const plot = 'P5_7';
let save: FarmSave | null = null;

Deno.serve({ hostname: '127.0.0.1', port: 8798 }, async (request) => {
  if (request.method !== 'POST' || new URL(request.url).pathname !== '/') {
    return Response.json({ error: 'NOT_FOUND' }, { status: 404 });
  }
  const payload: unknown = await request.json().catch(() => null);
  const actions = parseActions(payload && typeof payload === 'object' && 'actions' in payload ? payload.actions : null);
  if (!actions || actions.length > 1 || actions.some((action) => {
    switch (action.type) {
      case 'PLANT': return action.tileId !== plot || action.itemId !== rice;
      case 'WATER':
      case 'HARVEST': return action.tileId !== plot;
      case 'SELL': return action.itemId !== rice;
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
