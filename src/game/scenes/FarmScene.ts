import Phaser from 'phaser';
import { useGameStore } from '../../store/useGameStore';
import { GAME_CATALOG } from '../../data/masterData';
import { EventBus } from '../EventBus';
import { triggerHaptic } from '../../services/nativePlatform';
import { soundFX } from '../../services/soundEffects';
import { isStageOpen } from '../../config/features';
import { PLOT_LAYOUT, nextLockedPlot } from '../../domain/farmGrid';
import { DOG_CATCH_CHANCE } from '../../domain/social';
import { growthFrame, growthStage } from '../../domain/growth';
import { SPRITE_ATLASES } from './BootScene';
import { FarmVfx } from '../vfx/farmVfx';
import { WORLD_ATLAS, hasWorldFrame, setWorldTexture } from '../worldTex';
import { FarmPlayer } from '../player';
import { createAmbient, decorLayout } from '../ambient';

/** Lưới 5×5 (M02.4): khoảng cách tối thiểu giữa 2 cột để ô 168px không chồng nhau. */
const MIN_GAP_X = 180;
const MAX_GAP_Y = 115;

interface TileVisualGroup {
  tileId: string;
  tileSprite: Phaser.GameObjects.Image;
  cropSprite: Phaser.GameObjects.Image;
  label: Phaser.GameObjects.Text;
  statusTag: Phaser.GameObjects.Text;
  phaseOffset: number;
  baseY: number;
  /** Loại sinh vật đang ở ô (để chọn kiểu chuyển động: đung đưa / nhún / cá nhảy). */
  kind?: 'plant' | 'animal' | 'fish';
  /** Texture nền theo loại đất của ô (khi đã khai hoang). */
  zoneTex: string;
}

export class FarmScene extends Phaser.Scene {
  private tileVisuals: TileVisualGroup[] = [];
  private player: FarmPlayer | null = null;
  private workerSprites: {
    workerCode?: string;
    icon: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite;
    tag: Phaser.GameObjects.Text;
    /** Khung atlas `world` của thợ (vd 'worker_tu'); thiếu = hình vẽ code cũ. */
    worldKey?: string;
    baseX: number;
    baseY: number;
    speed: number;
  }[] = [];
  private waterWaveGraphics!: Phaser.GameObjects.Graphics;
  private weatherOverlay!: Phaser.GameObjects.Rectangle;
  private weatherParticles: Phaser.GameObjects.Image[] = [];
  private trainSprite!: Phaser.GameObjects.Image;
  private trainLabel!: Phaser.GameObjects.Text;
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  /** Hàm hủy đăng ký store / EventBus — gọi khi scene tắt để không rò listener. */
  private teardown: Array<() => void> = [];

  constructor() {
    super('FarmScene');
  }

