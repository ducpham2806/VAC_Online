import { SLICE_CROPS } from '../src/data/sliceContent';
import { GAME_CATALOG } from '../src/data/masterData';
import {
  CLEAR_RULES, MATERIALS, OBSTACLES, RECLAIM_REGIONS, REPAIRS, STRUCTURE_CHAR, STRUCTURE_IDS,
  plotId, plotPositions, reclaimCost, regionIndexAt, type TilePos,
} from '../src/domain/estate';
import { EXPAND_STAMINA } from '../src/domain/farm';
import { BATCH_DRAG_MAX, REACH_TILES } from '../src/domain/tools';
import { boundsOf } from '../src/game/slice/estateMap';

function bounds(tiles: readonly TilePos[]) {
  const xs = tiles.map(({ x }) => x);
  const ys = tiles.map(({ y }) => y);
  return [Math.max(...xs) - Math.min(...xs) + 1, Math.max(...ys) - Math.min(...ys) + 1];
}

const obstacles = OBSTACLES.map(({ id, kind, tiles }) => ({
  id, kind, size: bounds(tiles), ...CLEAR_RULES[kind],
}));
const repairs = STRUCTURE_IDS.map((id) => {
  const area = boundsOf(STRUCTURE_CHAR[id]);
  if (!area) throw new Error(`Không có vị trí cho ${id}.`);
  // Sân chuồng vẫn đi được, chỉ phần lều 3×3 chiếm chỗ.
  return { id, size: id === 'COOP' ? [3, 3] : [area.w, area.h], ...REPAIRS[id] };
});
const regions = RECLAIM_REGIONS.map((tiles, index) => ({
  index, size: bounds(tiles), x: tiles[0].x, y: tiles[0].y, count: tiles.length,
  gold: reclaimCost(index), stamina: EXPAND_STAMINA,
}));
const plots = plotPositions({ cleared: [], repaired: [], reclaimed: regions.length })
  .map(({ x, y }) => ({ id: plotId(x, y), x, y, region: regionIndexAt(x, y) }));
const crops = Object.fromEntries(GAME_CATALOG.filter(({ id }) => SLICE_CROPS.includes(id)).map(({ id, name }) => [id, name]));
const scenery = { Pond: boundsOf('P'), SacredTree: boundsOf('D') };

process.stdout.write(JSON.stringify({
  obstacles, repairs, regions, plots, crops, scenery, materials: MATERIALS,
  reach: REACH_TILES, dragMax: BATCH_DRAG_MAX,
}) + '\n');
