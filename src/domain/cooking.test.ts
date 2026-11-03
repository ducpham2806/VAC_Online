import { describe, expect, it } from 'vitest';
import { GAME_CATALOG } from '../data/masterData';
import {
  DISCOVER_GEMS,
  DISCOVER_XP,
  KITCHEN_MACHINE_IDS,
  KITCHEN_RECIPES,
  KitchenResult,
  KitchenSave,
  POT_MAX_INGREDIENTS,
  buildMachine,
  collectCraft,
  craftDurationMs,
  discoverRecipe,
  eatDish,
  kitchenItem,
  missingIngredients,
  recipeHint,
  recipeLock,
  startCraft,
} from './cooking';
import { STAMINA_REGEN_MS } from './stamina';

const NOW = 1_800_000_000_000;
const GD2 = 2;

function save(over: Partial<KitchenSave> = {}): KitchenSave {
  return {
    region: 'NORTH',
    level: 20,
    xp: 0,
    gold: 5000,
    gems: 50,
    stamina: 20,
    maxStamina: 50,
    staminaUpdatedAt: NOW,
    inventory: {},
    machines: {},
    discoveredRecipes: [],
    ...over,
  };
}

function ok(r: KitchenResult): KitchenSave {
  if (!r.ok) throw new Error(r.message);
  return r.save;
}

const item = (id: string) => {
  const it = kitchenItem(id);
  if (!it) throw new Error(id);
  return it;
};

