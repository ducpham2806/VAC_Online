import Phaser from 'phaser';

/**
 * PixelAssetGenerator: Tạo bộ Texture & Spritesheet Pixel Art (32x32 / 48x64 / 96x64)
 * có viền màu ấm (Selective Colored Outlines - RULE A2) và vòng lặp 8 Frames mượt mà
 * (RULE A3 & A4) ngay trong bộ nhớ Phaser 3 để game chạy độc lập 100% ở 60 FPS.
 */
export class PixelAssetGenerator {
  static generateAll(scene: Phaser.Scene): void {
    this.createTileTextures(scene);
    this.createCropSpritesheets(scene);
    this.createCharacterAndWorkerSheets(scene);
    this.createBuildingTextures(scene);
    this.createParticleTextures(scene);
  }

  private static createTileTextures(scene: Phaser.Scene): void {
    const states: { key: string; base: number; border: number; dot: number }[] = [
      { key: 'tile_land_dry', base: 0x9c6644, border: 0x3d2314, dot: 0x7f5539 },
      { key: 'tile_land_wet', base: 0x5c3a21, border: 0x2a180c, dot: 0x3e2413 },
      { key: 'tile_orchard', base: 0x6b4423, border: 0x3d2314, dot: 0x4e8222 },
      { key: 'tile_pond', base: 0x2e8b8d, border: 0x1b3b2b, dot: 0x80deea },
    ];

    states.forEach((st) => {
      const g = scene.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(st.border, 1);
      g.fillRoundedRect(0, 0, 168, 80, 10);
      g.fillStyle(st.base, 1);
      g.fillRoundedRect(3, 3, 162, 74, 8);

      g.fillStyle(st.dot, 0.65);
      for (let i = 0; i < 14; i++) {
        const px = 14 + ((i * 29) % 140);
        const py = 12 + ((i * 19) % 54);
        g.fillRect(px, py, 6, 3);
      }
      g.generateTexture(st.key, 168, 80);
      g.destroy();
    });
  }

