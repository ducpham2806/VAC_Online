/**
 * NPC có tim của bản thử (QD-84, GP-50, `docs/02` TG-20). Dữ liệu thuần: tên, chỗ đứng, sở thích, lời thoại.
 * Sở thích chỉ hiện cho người chơi sau khi tặng thử (GP-50 "chỉ hiện sở thích đã phát hiện").
 */
export type NpcId = 'BAC_BAY' | 'CO_HUONG';

export interface NpcDef {
  id: NpcId;
  name: string;
  emoji: string;
  /** Khung hình trong atlas `world` (tạm tới khi có art thật). */
  frame: string;
  tile: { x: number; y: number };
  likes: readonly string[];
  dislikes: readonly string[];
  /** Lời chào theo số tim: phần tử i dùng khi tim ≥ ngưỡng i×2 (0, 2, 4…). */
  lines: readonly string[];
  /** Cảnh ngắn mở khi đạt 2 tim (GP-50). */
  event2: string;
}

export const NPCS: Record<NpcId, NpcDef> = {
  BAC_BAY: {
    id: 'BAC_BAY',
    name: 'Bác Trưởng Thôn Bảy',
    emoji: '👴',
    frame: 'bacbay_idle_0',
    tile: { x: 16, y: 6 },
    likes: ['CROP_01'],
    dislikes: [],
    lines: [
      'Nắng tốt dưa, mưa tốt lúa, ra đồng thôi cháu ơi!',
      'Cháu chăm thế này, ông nội cháu trên kia chắc mát lòng lắm.',
    ],
    event2:
      'Bác Bảy ngồi xuống bờ giếng: "Ngày xưa ông cháu với bác cùng gánh lúa qua cầu tre. Bão năm ấy cuốn mất cả vụ, ông vẫn cười bảo: đất còn thì người còn." Bác dúi vào tay cháu nắm thóc giống cũ.',
  },
  CO_HUONG: {
    id: 'CO_HUONG',
    name: 'Cô Giáo Hương',
    emoji: '👩‍🏫',
    frame: 'farmer_f_idle_0',
    tile: { x: 21, y: 10 },
    likes: ['CROP_02'],
    dislikes: ['MAT_DA'],
    lines: [
      'Chào anh, em dạy ở trường làng đầu xóm. Học trò em hay ghé xem ruộng nhà mình đấy.',
      'Bọn trẻ cứ hỏi bao giờ lúa nhà anh chín để ra xem gặt.',
    ],
    event2:
      'Cô Hương đưa anh xấp giấy vẽ của học trò: cánh đồng, cái giếng, và một người đội nón lá đang cấy. "Tụi nhỏ vẽ anh đó. Em giữ một tờ nhé."',
  },
};

export const NPC_IDS = Object.keys(NPCS) as NpcId[];

/** NPC đứng ở ô (x, y), nếu có. */
export function npcAt(x: number, y: number): NpcId | undefined {
  return NPC_IDS.find((id) => NPCS[id].tile.x === x && NPCS[id].tile.y === y);
}
