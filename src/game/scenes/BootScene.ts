import Phaser from 'phaser';
import { PixelAssetGenerator } from '../assets/PixelAssetGenerator';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    // Khởi tạo toàn bộ Pixel Art Textures & Particle FX trong bộ nhớ GPU
    PixelAssetGenerator.generateAll(this);
  }

  create(): void {
    this.scene.start('FarmScene');
  }
}
