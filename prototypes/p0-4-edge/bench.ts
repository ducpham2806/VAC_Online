// Đo độ trễ cục bộ: N lô tuần tự + 10 lô song song cùng người chơi (kiểm khóa lạc quan). Chạy bởi run-local.sh.
const URL_ = Deno.env.get('URL') ?? 'http://127.0.0.1:8000';
const N = Number(Deno.env.get('N') ?? 100);
const jwt = (sub: string) => `x.${btoa(JSON.stringify({ sub })).replace(/=+$/, '')}.x`;
const post = (sub: string, actions: unknown[]) =>
  fetch(URL_, { method: 'POST', headers: { authorization: `Bearer ${jwt(sub)}`, 'content-type': 'application/json' }, body: JSON.stringify({ actions }) }).then((r) => r.json());

const user = '00000000-0000-0000-0000-0000000000b1';
const times: number[] = [];
await post(user, [{ type: 'PLANT', tileId: 'T0', itemId: 'CROP_01' }]);
for (let i = 0; i < N; i++) {
  const t0 = performance.now();
  await post(user, [{ type: 'WATER', tileId: 'T0' }, { type: 'PLANT', tileId: 'T1', itemId: 'CROP_01' }]);
  times.push(performance.now() - t0);
}
times.sort((a, b) => a - b);
const pct = (p: number) => times[Math.min(times.length - 1, Math.floor((p / 100) * times.length))].toFixed(1);
console.log(`tuần tự ${N} lô: p50 ${pct(50)} ms, p95 ${pct(95)} ms, max ${times.at(-1)!.toFixed(1)} ms`);

// 10 lô song song: mỗi lô gieo 1 ô khác nhau → cả 10 phải thành công nhờ thử lại.
const par = '00000000-0000-0000-0000-0000000000b2';
await post(par, []); // tạo trạng thái
const res = await Promise.all(Array.from({ length: 3 }, (_, i) => post(par, [{ type: 'PLANT', tileId: `T${i}`, itemId: 'CROP_01' }])));
const ok = res.filter((r) => r.version).length;
const retries = res.reduce((s, r) => s + ((r.attempts ?? 1) - 1), 0);
const final = await post(par, []);
const planted = final.state.tiles.filter((t: { itemId: string | null }) => t.itemId).length;
console.log(`song song 3 lô: ${ok}/3 thành công, ${retries} lần thử lại, ${planted} ô đã gieo, vàng ${final.state.gold}`);
