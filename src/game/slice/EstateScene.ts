/**
 * P1-3 — scene điền trang bản thử (LT-03, UI-20): nhân vật đi 4 hướng bằng joystick nổi
 * hoặc chạm đất để tự tìm đường; kéo ở vùng trống để xem bản đồ.
 * Chưa có thao tác ô (P1-4) và HUD (P1-5). Nhà/giếng/cây/đá đang dùng hình vẽ code của atlas `world` (tạm).
 */
import Phaser from 'phaser';
import {
  ESTATE_COLS,
  ESTATE_HEIGHT,
  ESTATE_ROWS,
  TILE,
  type TilePos,
  boundsOf,
  isWalkable,
  spawnTile,
  tileAt,
  tileCenter,
  worldToTile,
} from './estateMap';
import { type Dir, JOYSTICK_RADIUS_PX, facing, inJoystickZone, isDrag, joystickVector } from './gesture';
import { pathToward } from './pathfinding';

export const SLICE_ATLAS = 'slice';
const WORLD = 'world';
const SPEED_PX_PER_S = 96; // 3 ô/giây
const FEET_HALF_W = 8; // nửa bề ngang "chân" để va chạm, nhỏ hơn 1 ô cho dễ lách
const DIRS: readonly Dir[] = ['down', 'up', 'left', 'right'];
const WOOD_D = 0x3d2314;
const PAPER = 0xf3e3c0;

type PointerMode = 'joystick' | 'pending' | 'pan';

export interface SliceDebug {
  tile: TilePos;
  dir: Dir;
  moving: boolean;
  zoom: number;
}

