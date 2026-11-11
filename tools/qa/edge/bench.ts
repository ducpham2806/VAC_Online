// Kiểm + đo `apply-actions`: URL, TOKEN (thật) hoặc header x-test-user (cục bộ). In p50/p95 và kiểm luật cơ bản.
const URL = Deno.env.get('URL') ?? 'http://127.0.0.1:8787';
const N = Number(Deno.env.get('N') ?? 100);
const headers = (user: string): HeadersInit => {
  const token = Deno.env.get('TOKEN');
  const apikey = Deno.env.get('APIKEY');
  return {
    'content-type': 'application/json',
    ...(token ? { authorization: `Bearer ${token}` } : { 'x-test-user': user }),
    ...(apikey ? { apikey } : {}),
    ...(Deno.env.get('REGION') ? { 'x-region': Deno.env.get('REGION') as string } : {}),
  };
};
async function call(user: string, actions: unknown) {
  const t = performance.now();
  const r = await fetch(URL, { method: 'POST', headers: headers(user), body: JSON.stringify({ actions }) });
  return { ms: performance.now() - t, status: r.status, body: await r.json() };
}
const fail = (m: string) => { console.log('FAIL', m); Deno.exit(1); };
const U = Deno.env.get('USER_A') ?? '00000000-0000-0000-0000-0000000000c1';

const bad = await call(U, [{ type: 'SET_GOLD', gold: 1e9 }]);
if (bad.status !== 400) fail(`lô sai dạng phải 400, ra ${bad.status}`);
if (!Deno.env.get('TOKEN')) {
  const r = await fetch(URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"actions":[]}' });
  await r.body?.cancel();
  if (r.status !== 401) fail(`không danh tính phải 401, ra ${r.status}`);
}
const first = await call(U, []);
if (first.status !== 200) fail(`tải trạng thái: ${first.status} ${JSON.stringify(first.body)}`);
const plot = first.body.state.tiles.find((t: { zoneType: string; itemId: string | null }) => t.zoneType === 'LAND' && !t.itemId)?.id;
const p = await call(U, [{ type: 'PLANT', tileId: plot, itemId: 'CROP_01' }, { type: 'PLANT', tileId: plot, itemId: 'CROP_08' }]);
if (!(p.body.results?.[0]?.ok && !p.body.results?.[1]?.ok)) fail(`gieo: ${JSON.stringify(p.body.results)}`);

const ms: number[] = [];
const srv: number[] = [];
const auth: number[] = [];
for (let i = 0; i < N; i++) {
  const r = await call(U, [{ type: 'TALK', npcId: 'BAC_BAY' }, { type: 'REFRESH_ORDERS' }]);
  if (r.status !== 200) fail(`lô ${i}: ${r.status}`);
  ms.push(r.ms);
  if (r.body.ms) {
    srv.push(r.body.ms.total);
    auth.push(r.body.ms.auth);
  }
}
const pct = (xs: number[], x: number) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(x * s.length))]?.toFixed(1) ?? '-';
};
console.log(`${N} lô tuần tự, tính cả mạng từ máy đo: p50 ${pct(ms, 0.5)} ms, p95 ${pct(ms, 0.95)} ms, max ${pct(ms, 1)} ms`);
if (srv.length) console.log(`xử lý trên server: p50 ${pct(srv, 0.5)} ms, p95 ${pct(srv, 0.95)} ms (trong đó kiểm token p50 ${pct(auth, 0.5)} ms)`);
const par = await Promise.all([0, 1, 2].map(() => call(U, [{ type: 'REFRESH_ORDERS' }])));
console.log(`3 lô song song: ${par.map((r) => r.status).join(',')}, thử lại ${par.map((r) => r.body.attempts).join(',')}`);
if (par.some((r) => r.status !== 200)) fail('song song');
console.log('bench PASS');
