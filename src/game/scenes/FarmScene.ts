import Phaser from 'phaser';
import { useGameStore } from '../../store/useGameStore';
import { GAME_CATALOG } from '../../data/masterData';
import { EventBus } from '../EventBus';
import { triggerHaptic } from '../../services/nativePlatform';
import { soundFX } from '../../services/soundEffects';

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
    icon: Phaser.GameObjects.Image;
    tag: Phaser.GameObjects.Text;
    baseX: number;
    baseY: number;
    speed: number;
  }[] = [];
  private waterWaveGraphics!: Phaser.GameObjects.Graphics;
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;

  constructor() {
    super('FarmScene');
  }

  create(): void {
    const { width, height } = this.scale;

    // 1. Nền đồng quê 3 miền rộng mở (Hỗ trợ Camera Pan & Zoom cho Mobile / iPad)
    this.cameras.main.setBounds(-160, -80, width + 320, height + 180);
    this.add.rectangle(width / 2, height / 2, width + 320, height + 180, 0x6ab04c);

    // Đường làng gạch đỏ Bát Tràng & Bờ đê cỏ mượt
    this.add.rectangle(width / 2, 118, width - 36, 24, 0xc85a32).setStrokeStyle(2, 0x3d2314);

    // 2. Khuôn viên 4 Cụm Công Trình Làng Quê (Nhà Chính, Lán Thợ, Đình Làng, Chợ Phiên)
    this.createVillageLandmarks(width);

    // 3. Khởi tạo Lưới 12 Ô Vườn - Ao - Chuồng (3 Hàng x 4 Cột) dùng Pixel Textures
    this.createVACGrid(width, height);

    // 4. Khởi tạo Nhân công Lán Thợ & Chó Phú Quốc đi tuần tự động (Seamless Loop)
    this.createAnimatedWorkers(width, height);

    // 5. Hiệu ứng sóng nước Ao Cá
    this.waterWaveGraphics = this.add.graphics();

    // 6. Cử chỉ Kéo Bản Đồ (Touch Drag-to-Pan) & Zoom (+/-) cho Mobile / iPad
    this.setupMobileTouchCamera();

    useGameStore.subscribe(() => {
      this.refreshTileVisuals();
    });
    this.refreshTileVisuals();
  }

  private setupMobileTouchCamera(): void {
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.isDragging = false;
      this.dragStartX = pointer.x;
      this.dragStartY = pointer.y;
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!pointer.isDown) return;
      const dist = Phaser.Math.Distance.Between(this.dragStartX, this.dragStartY, pointer.x, pointer.y);
      if (dist > 12) {
        this.isDragging = true;
        this.cameras.main.scrollX -= (pointer.x - pointer.prevPosition.x) / this.cameras.main.zoom;
        this.cameras.main.scrollY -= (pointer.y - pointer.prevPosition.y) / this.cameras.main.zoom;
      }
    });

    EventBus.on('camera-zoom', (delta: number) => {
      const nextZoom = Phaser.Math.Clamp(this.cameras.main.zoom + delta, 0.75, 1.45);
      this.cameras.main.zoomTo(nextZoom, 180);
    });

    EventBus.on('camera-center', () => {
      this.cameras.main.pan(this.scale.width / 2, this.scale.height / 2, 220);
      this.cameras.main.zoomTo(1, 220);
    });
  }

  private createVillageLandmarks(width: number): void {
    const landmarks = [
      {
        x: width * 0.15,
        y: 68,
        tex: 'bldg_house',
        title: '🏠 NHÀ CHÍNH 3 GIAN',
        sub: '🍲 Bếp Quê Ngẫu Nhiên',
        onClick: () => useGameStore.getState().setActiveModal('COOKING'),
      },
      {
        x: width * 0.39,
        y: 68,
        tex: 'bldg_lodge',
        title: '🛖 LÁN THỢ GIA NHÂN',
        sub: '👨‍🌾 6 Thợ: Lương & Cơm',
        onClick: () => useGameStore.getState().setActiveModal('WORKERS'),
      },
      {
        x: width * 0.64,
        y: 68,
        tex: 'bldg_dinh',
        title: '⛩️ ĐÌNH LÀNG & ĐỘT BIẾN',
        sub: '🧬 Lai Tạo, Ông Địa & Rừng Trúc',
        onClick: () => useGameStore.getState().setActiveModal('BENCHMARK'),
      },
      {
        x: width * 0.88,
        y: 68,
        tex: 'bldg_market',
        title: '📰 BÁO CHỢ & ĐI TRỘM',
        sub: '🐕 Chó Phú Quốc Canh Gác',
        onClick: () => useGameStore.getState().setActiveModal('MARKET_STEAL'),
      },
    ];

    landmarks.forEach((lm) => {
      const sprite = this.add
        .image(lm.x, lm.y, lm.tex)
        .setInteractive({ useHandCursor: true });

      this.add
        .text(lm.x, lm.y - 16, lm.title, {
          fontSize: '12px',
          fontStyle: 'bold',
          color: '#fff8eb',
        })
        .setOrigin(0.5);

      this.add
        .text(lm.x, lm.y + 12, lm.sub, {
          fontSize: '11px',
          fontStyle: 'bold',
          color: '#2a180c',
          backgroundColor: 'rgba(255,248,235,0.88)',
          padding: { x: 5, y: 2 },
        })
        .setOrigin(0.5);

      sprite.on('pointerup', () => {
        if (this.isDragging) return;
        triggerHaptic('light');
        soundFX.playHarvestCoin();
        this.tweens.add({
          targets: sprite,
          scaleX: 0.94,
          scaleY: 0.94,
          duration: 85,
          yoyo: true,
        });
        lm.onClick();
      });
    });
  }

  private createVACGrid(width: number, height: number): void {
    const state = useGameStore.getState();
    const startX = width * 0.16;
    const startY = 185;
    const gapX = (width * 0.68) / 3;
    const gapY = Math.min(115, (height - 235) / 2.4);

    state.tiles.forEach((tile, idx) => {
      const x = startX + tile.tileX * gapX;
      const y = startY + tile.tileY * gapY;

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

      tileSprite.on('pointerup', () => {
        if (this.isDragging) return;
        triggerHaptic('light');
        if (tile.watered) soundFX.playHarvestCoin();
        else soundFX.playWaterSplash();

        this.tweens.add({
          targets: [tileSprite, cropSprite, label],
          scaleX: 1.07,
          scaleY: 0.92,
          duration: 90,
          yoyo: true,
        });
        this.spawnClickParticles(x, y, tile.watered ? 'fx_gold_star' : 'fx_water_drop');
        useGameStore.getState().interactTile(tile.id);
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
        tex: 'char_worker_garden',
        text: 'Chú Tư Cày (Tưới nước)',
        x: width * 0.25,
        y: 230,
        speed: 0.0018,
      },
      {
        tex: 'char_worker_breed',
        text: 'Cô Năm Thảo (Chăn nuôi)',
        x: width * 0.56,
        y: 305,
        speed: 0.0022,
      },
      {
        tex: 'char_worker_fish',
        text: 'Anh Sáu Kình (Vét bùn ao)',
        x: width * 0.42,
        y: Math.min(height - 65, 425),
        speed: 0.0015,
      },
      {
        tex: 'char_dog_phuquoc',
        text: '🐕 Chó Phú Quốc (70% Bắt trộm)',
        x: width * 0.78,
        y: 142,
        speed: 0.0028,
      },
    ];

    workerConfigs.forEach((wc) => {
      const icon = this.add.image(wc.x - 68, wc.y, wc.tex).setScale(0.72).setDepth(21);
      const tag = this.add
        .text(wc.x, wc.y, wc.text, {
          fontSize: '11px',
          fontStyle: 'bold',
          color: '#fff8eb',
          backgroundColor: '#3e2413',
          padding: { x: 6, y: 2 },
        })
        .setOrigin(0.5)
        .setDepth(20);

      this.workerSprites.push({
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
    const now = Date.now();

    this.tileVisuals.forEach((vis) => {
      const tile = state.tiles.find((t) => t.id === vis.tileId);
      if (!tile) return;

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
      if (tile.itemId.includes('MUT')) {
        vis.cropSprite.setTexture('crop_mutant_purple');
      } else if (tile.itemId === 'CROP_15' || tile.zoneType === 'POND') {
        vis.cropSprite.setTexture('crop_lotus');
      } else if (tile.zoneType === 'ORCHARD') {
        vis.cropSprite.setTexture('crop_fruit_tree');
      } else {
        vis.cropSprite.setTexture('crop_rice_gold');
      }

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
        vis.statusTag.setText('💧 Chạm tưới Giếng (-15% t/g)');
        vis.statusTag.setColor('#80deea');
      } else if (!tile.mudApplied) {
        vis.statusTag.setText('🪣 Chạm bón Bùn Phù Sa (Nổ ⭐)');
        vis.statusTag.setColor('#ffcc80');
      } else {
        vis.statusTag.setText('⏳ Đang lớn...');
        vis.statusTag.setColor('#ffffff');
      }
    });
  }

  update(time: number): void {
    this.tileVisuals.forEach((vis) => {
      const swayX = Math.sin(time * 0.0032 + vis.phaseOffset) * 4;
      const bobY = Math.cos(time * 0.004 + vis.phaseOffset) * 2;
      vis.label.y = vis.baseY + bobY;
      vis.cropSprite.y = vis.baseY + 6 + bobY;
      vis.cropSprite.angle = swayX * 1.4;
    });

    this.workerSprites.forEach((w, idx) => {
      const offsetX = Math.sin(time * w.speed + idx) * 42;
      const offsetY = Math.cos(time * w.speed * 2 + idx) * 3.5;
      w.tag.x = w.baseX + offsetX;
      w.tag.y = w.baseY + offsetY;
      w.icon.x =W_ICON_X(w.baseX, offsetX);
      w.icon.y = w.baseY + offsetY;
    });

    this.waterWaveGraphics.clear();
    this.waterWaveGraphics.lineStyle(2, 0x80deea, 0.38);
    for (let i = 0; i < 4; i++) {
      const waveY = 405 + i * 16 + Math.sin(time * 0.004 + i) * 3;
      this.waterWaveGraphics.strokeLineShape(
        new Phaser.Geom.Line(120 + i * 160, waveY, 210 + i * 160, waveY)
      );
    }
  }
}

function W_ICON_X(baseX: number, offsetX: number): number {
  return baseX - 75 + offsetX;
}
