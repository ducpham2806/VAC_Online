import { useEffect, useRef, useState } from 'react';
import { GameIcon } from '../GameIcon';

/** Ô tiền trên HUD: icon pixel + số, nhảy xanh khi tăng / cam khi giảm. `id` dùng làm đích cho đồng xu bay. */
export function CurrencyBadge({
  id,
  icon,
  fallback,
  value,
  className,
}: {
  id: string;
  icon: string;
  fallback: string;
  value: number;
  className: string;
}) {
  const prev = useRef(value);
  const [bump, setBump] = useState<{ dir: 'up' | 'down'; n: number } | null>(null);
  useEffect(() => {
    if (value !== prev.current) {
      setBump((b) => ({ dir: value > prev.current ? 'up' : 'down', n: (b?.n ?? 0) + 1 }));
      prev.current = value;
    }
  }, [value]);
  return (
    <span id={id} className={`flex items-center gap-1 ${className}`}>
      <GameIcon id={icon} fallback={fallback} size={16} />
      <span key={bump?.n ?? 0} className={bump ? (bump.dir === 'up' ? 'vac-bump-up' : 'vac-bump-down') : ''}>
        {value.toLocaleString()}
      </span>
    </span>
  );
}
