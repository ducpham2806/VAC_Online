/**
 * Native Platform & Mobile PWA Bridge (iOS / Android / iPadOS / Mobile Web)
 * Cung cấp:
 *  1. Rung phản hồi xúc giác (Haptic Feedback) khi gieo hạt, thu hoạch, đập niêu, bị chó rượt.
 *  2. Khóa màn hình ngang (Landscape Orientation Lock) & Fullscreen trên PWA / Capacitor.
 *  3. Nhận diện thiết bị (iOS, Android, iPadOS, Standalone PWA).
 */

export interface DevicePlatformInfo {
  isStandalonePWA: boolean;
  isIOS: boolean;
  isIPadOS: boolean;
  isAndroid: boolean;
  isMobileOrTablet: boolean;
}

export function detectPlatform(): DevicePlatformInfo {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      isStandalonePWA: false,
      isIOS: false,
      isIPadOS: false,
      isAndroid: false,
      isMobileOrTablet: false,
    };
  }

  const ua = navigator.userAgent || '';
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPod/i.test(ua);
  const isIPadOS =
    /iPad/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const isStandalonePWA =
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: standalone)').matches ||
    Boolean((navigator as unknown as { standalone?: boolean }).standalone);

  return {
    isStandalonePWA,
    isIOS,
    isIPadOS,
    isAndroid,
    isMobileOrTablet: isIOS || isIPadOS || isAndroid || window.innerWidth < 1024,
  };
}

/**
 * Rung phản hồi xúc giác nhẹ nhàng (Haptics) khi chạm ô ruộng / thu hoạch / bị chó rượt
 */
export function triggerHaptic(type: 'light' | 'success' | 'warning' = 'light'): void {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      if (type === 'light') navigator.vibrate(12);
      else if (type === 'success') navigator.vibrate([18, 30, 25]);
      else if (type === 'warning') navigator.vibrate([45, 40, 65]);
    }
  } catch {
    // Bỏ qua trên thiết bị không hỗ trợ rung
  }
}
