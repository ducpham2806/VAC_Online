/**
 * Icon pixel 32x32 (tools/art/codeart_ui.py → src/assets/icons/<key>.png). Thiếu ảnh thì hiện emoji dự phòng.
 * Ảnh nằm trong src/ nên Vite đóng gói đúng đường dẫn cả khi build --base=./ (bản chạy thử Artifact).
 */
const ICON_URLS: Record<string, string> = Object.fromEntries(
  Object.entries(import.meta.glob('../assets/icons/*.png', { eager: true, query: '?url', import: 'default' })).map(
    ([path, url]) => [path.replace(/^.*\/(.+)\.png$/, '$1'), url as string]
  )
);

export function hasGameIcon(id: string): boolean {
  return id in ICON_URLS;
}

export function GameIcon({
  id,
  fallback = '',
  size = 20,
  className = '',
  title,
}: {
  id: string;
  fallback?: string;
  size?: number;
  className?: string;
  title?: string;
}) {
  const url = ICON_URLS[id];
  if (!url) return fallback ? <span className={className}>{fallback}</span> : null;
  return (
    <img
      src={url}
      alt={title ?? fallback}
      title={title}
      width={size}
      height={size}
      draggable={false}
      className={`inline-block align-middle shrink-0 [image-rendering:pixelated] ${className}`}
    />
  );
}
