/**
 * P1-11 — người mới làm theo thanh hướng dẫn Bác Bảy từ đầu tới nhận thưởng Chương 1 (GP-62, LT-12 "không kẹt").
 * Mỗi vòng: đọc bước đang làm, làm đúng việc gợi ý bằng thao tác người chơi (chạm / kéo / nút HUD),
 * kiểm bước chuyển tiếp. Chỉ "cho lúa chín ngay" là sửa thời gian trong store (kiểm thử).
 *   npx vite --port 5179 --strictPort &
 *   node tools/qa/p1-tutorial-smoke.cjs docs/screenshots [844x390]
 */
const { chromium } = require('playwright');
(async () => {
  const out = process.argv[2];
  const [w, h] = (process.argv[3] || '844x390').split('x').map(Number);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: true });
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('http://localhost:5179/?p1');
  await p.waitForFunction(() => window.__vacSlice && window.__vacSlice.sys.isActive() && window.__vacSliceStore, null, { timeout: 15000 });
  await p.getByTestId('intro-next').click(); await p.getByTestId('intro-next').click();
  await p.getByTestId('choose-PRAG').click();
  const step = () => p.evaluate(() => { const t = document.querySelector('[data-testid=tutorial]'); return t ? t.innerText.replace(/\n/g, ' ') : ''; });
  const idle = () => p.waitForFunction(() => !window.__vacSlice.debugState().moving, null, { timeout: 20000 });
  const tap = async (tx, ty) => { await p.evaluate(([x, y]) => window.__vacSlice.tapWorld(x * 32 + 16, y * 32 + 16), [tx, ty]); await p.waitForTimeout(200); await idle(); await p.waitForTimeout(250); };
  const confirm = async () => { await p.getByTestId('confirm-yes').click(); await p.waitForTimeout(250); };
  const log = [];
  const t0 = Date.now();
  for (let guard = 0; guard < 20; guard++) {
    const text = await step();
    log.push(text.slice(0, 70));
    if (!text) break;
    if (text.includes('Bước 1/')) {
      // joystick: kéo trong vùng góc dưới trái
      await p.mouse.move(80, h - 60); await p.mouse.down(); await p.mouse.move(140, h - 60, { steps: 5 });
      await p.waitForTimeout(700); await p.mouse.up();
    } else if (text.includes('Bước 2/')) await tap(6, 7);
    else if (text.includes('Bước 3/')) await tap(6, 7);
    else if (text.includes('Bước 4/')) {
      await p.evaluate(() => { const S = window.__vacSliceStore; const s = S.getState(); const n = Date.now();
        S.setState({ save: { ...s.save, tiles: s.save.tiles.map((t) => (t.itemId ? { ...t, matureAt: n - 1 } : t)) }, now: n }); });
      await tap(6, 7);
    } else if (text.includes('Bước 5/')) {
      await p.getByRole('button', { name: 'Kho' }).click(); await p.getByTestId('sell-CROP_01').click();
      await p.getByRole('button', { name: 'Đóng' }).click();
    } else if (text.includes('Bước 6/')) await tap(19, 10);
    else if (text.includes('Bước 7/')) {
      const da = await p.evaluate(() => window.__vacSliceStore.getState().save.inventory.MAT_DA ?? 0);
      if (da < 4) await tap(3, 12); else { await tap(18, 4); await confirm(); }
    } else if (text.includes('Bước 8/')) {
      const inv = await p.evaluate(() => window.__vacSliceStore.getState().save.inventory);
      if ((inv.MAT_GO ?? 0) < 6) await tap((inv.MAT_GO ?? 0) < 5 ? 6 : 4, (inv.MAT_GO ?? 0) < 5 ? 2 : 15);
      else { await tap(12, 4); await confirm(); }
    } else if (text.includes('Gia Phả')) {
      await p.screenshot({ path: `${out}/p1-11-tutorial-done-${w}x${h}.png` });
      await p.getByRole('button', { name: 'Gia Phả' }).click(); await p.getByTestId('claim-ch1').click();
      await p.waitForTimeout(300); await p.getByRole('button', { name: 'Đóng' }).click();
    }
    if (guard === 2) await p.screenshot({ path: `${out}/p1-11-tutorial-${w}x${h}.png` });
  }
  const s = await p.evaluate(() => { const s = window.__vacSliceStore.getState().save; return { gold: s.gold, gems: s.gems, lv: s.level, st: s.stamina, story: s.story }; });
  console.log(JSON.stringify(log, null, 1));
  console.log('ket-qua', JSON.stringify(s), 'giay-that', Math.round((Date.now() - t0) / 1000));
  // P1-12: nhật ký chơi thử ghi đủ phiên, các bước hướng dẫn tới DONE, cấp, thao tác (LT-13)
  const pt = await p.evaluate(() => { const l = window.__vacPlaytest(); return { sessions: l.session, steps: l.events.filter((e) => e.type === 'TUTORIAL').map((e) => e.name),
    levels: l.events.filter((e) => e.type === 'LEVEL').map((e) => e.value), actions: [...new Set(l.events.filter((e) => e.type === 'ACTION').map((e) => e.name))] }; });
  console.log('nhat-ky-choi-thu', JSON.stringify(pt), pt.steps.at(-1) === 'DONE' && pt.actions.includes('PLANT') ? 'PASS' : 'FAIL');
  console.log(errs.join('\n') || 'no page errors');
  await b.close();
})();
