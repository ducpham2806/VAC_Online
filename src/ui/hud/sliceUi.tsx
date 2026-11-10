/** Thành phần dùng chung của HUD bản thử `?p1` (UI-20): nút giấy dó ≥ 44 px, tấm giấy nổi. */
import React from 'react';

export const btn = 'touch-btn touch-btn-44 vac-paper bg-[#f3e3c0] text-[#3D2314] pointer-events-auto select-none';

export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div
        className="vac-paper vac-pop-in max-h-[80vh] w-[min(420px,90vw)] overflow-y-auto bg-[#f3e3c0] p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-center justify-between">
          <b>{title}</b>
          <button className={`${btn}`} onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
