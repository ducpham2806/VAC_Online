/**
 * P1 — bản thử vertical slice (LT-12), mở bằng `?p1` trên URL. Game MVP cũ vẫn là mặc định.
 * Phaser chiếm toàn màn (RESIZE theo cửa sổ, màn ngang); HUD React nằm trên (P1-5).
 */
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { EstateScene } from './EstateScene';
import { SliceHud } from '../../ui/hud/SliceHud';
import { useSliceStore } from '../../store/useSliceStore';
import { currentLog, startPlaytest } from './playtest';
import { startSliceSync } from '../../services/sliceSync';

declare global {
  interface Window {
    __vacSlice?: EstateScene;
    __vacSliceStore?: typeof useSliceStore;
    __vacPlaytest?: typeof currentLog;
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
        window.__vacPlaytest = currentLog;
      });
    }
    const stopPlaytest = startPlaytest(useSliceStore, Date.now());
    const stopSync = startSliceSync(); // P1-8: chơi online (thêm `?offline` để chơi trên máy)
    const timer = window.setInterval(() => useSliceStore.getState().tick(Date.now()), 1000);
    return () => {
      window.clearInterval(timer);
      stopSync();
      stopPlaytest();
      game.destroy(true);
      delete window.__vacSlice;
      delete window.__vacSliceStore;
      delete window.__vacPlaytest;
    };
  }, []);

  return (
    <div className="fixed inset-0 select-none overflow-hidden bg-[#1b3b2b]">
      <div ref={ref} className="absolute inset-0" style={{ touchAction: 'none' }} />
      <SliceHud />
    </div>
  );
};
