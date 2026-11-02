import { useEffect, useState } from 'react';
import { STAMINA_REGEN_MS, regenStamina } from '../../domain/stamina';
import { useGameStore } from '../../store/useGameStore';
import { GameIcon } from '../GameIcon';

/** Năng lượng hiện tại (đã tính hồi +1⚡/3 phút) + đếm ngược tới lần hồi kế tiếp. */
export function StaminaBadge() {
  const stamina = useGameStore((s) => s.stamina);
  const maxStamina = useGameStore((s) => s.maxStamina);
  const updatedAt = useGameStore((s) => s.staminaUpdatedAt);
  const clockOffsetMs = useGameStore((s) => s.clockOffsetMs);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const serverNow = now + clockOffsetMs;
  const current = regenStamina(stamina, maxStamina, updatedAt, serverNow);
  const full = current.stamina >= maxStamina;
  const nextInSec = full ? 0 : Math.ceil((current.updatedAt + STAMINA_REGEN_MS - serverNow) / 1000);
  const mm = Math.floor(nextInSec / 60);
  const ss = String(nextInSec % 60).padStart(2, '0');

  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-extrabold text-[#b8f272] px-1"
      title={full ? 'Năng lượng đầy' : `+1 ⚡ sau ${mm}:${ss} (hồi 1 ⚡ mỗi 3 phút)`}
    >
      <GameIcon id="energy" fallback="⚡" size={16} /> {current.stamina}/{maxStamina}
      {!full && <span className="text-[10px] text-[#ffe8c2] font-bold"> (+1 {mm}:{ss})</span>}
    </span>
  );
}
