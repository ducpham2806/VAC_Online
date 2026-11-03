import { beforeEach, describe, expect, it } from 'vitest';
import { FarmSnapshot, tilesFromSnapshot } from '../services/farmGateway';
import { SAVE_STORAGE_KEY, createFreshState, useGameStore } from './useGameStore';

const store = useGameStore;

describe('Người chơi mới (production) — vòng chơi offline', () => {
  beforeEach(() => {
    store.setState({ ...createFreshState(), selectedSeedId: 'CROP_01' });
  });

  it('bắt đầu Lv.1, 2.500 🪙, kho trống, 12 ô trống', () => {
    const s = store.getState();
    expect(s).toMatchObject({ level: 1, xp: 0, gold: 2500, gems: 50, stamina: 50, accountType: 'GUEST' });
    expect(s.inventory).toEqual({});
    expect(s.tiles).toHaveLength(12);
    expect(s.tiles.every((t) => t.itemId === null)).toBe(true);
  });

  it('gieo → chín → thu hoạch vào kho → bán HTX', () => {
    store.getState().interactTile('TILE_1');
    expect(store.getState().gold).toBe(2498);
    store.setState({
      tiles: store.getState().tiles.map((t) => (t.id === 'TILE_1' ? { ...t, matureAt: Date.now() - 1 } : t)),
    });
    store.getState().interactTile('TILE_1');
    expect(store.getState().inventory.CROP_01).toBe(2);
    expect(store.getState().gold).toBe(2498);
    store.getState().sellToHtx('CROP_01', 2);
    expect(store.getState().gold).toBe(2506);
    expect(store.getState().inventory.CROP_01).toBe(0);
  });

  // vitest chạy DEV → GAME_STAGE = 6; nhánh GĐ1 (STAGE_LOCKED) được test ở src/domain/progression.test.ts.
  it('chế biến món khi chưa đủ cấp bị chặn: không trừ vàng, không vào kho, không hồi ⚡', () => {
    store.getState().craftOrBuyCatalogItem('PROD_01'); // Cơm Trắng cần Lv.4, người chơi mới Lv.1
    const s = store.getState();
    expect(s.gold).toBe(2500);
    expect(s.inventory.PROD_01).toBeUndefined();
    expect(s.stamina).toBe(50);
    expect(s.toastMessage).toContain('Cấp 4');
  });

  it('không gieo được loài chưa đủ cấp', () => {
    store.setState({ selectedSeedId: 'CROP_02' });
    store.getState().interactTile('TILE_1');
    expect(store.getState().tiles[0].itemId).toBeNull();
    expect(store.getState().toastMessage).toContain('Lv.2');
  });

  it('quà tân thủ chỉ nhận 1 lần mỗi ngày', () => {
    store.getState().claimRookieDayReward();
    store.getState().claimRookieDayReward();
    expect(store.getState().rookieDaysClaimed).toBe(1);
    expect(store.getState().gold).toBe(3500);
  });

  it('nhiệm vụ cần đủ cấp', () => {
    store.setState({ progressCounters: { WATER: 1, 'HARVEST:CROP_01': 1, DREDGE: 1, APPLY_MUD: 1 } });
    store.getState().claimStoryQuest('Q_CH2', 'EMP'); // Lv.3
    expect(store.getState().storyQuests.find((q) => q.id === 'Q_CH2')?.completed).toBe(false);
    store.getState().claimStoryQuest('Q_CH1', 'PRAG');
    expect(store.getState().gold).toBe(2500 + 600 + 350);
    expect(store.getState().level).toBe(2);
  });

  it('nhiệm vụ Chương 1 bị chặn tới khi tưới nước và thu hoạch Lúa (M03.5)', () => {
    store.getState().claimStoryQuest('Q_CH1', 'EMP');
    expect(store.getState().storyQuests.find((q) => q.id === 'Q_CH1')?.completed).toBe(false);
    expect(store.getState().toastMessage).toContain('Chưa hoàn thành');
    expect(store.getState().gold).toBe(2500);

    store.getState().interactTile('TILE_1'); // gieo
    store.getState().interactTile('TILE_1'); // tưới
    expect(store.getState().progressCounters.WATER).toBe(1);
    store.setState({
      tiles: store.getState().tiles.map((t) => (t.id === 'TILE_1' ? { ...t, matureAt: Date.now() - 1 } : t)),
    });
    store.getState().interactTile('TILE_1'); // thu hoạch
    expect(store.getState().progressCounters['HARVEST:CROP_01']).toBe(1);

    store.getState().claimStoryQuest('Q_CH1', 'EMP');
    expect(store.getState().storyQuests.find((q) => q.id === 'Q_CH1')?.completed).toBe(true);
  });

  it('tiến trình offline được lưu vào localStorage', () => {
    store.getState().interactTile('TILE_1');
    const saved = JSON.parse(localStorage.getItem(SAVE_STORAGE_KEY) ?? '{}');
    expect(saved.state.gold).toBe(2498);
    expect(saved.state.tiles[0].itemId).toBe('CROP_01');
    expect(saved.state).not.toHaveProperty('activeModal');
  });

  it('khai hoang offline mở thêm ô thật ở cột 5 và gieo được (M02.4)', () => {
    store.getState().expandWildLand();
    const st = store.getState();
    expect(st).toMatchObject({ wildPlotsUnlocked: 13, gold: 2000, stamina: 45 });
    expect(st.tiles).toHaveLength(13);
    expect(st.tiles[12]).toMatchObject({ id: 'TILE_13', tileX: 4, tileY: 0 });
    store.getState().interactTile('TILE_13');
    expect(store.getState().tiles[12].itemId).toBe('CROP_01');
  });

  it('save cũ đã khai hoang nhưng chỉ có 12 ô được bổ sung đủ ô khi tải lại', async () => {
    const twelve = createFreshState().tiles;
    localStorage.setItem(
      SAVE_STORAGE_KEY,
      JSON.stringify({ state: { ...createFreshState(), wildPlotsUnlocked: 15, tiles: twelve }, version: 1 })
    );
    await store.persist.rehydrate();
    expect(store.getState().tiles.map((t) => t.id).slice(12)).toEqual(['TILE_13', 'TILE_14', 'TILE_15']);
  });

  it('chế độ online không lưu tiến trình cục bộ', () => {
    store.setState({ farmMode: 'cloud', gold: 99999 });
    const saved = JSON.parse(localStorage.getItem(SAVE_STORAGE_KEY) ?? '{}');
    expect(saved.state).toEqual({ farmMode: 'cloud' });
  });
});

