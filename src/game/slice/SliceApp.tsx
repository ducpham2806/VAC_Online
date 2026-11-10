/**
 * P1 — bản thử vertical slice (LT-12), mở bằng `?p1` trên URL. Game MVP cũ vẫn là mặc định.
 * Phaser chiếm toàn màn (RESIZE theo cửa sổ, màn ngang); HUD React sẽ thêm ở P1-5.
 */
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { EstateScene } from './EstateScene';

declare global {
  interface Window {
    __vacSlice?: EstateScene;
  }
}

export const SliceApp: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: ref.current,
      backgroundColor: '#1b3b2b',
      pixelArt: true,
      roundPixels: true,
      scale: { mode: Phaser.Scale.RESIZE, width: window.innerWidth, height: window.innerHeight },
      input: { activePointers: 3 },
      scene: [EstateScene],
    });
    if (import.meta.env.DEV) {
      game.events.once(Phaser.Core.Events.READY, () => {
        window.__vacSlice = game.scene.getScene('EstateScene') as EstateScene;
      });
    }
    return () => {
      game.destroy(true);
      delete window.__vacSlice;
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#1b3b2b]">
      <div ref={ref} className="absolute inset-0" style={{ touchAction: 'none' }} />
      <div
        className="pointer-events-none absolute rounded-md border-2 border-[#3D2314] bg-[#f3e3c0]/90 px-2 py-0.5 text-xs text-[#3D2314]"
        style={{ top: 'max(8px, env(safe-area-inset-top))', left: 'max(8px, env(safe-area-inset-left))' }}
      >
        Bản thử P1 · điền trang Bắc Bộ
      </div>
    </div>
  );
};
