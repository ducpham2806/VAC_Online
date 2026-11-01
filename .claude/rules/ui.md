---
paths:
  - "src/ui/**"
  - "src/App.tsx"
  - "src/components/**"
  - "src/game/**"
---

# Giao diện & Phaser — chuyển thể từ CCGS `ui-code`

- UI **không sở hữu state game**: chỉ đọc store (dùng selector `useGameStore((s) => s.x)`) và gọi action. Không tính tiền hay luật trong component.
- **2-Thumb Landscape** (`06_MASTER_UI_UX`): nút chạm ≥ 44px (`.touch-btn`), chừa `safe-area-inset-*`, chất liệu gỗ/tre/giấy dó. Phải kiểm ở **1280×720 và 844×390**.
- Công cụ debug chỉ hiện sau `import.meta.env.DEV`. Tính năng của giai đoạn sau phải bọc `isStageOpen(n)` (`src/config/features.ts`).
- Phaser:
  - Gỡ mọi `subscribe` / `EventBus.on` / timer khi scene `shutdown`/`destroy`.
  - Thao tác chạm phải qua `pressedOnCanvas()`, vì click lên nút HTML không được xuyên xuống ô đất.
  - Đồng hồ dùng `Date.now() + clockOffsetMs`.
- Component mới đặt trong `src/ui/hud` hoặc `src/ui/modals`, không nhồi thêm vào `App.tsx`.