describe('tilesFromSnapshot', () => {
  it('đặt ô từ server vào đúng vị trí lưới 4×3', () => {
    const snap = {
      server_now: 0,
      game_stage: 1,
      profile: {} as FarmSnapshot['profile'],
      inventory: {},
      quests: {},
      tiles: [
        { x: 3, y: 2, item_id: 'AQUA_01', planted_at: 1, mature_at: 2, watered: true, mud_applied: false, is_golden: false, total_yield: 1, remaining_yield: 1 },
      ],
    } satisfies FarmSnapshot;
    const tiles = tilesFromSnapshot(snap);
    expect(tiles).toHaveLength(12);
    expect(tiles[11]).toMatchObject({ id: 'TILE_12', zoneType: 'POND', itemId: 'AQUA_01', watered: true });
    expect(tiles.filter((t) => t.itemId).length).toBe(1);
  });
});

// vitest chạy DEV → GAME_STAGE = 6 nên Bếp Quê mở; nhánh GĐ1 test ở src/domain/cooking.test.ts.
describe('Bếp Quê & Xưởng (S4) — offline qua kitchenSlice', () => {
  beforeEach(() => {
    store.setState({ ...createFreshState(), level: 15, gold: 1000, inventory: { CROP_01: 4 } });
  });

  it('xây Bếp Củi → nấu Cơm (trừ 3 Lúa, 0⚡) → lấy món → ăn hồi ⚡', () => {
    store.getState().craftOrBuyCatalogItem('MAC_02'); // đường cũ (Bách Khoa) dẫn tới xây xưởng
    expect(store.getState().gold).toBe(650);
    expect(store.getState().machines.MAC_02).toEqual({ craftItemId: null, readyAt: null });

    store.getState().craftOrBuyCatalogItem('PROD_01'); // không còn "mua" món bằng vàng
    let s = store.getState();
    expect(s.gold).toBe(650);
    expect(s.inventory.CROP_01).toBe(1);
    expect(s.stamina).toBe(50);
    expect(s.machines.MAC_02.craftItemId).toBe('PROD_01');

    store.setState({ machines: { MAC_02: { craftItemId: 'PROD_01', readyAt: Date.now() - 1 } } });
    store.getState().collectKitchenCraft('MAC_02');
    expect(store.getState().inventory.PROD_01).toBe(1);

    store.setState({ stamina: 40, staminaUpdatedAt: Date.now() });
    store.getState().eatDish('PROD_01');
    s = store.getState();
    expect(s.stamina).toBe(45);
    expect(s.inventory.PROD_01).toBe(0);
  });

  it('Nồi Đất qua cookRandomDish (tên cũ): cần Bếp Củi, sai không thưởng, đúng +10 💎', () => {
    store.setState({ inventory: { CROP_09: 2 } });
    store.getState().cookRandomDish(['CROP_09', 'CROP_09']);
    expect(store.getState().toastMessage).toContain('Bếp Củi');
    store.setState({ machines: { MAC_02: { craftItemId: null, readyAt: null } } });
    store.getState().cookRandomDish(['CROP_09']);
    expect(store.getState().gems).toBe(50);
    store.getState().cookRandomDish(['CROP_09', 'CROP_09']);
    expect(store.getState().gems).toBe(60);
    expect(store.getState().discoveredRecipes).toEqual(['PROD_09']);
    expect(store.getState().inventory.CROP_09).toBe(2);
  });

  it('save cũ (trước S4) thiếu machines / discoveredRecipes vẫn mở được', async () => {
    localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify({ state: { level: 7, gold: 900 }, version: 1 }));
    await store.persist.rehydrate();
    expect(store.getState().level).toBe(7);
    expect(store.getState().machines).toBeDefined();
    expect(Array.isArray(store.getState().discoveredRecipes)).toBe(true);
  });
});