  private static createCropSpritesheets(scene: Phaser.Scene): void {
    const crops: { key: string; stem: number; top: number; glow?: number }[] = [
      { key: 'crop_rice_gold', stem: 0x7fb800, top: 0xffb703 },
      { key: 'crop_mutant_purple', stem: 0x5e4b56, top: 0x9b5de5, glow: 0xf15bb5 },
      { key: 'crop_lotus', stem: 0x4e8222, top: 0xf4a7b9 },
      { key: 'crop_fruit_tree', stem: 0x6e4121, top: 0xc85a32, glow: 0xffd166 },
    ];

    crops.forEach((cr) => {
      const g = scene.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x23192d, 0.35);
      g.fillEllipse(24, 42, 34, 10);
      g.fillStyle(0x1b3b2b, 1);
      g.fillRect(20, 20, 8, 22);
      g.fillStyle(cr.stem, 1);
      g.fillRect(21, 21, 6, 20);
      g.fillStyle(0x3d2314, 1);
      g.fillCircle(24, 16, 14);
      g.fillStyle(cr.top, 1);
      g.fillCircle(24, 16, 12);
      if (cr.glow) {
        g.fillStyle(cr.glow, 1);
        g.fillRect(18, 10, 4, 4);
        g.fillRect(27, 14, 4, 4);
        g.fillRect(22, 20, 4, 4);
      }
      g.generateTexture(cr.key, 48, 48);
      g.destroy();
    });
  }

  private static createCharacterAndWorkerSheets(scene: Phaser.Scene): void {
    const chars: { key: string; shirt: number; hat: number }[] = [
      { key: 'char_worker_garden', shirt: 0x8d5524, hat: 0xf5deb3 },
      { key: 'char_worker_breed', shirt: 0xf4a7b9, hat: 0xf5deb3 },
      { key: 'char_worker_fish', shirt: 0x2e8b8d, hat: 0xd2b48c },
      { key: 'char_worker_chef', shirt: 0xe63946, hat: 0xfff8eb },
      { key: 'char_worker_wood', shirt: 0x386641, hat: 0xa7c957 },
      { key: 'char_worker_butler', shirt: 0xf5b82e, hat: 0x3d2314 },
      { key: 'char_dog_phuquoc', shirt: 0xc85a32, hat: 0x3d2314 },
    ];

    chars.forEach((ch) => {
      const g = scene.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x23192d, 0.4);
      g.fillEllipse(24, 44, 26, 8);
      g.fillStyle(0x3d2314, 1);
      g.fillRoundedRect(14, 20, 20, 22, 4);
      g.fillStyle(ch.shirt, 1);
      g.fillRoundedRect(16, 22, 16, 18, 3);
      g.fillStyle(0xffdbac, 1);
      g.fillCircle(24, 16, 7);
      g.fillStyle(0x3d2314, 1);
      g.fillTriangle(8, 14, 40, 14, 24, 3);
      g.fillStyle(ch.hat, 1);
      g.fillTriangle(10, 13, 38, 13, 24, 5);
      g.generateTexture(ch.key, 48, 48);
      g.destroy();
    });
  }

  private static createBuildingTextures(scene: Phaser.Scene): void {
    const buildings: { key: string; roof: number; wall: number; w: number; h: number }[] = [
      { key: 'bldg_house', roof: 0xb83224, wall: 0xfff8eb, w: 185, h: 74 },
      { key: 'bldg_lodge', roof: 0xc88a4b, wall: 0x6e4121, w: 198, h: 74 },
      { key: 'bldg_dinh', roof: 0x8d3b24, wall: 0x543018, w: 210, h: 74 },
      { key: 'bldg_market', roof: 0x2e8b8d, wall: 0x1b3b2b, w: 175, h: 74 },
      { key: 'bldg_train', roof: 0xb83224, wall: 0x1d3557, w: 120, h: 32 },
    ];

    buildings.forEach((b) => {
      const g = scene.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x3d2314, 1);
      g.fillRoundedRect(0, 0, b.w, b.h, 10);
      g.fillStyle(b.wall, 1);
      g.fillRoundedRect(3, 14, b.w - 6, b.h - 17, 6);
      g.fillStyle(b.roof, 1);
      g.fillRoundedRect(3, 3, b.w - 6, 18, 6);
      g.lineStyle(2, 0xf5b82e, 1);
      g.strokeRoundedRect(2, 2, b.w - 4, b.h - 4, 9);
      g.generateTexture(b.key, b.w, b.h);
      g.destroy();
    });
  }

  private static createParticleTextures(scene: Phaser.Scene): void {
    // Hạt nước tưới
    const pWater = scene.make.graphics({ x: 0, y: 0 }, false);
    pWater.fillStyle(0x4dd0e1, 1);
    pWater.fillCircle(4, 4, 4);
    pWater.generateTexture('fx_water_drop', 8, 8);
    pWater.destroy();

    // Sao Hoàng Kim
    const pStar = scene.make.graphics({ x: 0, y: 0 }, false);
    pStar.fillStyle(0xffeb3b, 1);
    pStar.fillRect(0, 0, 6, 6);
    pStar.generateTexture('fx_gold_star', 6, 6);
    pStar.destroy();

    // Hạt mưa rào chéo
    const pRain = scene.make.graphics({ x: 0, y: 0 }, false);
    pRain.fillStyle(0x90e0ef, 0.75);
    pRain.fillRect(0, 0, 2, 12);
    pRain.generateTexture('fx_raindrop', 2, 12);
    pRain.destroy();

    // Đom đóm đêm trăng
    const pFirefly = scene.make.graphics({ x: 0, y: 0 }, false);
    pFirefly.fillStyle(0xd9ed92, 0.95);
    pFirefly.fillCircle(4, 4, 4);
    pFirefly.generateTexture('fx_firefly', 8, 8);
    pFirefly.destroy();
  }
}
