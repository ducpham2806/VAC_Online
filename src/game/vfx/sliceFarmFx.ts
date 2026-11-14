import Phaser from 'phaser';
import type { Tool } from '../../domain/tools';
import { VFX_COLORS } from '../../domain/vfxEvents';
import type { Dir } from '../slice/gesture';

export type FarmActionTool = 'SEED' | 'WATER' | 'SICKLE';

export function isFarmActionTool(tool: Tool): tool is FarmActionTool {
  return tool === 'SEED' || tool === 'WATER' || tool === 'SICKLE';
}

const TOOL_TEXTURE: Record<FarmActionTool, string> = {
  SEED: 'slice_seed_pouch',
  WATER: 'slice_watering_can',
  SICKLE: 'slice_sickle',
};

// Lớp công cụ pixel 32×32, tâm khung đặt trên tay nắm. Màu thuộc vac_base.gpl.
function createToolArt(scene: Phaser.Scene): void {
  const outline = 0x3d2314;
  const art = scene.make.graphics({}, false);
  if (!scene.textures.exists(TOOL_TEXTURE.SEED)) {
    art.fillStyle(outline).fillRect(13, 14, 9, 5).fillRect(11, 18, 14, 9).fillRect(13, 27, 10, 1);
    art.fillStyle(0xe0c79a).fillRect(13, 19, 9, 6).fillRect(15, 15, 5, 2);
    art.fillStyle(0xc88a4b).fillRect(13, 24, 10, 2).fillRect(21, 19, 3, 5);
    art.fillStyle(0xa0673a).fillRect(14, 17, 8, 2);
    art.fillStyle(0xfff8eb).fillRect(14, 20, 3, 2);
    art.generateTexture(TOOL_TEXTURE.SEED, 32, 32);
  }
  if (!scene.textures.exists(TOOL_TEXTURE.WATER)) {
    art.clear().fillStyle(outline)
      .fillRect(12, 12, 9, 3).fillRect(12, 14, 3, 8).fillRect(15, 20, 3, 3)
      .fillRect(17, 14, 8, 2).fillRect(16, 16, 10, 9).fillRect(18, 25, 7, 1)
      .fillRect(25, 17, 3, 5).fillRect(27, 15, 3, 5).fillRect(29, 13, 3, 5);
    art.fillStyle(0x8e9a9f).fillRect(13, 13, 6, 1).fillRect(13, 14, 1, 6)
      .fillRect(18, 15, 6, 1).fillRect(17, 17, 8, 7).fillRect(25, 18, 3, 2).fillRect(28, 16, 2, 2);
    art.fillStyle(0x5c6b73).fillRect(17, 22, 8, 2).fillRect(23, 18, 2, 4);
    art.fillStyle(0xc4c7c2).fillRect(18, 17, 4, 3).fillRect(30, 14, 1, 3);
    art.generateTexture(TOOL_TEXTURE.WATER, 32, 32);
  }
  if (!scene.textures.exists(TOOL_TEXTURE.SICKLE)) {
    art.clear().fillStyle(outline)
      .fillRect(12, 16, 4, 5).fillRect(15, 14, 5, 5).fillRect(19, 10, 5, 7)
      .fillRect(22, 7, 6, 7).fillRect(26, 6, 5, 5).fillRect(29, 8, 3, 6)
      .fillRect(27, 12, 4, 4).fillRect(26, 15, 3, 2);
    art.fillStyle(0xa0673a).fillRect(13, 17, 3, 3).fillRect(16, 15, 3, 3);
    art.fillStyle(0x8e9a9f).fillRect(20, 11, 3, 5).fillRect(23, 8, 5, 5)
      .fillRect(27, 7, 3, 3).fillRect(30, 9, 1, 4).fillRect(28, 13, 2, 2);
    art.fillStyle(0xf2f0ea).fillRect(21, 11, 2, 2).fillRect(23, 8, 5, 2)
      .fillRect(27, 7, 3, 1).fillRect(30, 9, 1, 3).fillRect(28, 14, 1, 1);
    art.generateTexture(TOOL_TEXTURE.SICKLE, 32, 32);
  }
  art.destroy();
}

// Điểm tay tương ứng khung đứng của từng hướng trong atlas slice.
const HAND: Record<Dir, readonly [x: number, y: number]> = {
  down: [13, -18],
  up: [-14, -18],
  left: [-12, -20],
  right: [12, -20],
};

type PoseFrame = readonly [reach: number, lift: number, angle: number, crouch: number];
const POSE: Record<FarmActionTool, readonly PoseFrame[]> = {
  SEED: [[0, 0, 0, 0], [1, 2, -12, 0], [3, 3, -26, 0], [5, 1, 24, 1], [5, 0, 32, 2], [3, 0, 18, 1], [2, 0, 8, 0], [0, 0, 0, 0]],
  WATER: [[0, 0, 0, 0], [1, 2, 4, 0], [3, 3, 22, 1], [4, 2, 38, 2], [4, 2, 38, 2], [3, 2, 30, 1], [2, 1, 14, 0], [0, 0, 0, 0]],
  SICKLE: [[0, 0, -15, 0], [0, 3, -45, 0], [1, 5, -68, 0], [3, 4, -30, 1], [5, 1, 18, 2], [5, 0, 38, 2], [3, 0, 24, 1], [1, 0, 0, 0]],
};
const POSE_FRAME_MS = 1000 / 15;

