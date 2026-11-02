import Phaser from 'phaser';
import { VFX_COLORS, VfxEvent, diffVfxEvents } from '../../domain/vfxEvents';
import { useGameStore } from '../../store/useGameStore';

/**
 * VFX nông trại dựa trên KẾT QUẢ thật trong store (chạy giống nhau ở online/offline):
 * gieo → bụi đất, tưới → nước bắn, thu hoạch → "+n 🌾" bay lên, Hoàng Kim → lấp lánh,
 * khai hoang → bụi + lá, lên cấp → pháo giấy. Sự kiện: src/domain/vfxEvents.ts.
 */
export type TilePositionLookup = (tileId: string) => { x: number; y: number } | null;

export class FarmVfx {
  constructor(private scene: Phaser.Scene, private tilePos: TilePositionLookup) {}

  /** Theo dõi store; trả về hàm hủy. */
  watch(): () => void {
    return useGameStore.subscribe((now, prev) => {
      if (now.tiles === prev.tiles && now.level === prev.level) return;
      for (const ev of diffVfxEvents(prev, now)) this.play(ev);
    });
  }

  play(ev: VfxEvent): void {
    if (ev.kind === 'levelUp') {
      this.confetti(ev.level);
      return;
    }
    const pos = this.tilePos(ev.tileId);
    if (!pos) return;
    const { x, y } = pos;
    if (ev.kind === 'plant') this.burst(x - 50, y + 4, [VFX_COLORS.soil, VFX_COLORS.soilDark], 8, 26, -10);
    if (ev.kind === 'water') this.burst(x - 50, y - 6, [VFX_COLORS.water, VFX_COLORS.foam], 10, 30, -18);
    if (ev.kind === 'golden') this.sparkle(x - 50, y - 10);
    if (ev.kind === 'expand') {
      this.burst(x, y + 6, [VFX_COLORS.soil, VFX_COLORS.soilDark], 14, 60, -12);
      this.burst(x, y - 4, [VFX_COLORS.leaf, VFX_COLORS.leafDark], 10, 50, -30);
    }
    if (ev.kind === 'harvest') {
      this.floatText(x - 30, y + 4, ev.text);
      this.burst(x - 50, y - 6, [VFX_COLORS.gold, VFX_COLORS.goldDeep], 8, 28, -24);
    }
  }

  /** Hạt vuông nhỏ bắn ra rồi rơi, mờ dần. */
  private burst(x: number, y: number, colors: readonly number[], n: number, spread: number, lift: number): void {
    for (let i = 0; i < n; i++) {
      const size = 3 + (i % 3);
      const p = this.scene.add.rectangle(x, y, size, size, colors[i % colors.length]).setDepth(2001);
      const a = (Math.PI * 2 * i) / n + (i % 2) * 0.3;
      this.scene.tweens.add({
        targets: p,
        x: x + Math.cos(a) * spread * (0.5 + (i % 3) * 0.25),
        y: y + Math.sin(a) * spread * 0.45 + lift,
        alpha: 0,
        duration: 420 + (i % 4) * 60,
        ease: 'Quad.easeOut',
        onComplete: () => p.destroy(),
      });
    }
  }

  private sparkle(x: number, y: number): void {
    for (let i = 0; i < 6; i++) {
      const s = this.scene.add
        .image(x + Phaser.Math.Between(-22, 22), y + Phaser.Math.Between(-16, 10), 'fx_gold_star')
        .setDepth(2002)
        .setScale(0.2)
        .setTint(i % 2 ? VFX_COLORS.gold : VFX_COLORS.goldDeep);
      this.scene.tweens.add({
        targets: s,
        scale: 0.9,
        alpha: 0,
        angle: 90,
        delay: i * 70,
        duration: 520,
        onComplete: () => s.destroy(),
      });
    }
  }

  private floatText(x: number, y: number, text: string): void {
    const t = this.scene.add
      .text(x, y, text, { fontSize: '18px', fontStyle: 'bold', color: '#fff3b0', stroke: '#3d2314', strokeThickness: 4 })
      .setOrigin(0.5)
      .setDepth(2003);
    this.scene.tweens.add({ targets: t, y: y - 18, duration: 1200, ease: 'Sine.easeOut' });
    this.scene.tweens.add({ targets: t, alpha: 0, delay: 650, duration: 550, onComplete: () => t.destroy() });
  }

  private confetti(level: number): void {
    const cam = this.scene.cameras.main;
    const cx = cam.worldView.centerX;
    const top = cam.worldView.y + 60;
    for (let i = 0; i < 36; i++) {
      const p = this.scene.add
        .rectangle(cx + Phaser.Math.Between(-60, 60), top, 4, 6, VFX_COLORS.confetti[i % VFX_COLORS.confetti.length])
        .setDepth(2010)
        .setAngle(Phaser.Math.Between(0, 90));
      this.scene.tweens.add({
        targets: p,
        x: p.x + Phaser.Math.Between(-260, 260),
        y: top + Phaser.Math.Between(160, 340),
        angle: p.angle + 360,
        alpha: 0,
        duration: Phaser.Math.Between(900, 1500),
        ease: 'Quad.easeIn',
        onComplete: () => p.destroy(),
      });
    }
    this.floatText(cx, top + 40, `⭐ Lên Lv.${level}!`);
  }
}
