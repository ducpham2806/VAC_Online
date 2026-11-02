import Phaser from 'phaser';

/** Atlas asset thế giới (tools/art/codeart_world.py → pack_atlas.py). */
export const WORLD_ATLAS = 'world';

export function hasWorldFrame(scene: Phaser.Scene, frame: string): boolean {
  return scene.textures.exists(WORLD_ATLAS) && scene.textures.get(WORLD_ATLAS).has(frame);
}

/** Đặt texture từ atlas `world` nếu có khung, không thì dùng texture vẽ bằng code cùng tên (dự phòng). */
export function setWorldTexture(img: Phaser.GameObjects.Image, frame: string, fallbackKey = frame): void {
  if (hasWorldFrame(img.scene, frame)) {
    if (img.texture.key !== WORLD_ATLAS || img.frame.name !== frame) img.setTexture(WORLD_ATLAS, frame);
  } else if (img.texture.key !== fallbackKey) {
    img.setTexture(fallbackKey);
  }
}

/** Tạo hoạt ảnh từ các khung atlas `world` (bỏ qua nếu thiếu atlas hoặc đã tạo). */
export function createWorldAnims(scene: Phaser.Scene): void {
  if (!scene.textures.exists(WORLD_ATLAS)) return;
  const make = (key: string, frames: string[], frameRate: number, repeat = -1) => {
    if (scene.anims.exists(key) || !frames.every((f) => hasWorldFrame(scene, f))) return;
    scene.anims.create({ key, frames: frames.map((frame) => ({ key: WORLD_ATLAS, frame })), frameRate, repeat });
  };
  for (const who of ['farmer_m', 'farmer_f']) {
    make(`${who}_idle`, [`${who}_idle_0`, `${who}_idle_1`], 2);
    make(`${who}_walk`, [0, 1, 2, 3].map((i) => `${who}_walk_${i}`), 8);
    make(`${who}_act`, [`${who}_act_0`, `${who}_act_1`], 5);
  }
  make('bacbay_idle', ['bacbay_idle_0', 'bacbay_idle_1'], 2);
  make('butterfly_fly', ['butterfly_0', 'butterfly_1'], 10);
  make('bird_fly', ['bird_0', 'bird_1'], 6);
  make('pond_ripple', ['tile_pond_0', 'tile_pond_1', 'tile_pond_2'], 3);
}
