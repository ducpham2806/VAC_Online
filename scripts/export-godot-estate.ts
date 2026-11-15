import { ANIMAL_SLOTS, SLICE_CROPS, SLICE_KITCHEN_ID, SLICE_RECIPES, SLICE_SPECIES, SLOT_SPECIES, sliceUnlockLevel } from '../src/data/sliceContent';
import { CROP_SEASONS } from '../src/data/seasons';
import { POT_MAX_INGREDIENTS, STARTER_RECIPE_ID, recipeHint } from '../src/domain/cooking';
import { GAME_CATALOG } from '../src/data/masterData';
import {
  CLEAR_RULES, MATERIALS, OBSTACLES, RECLAIM_REGIONS, REPAIRS, STRUCTURE_CHAR, STRUCTURE_IDS,
  plotId, plotPositions, reclaimCost, regionIndexAt, type TilePos,
} from '../src/domain/estate';
import { EXPAND_STAMINA } from '../src/domain/farm';
import { BATCH_DRAG_MAX, REACH_TILES } from '../src/domain/tools';
import { boundsOf } from '../src/game/slice/estateMap';
import { NPCS, NPC_IDS } from '../src/data/npcs';
import { QUEST_BRANCH_REWARDS, QUEST_XP_REWARD } from '../src/data/quests';
import { INTRO_CHOICES, INTRO_PAGES, INTRO_QUESTION, INTRO_TITLE } from '../src/data/sliceStory';
import { HEART_POINTS, MAX_HEARTS } from '../src/domain/npc';
import { chapterGoals, chapterQuest } from '../src/domain/story';
import { newSliceSave } from '../src/game/slice/sliceSave';
import { SLICE_TUTORIAL } from '../src/game/slice/sliceTutorial';

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
// Chỗ nuôi dùng cùng id với ô lưu trên server; vị trí trong Godot lấy từ Marker2D `Slot_<id>`.
const slots = ANIMAL_SLOTS.map(({ kind, x, y }) => ({ id: plotId(x, y), kind, item: SLOT_SPECIES[kind] }));
// Tên, giá, thời gian và cấp mở để HUD hiển thị. Luật vẫn do server quyết định.
const items = Object.fromEntries(
  GAME_CATALOG.filter(({ id }) => SLICE_SPECIES.includes(id) || SLICE_RECIPES.includes(id)).map((item) => [item.id, {
    name: item.name, cost: item.buyCostGold, sell: item.baseSellGold, minutes: item.growOrCraftMinutes,
    level: sliceUnlockLevel(item), seasons: CROP_SEASONS[item.id] ?? null,
    ...(SLICE_RECIPES.includes(item.id) ? { stamina: item.staminaDelta, recipe: item.recipe ?? [], hint: recipeHint(item) } : {}),
  }]),
);
const kitchen = { id: SLICE_KITCHEN_ID, recipes: SLICE_RECIPES, starter: STARTER_RECIPE_ID, potMax: POT_MAX_INGREDIENTS };
// Cốt truyện Chương 1 (TG-30, TG-40), NPC có tim (GP-50) và lời hướng dẫn (GP-62).
const npcs = NPC_IDS.map((id) => ({ id, name: NPCS[id].name, portrait: NPCS[id].portrait, sprite: NPCS[id].sprite }));
const quest = chapterQuest(1);
if (!quest) throw new Error('Thiếu dữ liệu Chương 1.');
const goalLabels = chapterGoals(newSliceSave(0), 1).map(({ label }) => label);
const story = {
  intro: { title: INTRO_TITLE, pages: INTRO_PAGES, question: INTRO_QUESTION, choices: INTRO_CHOICES },
  chapter: {
    no: 1, title: quest.title, gold: quest.rewardGold, gems: quest.rewardGems, xp: QUEST_XP_REWARD,
    branches: QUEST_BRANCH_REWARDS,
    // Mục đầu là chọn hướng, mục cuối là sửa Nhà, ở giữa là bộ đếm nhiệm vụ.
    goals: [
      { label: goalLabels[0], kind: 'PATH' },
      ...(quest.objectives ?? []).map(({ counter, target, label }) => ({ label, kind: 'COUNTER', counter, target })),
      { label: goalLabels[goalLabels.length - 1], kind: 'HOUSE' },
    ],
  },
  hearts: { points: HEART_POINTS, max: MAX_HEARTS },
  tutorial: SLICE_TUTORIAL.map(({ id, speech, hint }) => ({ id, speech, hint })),
};
const scenery = { Pond: boundsOf('P'), SacredTree: boundsOf('D') };

process.stdout.write(JSON.stringify({
  obstacles, repairs, regions, plots, crops, slots, items, kitchen, npcs, story, scenery, materials: MATERIALS,
  reach: REACH_TILES, dragMax: BATCH_DRAG_MAX,
}) + '\n');
