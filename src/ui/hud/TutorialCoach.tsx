import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { TUTORIAL_STEPS, currentTutorialStep } from '../../domain/tutorial';
import { useGameStore } from '../../store/useGameStore';
import { useTutorialStore, watchFirstSale } from '../../store/useTutorialStore';

/** 👴 Bác Bảy hướng dẫn tân thủ Chương 1–2 (S3). Ẩn khi đang mở cửa sổ hoặc khi người chơi tắt. */
export function TutorialCoach() {
  const { level, tiles, progressCounters, storyQuests, activeModal, setToast } = useGameStore(
    useShallow((s) => ({
      level: s.level,
      tiles: s.tiles,
      progressCounters: s.progressCounters,
      storyQuests: s.storyQuests,
      activeModal: s.activeModal,
      setToast: s.setToast,
    }))
  );
  const { dismissed, soldOnce, dismiss } = useTutorialStore(
    useShallow((s) => ({ dismissed: s.dismissed, soldOnce: s.soldOnce, dismiss: s.dismiss }))
  );

  useEffect(() => watchFirstSale(), []);

  const current = currentTutorialStep({
    level,
    tiles,
    progressCounters,
    completedQuestIds: storyQuests.filter((q) => q.completed).map((q) => q.id),
    soldOnce,
  });

  // Chúc mừng đúng 1 lần khi vừa làm xong bước cuối trong phiên chơi này.
  const wasActive = useRef(false);
  useEffect(() => {
    if (current) wasActive.current = true;
    else if (wasActive.current && !dismissed) {
      wasActive.current = false;
      setToast('🎉 Hoàn thành Hướng dẫn tân thủ! Gia Phả Chương 1–2 đã mở — chúc điền chủ vụ mùa bội thu!');
    }
  }, [current, dismissed, setToast]);

  if (dismissed || !current || activeModal !== null) return null;

  return (
    <div
      className="fixed top-14 right-14 z-30 safe-right pointer-events-none max-w-[340px] short:max-w-[250px] short:top-12"
      role="status"
      aria-live="polite"
    >
      <div className="vac-paper vac-pop-in pointer-events-auto bg-[#fff8eb]/95 border-2 border-[#6e4121] rounded-xl shadow-xl px-2.5 py-2 short:py-1 text-[#2a180c]">
        <div className="flex items-center justify-between gap-2 text-[11px] font-extrabold text-[#6e4121]">
          <span>
            👴 Bác Bảy • Bước {current.index}/{TUTORIAL_STEPS.length}
          </span>
          <button
            onClick={dismiss}
            className="touch-btn min-h-[44px] short:min-h-[38px] px-2 rounded-lg bg-[#6e4121] text-[#fff8eb] text-[10px] font-bold cursor-pointer"
          >
            Ẩn hướng dẫn
          </button>
        </div>
        <p className="text-[11px] italic text-[#3e2413] short:hidden">"{current.step.speech}"</p>
        <p className="text-xs font-extrabold text-[#2b4c1b] short:text-[11px]">{current.step.hint}</p>
        <div className="flex gap-1 pt-1" aria-hidden>
          {TUTORIAL_STEPS.map((s, i) => (
            <span
              key={s.id}
              className={`h-1.5 flex-1 rounded-full ${i < current.index - 1 ? 'bg-[#4e8222]' : i === current.index - 1 ? 'bg-[#f5b82e]' : 'bg-[#e0d4c0]'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
