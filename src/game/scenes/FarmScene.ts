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
}

export class FarmScene extends Phaser.Scene {
  private tileVisuals: TileVisualGroup[] = [];
  private workerSprites: {
    workerCode?: string;
    icon: Phaser.GameObjects.Image;
    tag: Phaser.GameObjects.Text;
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
    this.add.rectangle(width / 2, worldH / 2 - 80, width + 320, worldH, 0x6ab04c);

    // Đường làng gạch đỏ Bát Tràng & Đường ray Tàu Thống Nhất Bắc – Nam
    this.add.rectangle(width / 2, 118, width + 240, 22, 0xc85a32).setStrokeStyle(2, 0x3d2314);
    this.add.rectangle(width / 2, 118, width + 240, 6, 0x4a3b32);

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
      .setDepth(25);
    this.createWeatherParticles(width, height);

    // 6. Cử chỉ Kéo Bản Đồ (Touch Drag-to-Pan) & Zoom (+/-) cho Mobile / iPad
    this.setupMobileTouchCamera();

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

  private createWeatherParticles(width: number, height: number): void {
    for (let i = 0; i < 24; i++) {
      const p = this.add
        .image(Math.random() * width, Math.random() * height, 'fx_raindrop')
        .setDepth(26)
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
      const sprite = this.add.image(lm.x, lm.y, lm.tex).setInteractive({ useHandCursor: true });

      this.add
        .text(lm.x, lm.y - 16, lm.title, {
          fontSize: '12px',
          fontStyle: 'bold',
          color: '#fff8eb',
        })
        .setOrigin(0.5);

      const open = isStageOpen(lm.stage);
      this.add
        .text(lm.x, lm.y + 12, open ? lm.sub : `🔒 Sắp mở (Giai đoạn ${lm.stage})`, {
          fontSize: '11px',
          fontStyle: 'bold',
          color: '#2a180c',
          backgroundColor: 'rgba(255,248,235,0.88)',
          padding: { x: 5, y: 2 },
        })
        .setOrigin(0.5);

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

      const tileSprite = this.add
        .image(x, y, initTex)
        .setInteractive({ useHandCursor: true });

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
      });

      this.tileVisuals.push({
        tileId: tile.id,
        tileSprite,
        cropSprite,
        label,
        statusTag,
        phaseOffset: idx * 0.85,
        baseY: y - 12,
      });
    });
  }

  private spawnClickParticles(x: number, y: number, texKey: string): void {
    for (let i = 0; i < 6; i++) {
      const p = this.add.image(x, y, texKey).setDepth(30);
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

    workerConfigs.forEach((wc) => {
      const icon = this.add.image(wc.x - 68, wc.y, wc.tex).setScale(0.72).setDepth(21);
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

      if (tile.zoneType === 'LAND') {
        vis.tileSprite.setTexture(tile.watered ? 'tile_land_wet' : 'tile_land_dry');
      }

      if (!tile.itemId) {
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
        `${spec?.emoji ?? '🌱'} ${spec?.name ?? tile.itemId}${tile.isGolden ? ' ⭐' : ''}`
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
    this.tileVisuals.forEach((vis) => {
      const sway = Math.sin(time * 0.004 + vis.phaseOffset) * 2.5;
      vis.label.y = vis.baseY + sway;
      vis.cropSprite.y = vis.baseY + 6 + sway;
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
          w.icon.y = targetBaseY - bob;

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
