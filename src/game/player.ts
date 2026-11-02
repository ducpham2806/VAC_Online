import Phaser from 'phaser';
import type { GenderType } from '../data/types';
import { WORLD_ATLAS, hasWorldFrame } from './worldTex';

/**
 * Nhân vật điền chủ trên bản đồ (chỉ hình ảnh): đứng thở ở nhà, chạm ô đất thì đi tới và làm động tác.
 * Thao tác nông trại vẫn chạy ngay khi chạm — nhân vật KHÔNG chặn hay trì hoãn luật chơi.
 */
const WALK_SPEED = 0.16; // px / ms

export class FarmPlayer {
  private sprite: Phaser.GameObjects.Sprite | null = null;
  private prefix = 'farmer_m';
  private moveTween: Phaser.Tweens.Tween | null = null;
  private actTimer: Phaser.Time.TimerEvent | null = null;

  constructor(private scene: Phaser.Scene, private home: { x: number; y: number }) {}

  spawn(gender: GenderType): this {
    if (!hasWorldFrame(this.scene, 'farmer_m_idle_0')) return this;
    this.prefix = gender === 'FEMALE' ? 'farmer_f' : 'farmer_m';
    this.sprite = this.scene.add
      .sprite(this.home.x, this.home.y, WORLD_ATLAS, `${this.prefix}_idle_0`)
      .setOrigin(0.5, 0.95)
      .setDepth(this.home.y);
    this.sprite.play(`${this.prefix}_idle`);
    return this;
  }

  setGender(gender: GenderType): void {
    const next = gender === 'FEMALE' ? 'farmer_f' : 'farmer_m';
    if (!this.sprite || next === this.prefix) return;
    this.prefix = next;
    this.sprite.play(`${this.prefix}_idle`);
  }

  /** Đi tới (x, y) rồi làm động tác 0,8 giây. */
  goTo(x: number, y: number): void {
    const s = this.sprite;
    if (!s) return;
    this.moveTween?.stop();
    this.actTimer?.remove(false);
    const dist = Phaser.Math.Distance.Between(s.x, s.y, x, y);
    s.setFlipX(x < s.x);
    const act = () => {
      s.play(`${this.prefix}_act`);
      this.actTimer = this.scene.time.delayedCall(800, () => s.play(`${this.prefix}_idle`));
    };
    if (dist < 8) {
      act();
      return;
    }
    s.play(`${this.prefix}_walk`);
    this.moveTween = this.scene.tweens.add({
      targets: s,
      x,
      y,
      duration: Math.min(1400, dist / WALK_SPEED),
      onUpdate: () => s.setDepth(s.y),
      onComplete: act,
    });
  }

  destroy(): void {
    this.moveTween?.stop();
    this.actTimer?.remove(false);
    this.sprite?.destroy();
    this.sprite = null;
  }
}
