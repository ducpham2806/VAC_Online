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
