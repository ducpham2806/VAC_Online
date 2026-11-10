/**
 * P1-3 — phân loại thao tác chạm theo UI-20. Hàm thuần để test, scene chỉ gọi.
 *  - Bắt đầu trong vùng góc dưới trái (~1/3 rộng, ~40% cao) → joystick nổi.
 *  - Ngoài vùng: dịch ≤ 12 px khi nhả → chạm (đi tới / làm); dịch > 12 px → kéo (camera; P1-4: kéo trên ô = làm cả loạt).
 */
export const DRAG_THRESHOLD_PX = 12;
export const JOYSTICK_ZONE = { widthFrac: 1 / 3, heightFrac: 0.4 } as const;
export const JOYSTICK_RADIUS_PX = 48;
export const JOYSTICK_DEADZONE_PX = 8;

export type Dir = 'down' | 'up' | 'left' | 'right';

export function inJoystickZone(x: number, y: number, screenW: number, screenH: number): boolean {
  return x <= screenW * JOYSTICK_ZONE.widthFrac && y >= screenH * (1 - JOYSTICK_ZONE.heightFrac);
}

export function isDrag(dx: number, dy: number): boolean {
  return Math.hypot(dx, dy) > DRAG_THRESHOLD_PX;
}

/** Vector joystick đã chuẩn hóa (độ dài 0…1) + vị trí núm bị kẹp trong bán kính. */
export function joystickVector(dx: number, dy: number): { vx: number; vy: number; knobX: number; knobY: number } {
  const len = Math.hypot(dx, dy);
  if (len <= JOYSTICK_DEADZONE_PX) return { vx: 0, vy: 0, knobX: dx, knobY: dy };
  const k = Math.min(len, JOYSTICK_RADIUS_PX) / len;
  const mag = Math.min(1, (len - JOYSTICK_DEADZONE_PX) / (JOYSTICK_RADIUS_PX - JOYSTICK_DEADZONE_PX));
  return { vx: (dx / len) * mag, vy: (dy / len) * mag, knobX: dx * k, knobY: dy * k };
}

/** Hướng hoạt ảnh 4 hướng theo trục lớn hơn; giữ hướng cũ khi đứng yên. */
export function facing(vx: number, vy: number, prev: Dir): Dir {
  if (vx === 0 && vy === 0) return prev;
  if (Math.abs(vx) > Math.abs(vy)) return vx > 0 ? 'right' : 'left';
  return vy > 0 ? 'down' : 'up';
}
