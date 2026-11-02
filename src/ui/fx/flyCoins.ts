import goldUrl from '../../assets/icons/gold.png';

/** Đồng xu bay từ phần tử nguồn (vd nút "Bán HTX") lên ô vàng trên HUD (#hud-gold). Chỉ hiệu ứng. */
export function flyCoins(from: Element | null, count = 5): void {
  const target = document.getElementById('hud-gold');
  if (!from || !target || typeof window === 'undefined') return;
  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  for (let i = 0; i < count; i++) {
    const img = document.createElement('img');
    img.src = goldUrl;
    img.width = 20;
    img.height = 20;
    img.className = 'vac-coin-fly';
    img.style.imageRendering = 'pixelated';
    const x = a.left + a.width / 2 + (i - count / 2) * 6;
    const y = a.top + a.height / 2;
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
    img.style.setProperty('--dx', `${b.left + b.width / 2 - x}px`);
    img.style.setProperty('--dy', `${b.top + b.height / 2 - y}px`);
    img.style.animationDelay = `${i * 60}ms`;
    document.body.appendChild(img);
    window.setTimeout(() => img.remove(), 900 + i * 60);
  }
}
