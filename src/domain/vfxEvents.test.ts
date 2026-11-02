import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createPlotTiles } from './farmGrid';
import { VFX_COLORS, VfxSnap, diffVfxEvents } from './vfxEvents';

const base = (): VfxSnap => ({ tiles: createPlotTiles(12), level: 1, inventory: {} });
const withTile = (s: VfxSnap, id: string, patch: object): VfxSnap => ({
  ...s,
  tiles: s.tiles.map((t) => (t.id === id ? { ...t, ...patch } : t)),
});

describe('Sự kiện VFX từ thay đổi store', () => {
  it('gieo / tưới / Hoàng Kim / thu hoạch / khai hoang / lên cấp', () => {
    const a = base();
    const planted = withTile(a, 'TILE_1', { itemId: 'CROP_01' });
    expect(diffVfxEvents(a, planted)).toEqual([{ kind: 'plant', tileId: 'TILE_1' }]);

    const watered = withTile(planted, 'TILE_1', { watered: true });
    expect(diffVfxEvents(planted, watered)).toEqual([{ kind: 'water', tileId: 'TILE_1' }]);

    const golden = withTile(watered, 'TILE_1', { isGolden: true });
    expect(diffVfxEvents(watered, golden)).toEqual([{ kind: 'golden', tileId: 'TILE_1' }]);

    const harvested = { ...withTile(golden, 'TILE_1', { itemId: null }), inventory: { CROP_01: 6 }, level: 2 };
    expect(diffVfxEvents(golden, harvested)).toEqual([
      { kind: 'harvest', tileId: 'TILE_1', text: '+6 🌾' },
      { kind: 'levelUp', level: 2 },
    ]);

    const expanded = { ...a, tiles: createPlotTiles(13) };
    expect(diffVfxEvents(a, expanded)).toEqual([{ kind: 'expand', tileId: 'TILE_13' }]);
  });

  it('đồng bộ hàng loạt (nạp ảnh chụp server) không bắn hiệu ứng ô, vẫn giữ lên cấp', () => {
    let after = { ...base(), level: 3 };
    for (const id of ['TILE_1', 'TILE_2', 'TILE_3', 'TILE_4']) after = withTile(after, id, { itemId: 'CROP_01' });
    expect(diffVfxEvents(base(), after)).toEqual([{ kind: 'levelUp', level: 3 }]);
  });

  it('không có thay đổi thì không có hiệu ứng', () => {
    expect(diffVfxEvents(base(), base())).toEqual([]);
  });

  it('mọi màu VFX thuộc bảng 64 màu', () => {
    const gpl = readFileSync(resolve(process.cwd(), 'art/palette/vac_base.gpl'), 'utf-8').toUpperCase();
    const colors = [...Object.values(VFX_COLORS).flat()] as number[];
    for (const c of colors) expect(gpl).toContain(`#${c.toString(16).padStart(6, '0').toUpperCase()}`);
  });
});
