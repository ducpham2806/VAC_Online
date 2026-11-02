import { xpToNext } from '../../domain/progression';
import { useGameStore } from '../../store/useGameStore';

/** Thanh kinh nghiệm tới cấp kế tiếp (đường cong src/domain/progression.ts). */
export function XpBar() {
  const level = useGameStore((s) => s.level);
  const xp = useGameStore((s) => s.xp);
  const need = xpToNext(level);
  const pct = Math.max(0, Math.min(100, Math.round((xp / need) * 100)));
  return (
    <span className="flex items-center gap-1 text-[10px] font-bold text-[#ffe8c2]" title={`${xp}/${need} XP tới Lv.${level + 1}`}>
      <span className="w-14 h-2 bg-[#2a180c] border border-[#c88a4b] rounded-full overflow-hidden">
        <span className="block h-full bg-[#f5b82e]" style={{ width: `${pct}%` }} />
      </span>
      {xp}/{need}
    </span>
  );
}
