/**
 * Kiểm thử khói P1-8 (QD-89): bản thử `?p1` chơi ONLINE với project Supabase thật.
 * CHÚ Ý: mỗi lần chạy tạo 1 người chơi ẩn danh thật trên DB (farm_states, ledger, playtest_events).
 *   npx vite --port 5179 --strictPort &
 *   node tools/qa/p1-8-online-smoke.cjs <thư mục ảnh>
 * Kiểm: đăng nhập ẩn danh → ONLINE; gieo/tưới gửi lên server; xóa bản lưu trên máy rồi tải lại vẫn lấy lại được
 * tiến trình từ server; nhật ký chơi thử gửi lên (đợi chu kỳ 30 s).
 */
const { chromium } = require('playwright');
(async () => {
  const out = process.argv[2] || '.';
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined;
  const b = await chromium.launch({ proxy });
  const p = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true });
  const errs = [];
  let fail = 0;
  const check = (name, cond, extra = '') => { if (!cond) fail++; console.log(`${cond ? 'OK  ' : 'FAIL'} ${name} ${extra}`); };
  p.on('pageerror', (e) => errs.push(`PAGEERROR: ${e.message}`));
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  const S = (f, a) => p.evaluate(f, a);
  const ready = () => p.waitForFunction(() => window.__vacSlice && window.__vacSliceStore, null, { timeout: 20000 });
  const online = () => p.waitForFunction(() => window.__vacSliceStore.getState().net === 'ONLINE', null, { timeout: 20000 });
  const drained = () => p.waitForFunction(() => (localStorage.getItem('vac_slice_queue_v1') ?? '[]') === '[]' && window.__vacSliceStore.getState().net === 'ONLINE', null, { timeout: 20000 });

  await p.goto('http://localhost:5179/?p1');
  await ready();
  await online();
  check('đăng nhập ẩn danh → ONLINE', true);
  await p.getByTestId('intro-next').click(); await p.getByTestId('intro-next').click(); await p.getByTestId('choose-EMP').click();
  const plot = await S(() => window.__vacSliceStore.getState().save.tiles.find((t) => t.zoneType === 'LAND').id);
  const [x, y] = plot.slice(1).split('_').map(Number);
  await S(([x, y]) => window.__vacSlice.tapWorld(x * 32 + 16, y * 32 + 16), [x, y]);
  await p.waitForFunction((id) => window.__vacSliceStore.getState().save.tiles.find((t) => t.id === id)?.itemId === 'CROP_01', plot, { timeout: 20000 });
  await drained();
  const before = await S(() => { const s = window.__vacSliceStore.getState().save; return { gold: s.gold, path: s.story?.path }; });
  check('gieo Lúa đã gửi server (hàng chờ trống)', before.gold === 2498 && before.path === 'EMP', JSON.stringify(before));
  // Bỏ bản lưu trên máy (giữ phiên đăng nhập) → tải lại phải lấy lại tiến trình từ server
  await S(() => localStorage.removeItem('vac_slice_save_v1'));
  await p.reload(); await ready(); await online();
  await p.waitForFunction(() => window.__vacSliceStore.getState().save.story?.path === 'EMP', null, { timeout: 20000 }).catch(() => undefined);
  const after = await S((id) => { const s = window.__vacSliceStore.getState().save; return { gold: s.gold, path: s.story?.path, tile: s.tiles.find((t) => t.id === id)?.itemId }; }, plot);
  check('tải lại không có bản lưu máy → lấy từ server', after.gold === 2498 && after.path === 'EMP' && after.tile === 'CROP_01', JSON.stringify(after));
  const st = await p.getByRole('button', { name: 'Cài đặt' }).click().then(() => p.getByTestId('online-note').isVisible());
  check('online: Cài đặt không có công tắc mùa / chơi lại', st && (await p.getByTestId('season-switch').count()) === 0);
  await p.screenshot({ path: `${out}/p1-8-online-settings-844x390.png` });
  await p.getByRole('button', { name: 'Đóng' }).click();
  const code = await S(() => window.__vacPlaytest().player);
  await p.waitForTimeout(33000); // chu kỳ gửi nhật ký chơi thử
  const sent = await S(() => window.__vacPlaytest().sent);
  check('nhật ký chơi thử đã gửi server', sent > 0, `sent=${sent}`);
  console.log('player', code);
  check('không lỗi JS', errs.length === 0, errs.join('\n'));
  await b.close();
  process.exit(fail ? 1 : 0);
})();