/** Chỉ trình bày sự kiện đã thành công. Chuyển động người chơi có quyền ngắt tư thế. */
export class SliceFarmFx {
  private readonly toolImage: Phaser.GameObjects.Image;
  private pose: FarmActionTool | null = null;
  private poseMs = 0;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly uiCamera: Phaser.Cameras.Scene2D.Camera,
    private readonly player: Phaser.GameObjects.Sprite,
  ) {
    createToolArt(scene);
    this.toolImage = scene.add.image(0, 0, TOOL_TEXTURE.SEED).setName('slice-farm-tool').setVisible(false);
    uiCamera.ignore(this.toolImage);
  }

  playPose(tool: FarmActionTool): void {
    this.pose = tool;
    this.poseMs = 0;
    this.toolImage.setTexture(TOOL_TEXTURE[tool]);
  }

  updatePose(delta: number, moving: boolean, dir: Dir): void {
    if (!this.pose) return;
    const frame = POSE[this.pose][Math.floor(this.poseMs / POSE_FRAME_MS)];
    if (moving || !frame) {
      this.pose = null;
      this.toolImage.setVisible(false);
      this.player.setScale(1);
      return;
    }
    const [reach, lift, angle, crouch] = frame;
    const [handX, handY] = HAND[dir];
    const mirror = handX < 0;
    this.player.setScale(1 + crouch / 90, 1 - crouch / 64);
    this.toolImage
      .setPosition(Math.round(this.player.x + handX + (mirror ? -reach : reach)), Math.round(this.player.y + handY - lift + crouch))
      .setDepth(this.player.y + (dir === 'up' ? -0.25 : 0.25))
      .setFlipX(mirror)
      .setAngle(mirror ? -angle : angle)
      .setVisible(true);
    this.poseMs += delta;
  }

  playTile(tool: FarmActionTool, x: number, y: number): void {
    const particles = this.scene.add.graphics({ x, y }).setName(`slice-${tool.toLowerCase()}-fx`).setDepth(20_000);
    this.uiCamera.ignore(particles);
    const water = tool === 'WATER';
    this.scene.tweens.addCounter({
      from: 0,
      to: water ? 1.5 : 1,
      delay: tool === 'SICKLE' ? 200 : 140,
      duration: water ? 460 : 370,
      onUpdate: (tween) => {
        particles.clear();
        const progress = tween.getValue() ?? 0;
        if (water) this.drawWater(particles, progress);
        else this.drawBurst(particles, progress, tool === 'SICKLE');
      },
      onComplete: () => particles.destroy(),
    });
  }

  private drawBurst(g: Phaser.GameObjects.Graphics, progress: number, harvest: boolean): void {
    const scatter = 1 - (1 - progress) ** 2;
    const height = (harvest ? 22 : 15) * 4 * progress * (1 - progress);
    const alpha = Math.min(1, (1 - progress) * 3);
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const spread = (8 + i % 3 * 3) * scatter;
      const x = Math.round(Math.cos(angle) * spread);
      const y = Math.round(Math.sin(angle) * spread * 0.38 - height);
      if (harvest) {
        g.fillStyle(VFX_COLORS.goldDeep, alpha).fillRect(x, y, 2, 4);
        g.fillStyle(VFX_COLORS.gold, alpha).fillRect(x + 1, y, 1, 2);
      } else {
        g.fillStyle(i % 2 ? VFX_COLORS.soil : VFX_COLORS.soilDark, alpha).fillRect(x, y, 3, 2);
        if (i % 3 === 0) g.fillStyle(0xe0c79a, alpha).fillRect(x + 1, y - 2, 2, 2);
      }
    }
  }

  /** Sáu giọt rơi lệch nhịp, chạm đất rồi tách ra thành hạt nước nhỏ. */
  private drawWater(g: Phaser.GameObjects.Graphics, progress: number): void {
    for (let i = 0; i < 6; i++) {
      const age = progress - i * 0.1;
      if (age < 0 || age >= 1) continue;
      const x = (i % 3 - 1) * 9 + (i >= 3 ? 4 : -3);
      const ground = i >= 3 ? 8 : 2;
      if (age < 0.65) {
        const y = ground - Math.round(24 * (1 - (age / 0.65) ** 2));
        g.fillStyle(VFX_COLORS.water).fillRect(x - 2, y - 5, 4, 5).fillRect(x - 1, y - 7, 2, 2);
        g.fillStyle(VFX_COLORS.foam).fillRect(x - 1, y - 4, 1, 2);
      } else {
        const splash = (age - 0.65) / 0.35;
        const spread = 2 + Math.round(splash * 4);
        g.fillStyle(VFX_COLORS.foam, 1 - splash)
          .fillRect(x - spread, ground - 1, 2, 2)
          .fillRect(x + spread, ground - 1, 2, 2);
      }
    }
  }
}
