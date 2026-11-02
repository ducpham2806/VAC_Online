import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { GAME_CATALOG } from './masterData';

/** Atlas sprite Đợt 1 (tools/art/codeart_wave1.py → pack_atlas.py). */
const root = process.cwd();
const json = JSON.parse(readFileSync(resolve(root, 'public/assets/atlas/wave1.json'), 'utf-8')) as {
  frames: Record<string, { frame: { x: number; y: number; w: number; h: number } }>;
  meta: { image: string; size: { w: number; h: number } };
};
const png = readFileSync(resolve(root, 'public/assets/atlas/wave1.png'));
const pngSize = { w: png.readUInt32BE(16), h: png.readUInt32BE(20) };

const WAVE1 = GAME_CATALOG.filter(
  (c) => c.unlockWave === 1 && ['CROP', 'TREE', 'ANIMAL', 'AQUA', 'MUTANT_CROP'].includes(c.category)
);

describe('Atlas wave1', () => {
  it('đủ 23 loài Đợt 1 × 4 giai đoạn lớn, tên khung <ID>_<0..3>', () => {
    expect(WAVE1).toHaveLength(23);
    for (const c of WAVE1) for (let st = 0; st < 4; st++) expect(json.frames).toHaveProperty(`${c.id}_${st}`);
    expect(Object.keys(json.frames)).toHaveLength(92);
  });

  it('mọi khung là 48x48 và nằm trong ảnh PNG thật', () => {
    expect(png.subarray(1, 4).toString()).toBe('PNG');
    expect(pngSize).toEqual(json.meta.size);
    for (const { frame } of Object.values(json.frames)) {
      expect([frame.w, frame.h]).toEqual([48, 48]);
      expect(frame.x + frame.w).toBeLessThanOrEqual(pngSize.w);
      expect(frame.y + frame.h).toBeLessThanOrEqual(pngSize.h);
    }
    expect(json.meta.image).toBe('wave1.png');
  });
});

describe('Atlas world (bản chạy thử GĐ1)', () => {
  const w = JSON.parse(readFileSync(resolve(root, 'public/assets/atlas/world.json'), 'utf-8')) as typeof json;
  const size = (f: string) => [w.frames[f].frame.w, w.frames[f].frame.h];
  it('đủ khung ô đất 168x80, nhân vật 48x64 và hoạt ảnh', () => {
    for (const f of ['tile_land_dry', 'tile_land_wet', 'tile_orchard', 'tile_wild', 'tile_pond_0', 'tile_pond_1', 'tile_pond_2']) {
      expect(size(f)).toEqual([168, 80]);
    }
    for (const who of ['farmer_m', 'farmer_f']) {
      for (const f of [`${who}_idle_0`, `${who}_idle_1`, `${who}_act_0`, `${who}_act_1`, ...[0, 1, 2, 3].map((i) => `${who}_walk_${i}`)]) {
        expect(size(f)).toEqual([48, 64]);
      }
    }
    for (const f of ['house', 'well', 'lot_sign', 'grass_tile', 'path_tile', 'bacbay_idle_0', 'butterfly_0', 'bird_0', 'smoke']) {
      expect(w.frames).toHaveProperty(f);
    }
  });
});

describe('Icon UI pixel (src/assets/icons)', () => {
  it('có icon cho 23 loài Đợt 1 và các icon HUD / dock', () => {
    for (const c of WAVE1) expect(existsSync(resolve(root, `src/assets/icons/${c.id}.png`))).toBe(true);
    for (const k of ['gold', 'gem', 'energy', 'xp', 'mud', 'scroll', 'basket', 'book', 'axe', 'gate', 'seed']) {
      expect(existsSync(resolve(root, `src/assets/icons/${k}.png`))).toBe(true);
    }
    for (const k of ['ui_wood', 'ui_paper', 'splash_scene']) expect(existsSync(resolve(root, `src/assets/ui/${k}.png`))).toBe(true);
  });
});