  create(): void {
    const { width, height } = this.scale;

    // 1. Nền đồng quê 3 miền rộng mở (Hỗ trợ Camera Pan & Zoom cho Mobile / iPad)
    // Vùng kéo bản đồ đủ chứa cả 5 hàng ruộng/ao sau khi khai hoang hết 25 phân khu.
    const worldH = Math.max(height + 180, this.gridY(4, height) + 140);
    this.cameras.main.setBounds(-160, -80, width + 320, worldH);
    if (hasWorldFrame(this, 'grass_tile')) {
      this.add.tileSprite(width / 2, worldH / 2 - 80, width + 320, worldH, WORLD_ATLAS, 'grass_tile').setDepth(-1000);
    } else {
      this.add.rectangle(width / 2, worldH / 2 - 80, width + 320, worldH, 0x6ab04c).setDepth(-1000);
    }

    // Đường làng (GĐ1) — đường ray Tàu Thống Nhất chỉ từ GĐ3
    if (hasWorldFrame(this, 'path_tile')) {
      this.add.tileSprite(width / 2, 120, width + 320, 26, WORLD_ATLAS, 'path_tile').setDepth(-900);
    } else {
      this.add.rectangle(width / 2, 118, width + 240, 22, 0xc85a32).setStrokeStyle(2, 0x3d2314);
    }
    if (isStageOpen(3)) this.add.rectangle(width / 2, 118, width + 240, 6, 0x4a3b32).setDepth(-890);

    // Đầu máy Tàu Thống Nhất Bắc – Nam chạy dọc đường ray
    this.trainSprite = this.add
      .image(width * 0.2, 116, 'bldg_train')
      .setScale(0.85)
      .setDepth(18)
      .setInteractive({ useHandCursor: true });
    this.trainLabel = this.add
      .text(width * 0.2, 116, '🚂 Tàu Thống Nhất', {
        fontSize: '10px',
        fontStyle: 'bold',
        color: '#ffeb3b',
      })
      .setOrigin(0.5)
      .setDepth(19);

    // Tàu Thống Nhất thuộc GĐ3 (Chợ Phiên & Hàng Xóm).
    this.trainSprite.setVisible(isStageOpen(3));
    this.trainLabel.setVisible(isStageOpen(3));

    this.trainSprite.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (this.isDragging || !this.pressedOnCanvas(pointer)) return;
      soundFX.playTrainWhistle();
      useGameStore.getState().setActiveModal('COOP_QUESTS');
    });

    // 2. Khuôn viên 4 Cụm Công Trình Làng Quê (Nhà Chính, Lán Thợ, Đình Làng, Chợ Phiên)
    this.createVillageLandmarks(width);

    // 3. Khởi tạo Lưới 25 Phân khu Vườn - Ao - Chuồng (5×5, mở dần bằng Khai Hoang) dùng Pixel Textures
    this.createVACGrid(width, height);

    // 4. Khởi tạo 6 Nhân công Lán Thợ & Chó Phú Quốc đi tuần tự động (Seamless Loop)
    if (isStageOpen(2)) this.createAnimatedWorkers(width, height);

    // 5. Hiệu ứng sóng nước Ao Cá & Màn sương Thời Tiết Động (Mưa Rào / Đêm Đom Đóm)
    this.waterWaveGraphics = this.add.graphics();
    this.weatherOverlay = this.add
      .rectangle(width / 2, height / 2, width + 320, height + 180, 0x0d1b2a, 0)
      .setDepth(1500);
    this.createWeatherParticles(width, height);

    // 6. Cử chỉ Kéo Bản Đồ (Touch Drag-to-Pan) & Zoom (+/-) cho Mobile / iPad
    this.setupMobileTouchCamera();

    // VFX theo kết quả thật (gieo / tưới / thu hoạch / Hoàng Kim / khai hoang / lên cấp)
    const vfx = new FarmVfx(this, (tileId) => {
      const vis = this.tileVisuals.find((v) => v.tileId === tileId);
      return vis ? { x: vis.tileSprite.x, y: vis.tileSprite.y } : null;
    });
    this.teardown.push(vfx.watch());

    // Nhân vật điền chủ, Bác Bảy, giếng làng & cảnh nền sống động (chỉ hình ảnh)
    this.createFarmLife(width, height);

    this.teardown.push(
      useGameStore.subscribe(() => {
        this.refreshTileVisuals();
      })
    );
    this.refreshTileVisuals();

    // Cập nhật đồng hồ đếm ngược / trạng thái "chín" mỗi giây (không phụ thuộc store đổi).
    const ticker = this.time.addEvent({ delay: 1000, loop: true, callback: () => this.refreshTileVisuals() });
    this.teardown.push(() => ticker.remove(false));

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.runTeardown());
    this.events.once(Phaser.Scenes.Events.DESTROY, () => this.runTeardown());
  }

  /** Nhân vật, NPC, giếng và cảnh nền — chỉ hình ảnh, không ảnh hưởng luật chơi. */
  private createFarmLife(width: number, height: number): void {
    if (!this.textures.exists(WORLD_ATLAS)) return;
    const houseX = width * 0.15;
    if (hasWorldFrame(this, 'well')) this.add.image(houseX + 110, 112, WORLD_ATLAS, 'well').setOrigin(0.5, 1).setDepth(112);
    if (this.anims.exists('bacbay_idle')) {
      this.add.sprite(houseX - 56, 150, WORLD_ATLAS, 'bacbay_idle_0').setOrigin(0.5, 0.95).setDepth(150).play('bacbay_idle');
    }

    const state = useGameStore.getState();
    this.player = new FarmPlayer(this, { x: houseX + 160, y: 156 }).spawn(state.gender);
    this.teardown.push(
      useGameStore.subscribe((now, prev) => {
        if (now.gender !== prev.gender) this.player?.setGender(now.gender);
      })
    );
    this.teardown.push(() => {
      this.player?.destroy();
      this.player = null;
    });

    const left = this.gridX(0, width) - 84;
    const right = this.gridX(4, width) + 84;
    const top = this.gridY(0, height) - 40;
    const bottom = this.gridY(4, height) + 40;
    this.teardown.push(
      createAmbient(this, {
        decor: decorLayout(width, left, right, top, bottom),
        chimney: { x: houseX + 32, y: 22 },
        field: new Phaser.Geom.Rectangle(left, top, right - left, bottom - top),
      })
    );
  }

  private createWeatherParticles(width: number, height: number): void {
    for (let i = 0; i < 24; i++) {
      const p = this.add
        .image(Math.random() * width, Math.random() * height, 'fx_raindrop')
        .setDepth(1501)
        .setVisible(false);
      this.weatherParticles.push(p);
    }
  }

  private setupMobileTouchCamera(): void {
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.isDragging = false;
      this.dragStartX = pointer.x;
      this.dragStartY = pointer.y;
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!pointer.isDown) return;
      const dist = Phaser.Math.Distance.Between(
        this.dragStartX,
        this.dragStartY,
        pointer.x,
        pointer.y
      );
      if (dist > 12) {
        this.isDragging = true;
        this.cameras.main.scrollX -= (pointer.x - pointer.prevPosition.x) / this.cameras.main.zoom;
        this.cameras.main.scrollY -= (pointer.y - pointer.prevPosition.y) / this.cameras.main.zoom;
      }
    });

    const onZoom = (delta: number) => {
      const nextZoom = Phaser.Math.Clamp(this.cameras.main.zoom + delta, 0.75, 1.45);
      this.cameras.main.zoomTo(nextZoom, 180);
    };
    const onCenter = () => {
      this.cameras.main.pan(this.scale.width / 2, this.scale.height / 2, 220);
      this.cameras.main.zoomTo(1, 220);
    };
    EventBus.on('camera-zoom', onZoom);
    EventBus.on('camera-center', onCenter);
    this.teardown.push(() => {
      EventBus.off('camera-zoom', onZoom);
      EventBus.off('camera-center', onCenter);
    });
  }

  /**
   * Phaser nghe mouseup trên cả window: bấm nút HUD / modal HTML nằm đè lên canvas vẫn kích hoạt
   * pointerup của ô đất bên dưới. Chỉ xử lý khi cú bấm bắt đầu VÀ kết thúc trên canvas.
   */
  private pressedOnCanvas(pointer: Phaser.Input.Pointer): boolean {
    const canvas = this.sys.game.canvas;
    return pointer.downElement === canvas && pointer.upElement === canvas;
  }

  private runTeardown(): void {
    const fns = this.teardown;
    this.teardown = [];
    fns.forEach((fn) => fn());
  }

  private createVillageLandmarks(width: number): void {
    const landmarks = [
      {
        x: width * 0.15,
        y: 68,
        tex: 'bldg_house',
        title: '🏠 NHÀ CHÍNH 3 GIAN',
        sub: isStageOpen(2) ? '🍲 Bếp Quê Ngẫu Nhiên' : '🧺 Kho & Bán HTX',
        stage: 1,
        onClick: () => useGameStore.getState().setActiveModal(isStageOpen(2) ? 'COOKING' : 'WAREHOUSE'),
      },
      {
        x: width * 0.39,
        y: 68,
        tex: 'bldg_lodge',
        title: '🛖 LÁN THỢ GIA NHÂN',
        sub: '👨‍🌾 6 Thợ: Lương & Cơm',
        stage: 2,
        onClick: () => useGameStore.getState().setActiveModal('WORKERS'),
      },
      {
        x: width * 0.64,
        y: 68,
        tex: 'bldg_dinh',
        title: '⛩️ ĐÌNH LÀNG & ĐỘT BIẾN',
        sub: '🧬 Lai Tạo, Ông Địa & Rừng Trúc',
        stage: 4,
        onClick: () => useGameStore.getState().setActiveModal('BENCHMARK'),
      },
      {
        x: width * 0.88,
        y: 68,
        tex: 'bldg_market',
        title: '📰 BÁO CHỢ & ĐI TRỘM',
        sub: '🐕 Chó Phú Quốc Canh Gác',
        stage: 3,
        onClick: () => useGameStore.getState().setActiveModal('MARKET_STEAL'),
      },
    ];

    landmarks.forEach((lm) => {
      const open = isStageOpen(lm.stage);
      // Asset thế giới: nhà chính 3 gian (GĐ1) / lô "sắp mở" có biển gỗ cho công trình chưa mở.
      const worldFrame = open
        ? lm.tex === 'bldg_house'
          ? 'house'
          : lm.tex === 'bldg_lodge'
          ? 'lodge'
          : null
        : 'lot_sign';
      const useWorld = worldFrame !== null && hasWorldFrame(this, worldFrame);
      const sprite = (
        useWorld && worldFrame
          ? this.add.image(lm.x, 116, WORLD_ATLAS, worldFrame).setOrigin(0.5, 1)
          : this.add.image(lm.x, lm.y, lm.tex)
      ).setInteractive({ useHandCursor: true });

      if (!useWorld) {
        this.add
          .text(lm.x, lm.y - 16, lm.title, { fontSize: '12px', fontStyle: 'bold', color: '#fff8eb' })
          .setOrigin(0.5);
      }
      this.add
        .text(
          lm.x,
          useWorld ? 128 : lm.y + 12,
          useWorld
            ? `${lm.title} · ${open ? lm.sub : `🔒 Sắp mở (GĐ${lm.stage})`}`
            : open
            ? lm.sub
            : `🔒 Sắp mở (Giai đoạn ${lm.stage})`,
          {
            fontSize: '11px',
            fontStyle: 'bold',
            color: '#2a180c',
            backgroundColor: 'rgba(255,248,235,0.92)',
            padding: { x: 5, y: 2 },
          }
        )
        .setOrigin(0.5)
        .setDepth(-100);

      sprite.on('pointerup', (pointer: Phaser.Input.Pointer) => {
        if (this.isDragging || !this.pressedOnCanvas(pointer)) return;
        triggerHaptic('light');
        soundFX.playHarvestCoin();
        this.tweens.add({
          targets: sprite,
          scaleX: 0.94,
          scaleY: 0.94,
          duration: 85,
          yoyo: true,
        });
        if (open) lm.onClick();
        else useGameStore.getState().setToast(`🔒 ${lm.title} sẽ mở ở Giai đoạn ${lm.stage} — hãy chăm vườn trước nhé!`);
      });
    });
  }

  private gridX(col: number, width: number): number {
    return width * 0.16 + col * Math.max(MIN_GAP_X, (width * 0.68) / 4);
  }

  private gridY(row: number, height: number): number {
    return 185 + row * Math.min(MAX_GAP_Y, (height - 235) / 2.4);
  }

  /** Dựng sẵn đủ 25 phân khu; ô chưa khai hoang được ẩn / làm mờ trong refreshTileVisuals. */
  private createVACGrid(width: number, height: number): void {
    PLOT_LAYOUT.forEach((tile, idx) => {
      const x = this.gridX(tile.tileX, width);
      const y = this.gridY(tile.tileY, height);

      const initTex =
        tile.zoneType === 'POND'
          ? 'tile_pond'
          : tile.zoneType === 'ORCHARD'
          ? 'tile_orchard'
          : 'tile_land_dry';

      const tileSprite = this.add.image(x, y, initTex).setInteractive({ useHandCursor: true });
      setWorldTexture(tileSprite, initTex === 'tile_pond' ? 'tile_pond_0' : initTex, initTex);

      const cropSprite = this.add
        .image(x - 54, y - 6, 'crop_rice_gold')
        .setScale(0.85)
        .setVisible(false);

      const label = this.add
        .text(x + 10, y - 12, '', {
          fontSize: '13px',
          fontStyle: 'bold',
          color: '#ffffff',
          align: 'center',
        })
        .setOrigin(0.5);

      const statusTag = this.add
        .text(x, y + 19, '', {
          fontSize: '11px',
          fontStyle: 'bold',
          color: '#ffeb3b',
          backgroundColor: 'rgba(0,0,0,0.55)',
          padding: { x: 6, y: 2 },
        })
        .setOrigin(0.5);

      tileSprite.on('pointerup', (pointer: Phaser.Input.Pointer) => {
        if (this.isDragging || !this.pressedOnCanvas(pointer)) return;
        triggerHaptic('light');
        const latestState = useGameStore.getState();
        const currentTile = latestState.tiles.find((t) => t.id === tile.id);
        if (!currentTile) {
          // Ô chưa khai hoang: chỉ ô kế tiếp mới hiện và chạm được → hộp xác nhận Khai Hoang.
          if (nextLockedPlot(latestState.wildPlotsUnlocked)?.id === tile.id) {
            soundFX.playGoldenSparkle();
            this.player?.goTo(x - 96, y + 30);
            latestState.setActiveModal('EXPAND_LAND');
          }
          return;
        }
        const nowMs = Date.now() + latestState.clockOffsetMs;
        const isRipeNow = currentTile.matureAt !== null && nowMs >= currentTile.matureAt;

        if (!currentTile.itemId) {
          soundFX.playSeedPlant();
        } else if (currentTile.isTiltedByStorm || currentTile.isGolden) {
          soundFX.playGoldenSparkle();
        } else if (isRipeNow) {
          soundFX.playHarvestCoin();
        } else if (!currentTile.watered) {
          soundFX.playWaterSplash();
        } else {
          soundFX.playGoldenSparkle();
        }

        this.tweens.add({
          targets: [tileSprite, cropSprite, label],
          scaleX: 1.07,
          scaleY: 0.92,
          duration: 90,
          yoyo: true,
        });
        this.spawnClickParticles(
          x,
          y,
          !currentTile.itemId || currentTile.watered ? 'fx_gold_star' : 'fx_water_drop'
        );
        latestState.interactTile(tile.id);
        this.player?.goTo(x - 96, y + 30);
      });

      this.tileVisuals.push({
        tileId: tile.id,
        tileSprite,
        cropSprite,
        label,
        statusTag,
        phaseOffset: idx * 0.85,
        baseY: y - 12,
        zoneTex: initTex,
      });
    });
  }

  private spawnClickParticles(x: number, y: number, texKey: string): void {
    for (let i = 0; i < 6; i++) {
      const p = this.add.image(x, y, texKey).setDepth(2000);
      const angle = (Math.PI * 2 * i) / 6;
      this.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * 38,
        y: y + Math.sin(angle) * 28 - 12,
        alpha: 0,
        duration: 420,
        onComplete: () => p.destroy(),
      });
    }
  }

  private createAnimatedWorkers(width: number, height: number): void {
    const workerConfigs = [
      {
        workerCode: 'WORK_01',
        tex: 'char_worker_garden',
        text: '🌾 Chú Tư Cày',
        x: width * 0.24,
        y: 225,
        speed: 0.0018,
      },
      {
        workerCode: 'WORK_02',
        tex: 'char_worker_breed',
        text: '🐄 Cô Năm Thảo',
        x: width * 0.56,
        y: 300,
        speed: 0.0021,
      },
      {
        workerCode: 'WORK_03',
        tex: 'char_worker_fish',
        text: '🐟 Anh Sáu Kình',
        x: width * 0.42,
        y: Math.min(height - 65, 420),
        speed: 0.0016,
      },
      {
        workerCode: 'WORK_04',
        tex: 'char_worker_chef',
        text: '🍲 Dì Bảy Bếp',
        x: width * 0.19,
        y: 138,
        speed: 0.0019,
      },
      {
        workerCode: 'WORK_05',
        tex: 'char_worker_wood',
        text: '🪵 Chú Tám Mộc',
        x: width * 0.72,
        y: 295,
        speed: 0.0017,
      },
      {
        workerCode: 'WORK_06',
        tex: 'char_worker_butler',
        text: '📋 Quản Gia Cửu',
        x: width * 0.45,
        y: 138,
        speed: 0.0015,
      },
      {
        tex: 'char_dog_phuquoc',
        text: `🐕 Chó Phú Quốc (${Math.round(DOG_CATCH_CHANCE * 100)}% Bắt trộm)`,
        x: width * 0.78,
        y: 142,
        speed: 0.0028,
      },
    ];

    // Thợ GĐ2 có sprite atlas `world` (tools/art/codeart_world.py); thợ khác vẫn dùng hình vẽ code.
    const WORLD_WORKER: Record<string, string> = { WORK_01: 'worker_tu', WORK_02: 'worker_nam' };
    workerConfigs.forEach((wc) => {
      const worldKey = wc.workerCode ? WORLD_WORKER[wc.workerCode] : undefined;
      const useWorld = !!worldKey && hasWorldFrame(this, `${worldKey}_walk_0`) && this.anims.exists(`${worldKey}_walk`);
      const icon = useWorld
        ? this.add.sprite(wc.x - 68, wc.y + 8, WORLD_ATLAS, `${worldKey}_idle_0`).setOrigin(0.5, 1).setScale(0.9).setDepth(21)
        : this.add.image(wc.x - 68, wc.y, wc.tex).setScale(0.72).setDepth(21);
      if (useWorld && icon instanceof Phaser.GameObjects.Sprite) icon.play(`${worldKey}_walk`);
      const tag = this.add
        .text(wc.x, wc.y, wc.text, {
          fontSize: '10px',
          fontStyle: 'bold',
          color: '#fff8eb',
          backgroundColor: '#3e2413',
          padding: { x: 5, y: 2 },
        })
        .setOrigin(0.5)
        .setDepth(20);

      this.workerSprites.push({
        workerCode: wc.workerCode,
        icon,
        tag,
        worldKey: useWorld ? worldKey : undefined,
        baseX: wc.x,
        baseY: wc.y,
        speed: wc.speed,
      });
    });
  }

  private refreshTileVisuals(): void {
    const state = useGameStore.getState();
    const now = Date.now() + state.clockOffsetMs;

    // Cập nhật hiệu ứng nền Thời Tiết Động
    if (this.weatherOverlay) {
      if (state.weather === 'FIREFLY_NIGHT') {
        this.weatherOverlay.setFillStyle(0x0b132b, 0.36);
      } else if (state.weather === 'RAINY') {
        this.weatherOverlay.setFillStyle(0x1d3557, 0.22);
      } else {
        this.weatherOverlay.setFillStyle(0x000000, 0);
      }
    }

    const nextPlotId = nextLockedPlot(state.wildPlotsUnlocked)?.id;
    this.tileVisuals.forEach((vis) => {
      const tile = state.tiles.find((t) => t.id === vis.tileId);
      const parts = [vis.tileSprite, vis.cropSprite, vis.label, vis.statusTag];
      if (!tile) {
        // Chưa khai hoang: ô kế tiếp hiện mờ ("Đất Hoang"), các ô sau ẩn hẳn.
        const isNext = vis.tileId === nextPlotId;
        [vis.tileSprite, vis.label, vis.statusTag].forEach((o) => o.setVisible(isNext).setAlpha(0.55));
        vis.cropSprite.setVisible(false);
        if (isNext && hasWorldFrame(this, 'tile_wild')) {
          setWorldTexture(vis.tileSprite, 'tile_wild');
          vis.tileSprite.setAlpha(0.9);
          vis.label.setAlpha(1);
          vis.statusTag.setAlpha(1);
        }
        if (isNext) {
          vis.tileSprite.setInteractive({ useHandCursor: true });
          vis.label.setText('🌾 Đất Hoang');
          vis.statusTag.setText('🪓 Chạm khai hoang (-5⚡ -500🪙)');
          vis.statusTag.setColor('#ffd54f');
        } else {
          vis.tileSprite.disableInteractive();
        }
        return;
      }
      if (!vis.tileSprite.visible || vis.tileSprite.alpha < 1) {
        parts.forEach((o) => o.setAlpha(1));
        [vis.tileSprite, vis.label, vis.statusTag].forEach((o) => o.setVisible(true));
        vis.tileSprite.setInteractive({ useHandCursor: true });
      }
      if (vis.zoneTex !== 'tile_pond' && vis.zoneTex !== 'tile_land_dry') setWorldTexture(vis.tileSprite, vis.zoneTex);
      if (vis.zoneTex === 'tile_pond' && vis.tileSprite.frame.name === 'tile_wild') setWorldTexture(vis.tileSprite, 'tile_pond_0', 'tile_pond');

      if (tile.zoneType === 'LAND') {
        const key = tile.watered ? 'tile_land_wet' : 'tile_land_dry';
        setWorldTexture(vis.tileSprite, key, key);
      }

      if (!tile.itemId) {
        vis.kind = undefined;
        vis.cropSprite.setVisible(false);
        vis.label.setText(
          tile.zoneType === 'POND'
            ? '🌊 Ô Mặt Nước Trống'
            : tile.zoneType === 'ORCHARD'
            ? '🌳 Hố Cây Ăn Quả'
            : '🟫 Đất Ruộng Trống'
        );
        vis.statusTag.setText('[+ Chạm Gieo Giống (0⚡)]');
        vis.statusTag.setColor('#b8f272');
        return;
      }

      const spec = GAME_CATALOG.find((c) => c.id === tile.itemId);
      vis.kind = spec?.category === 'ANIMAL' ? 'animal' : spec?.category === 'AQUA' ? 'fish' : 'plant';
      const isRipe = tile.matureAt !== null && now >= tile.matureAt;

      vis.cropSprite.setVisible(true);
      // Sprite thật theo loài + giai đoạn lớn (atlas tools/art/pack_atlas.py); thiếu thì dùng hình vẽ code.
      const frame = growthFrame(tile.itemId, growthStage(tile.plantedAt, tile.matureAt, now));
      const atlas = SPRITE_ATLASES.find((a) => this.textures.exists(a) && this.textures.get(a).has(frame));
      if (atlas) {
        if (vis.cropSprite.texture.key !== atlas || vis.cropSprite.frame.name !== frame) {
          vis.cropSprite.setTexture(atlas, frame).setScale(1.25);
        }
      } else if (tile.itemId.includes('MUT')) {
        vis.cropSprite.setTexture('crop_mutant_purple');
      } else if (tile.itemId === 'CROP_15' || tile.zoneType === 'POND') {
        vis.cropSprite.setTexture('crop_lotus');
      } else if (tile.zoneType === 'ORCHARD') {
        vis.cropSprite.setTexture('crop_fruit_tree');
      } else {
        vis.cropSprite.setTexture('crop_rice_gold');
      }
      if (!atlas) vis.cropSprite.setScale(0.85);

      vis.label.setText(
        `${spec?.emoji ?? '🌱'} ${spec?.name ?? tile.itemId}${tile.isGolden ? ' ⭐' : ''}${
          (tile.harvestsLeft ?? 1) > 1 ? ` (còn ${tile.harvestsLeft} lứa)` : ''
        }`
      );

      if (tile.isTiltedByStorm) {
        vis.statusTag.setText('⛈️ Nghiêng giàn! [Chạm dựng +20%]');
        vis.statusTag.setColor('#ff9800');
      } else if (isRipe) {
        vis.statusTag.setText('★ CHÍN RỘ! [Chạm Thu Hoạch]');
        vis.statusTag.setColor('#ffeb3b');
      } else if (!tile.watered) {
        const remainSec = Math.max(1, Math.ceil(((tile.matureAt ?? now) - now) / 1000));
        vis.statusTag.setText(`💧 Tưới Nước (-15% | ${remainSec}s)`);
        vis.statusTag.setColor('#80deea');
      } else if (!tile.mudApplied) {
        vis.statusTag.setText('🪣 Bón Bùn Phù Sa (Chín Ngay + 45% ⭐)');
        vis.statusTag.setColor('#ffd54f');
      } else {
        vis.statusTag.setText('⏳ Đang lớn nhanh...');
        vis.statusTag.setColor('#ffffff');
      }
    });
  }

  update(time: number): void {
    const state = useGameStore.getState();

    // 1. Hiệu ứng gió đồng nội đung đưa cây trồng (Wind Sway 60 FPS)
    // Cây đung đưa; vật nuôi nhún / mổ thóc; cá thỉnh thoảng nhảy lên mặt nước. Ô ao gợn sóng 3 khung.
    const pondFrame = `tile_pond_${Math.floor(time / 420) % 3}`;
    this.tileVisuals.forEach((vis) => {
      const sway = Math.sin(time * 0.004 + vis.phaseOffset) * 2.5;
      vis.label.y = vis.baseY + sway;
      if (vis.kind === 'animal') {
        const hop = Math.abs(Math.sin(time * 0.006 + vis.phaseOffset)) * 3;
        vis.cropSprite.y = vis.baseY + 6 - hop;
        vis.cropSprite.angle = Math.sin(time * 0.003 + vis.phaseOffset) > 0.92 ? 8 : 0;
      } else if (vis.kind === 'fish') {
        const t = (time * 0.00025 + vis.phaseOffset * 0.37) % 1;
        const jump = t < 0.06 ? Math.sin((t / 0.06) * Math.PI) * 14 : 0;
        vis.cropSprite.y = vis.baseY + 6 - jump + Math.sin(time * 0.003 + vis.phaseOffset);
        vis.cropSprite.angle = t < 0.06 ? (t < 0.03 ? -12 : 12) : 0;
      } else {
        vis.cropSprite.y = vis.baseY + 6 + sway;
        vis.cropSprite.angle = 0;
      }
      if (vis.zoneTex === 'tile_pond' && vis.tileSprite.alpha === 1 && vis.tileSprite.frame.name !== pondFrame) {
        setWorldTexture(vis.tileSprite, pondFrame, 'tile_pond');
      }
    });

    // 2. Chuyển động Tàu Thống Nhất Bắc – Nam chạy ngang đường ray
    if (this.trainSprite && this.trainLabel) {
      const trainX = ((time * 0.045) % (this.scale.width + 220)) - 110;
      this.trainSprite.x = trainX;
      this.trainLabel.x = trainX;
    }

    // 3. Nhân công Lán Thợ: Hiển thị Độ No thực tế & Tự đi bộ về Lán Thợ khi Đói (< 35%)
    const lodgeX = this.scale.width * 0.39;
    const lodgeY = 104;

    this.workerSprites.forEach((w, idx) => {
      if (w.workerCode) {
        const workerState = state.workers.find((item) => item.code === w.workerCode);
        if (workerState) {
          w.icon.setVisible(workerState.isHired);
          w.tag.setVisible(workerState.isHired);
          if (!workerState.isHired) return;

          const isHungry = workerState.belly < 35;
          const targetBaseX = isHungry ? lodgeX + (idx - 2) * 26 : w.baseX;
          const targetBaseY = isHungry ? lodgeY : w.baseY;

          const offset = Math.sin(time * w.speed + idx) * (isHungry ? 8 : 34);
          const bob = Math.abs(Math.cos(time * 0.008 + idx)) * 3;
          w.tag.x = targetBaseX + offset;
          w.tag.y = targetBaseY - bob;
          w.icon.x = targetBaseX + offset - 62;
          w.icon.y = targetBaseY - bob + (w.worldKey ? 22 : 0);
          if (w.worldKey && w.icon instanceof Phaser.GameObjects.Sprite) {
            // Đi theo hướng dao động; đứng ăn ở Lán khi đói.
            w.icon.setFlipX(Math.cos(time * w.speed + idx) < 0);
            const anim = isHungry ? `${w.worldKey}_idle` : `${w.worldKey}_walk`;
            if (w.icon.anims.currentAnim?.key !== anim) w.icon.play(anim);
          }

          w.tag.setText(
            isHungry
              ? `${workerState.emoji} ${workerState.name.split(' ')[0]} [Đói ${workerState.belly}% ➔ Về Lán]`
              : `${workerState.emoji} ${workerState.name} (No ${workerState.belly}%)`
          );
          w.tag.setBackgroundColor(isHungry ? '#b83224' : '#3e2413');
          return;
        }
      }

      // Chó Phú Quốc tuần tra
      const offset = Math.sin(time * w.speed + idx) * 34;
      const bob = Math.abs(Math.cos(time * 0.008 + idx)) * 3;
      w.tag.x = w.baseX + offset;
      w.tag.y = w.baseY - bob;
      w.icon.x = w.baseX + offset - 68;
      w.icon.y = w.baseY - bob;
    });

    // 4. Hiệu ứng hạt Mưa Rào & Đom Đóm Đêm Trăng
    this.weatherParticles.forEach((p, i) => {
      if (state.weather === 'RAINY') {
        p.setVisible(true);
        p.setTexture('fx_raindrop');
        p.y = (p.y + 7 + (i % 3)) % this.scale.height;
        p.x = (p.x - 1.5 + this.scale.width) % this.scale.width;
        p.setAlpha(0.75);
      } else if (state.weather === 'FIREFLY_NIGHT') {
        p.setVisible(true);
        p.setTexture('fx_firefly');
        p.x = wModulo(p.x + Math.sin(time * 0.002 + i) * 0.8, this.scale.width);
        p.y = wModulo(p.y + Math.cos(time * 0.0018 + i) * 0.6, this.scale.height);
        p.setAlpha(0.45 + Math.abs(Math.sin(time * 0.005 + i)) * 0.55);
      } else {
        p.setVisible(false);
      }
    });

    // 5. Sóng nước lấp lánh dưới Ao Cá
    this.waterWaveGraphics.clear();
    this.waterWaveGraphics.lineStyle(2, 0x80deea, 0.35);
    const pondY = Math.min(this.scale.height - 55, 415);
    for (let i = 0; i < 4; i++) {
      const waveX =
        this.scale.width * 0.16 +
        i * ((this.scale.width * 0.68) / 3) +
        Math.sin(time * 0.003 + i) * 10;
      this.waterWaveGraphics.strokeCircle(waveX, pondY, 16 + Math.sin(time * 0.004 + i) * 4);
    }
  }
}

function wModulo(val: number, max: number): number {
  return ((val % max) + max) % max;
}
