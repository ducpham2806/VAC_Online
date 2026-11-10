/**
 * P1 — bản thử vertical slice (LT-12), mở bằng `?p1` trên URL. Game MVP cũ vẫn là mặc định.
 * Phaser chiếm toàn màn (RESIZE theo cửa sổ, màn ngang); HUD React nằm trên (P1-5).
 */
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { EstateScene } from './EstateScene';
import { SliceHud } from '../../ui/hud/SliceHud';
import { useSliceStore } from '../../store/useSliceStore';

declare global {
  interface Window {
    __vacSlice?: EstateScene;
    __vacSliceStore?: typeof useSliceStore;
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
        window.__vacSliceStore = useSliceStore;
      });
    }
    const timer = window.setInterval(() => useSliceStore.getState().tick(Date.now()), 1000);
    return () => {
      window.clearInterval(timer);
      game.destroy(true);
      delete window.__vacSlice;
      delete window.__vacSliceStore;
    };
  }, []);

  return (
    <div className="fixed inset-0 select-none overflow-hidden bg-[#1b3b2b]">
      <div ref={ref} className="absolute inset-0" style={{ touchAction: 'none' }} />
      <SliceHud />
    </div>
  );
};