export class EstateScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private dir: Dir = 'down';
  private path: TilePos[] = [];
  private joy = { vx: 0, vy: 0 };
  private pointerMode: PointerMode | null = null;
  private pointerId = -1;
  private startX = 0;
  private startY = 0;
  private lastX = 0;
  private lastY = 0;
  private uiCam!: Phaser.Cameras.Scene2D.Camera;
  private joyBase!: Phaser.GameObjects.Arc;
  private joyKnob!: Phaser.GameObjects.Arc;
  private marker!: Phaser.GameObjects.Rectangle;
  private worldObjects: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super('EstateScene');
  }

  preload(): void {
    this.load.atlas(SLICE_ATLAS, 'assets/atlas/slice.png', 'assets/atlas/slice.json');
    this.load.atlas(WORLD, 'assets/atlas/world.png', 'assets/atlas/world.json');
  }

  create(): void {
    this.drawMap();
    this.createPlayer();
    this.createUi();
    this.setupCameras();
    this.setupInput();
    this.scale.on(Phaser.Scale.Events.RESIZE, this.onResize, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.onResize, this);
      this.input.removeAllListeners();
    });
  }

  /** Cho Playwright / kiểm thử thủ công đọc trạng thái (chỉ DEV gắn vào window). */
  debugState(): SliceDebug {
    return { tile: worldToTile(this.player.x, this.player.y), dir: this.dir, moving: this.isMoving(), zoom: this.cameras.main.zoom };
  }

  // ------------------------------------------------------------------ bản đồ
  private add2<T extends Phaser.GameObjects.GameObject>(o: T): T {
    this.worldObjects.push(o);
    return o;
  }

  private drawMap(): void {
    for (let y = 0; y < ESTATE_HEIGHT; y++) {
      for (let x = 0; x < ESTATE_COLS; x++) {
        const ch = ESTATE_ROWS[y][x];
        const frame = ch === 'F' ? 'tile_tilled_dry' : ch === ',' ? 'tile_grass_dong' : 'tile_grass_xuan';
        this.add2(this.add.image(x * TILE, y * TILE, SLICE_ATLAS, frame).setOrigin(0).setDepth(-1000));
      }
    }
    this.drawPond();
    this.drawField();
    this.placeBlock('H', 'house');
    this.placeBlock('W', 'well');
    this.drawBorder();
    this.drawTrees();
    this.drawCoop();
  }

  private drawPond(): void {
    const b = boundsOf('P');
    if (!b) return;
    const g = this.add2(this.add.graphics().setDepth(-900));
    g.fillStyle(0x2e8b8d, 1).lineStyle(3, WOOD_D, 1);
    g.fillRoundedRect(b.x * TILE + 2, b.y * TILE + 2, b.w * TILE - 4, b.h * TILE - 4, 28);
    g.strokeRoundedRect(b.x * TILE + 2, b.y * TILE + 2, b.w * TILE - 4, b.h * TILE - 4, 28);
    const fish = [
      { x: (b.x + 1.5) * TILE, y: (b.y + 1.5) * TILE, f: 0 },
      { x: (b.x + 3.2) * TILE, y: (b.y + 3) * TILE, f: 1 },
    ];
    for (const p of fish) {
      const s = this.add2(this.add.image(p.x, p.y, SLICE_ATLAS, `AQUA_01_${p.f}`).setDepth(-890).setAlpha(0.9));
      this.tweens.add({ targets: s, x: p.x + 24, duration: 2600 + p.f * 700, yoyo: true, repeat: -1, ease: 'Sine.inOut', onYoyo: () => s.toggleFlipX(), onRepeat: () => s.toggleFlipX() });
    }
  }

  private drawField(): void {
    // Bản thử P1-3: ruộng có lúa nhiều giai đoạn để xem tỉ lệ. P1-4 thay bằng trạng thái thật từ engine.
    for (let y = 0; y < ESTATE_HEIGHT; y++) {
      for (let x = 0; x < ESTATE_COLS; x++) {
        if (tileAt(x, y) !== 'F') continue;
        const stage = (x + y * 2) % 5;
        if (stage === 4) continue;
        this.add2(this.add.image(x * TILE + TILE / 2, (y + 1) * TILE - 1, SLICE_ATLAS, `CROP_01_${stage}`).setOrigin(0.5, 1).setDepth((y + 1) * TILE - 2));
      }
    }
  }

  private placeBlock(ch: string, frame: string): void {
    const b = boundsOf(ch);
    if (!b) return;
    const bottom = (b.y + b.h) * TILE;
    const img = this.add2(this.add.image((b.x + b.w / 2) * TILE, bottom, WORLD, frame).setOrigin(0.5, 1).setDepth(bottom));
    if (ch === 'H') img.setTint(0xc8b8a0); // nhà đổ nát (GP-14) — tạm làm xỉn màu tới khi có art
  }

  private drawBorder(): void {
    for (let x = 0; x < ESTATE_COLS; x += 2) {
      this.add2(this.add.image(x * TILE + TILE, TILE - 2, WORLD, 'fence').setOrigin(0.5, 1).setDepth(TILE));
      this.add2(this.add.image(x * TILE + TILE, ESTATE_HEIGHT * TILE, WORLD, 'fence').setOrigin(0.5, 1).setDepth(ESTATE_HEIGHT * TILE));
    }
    for (let y = 1; y < ESTATE_HEIGHT - 1; y += 3) {
      this.add2(this.add.image(TILE / 2, (y + 2) * TILE, WORLD, 'bamboo').setOrigin(0.5, 1).setDepth((y + 2) * TILE));
      this.add2(this.add.image((ESTATE_COLS - 0.5) * TILE, (y + 2) * TILE, WORLD, 'bamboo').setOrigin(0.5, 1).setDepth((y + 2) * TILE));
    }
  }

  private drawTrees(): void {
    const seen = new Set<string>();
    for (let y = 0; y < ESTATE_HEIGHT; y++) {
      for (let x = 0; x < ESTATE_COLS; x++) {
        const ch = tileAt(x, y);
        if (ch === 'R') this.add2(this.add.image(x * TILE + TILE / 2, (y + 1) * TILE - 6, WORLD, 'rock').setOrigin(0.5, 1).setScale(1.4).setDepth((y + 1) * TILE));
        if (ch !== 'T' || seen.has(`${x},${y}`)) continue;
        // khối cây 3×3 → 1 cây đa phủ cả khối
        for (let dy = 0; dy < 3; dy++) for (let dx = 0; dx < 3; dx++) seen.add(`${x + dx},${y + dy}`);
        this.add2(this.add.image((x + 1.5) * TILE, (y + 3) * TILE, WORLD, 'banyan').setOrigin(0.5, 1).setDepth((y + 3) * TILE));
      }
    }
  }

  private drawCoop(): void {
    const b = boundsOf(',');
    if (!b) return;
    for (let x = b.x; x < b.x + b.w; x += 2) {
      this.add2(this.add.image((x + 1) * TILE, b.y * TILE + 4, WORLD, 'fence').setOrigin(0.5, 1).setDepth(b.y * TILE));
    }
    const hens = [
      { x: b.x + 1.5, y: b.y + 2, f: 0 },
      { x: b.x + 4, y: b.y + 3, f: 1 },
    ];
    for (const h of hens) {
      const s = this.add2(this.add.sprite(h.x * TILE, h.y * TILE, SLICE_ATLAS, `ANI_01_${h.f}`).setOrigin(0.5, 0.95).setDepth(h.y * TILE));
      this.time.addEvent({ delay: 900 + h.f * 300, loop: true, callback: () => s.setFrame(s.frame.name === 'ANI_01_0' ? 'ANI_01_1' : 'ANI_01_0') });
    }
  }

  // ------------------------------------------------------------------ nhân vật
  private createPlayer(): void {
    for (const d of DIRS) {
      if (this.anims.exists(`slice_walk_${d}`)) continue;
      this.anims.create({
        key: `slice_walk_${d}`,
        frames: [0, 1, 2, 3].map((i) => ({ key: SLICE_ATLAS, frame: `farmer_walk_${d}_${i}` })),
        frameRate: 8,
        repeat: -1,
      });
    }
    const c = tileCenter(spawnTile());
    this.player = this.add2(this.add.sprite(c.x, c.y + TILE / 2 - 2, SLICE_ATLAS, 'farmer_walk_down_0').setOrigin(0.5, 0.95));
  }

  private isMoving(): boolean {
    return this.path.length > 0 || this.joy.vx !== 0 || this.joy.vy !== 0;
  }

  /** Đi một bước (dx, dy) có va chạm: thử từng trục để trượt dọc tường. */
  private tryMove(dx: number, dy: number): void {
    const free = (px: number, py: number) =>
      [-FEET_HALF_W, FEET_HALF_W].every((ox) => {
        const t = worldToTile(px + ox, py - 2);
        return isWalkable(t.x, t.y);
      });
    if (dx !== 0 && free(this.player.x + dx, this.player.y)) this.player.x += dx;
    if (dy !== 0 && free(this.player.x, this.player.y + dy)) this.player.y += dy;
  }

  update(_time: number, deltaMs: number): void {
    const step = (SPEED_PX_PER_S * deltaMs) / 1000;
    let vx = 0;
    let vy = 0;
    if (this.joy.vx !== 0 || this.joy.vy !== 0) {
      this.path = [];
      vx = this.joy.vx;
      vy = this.joy.vy;
      this.tryMove(vx * step, vy * step);
    } else if (this.path.length) {
      const c = tileCenter(this.path[0]);
      const tx = c.x;
      const ty = c.y + TILE / 2 - 2; // chân đứng ở mép dưới ô
      const dx = tx - this.player.x;
      const dy = ty - this.player.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= step) {
        this.player.setPosition(tx, ty);
        this.path.shift();
        if (!this.path.length) this.marker.setVisible(false);
      } else {
        vx = dx / dist;
        vy = dy / dist;
        this.player.x += vx * step;
        this.player.y += vy * step;
      }
    }
    this.dir = facing(vx, vy, this.dir);
    if (vx !== 0 || vy !== 0) {
      this.player.anims.play(`slice_walk_${this.dir}`, true);
      if (!this.isFollowing()) this.follow();
    } else {
      this.player.anims.stop();
      this.player.setFrame(`farmer_walk_${this.dir}_0`);
    }
    this.player.setDepth(this.player.y);
  }

  private following = true;

  private isFollowing(): boolean {
    return this.following;
  }

  private follow(): void {
    this.following = true;
    this.cameras.main.startFollow(this.player, true, 0.15, 0.15);
  }

  // ------------------------------------------------------------------ camera + giao diện
  private zoomFor(h: number): number {
    // 720 px cao → ×2 (≈ 11 ô), 390 px → ×1 (≈ 12 ô)
    return Math.max(1, Math.min(3, Math.floor(h / 320)));
  }

  private setupCameras(): void {
    const cam = this.cameras.main;
    cam.setBounds(0, 0, ESTATE_COLS * TILE, ESTATE_HEIGHT * TILE);
    cam.setZoom(this.zoomFor(this.scale.height));
    this.follow();
    cam.setRoundPixels(true);
    this.uiCam = this.cameras.add(0, 0, this.scale.width, this.scale.height).setName('ui');
    this.uiCam.ignore(this.worldObjects);
    cam.ignore([this.joyBase, this.joyKnob]);
  }

  private onResize(size: Phaser.Structs.Size): void {
    this.cameras.main.setSize(size.width, size.height).setZoom(this.zoomFor(size.height));
    this.uiCam.setSize(size.width, size.height);
  }

  private createUi(): void {
    this.joyBase = this.add.circle(0, 0, JOYSTICK_RADIUS_PX + 8, PAPER, 0.35).setStrokeStyle(3, WOOD_D, 0.6).setVisible(false).setDepth(10_000);
    this.joyKnob = this.add.circle(0, 0, 22, PAPER, 0.9).setStrokeStyle(3, WOOD_D, 1).setVisible(false).setDepth(10_001);
    this.marker = this.add2(this.add.rectangle(0, 0, TILE - 4, TILE - 4).setStrokeStyle(2, 0xffffff, 0.9).setVisible(false).setDepth(-500));
  }

  // ------------------------------------------------------------------ chạm (UI-20)
  private setupInput(): void {
    this.input.on(Phaser.Input.Events.POINTER_DOWN, (p: Phaser.Input.Pointer) => {
      if (this.pointerMode) return; // chỉ theo 1 ngón cho P1-3
      this.pointerId = p.id;
      this.startX = this.lastX = p.x;
      this.startY = this.lastY = p.y;
      if (inJoystickZone(p.x, p.y, this.scale.width, this.scale.height)) {
        this.pointerMode = 'joystick';
        this.joyBase.setPosition(p.x, p.y).setVisible(true);
        this.joyKnob.setPosition(p.x, p.y).setVisible(true);
      } else {
        this.pointerMode = 'pending';
      }
    });

    this.input.on(Phaser.Input.Events.POINTER_MOVE, (p: Phaser.Input.Pointer) => {
      if (p.id !== this.pointerId || !this.pointerMode) return;
      if (this.pointerMode === 'joystick') {
        const v = joystickVector(p.x - this.startX, p.y - this.startY);
        this.joy = { vx: v.vx, vy: v.vy };
        this.joyKnob.setPosition(this.startX + v.knobX, this.startY + v.knobY);
        return;
      }
      if (this.pointerMode === 'pending' && isDrag(p.x - this.startX, p.y - this.startY)) this.pointerMode = 'pan';
      if (this.pointerMode === 'pan') {
        const cam = this.cameras.main;
        cam.stopFollow();
        this.following = false;
        cam.scrollX -= (p.x - this.lastX) / cam.zoom;
        cam.scrollY -= (p.y - this.lastY) / cam.zoom;
      }
      this.lastX = p.x;
      this.lastY = p.y;
    });

    const end = (p: Phaser.Input.Pointer) => {
      if (p.id !== this.pointerId) return;
      if (this.pointerMode === 'pending') this.walkTo(p.worldX, p.worldY);
      if (this.pointerMode === 'joystick') {
        this.joy = { vx: 0, vy: 0 };
        this.joyBase.setVisible(false);
        this.joyKnob.setVisible(false);
      }
      this.pointerMode = null;
      this.pointerId = -1;
    };
    this.input.on(Phaser.Input.Events.POINTER_UP, end);
    this.input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, end);
  }

  /** Chạm đất → tự tìm đường; chạm vật cản (nhà, giếng…) → đi tới ô sát nó (P1-4 sẽ làm thao tác ở đó). */
  walkTo(worldX: number, worldY: number): boolean {
    const target = worldToTile(worldX, worldY);
    const from = worldToTile(this.player.x, this.player.y - 2);
    const r = pathToward(from, target, isWalkable);
    if (!r) return false;
    this.path = r.path.slice(1);
    const c = tileCenter(target);
    this.marker.setPosition(c.x, c.y).setVisible(this.path.length > 0);
    this.follow();
    return true;
  }
}
