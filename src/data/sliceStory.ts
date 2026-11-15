/**
 * Lời cảnh mở đầu bản thử (TG-40, QD-84). Dùng chung cho HUD Phaser và bản Godot (LT-14)
 * qua `scripts/export-godot-estate.ts`, để hai client không lệch lời thoại.
 */
import type { StoryPath } from '../domain/story';
import { chapterQuest } from '../domain/story';

export const INTRO_TITLE = 'Bức Thư Trong Chiếc Tráp Gỗ Lim';

export interface IntroPage {
  /** Chân dung: `public/assets/portraits/<portrait>.png`. */
  portrait: string;
  who: string;
  text: string;
}

export const INTRO_PAGES: readonly IntroPage[] = [
  {
    portrait: 'bacbay',
    who: '👴 Bác Trưởng Thôn Bảy',
    text: 'Cháu về rồi đấy à. Ông nội cháu dặn bác giữ cái tráp gỗ lim này: cuốn Sổ Gia Phả, túi thóc giống tổ tiên, và tờ khế ước. Nhà cửa đổ nát cả, nhưng đất vẫn còn.',
  },
  { portrait: 'bakien', who: '🎩 Thương Nhân Bá Kiến', text: `Hừm… ${chapterQuest(1)?.npcQuote ?? ''}` },
];

export const INTRO_QUESTION = 'Cháu trả lời Bá Kiến thế nào?';

export const INTRO_CHOICES: Readonly<Record<StoryPath, { icon: string; quote: string; tone: string }>> = {
  EMP: { icon: '🤝', quote: '"Cháu tự cày trả sạch nợ, đất này không bán."', tone: 'Tình nghĩa' },
  PRAG: { icon: '🪙', quote: '"Mười mùa vụ nữa, ông sẽ mua lúa Hoàng Kim của tôi."', tone: 'Thực dụng' },
};
