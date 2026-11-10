/**
 * Bố cục điền trang bản thử (LT-03, GP-14): dữ liệu thuần, dùng chung cho scene (vẽ, tìm đường)
 * và engine (dọn chướng ngại, sửa hạng mục, khai hoang — `src/domain/estate.ts`).
 *
 * Ký hiệu:
 *  .  cỏ             ,  sân chuồng gà (hạng mục COOP)   F  ô ruộng đã cuốc
 *  w  đất hoang (khai hoang theo vùng, KT-15)
 *  #  bờ rào/bụi     H  nhà (hạng mục HOUSE)            W  giếng (hạng mục WELL)
 *  P  ao             T  gốc cây xoan (một cụm = 1 cây)  R  đá
 *  D  cây đa cổ thụ đầu làng (không chặt, chỉ chắn lối)
 *  K  Bếp Củi (hạng mục KITCHEN, P1-9)
 *  S  chỗ xuất hiện  (đi được)
 */
export const ESTATE_ROWS: readonly string[] = [
  '##############################',
  '#....TTT..............TTT....#',
  '#....TTT...HHHH.KK....TTT.DDD#',
  '#....TTT...HHHH.KK........DDD#',
  '#..........HHHH...WW.........#',
  '#.................WW.....PPPP#',
  '#.......................PPPPP#',
  '#....FFFwwww............PPPPP#',
  '#....FFFwwww.....S.......PPPP#',
  '#....wwwwwww.................#',
  '#....wwwwwww.......R.........#',
  '#............................#',
  '#..R..............,,,,,,.....#',
  '#.................,,,,,,.....#',
  '#.................,,,,,,..R..#',
  '#..TTT............,,,,,,.....#',
  '#..TTT.......................#',
  '##############################',
];

/** Ký hiệu gốc trên bố cục; ngoài biên trả `#`. */
export function layoutCharAt(x: number, y: number): string {
  if (y < 0 || y >= ESTATE_ROWS.length || x < 0 || x >= ESTATE_ROWS[0].length) return '#';
  return ESTATE_ROWS[y][x];
}
