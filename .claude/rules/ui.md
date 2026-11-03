---
paths:
  - "src/ui/**"
  - "src/App.tsx"
  - "src/components/**"
  - "src/game/**"
---
# Giao diện & Phaser
- UI không sở hữu state game: đọc store bằng selector, gọi action; không tính luật trong component.
- HUD 2 ngón cầm ngang (`06`): `.touch-btn` ≥ 44px, `safe-area-inset-*`, gỗ/tre/giấy dó; kiểm ở 1280×720 và 844×390.
- Debug chỉ sau `import.meta.env.DEV`; tính năng GĐ sau bọc `isStageOpen(n)`.
- Phaser: gỡ `subscribe`/`EventBus.on`/timer khi `shutdown`; chạm qua `pressedOnCanvas()`; đồng hồ `Date.now() + clockOffsetMs`.
- Component mới ở `src/ui/hud` hoặc `src/ui/modals`, không nhồi vào `App.tsx`.
