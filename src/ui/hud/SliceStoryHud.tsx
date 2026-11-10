/**
 * P1-11 — phần cốt truyện của HUD bản thử (QD-84): cảnh mở đầu chọn hướng (TG-40), thanh hướng dẫn Bác Bảy (GP-62),
 * hộp thoại NPC có tim (GP-50), Sổ Gia Phả Chương 1 (TG-30). Chỉ đọc `useSliceStore` và gọi action.
 */
import React, { useState } from 'react';
import { NPCS, NPC_IDS } from '../../data/npcs';
import { QUEST_BRANCH_REWARDS, QUEST_XP_REWARD } from '../../data/quests';
import { HEART_POINTS, MAX_HEARTS, heartsOf, npcOf } from '../../domain/npc';
import { chapterGoals, chapterQuest, storyOf } from '../../domain/story';
import { SLICE_TUTORIAL, currentTutorialStep } from '../../game/slice/sliceTutorial';
import { itemLabel, useSliceStore } from '../../store/useSliceStore';
import { Sheet, btn } from './sliceUi';

const WOOD_D = '#3D2314';
const EMP = QUEST_BRANCH_REWARDS.EMP;
const PRAG = QUEST_BRANCH_REWARDS.PRAG;

/** Cảnh mở đầu "Bức Thư Trong Chiếc Tráp Gỗ Lim" (TG-40): hiện tới khi người chơi trả lời Bá Kiến. */
export function IntroScene() {
  const path = useSliceStore((s) => storyOf(s.save).path);
  const choose = useSliceStore((s) => s.choosePath);
  const [page, setPage] = useState(0);
  if (path) return null;
  const q = chapterQuest(1);
  const pages = [
    {
      who: '👴 Bác Trưởng Thôn Bảy',
      text: 'Cháu về rồi đấy à. Ông nội cháu dặn bác giữ cái tráp gỗ lim này: cuốn Sổ Gia Phả, túi thóc giống tổ tiên, và tờ khế ước. Nhà cửa đổ nát cả, nhưng đất vẫn còn.',
    },
    { who: '🎩 Thương Nhân Bá Kiến', text: `Hừm… ${q?.npcQuote ?? ''}` },
  ];
  return (
    <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/50" data-testid="intro">
      <div className="vac-paper vac-pop-in max-h-[90vh] w-[min(520px,92vw)] overflow-y-auto bg-[#f3e3c0] p-3 text-sm">
        <b className="text-xs">📜 Bức Thư Trong Chiếc Tráp Gỗ Lim</b>
        {page < pages.length ? (
          <>
            <p className="mt-1 font-bold">{pages[page].who}</p>
            <p className="mt-1">{pages[page].text}</p>
            <div className="mt-2 flex justify-end">
              <button className={`${btn} px-4 font-bold`} onClick={() => setPage(page + 1)} data-testid="intro-next">
                Tiếp ▸
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-1 font-bold">Cháu trả lời Bá Kiến thế nào?</p>
            <div className="mt-2 flex flex-col gap-2">
              <button className={`${btn} flex-col px-3 py-1 text-left`} onClick={() => choose('EMP')} data-testid="choose-EMP">
                <b>🤝 "Cháu tự cày trả sạch nợ, đất này không bán."</b>
                <small>Tình nghĩa — xong Chương 1: +{EMP.fengShui} Phong Thủy, +{EMP.neighbor} Nghĩa Xóm</small>
              </button>
              <button className={`${btn} flex-col px-3 py-1 text-left`} onClick={() => choose('PRAG')} data-testid="choose-PRAG">
                <b>🪙 "Mười mùa vụ nữa, ông sẽ mua lúa Hoàng Kim của tôi."</b>
                <small>Thực dụng — xong Chương 1: +{PRAG.gold} 🪙, +{PRAG.fengShui} Phong Thủy</small>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** Thanh hướng dẫn 8 bước của Bác Bảy (GP-62): tự xong theo trạng thái, ẩn được, không chặn việc khác. */
export function TutorialBar({ short }: { short: boolean }) {
  const save = useSliceStore((s) => s.save);
  const tut = useSliceStore((s) => s.tut);
  const setHidden = useSliceStore((s) => s.setTutorialHidden);
  const story = storyOf(save);
  if (!story.path) return null;
  const cur = currentTutorialStep({ save, moved: tut.moved, sold: tut.sold });
  const claimable = !cur && !story.claimed.includes(1);
  if (!cur && !claimable) return null;
  const style = { top: 'max(60px, calc(env(safe-area-inset-top) + 52px))', left: 'max(8px, env(safe-area-inset-left))' };
  if (tut.hidden) {
    return (
      <button className={`${btn} absolute text-xl`} style={style} onClick={() => setHidden(false)} aria-label="Hiện hướng dẫn">
        👴
      </button>
    );
  }
  return (
    <div
      // chạm xuyên qua thanh xuống bản đồ (thanh nằm trên vùng ruộng ở màn thấp); chỉ nút ✕ nhận chạm
      className={`vac-paper pointer-events-none absolute flex items-start gap-1 bg-[#f3e3c0]/90 p-1.5 text-xs ${short ? 'w-[220px]' : 'w-[300px]'}`}
      style={{ ...style, borderColor: WOOD_D }}
      data-testid="tutorial"
    >
      <div className="flex-1">
        {cur ? (
          <>
            <b>
              👴 Bác Bảy · Bước {cur.index + 1}/{SLICE_TUTORIAL.length}
            </b>
            {!short && <p className="italic">"{cur.step.speech}"</p>}
            <p className="font-bold">{cur.step.hint}</p>
          </>
        ) : (
          <>
            <b>👴 Bác Bảy</b>
            <p className="font-bold">📜 Nhà sửa xong rồi! Mở Gia Phả ở dưới màn hình để nhận thưởng Chương 1.</p>
          </>
        )}
      </div>
      <button className={`${btn} text-sm`} onClick={() => setHidden(true)} aria-label="Ẩn hướng dẫn">
        ✕
      </button>
    </div>
  );
}

function Hearts({ points }: { points: number }) {
  const h = heartsOf(points);
  const pct = h >= MAX_HEARTS ? 100 : Math.round(((points % HEART_POINTS) / HEART_POINTS) * 100);
  return (
    <div className="flex items-center gap-1 text-xs" data-testid="hearts">
      <span>
        ❤️ <b>{h}</b>/{MAX_HEARTS}
      </span>
      <div className="h-2 w-20 overflow-hidden rounded bg-[#d8c49b]">
        <div className="h-full bg-[#c85a32]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** Hộp thoại NPC (GP-50): lời vừa nói, tim, nói chuyện, tặng 1 món trong Kho. */
export function NpcDialogSheet() {
  const dialog = useSliceStore((s) => s.dialog);
  const save = useSliceStore((s) => s.save);
  const close = useSliceStore((s) => s.closeNpc);
  const talkTo = useSliceStore((s) => s.talkTo);
  const giftTo = useSliceStore((s) => s.giftTo);
  if (!dialog) return null;
  const def = NPCS[dialog.npcId];
  const st = npcOf(save, dialog.npcId);
  const items = Object.entries(save.inventory).filter(([, n]) => n > 0);
  return (
    <Sheet title={`${def.emoji} ${def.name}`} onClose={close}>
      <div className="text-xs" data-testid="npc-dialog">
        <Hearts points={st.points} />
        <p className="my-2 rounded border border-[#d8c49b] bg-[#fbf3df] p-2 text-sm">{dialog.line}</p>
        <button className={`${btn} mb-2 px-3`} onClick={() => talkTo(dialog.npcId)}>
          💬 Nói chuyện
        </button>
        <p className="mb-1">🎁 Tặng quà (mỗi ngày 1 món có tác dụng):</p>
        {items.length === 0 && <p className="opacity-80">Kho trống — gặt lúa hoặc dọn đá để có quà.</p>}
        <div className="flex flex-wrap gap-1">
          {items.map(([id, n]) => (
            <button key={id} className={`${btn} px-2`} onClick={() => giftTo(dialog.npcId, id)} data-testid={`gift-${id}`}>
              {itemLabel(id)} ×{n}
              {st.knownLikes.includes(id) && ' ❤️'}
              {st.knownDislikes.includes(id) && ' 💔'}
            </button>
          ))}
        </div>
      </div>
    </Sheet>
  );
}

/** Sổ Gia Phả (TG-30): Chương 1 của bản thử + quan hệ với NPC. */
export function GiaPhaPanel({ onClose }: { onClose: () => void }) {
  const save = useSliceStore((s) => s.save);
  const claim = useSliceStore((s) => s.claimChapter);
  const q = chapterQuest(1);
  const story = storyOf(save);
  const goals = chapterGoals(save, 1);
  const claimed = story.claimed.includes(1);
  const ready = goals.every((g) => g.done);
  const branch = story.path ? QUEST_BRANCH_REWARDS[story.path] : null;
  return (
    <Sheet title="📜 Sổ Gia Phả" onClose={onClose}>
      <div className="text-xs" data-testid="giapha">
        <b>Chương 1 · {q?.title}</b>
        <ul className="my-1">
          {goals.map((g) => (
            <li key={g.label}>
              {g.done ? '✅' : '⬜'} {g.label}
            </li>
          ))}
        </ul>
        <p>
          Thưởng: {(q?.rewardGold ?? 0) + (branch?.gold ?? 0)} 🪙, {q?.rewardGems} 💎, {QUEST_XP_REWARD} XP
          {branch ? `, +${branch.fengShui} Phong Thủy, +${branch.neighbor} Nghĩa Xóm` : ''}
        </p>
        {claimed ? (
          <p className="mt-1 font-bold">✅ Đã nhận thưởng Chương 1. Chương 2 mở ở bản sau.</p>
        ) : (
          <button
            className={`${btn} mt-1 px-3 font-bold ${ready ? '!bg-[#ffe28a]' : 'opacity-60'}`}
            onClick={() => claim(1)}
            data-testid="claim-ch1"
          >
            Nhận thưởng Chương 1
          </button>
        )}
        <p className="mt-2 font-bold">Quan hệ trong làng</p>
        {NPC_IDS.map((id) => (
          <div key={id} className="flex items-center justify-between py-0.5">
            <span>
              {NPCS[id].emoji} {NPCS[id].name}
            </span>
            <Hearts points={npcOf(save, id).points} />
          </div>
        ))}
        <p className="mt-1">🤝 Nghĩa Xóm: {story.neighbor}</p>
      </div>
    </Sheet>
  );
}