describe('dữ liệu công thức S4 (17 mục C2)', () => {
  it('đủ 14 món Đợt 1–2 ở 3 xưởng MAC_02/03/04', () => {
    expect(KITCHEN_RECIPES.map((r) => r.id).sort()).toEqual(
      ['PROD_01', 'PROD_02', 'PROD_03', 'PROD_04', 'PROD_05', 'PROD_06', 'PROD_07', 'PROD_08', 'PROD_09', 'PROD_10', 'PROD_11', 'PROD_12', 'PROD_N01', 'PROD_C01'].sort()
    );
    for (const m of KITCHEN_MACHINE_IDS) expect(KITCHEN_RECIPES.some((r) => r.machineId === m)).toBe(true);
  });

  it('mọi nguyên liệu là ID có thật, số lượng nguyên dương, tổng ≤ sức chứa Nồi Đất', () => {
    for (const r of GAME_CATALOG.filter((c) => c.recipe)) {
      const total = (r.recipe ?? []).reduce((a, x) => a + x.qty, 0);
      expect(total, r.id).toBeLessThanOrEqual(POT_MAX_INGREDIENTS);
      for (const ing of r.recipe ?? []) {
        expect(kitchenItem(ing.itemId), `${r.id} → ${ing.itemId}`).toBeDefined();
        expect(Number.isInteger(ing.qty) && ing.qty > 0).toBe(true);
      }
      expect(kitchenItem(r.machineId ?? '')?.category).toBe('MACHINE');
    }
  });

  // 2026-11-03 (PO, `17` C4): Cà Phê Muối đổi sang Đậu Phộng + Sữa Bò + Mía → không còn ngoại lệ.
  it('mọi nguyên liệu thuộc Đợt ≤ Đợt của món (không ngoại lệ)', () => {
    const late = KITCHEN_RECIPES.filter((r) =>
      (r.recipe ?? []).some((ing) => (kitchenItem(ing.itemId)?.unlockWave ?? 99) > (r.unlockWave ?? 0))
    ).map((r) => r.id);
    expect(late).toEqual([]);
  });

  it('không có 2 món trùng hệt công thức (Nồi Đất phải nhận ra đúng 1 món)', () => {
    const keys = KITCHEN_RECIPES.map((r) =>
      [...(r.recipe ?? [])].sort((a, b) => a.itemId.localeCompare(b.itemId)).map((x) => `${x.itemId}×${x.qty}`).join('+')
    );
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe('recipeLock', () => {
  it('GĐ1 khóa, GĐ2 mở; thiếu cấp; nguyên liệu thuộc Đợt chưa mở thì khóa', () => {
    expect(recipeLock(item('PROD_01'), 20, 1)).toEqual({ ok: false, reason: 'STAGE_LOCKED', stage: 2 });
    expect(recipeLock(item('PROD_01'), 20, GD2)).toEqual({ ok: true });
    expect(recipeLock(item('PROD_01'), 1, GD2)).toEqual({ ok: false, reason: 'LEVEL_LOCKED' });
    expect(recipeLock(item('PROD_C01'), 30, GD2)).toEqual({ ok: true });
    const lateDish = { ...item('PROD_C01'), recipe: [{ itemId: 'CROP_C05', qty: 1 }] };
    expect(recipeLock(lateDish, 30, GD2)).toEqual({ ok: false, reason: 'INGREDIENT_LOCKED', itemId: 'CROP_C05', wave: 4 });
    expect(recipeLock(lateDish, 30, 4)).toEqual({ ok: true });
    expect(recipeLock(item('CROP_01'), 30, GD2)).toEqual({ ok: false, reason: 'NOT_RECIPE' });
  });
});

describe('buildMachine (M04.1)', () => {
  it('xây Bếp Củi: trừ vàng, cộng XP, xưởng rảnh', () => {
    const s = ok(buildMachine(save(), 'MAC_02', GD2));
    expect(s.gold).toBe(5000 - 350);
    expect(s.xp).toBe(25);
    expect(s.machines.MAC_02).toEqual({ craftItemId: null, readyAt: null });
  });

  it('từ chối: GĐ1, thiếu cấp, đã có, thiếu vàng, Cối Xay Cám (hoãn), mã sai', () => {
    expect(buildMachine(save(), 'MAC_02', 1).ok).toBe(false);
    expect(buildMachine(save({ level: 3 }), 'MAC_02', GD2).ok).toBe(false);
    const built = ok(buildMachine(save(), 'MAC_02', GD2));
    expect(buildMachine(built, 'MAC_02', GD2).ok).toBe(false);
    expect(buildMachine(save({ gold: 349 }), 'MAC_02', GD2).ok).toBe(false);
    expect(buildMachine(save(), 'MAC_01', GD2).ok).toBe(false);
    expect(buildMachine(save(), 'PROD_01', GD2).ok).toBe(false);
  });
});

describe('startCraft / collectCraft (M04.3)', () => {
  const withKitchen = (over: Partial<KitchenSave> = {}) =>
    save({ machines: { MAC_02: { craftItemId: null, readyAt: null } }, inventory: { CROP_01: 5 }, ...over });

  it('nấu Cơm Trắng (mở sẵn): trừ 3 Lúa, 0⚡, xong sau 5 phút → lấy được +1 món +XP', () => {
    const s = ok(startCraft(withKitchen(), 'MAC_02', 'PROD_01', GD2, NOW));
    expect(s.inventory.CROP_01).toBe(2);
    expect(s.stamina).toBe(20);
    expect(s.machines.MAC_02).toEqual({ craftItemId: 'PROD_01', readyAt: NOW + 5 * 60_000 });
    expect(collectCraft(s, 'MAC_02', NOW + 5 * 60_000 - 1).ok).toBe(false);
    const done = ok(collectCraft(s, 'MAC_02', NOW + 5 * 60_000));
    expect(done.inventory.PROD_01).toBe(1);
    expect(done.xp).toBe(item('PROD_01').xpReward);
    expect(done.machines.MAC_02).toEqual({ craftItemId: null, readyAt: null });
    expect(done.counters?.COOK).toBe(1); // mục tiêu Ch.3
  });

  it('miền Trung nấu nhanh hơn 10%', () => {
    expect(craftDurationMs(item('PROD_03'), 'CENTRAL')).toBe(Math.round(20 * 60_000 * 0.9));
    const s = ok(startCraft(withKitchen({ region: 'CENTRAL' }), 'MAC_02', 'PROD_01', GD2, NOW));
    expect(s.machines.MAC_02.readyAt).toBe(NOW + Math.round(5 * 60_000 * 0.9));
  });

  it('từ chối: chưa xây, xưởng bận, sai xưởng, chưa khám phá, thiếu nguyên liệu, GĐ1, thiếu cấp; Cà Phê Muối nấu được ở GĐ2', () => {
    expect(startCraft(save({ inventory: { CROP_01: 5 } }), 'MAC_02', 'PROD_01', GD2, NOW).ok).toBe(false);
    const busy = ok(startCraft(withKitchen(), 'MAC_02', 'PROD_01', GD2, NOW));
    expect(startCraft(busy, 'MAC_02', 'PROD_01', GD2, NOW).ok).toBe(false);
    expect(startCraft(withKitchen(), 'MAC_02', 'PROD_05', GD2, NOW).ok).toBe(false);
    const r = startCraft(withKitchen({ inventory: { CROP_06: 1, CROP_03: 1, CROP_04: 1 } }), 'MAC_02', 'PROD_02', GD2, NOW);
    expect(r.ok).toBe(false);
    expect(r.ok ? '' : r.message).toContain('Nồi Đất');
    const short = startCraft(withKitchen({ inventory: { CROP_01: 2 } }), 'MAC_02', 'PROD_01', GD2, NOW);
    expect(short.ok ? '' : short.message).toContain('Còn thiếu: 1');
    expect(startCraft(withKitchen(), 'MAC_02', 'PROD_01', 1, NOW).ok).toBe(false);
    expect(startCraft(withKitchen({ level: 3 }), 'MAC_02', 'PROD_01', GD2, NOW).ok).toBe(false);
    const cafe = save({
      machines: { MAC_04: { craftItemId: null, readyAt: null } },
      discoveredRecipes: ['PROD_C01'],
      inventory: { CROP_10: 1, ANI_07: 1, CROP_09: 1 },
    });
    const c = startCraft(cafe, 'MAC_04', 'PROD_C01', GD2, NOW);
    expect(c.ok).toBe(true);
  });

  it('lấy món khi xưởng rảnh bị từ chối', () => {
    expect(collectCraft(withKitchen(), 'MAC_02', NOW).ok).toBe(false);
    expect(collectCraft(save(), 'MAC_02', NOW).ok).toBe(false);
  });

  it('missingIngredients', () => {
    expect(missingIngredients({ CROP_01: 1 }, [{ itemId: 'CROP_01', qty: 3 }, { itemId: 'CROP_04', qty: 1 }])).toEqual([
      { itemId: 'CROP_01', qty: 2 },
      { itemId: 'CROP_04', qty: 1 },
    ]);
    expect(missingIngredients({ CROP_01: 3 }, [{ itemId: 'CROP_01', qty: 3 }])).toEqual([]);
  });
});

describe('eatDish', () => {
  it('ăn Canh Cải Cá Rô: +16⚡, trừ 1 món, giữ phần lẻ thời gian hồi', () => {
    const s = ok(eatDish(save({ inventory: { PROD_03: 2 } }), 'PROD_03', GD2, NOW + 60_000));
    expect(s.stamina).toBe(36);
    expect(s.inventory.PROD_03).toBe(1);
    expect(s.staminaUpdatedAt).toBe(NOW);
  });

  it('không vượt trần, chạm trần thì mốc hồi = now', () => {
    const s = ok(eatDish(save({ stamina: 45, inventory: { PROD_03: 1 } }), 'PROD_03', GD2, NOW));
    expect(s.stamina).toBe(50);
    expect(s.staminaUpdatedAt).toBe(NOW);
  });

  it('tính cả ⚡ đã hồi trước khi ăn', () => {
    const s = ok(eatDish(save({ stamina: 10, inventory: { PROD_01: 1 } }), 'PROD_01', GD2, NOW + 2 * STAMINA_REGEN_MS));
    expect(s.stamina).toBe(10 + 2 + 5);
  });

  it('từ chối: ⚡ đầy, hết món, không phải món ăn, GĐ1', () => {
    expect(eatDish(save({ stamina: 50, inventory: { PROD_03: 1 } }), 'PROD_03', GD2, NOW).ok).toBe(false);
    expect(eatDish(save(), 'PROD_03', GD2, NOW).ok).toBe(false);
    expect(eatDish(save({ inventory: { CROP_01: 3 } }), 'CROP_01', GD2, NOW).ok).toBe(false);
    expect(eatDish(save({ inventory: { PROD_03: 1 } }), 'PROD_03', 1, NOW).ok).toBe(false);
  });
});

describe('discoverRecipe — Nồi Đất (M04.2)', () => {
  const pot = (over: Partial<KitchenSave> = {}) =>
    save({
      machines: { MAC_02: { craftItemId: null, readyAt: null } },
      inventory: { CROP_06: 1, CROP_03: 1, CROP_04: 2, CROP_07: 3, CROP_01: 3 },
      ...over,
    });

  it('phối đúng Khoai Ngô Nướng (thứ tự bất kỳ): mở công thức, +10💎 +50XP, KHÔNG tiêu nguyên liệu', () => {
    const before = pot();
    const s = ok(discoverRecipe(before, ['CROP_04', 'CROP_06', 'CROP_03'], GD2));
    expect(s.discoveredRecipes).toEqual(['PROD_02']);
    expect(s.gems).toBe(50 + DISCOVER_GEMS);
    expect(s.xp).toBe(DISCOVER_XP);
    expect(s.inventory).toEqual(before.inventory);
  });

  it('khám phá được món của xưởng khác (Đậu Phụ ở Lò) khi đã có Bếp Củi', () => {
    expect(ok(discoverRecipe(pot(), ['CROP_07', 'CROP_07', 'CROP_07'], GD2)).discoveredRecipes).toEqual(['PROD_05']);
  });

  it('món đã biết / món mở sẵn thì không thưởng lại', () => {
    const once = ok(discoverRecipe(pot(), ['CROP_06', 'CROP_03', 'CROP_04'], GD2));
    expect(discoverRecipe(once, ['CROP_06', 'CROP_03', 'CROP_04'], GD2).ok).toBe(false);
    expect(discoverRecipe(pot(), ['CROP_01', 'CROP_01', 'CROP_01'], GD2).ok).toBe(false);
  });

  it('phối sai: gợi ý "có mùi" khi là một phần của món chưa biết, không mất gì', () => {
    const r = discoverRecipe(pot(), ['CROP_06', 'CROP_03'], GD2);
    expect(r.ok).toBe(false);
    expect(r.ok ? '' : r.message).toContain('Có mùi');
    const r2 = discoverRecipe(pot(), ['CROP_04', 'CROP_04'], GD2);
    expect(r2.ok ? '' : r2.message).toContain('Chưa thành món');
  });

  it('từ chối: chưa có Bếp Củi, rỗng, quá 4, kho không đủ, GĐ1, món chưa đủ cấp', () => {
    expect(discoverRecipe(pot({ machines: {} }), ['CROP_06', 'CROP_03', 'CROP_04'], GD2).ok).toBe(false);
    expect(discoverRecipe(pot(), [], GD2).ok).toBe(false);
    expect(discoverRecipe(pot(), ['CROP_01', 'CROP_01', 'CROP_01', 'CROP_04', 'CROP_04'], GD2).ok).toBe(false);
    expect(discoverRecipe(pot({ inventory: { CROP_06: 1, CROP_03: 1 } }), ['CROP_06', 'CROP_03', 'CROP_04'], GD2).ok).toBe(false);
    expect(discoverRecipe(pot(), ['CROP_06', 'CROP_03', 'CROP_04'], 1).ok).toBe(false);
    // Khoai Ngô Nướng cần Lv.5
    expect(discoverRecipe(pot({ level: 4 }), ['CROP_06', 'CROP_03', 'CROP_04'], GD2).ok).toBe(false);
  });

  it('recipeHint: nguyên liệu đầu + tổng số', () => {
    expect(recipeHint(item('PROD_03'))).toEqual({ firstItemId: 'AQUA_01', totalQty: 4 });
  });
});

describe('bộ đếm nhiệm vụ Ch.3', () => {
  it('xây Bếp Củi +BUILD:MAC_02', () => {
    expect(ok(buildMachine(save(), 'MAC_02', GD2)).counters?.['BUILD:MAC_02']).toBe(1);
  });
});


describe('xưởng nghề + đồ thợ (S5d, PO 2026-11-03)', () => {
  it('công thức đồ thợ dùng loài Đợt 2 có sẵn', () => {
    expect(item('CRAFT_01')).toMatchObject({ machineId: 'MAC_07', recipe: [{ itemId: 'CROP_24', qty: 1 }, { itemId: 'CROP_19', qty: 1 }] });
    expect(item('CRAFT_02')).toMatchObject({ machineId: 'MAC_08', recipe: [{ itemId: 'ANI_06', qty: 1 }, { itemId: 'CROP_17', qty: 1 }] });
  });

  it('xây Đan Lát → làm Nón Lá (biết sẵn, không cần Nồi Đất) → lấy vào Kho', () => {
    const built = ok(buildMachine(save(), 'MAC_07', GD2));
    expect(built.gold).toBe(5000 - 2200);
    const s = ok(startCraft({ ...built, inventory: { CROP_24: 1, CROP_19: 1 } }, 'MAC_07', 'CRAFT_01', GD2, NOW));
    expect(s.inventory).toEqual({ CROP_24: 0, CROP_19: 0 });
    const done = ok(collectCraft(s, 'MAC_07', NOW + 45 * 60_000));
    expect(done.inventory.CRAFT_01).toBe(1);
  });

  it('đồ thợ không khám phá được ở Nồi Đất và không ăn được', () => {
    const s = save({ machines: { MAC_02: { craftItemId: null, readyAt: null } }, inventory: { CROP_24: 1, CROP_19: 1, CRAFT_01: 1 } });
    expect(discoverRecipe(s, ['CROP_24', 'CROP_19'], GD2).ok).toBe(false);
    expect(eatDish(s, 'CRAFT_01', GD2, NOW).ok).toBe(false);
  });

  it('Khung Cửi cần Lv.15', () => {
    expect(buildMachine(save({ level: 14 }), 'MAC_08', GD2).message).toContain('Cấp 15');
  });
});
