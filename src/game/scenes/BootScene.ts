import Phaser from 'phaser';
import { PixelAssetGenerator } from '../assets/PixelAssetGenerator';
import { createWorldAnims } from '../worldTex';

/** Atlas sprite theo lô (public/assets/atlas/<tên>.png + .json). */
export const SPRITE_ATLASES = ['wave1', 'world'] as const;

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    // Khởi tạo toàn bộ Pixel Art Textures & Particle FX trong bộ nhớ GPU (dự phòng khi thiếu atlas)
    PixelAssetGenerator.generateAll(this);
    // Atlas sprite thật theo lô Đợt (tools/art/pack_atlas.py). Thiếu file thì game vẫn chạy bằng hình vẽ code.
    for (const name of SPRITE_ATLASES) {
      this.load.atlas(name, `assets/atlas/${name}.png`, `assets/atlas/${name}.json`);
    }
    this.load.on(Phaser.Loader.Events.FILE_LOAD_ERROR, (file: Phaser.Loader.File) => {
      console.warn(`[VAC] Thiếu atlas ${file.key} — dùng hình vẽ bằng code.`);
    });
  }

  create(): void {
    createWorldAnims(this);
    this.scene.start('FarmScene');
  }
}
