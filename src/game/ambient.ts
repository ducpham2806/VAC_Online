import Phaser from 'phaser';
import { WORLD_ATLAS, hasWorldFrame } from './worldTex';

/**
 * Cảnh nền sống động (chỉ hình ảnh): cảnh trang trí cố định, bướm lượn, chim bay ngang, khói bếp, tre / chuối đung đưa.
 * Số đối tượng giới hạn để giữ 60 FPS trên điện thoại. Trả về hàm hủy.
 */
export interface DecorItem {
  frame: string;
  x: number;
  y: number;
  sway?: boolean;
}

/** Bố cục trang trí quanh lưới 5×5 (toạ độ thế giới 1120×540, không đè lên ô đất). */
export function decorLayout(w: number, gridLeft: number, gridRight: number, gridTop: number, gridBottom: number): DecorItem[] {
  const items: DecorItem[] = [
    { frame: 'banyan', x: -90, y: gridTop + 20 },
    { frame: 'bamboo', x: -110, y: gridTop + 200, sway: true },
    { frame: 'bamboo', x: -40, y: gridTop + 260, sway: true },
    { frame: 'haystack', x: 30, y: gridTop + 120 },
    { frame: 'banana', x: 40, y: gridTop + 330, sway: true },
    { frame: 'bamboo', x: w + 110, y: gridTop + 120, sway: true },
    { frame: 'banana', x: w + 60, y: gridTop + 260, sway: true },
    { frame: 'haystack', x: w + 120, y: gridTop + 360 },
    { frame: 'banyan', x: w + 90, y: gridBottom + 40 },
  ];
  for (let y = gridTop - 10; y <= gridBottom; y += 64) {
    items.push({ frame: 'fence', x: gridLeft - 36, y }, { frame: 'fence', x: gridRight + 36, y });
  }
  const flowers = ['flower_pink', 'flower_yellow', 'flower_purple', 'tuft_0', 'tuft_1', 'tuft_2', 'rock'];
  for (let i = 0; i < 18; i++) {
    const side = i % 2 === 0 ? gridLeft - 70 + ((i * 13) % 40) : gridRight + 30 + ((i * 17) % 50);
    items.push({ frame: flowers[i % flowers.length], x: side, y: gridTop + ((i * 37) % (gridBottom - gridTop + 40)) });
  }
  return items;
}

export function createAmbient(
  scene: Phaser.Scene,
  opts: { decor: DecorItem[]; chimney: { x: number; y: number } | null; field: Phaser.Geom.Rectangle }
): () => void {
  if (!scene.textures.exists(WORLD_ATLAS)) return () => undefined;
  const objs: Phaser.GameObjects.GameObject[] = [];
  const timers: Phaser.Time.TimerEvent[] = [];

  for (const d of opts.decor) {
    if (!hasWorldFrame(scene, d.frame)) continue;
    const img = scene.add.image(d.x, d.y, WORLD_ATLAS, d.frame).setOrigin(0.5, 1).setDepth(d.y - 200);
    objs.push(img);
    if (d.sway) {
      scene.tweens.add({ targets: img, angle: { from: -1.5, to: 1.5 }, duration: 1800 + (d.x % 600), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  // Bướm lượn trên ruộng
  if (scene.anims.exists('butterfly_fly')) {
    for (let i = 0; i < 3; i++) {
      const b = scene.add
        .sprite(opts.field.x + 80 + i * 260, opts.field.y + 40 + i * 70, WORLD_ATLAS, 'butterfly_0')
        .setDepth(900)
        .play('butterfly_fly');
      objs.push(b);
      const wander = () => {
        scene.tweens.add({
          targets: b,
          x: Phaser.Math.Between(opts.field.left, opts.field.right),
          y: Phaser.Math.Between(opts.field.top, opts.field.bottom),
          duration: Phaser.Math.Between(3500, 6000),
          ease: 'Sine.easeInOut',
          onComplete: wander,
        });
      };
      wander();
    }
  }

  // Đàn chim bay ngang mỗi 12–18 giây
  if (scene.anims.exists('bird_fly')) {
    const flock = () => {
      const y = Phaser.Math.Between(opts.field.top - 40, opts.field.top + 120);
      for (let i = 0; i < 3; i++) {
        const bird = scene.add.sprite(-200 - i * 18, y + i * 8, WORLD_ATLAS, 'bird_0').setDepth(950).play('bird_fly');
        scene.tweens.add({ targets: bird, x: scene.scale.width + 220, y: y - 30 + i * 6, duration: 9000 + i * 300, onComplete: () => bird.destroy() });
      }
    };
    timers.push(scene.time.addEvent({ delay: 15000, loop: true, callback: flock }));
    scene.time.delayedCall(2500, flock);
  }

  // Khói bếp nhà chính
  if (opts.chimney && hasWorldFrame(scene, 'smoke')) {
    const { x, y } = opts.chimney;
    timers.push(
      scene.time.addEvent({
        delay: 900,
        loop: true,
        callback: () => {
          const p = scene.add.image(x, y, WORLD_ATLAS, 'smoke').setDepth(800).setAlpha(0.8).setScale(0.6);
          scene.tweens.add({ targets: p, y: y - 34, x: x + 10, scale: 1.4, alpha: 0, duration: 2600, onComplete: () => p.destroy() });
        },
      })
    );
  }

  return () => {
    timers.forEach((t) => t.remove(false));
    objs.forEach((o) => o.destroy());
  };
}