describe('Lán Thợ (S5c) — offline qua workersSlice', () => {
  beforeEach(() => {
    store.setState({ ...createFreshState(), level: 15, gold: 2000, inventory: { PROD_03: 1 } });
  });

  it('người chơi mới: chưa thuê ai, Giỏ Thợ rỗng, Bàn Ăn 0 suất', () => {
    const s = store.getState();
    expect(s.workers.every((w) => !w.isHired)).toBe(true);
    expect(s.workerPantryCount).toBe(0);
    expect(s.lodgeDiningTableMeals).toBe(0);
  });

  it('thuê Chú Tư → dọn món lên Bàn Ăn → thợ thu Lúa vào Giỏ → thu Giỏ về Kho (không ra vàng)', () => {
    store.getState().payWorkerSalary('WORK_01');
    expect(store.getState().gold).toBe(2000 - 528);
    expect(store.getState().workers.find((w) => w.code === 'WORK_01')?.isHired).toBe(true);

    store.getState().serveLodgeMeal('PROD_03');
    expect(store.getState().lodgeDiningTableMeals).toBe(3);
    expect(store.getState().inventory.PROD_03).toBe(0);

    const now = Date.now();
    store.setState({
      tiles: store.getState().tiles.map((t, i) =>
        i === 0 ? { ...t, itemId: 'CROP_01', plantedAt: now - 600_000, matureAt: now - 400_000, watered: true } : t
      ),
    });
    store.getState().tickWorkerAutomation();
    expect(store.getState().workerPantry.CROP_01).toBe(2);
    expect(store.getState().workerPantryCount).toBe(2);
    expect(store.getState().tiles[0].itemId).toBeNull();

    const gold = store.getState().gold;
    store.getState().claimWorkerPantry();
    expect(store.getState().inventory.CROP_01).toBe(2);
    expect(store.getState().workerPantryCount).toBe(0);
    expect(store.getState().gold).toBe(gold);
  });

  it('đồ thợ / phụ cấp chưa mở: không trừ vàng; cho ăn miễn phí đã bỏ', () => {
    store.getState().equipWorkerGear('WORK_01', 'CRAFT_01');
    store.getState().giveWorkerBonus('WORK_01');
    store.getState().feedWorker('WORK_01', 'Cơm', 85);
    expect(store.getState().gold).toBe(2000);
  });
});
