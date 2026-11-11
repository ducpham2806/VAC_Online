/**
 * Kiểm thử khói bản thử P1 (?p1): đi tới, gieo/tưới/gặt cả loạt, nút hành động, Kho bán HTX, thanh công cụ,
 * công tắc 4 mùa (P1-6), tải lại trang giữ tiến trình (P1-7), điền trang: dọn đá/gốc cây, sửa giếng/chuồng/nhà,
 * khai hoang, giếng mở tưới cả loạt (P1-10), cảnh mở đầu + Gia Phả Chương 1 + NPC (P1-11),
 * chụp 1280x720 + 844x390 và báo nút < 44 px (UI-01).
 *   npx vite --port 5179 --strictPort &   (cần DEV để có window.__vacSlice)
 *   node tools/qa/p1-slice-smoke.cjs docs/screenshots
 * Bước "cho chín ngay" sửa mốc thời gian trong store — chỉ dùng trong kiểm thử.
 */
const { chromium } = require('playwright');
(async () => {
  const out = process.argv[2];
  const b = await chromium.launch();
  const errs = [];
  for (const [w, h] of [[1280, 720], [844, 390]]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: true });
    p.on('pageerror', (e) => errs.push(`${w} PAGEERROR: ${e.message}`));
    p.on('console', (m) => { if (m.type() === 'error') errs.push(`${w}: ${m.text()}`); });
    await p.goto('http://localhost:5179/?p1&offline');
    await p.waitForFunction(() => window.__vacSlice && window.__vacSlice.sys.isActive() && window.__vacSliceStore, null, { timeout: 15000 });
    await p.waitForTimeout(500);
    // P1-11: cảnh mở đầu (TG-40) — đọc 2 trang rồi chọn tình nghĩa
    await p.getByTestId('intro-next').click(); await p.getByTestId('intro-next').click();
    if (w === 844) await p.screenshot({ path: `${out}/p1-11-intro-${w}x${h}.png` });
    await p.getByTestId('choose-EMP').click(); await p.waitForTimeout(200);
    const toScreen = (tx, ty) => p.evaluate(([tx, ty]) => { const c = window.__vacSlice.cameras.main;
      return { x: (tx * 32 + 16 - c.worldView.x) * c.zoom, y: (ty * 32 + 16 - c.worldView.y) * c.zoom }; }, [tx, ty]);
    const st = () => p.evaluate(() => { const s = window.__vacSliceStore.getState(); return { gold: s.save.gold, inv: s.save.inventory,
      plots: s.save.tiles.map((t) => (t.itemId ? (t.watered ? 'W' : 'P') : '.')).join(''), toast: s.toasts.at(-1)?.text, me: s.playerTile }; });
    const log = [];
    const est = () => p.evaluate(() => { const s = window.__vacSliceStore.getState(); return { gold: s.save.gold, st: s.save.stamina,
      inv: s.save.inventory, e: s.save.estate, fs: s.save.fengShuiScore, tiles: s.save.tiles.length, toast: s.toasts.at(-1)?.text }; });
    // chạm đối tượng ở ô (tx, ty) như người chơi, đợi tới khi điều kiện trên store đúng (đi tới rồi làm)
    const tapUntil = async (tx, ty, cond, arg) => {
      const r = await toScreen(tx, ty);
      // ngoài màn hoặc rơi vào vùng joystick (UI-20: chạm ở đó là cần điều khiển, không phải chạm ô)
      const onCanvas = r.x >= 0 && r.y >= 0 && r.x <= w && r.y <= h && (await p.evaluate(([x, y]) => document.elementFromPoint(x, y)?.tagName === 'CANVAS', [r.x, r.y]));
      // ô bị nút HUD che → chạm thẳng vào thế giới (như người chơi kéo bản đồ rồi chạm)
      if (!onCanvas || (r.x < w / 3 && r.y > h * 0.6)) await p.evaluate(([tx, ty]) => window.__vacSlice.tapWorld(tx * 32 + 16, ty * 32 + 16), [tx, ty]);
      else await p.mouse.click(r.x, r.y);
      await p.waitForFunction(cond, arg, { timeout: 15000 }).catch(async (e) => {
        console.log('tapUntil', tx, ty, JSON.stringify(r), JSON.stringify(await est()), JSON.stringify(await p.evaluate(() => window.__vacSlice.debugState())));
        throw e;
      });
      await p.waitForTimeout(150);
    };
    const cleared = (id) => window.__vacSliceStore.getState().save.estate.cleared.includes(id);
    const pendingOpen = () => !!window.__vacSliceStore.getState().pending;
    // 0) chạm đất (13,9) để đi lại gần ruộng (camera theo)
    let s = await toScreen(13, 9); await p.mouse.click(s.x, s.y); await p.waitForTimeout(2500);
    // 1) chạm ô ruộng xa (5,7) → đi tới rồi gieo
    s = await toScreen(5, 7); await p.mouse.click(s.x, s.y); await p.waitForTimeout(3500); log.push(['tap-far', await st()]);
    // 2) kéo qua các ô còn lại (6,7)→(7,7)→(7,8)→(5,8) → gieo cả loạt
    const pts = [[6, 7], [7, 7], [7, 8], [6, 8], [5, 8]];
    s = await toScreen(...pts[0]); await p.mouse.move(s.x, s.y); await p.mouse.down();
    for (const q of pts.slice(1)) { const r = await toScreen(...q); await p.mouse.move(r.x, r.y, { steps: 5 }); }
    await p.mouse.up(); await p.waitForTimeout(300); log.push(['drag-plant', await st()]);
    // 3) kéo tưới cả loạt
    s = await toScreen(5, 7); await p.mouse.move(s.x, s.y); await p.mouse.down();
    for (const q of [[6, 7], [7, 7], [7, 8], [6, 8], [5, 8]]) { const r = await toScreen(...q); await p.mouse.move(r.x, r.y, { steps: 5 }); }
    await p.mouse.up(); await p.waitForTimeout(400); log.push(['drag-water-well-broken', await st()]);
    // 3b) P1-10: dọn 2 tảng đá (6 Đá) → sửa giếng (hỏi lại) → kéo tưới lại được cả loạt
    if (w === 1280) await p.screenshot({ path: `${out}/p1-10-before-${w}x${h}.png` });
    await tapUntil(19, 10, cleared, 'R_19_10');
    await tapUntil(3, 12, cleared, 'R_3_12');
    await tapUntil(18, 4, pendingOpen);
    await p.screenshot({ path: `${out}/p1-10-confirm-${w}x${h}.png` });
    await p.getByTestId('confirm-yes').click(); await p.waitForTimeout(300); log.push(['repair-well', await est()]);
    // gốc cây → gỗ → chuồng gà và nhà
    await tapUntil(6, 2, cleared, 'T_5_1');
    await tapUntil(4, 15, cleared, 'T_3_15');
    await tapUntil(22, 1, cleared, 'T_22_1');
    await tapUntil(18, 12, pendingOpen); await p.getByTestId('confirm-yes').click(); await p.waitForTimeout(200);
    await tapUntil(12, 4, pendingOpen); await p.getByTestId('confirm-yes').click(); await p.waitForTimeout(200);
    log.push(['repair-coop-house', await est()]);
    // khai hoang vùng 1
    await tapUntil(9, 7, pendingOpen); await p.getByTestId('confirm-yes').click(); await p.waitForTimeout(300);
    log.push(['reclaim-1', await est()]);
    // P1-11: Gia Phả — chưa gặt nên chưa nhận được; nói chuyện + tặng Gỗ cho Cô Hương
    await p.getByRole('button', { name: 'Gia Phả' }).click(); await p.waitForTimeout(200);
    log.push(['giapha-goals', await p.getByTestId('giapha').innerText().then((t) => t.split('\n').filter((l) => /^[✅⬜]/.test(l)).join(' | '))]);
    await p.getByRole('button', { name: 'Đóng' }).click();
    await tapUntil(21, 10, () => !!window.__vacSliceStore.getState().dialog);
    await p.getByTestId('gift-MAT_GO').click(); await p.waitForTimeout(200);
    log.push(['npc-huong', await p.getByTestId('npc-dialog').innerText().then((t) => t.replace(/\n/g, ' ').slice(0, 160))]);
    await p.screenshot({ path: `${out}/p1-11-npc-${w}x${h}.png` });
    await p.getByRole('button', { name: 'Đóng' }).click();
    // quay lại ruộng, kéo tưới cả loạt (giếng đã sửa)
    await p.evaluate(() => window.__vacSlice.tapWorld(4 * 32 + 16, 8 * 32 + 16)); // cỏ sát ruộng
    await p.waitForFunction(() => !window.__vacSlice.debugState().moving, null, { timeout: 15000 }); await p.waitForTimeout(200);
    s = await toScreen(5, 7); await p.mouse.move(s.x, s.y); await p.mouse.down();
    for (const q of [[6, 7], [7, 7], [7, 8], [6, 8], [5, 8]]) { const r = await toScreen(...q); await p.mouse.move(r.x, r.y, { steps: 5 }); }
    await p.mouse.up(); await p.waitForTimeout(400); log.push(['drag-water-well-ok', await st()]);
    await p.screenshot({ path: `${out}/p1-10-after-${w}x${h}.png` });
    await p.screenshot({ path: `${out}/p1-4-growing-${w}x${h}.png` });
    // 4) cho chín ngay (chỉ trong kiểm thử): lùi mốc thời gian của ô
    await p.evaluate(() => { const S = window.__vacSliceStore; const s = S.getState(); const n = Date.now();
      S.setState({ save: { ...s.save, tiles: s.save.tiles.map((t) => ({ ...t, plantedAt: n - 200000, matureAt: n - 1 })) }, now: n }); });
    await p.waitForTimeout(400);
    await p.screenshot({ path: `${out}/p1-4-ripe-${w}x${h}.png` });
    // 5) nút hành động gặt 1 ô, rồi kéo gặt phần còn lại
    await p.getByTestId('action-btn').click(); await p.waitForTimeout(300); log.push(['action-btn', await st()]);
    // kéo bắt đầu từ ô còn chín (ô vừa gặt bằng nút đã trống; GP-02: công cụ chốt theo ô đầu)
    s = await toScreen(7, 8); await p.mouse.move(s.x, s.y); await p.mouse.down();
    for (const q of [[7, 7], [6, 7], [5, 7], [5, 8], [6, 8]]) { const r = await toScreen(...q); await p.mouse.move(r.x, r.y, { steps: 5 }); }
    await p.mouse.up(); await p.waitForTimeout(300); log.push(['drag-harvest', await st()]);
    // 5b) P1-11: đủ mục tiêu (tưới, gặt, sửa nhà) → nhận thưởng Chương 1
    await p.getByRole('button', { name: 'Gia Phả' }).click(); await p.waitForTimeout(200);
    await p.getByTestId('claim-ch1').click(); await p.waitForTimeout(300);
    log.push(['claim-ch1', await est()]);
    await p.screenshot({ path: `${out}/p1-11-giapha-${w}x${h}.png` });
    await p.getByRole('button', { name: 'Đóng' }).click();
    // 6) Kho → bán HTX
    await p.getByRole('button', { name: 'Kho' }).click(); await p.waitForTimeout(300);
    await p.screenshot({ path: `${out}/p1-5-kho-${w}x${h}.png` });
    await p.getByTestId('sell-CROP_01').click(); await p.waitForTimeout(300); log.push(['sell', await st()]);
    await p.getByRole('button', { name: 'Đóng' }).click();
    // 7) mở thanh công cụ
    await p.getByRole('button', { name: 'Thanh công cụ' }).click(); await p.waitForTimeout(200);
    await p.screenshot({ path: `${out}/p1-5-hud-${w}x${h}.png` });
    await p.getByRole('button', { name: 'Thanh công cụ' }).click(); // thu lại
    // 8) công tắc mùa (P1-6): chụp từng mùa
    for (const [name, key] of [['Mùa Hạ', 'ha'], ['Mùa Thu', 'thu'], ['Mùa Đông', 'dong']]) {
      await p.getByRole('button', { name: 'Cài đặt' }).click();
      await p.getByRole('button', { name }).click();
      await p.getByRole('button', { name: 'Đóng' }).click();
      await p.waitForTimeout(300);
      const shown = await p.evaluate(() => window.__vacSlice.shownSeason());
      log.push(['season-' + key, shown, await p.getByTestId('season').innerText()]);
      if (w === 1280) await p.screenshot({ path: `${out}/p1-6-${key}-${w}x${h}.png` });
    }
    await p.getByRole('button', { name: 'Túi hạt' }).click(); await p.waitForTimeout(200);
    log.push(['seeds-dong', (await p.locator('text=Chưa có giống nào').count()) > 0]);
    await p.getByRole('button', { name: 'Đóng' }).click();
    await p.getByRole('button', { name: 'Cài đặt' }).click();
    if (w === 844) await p.screenshot({ path: `${out}/p1-6-settings-${w}x${h}.png` });
    await p.getByRole('button', { name: 'Lịch thật' }).click();
    await p.getByRole('button', { name: 'Đóng' }).click();
    // 9) gieo 1 ô rồi tải lại trang (P1-7)
    s = await toScreen(5, 7); await p.mouse.click(s.x, s.y); await p.waitForTimeout(800);
    const before = await st();
    await p.reload();
    await p.waitForFunction(() => window.__vacSlice && window.__vacSlice.sys.isActive() && window.__vacSliceStore, null, { timeout: 15000 });
    await p.waitForTimeout(300);
    const after = await st();
    log.push(['reload-kept', before.gold === after.gold && before.plots === after.plots, before.plots, after.plots, after.gold]);
    // kiểm cỡ nút
    const small = await p.evaluate(() => [...document.querySelectorAll('button')].map((b) => { const r = b.getBoundingClientRect(); return [b.getAttribute('aria-label') || b.textContent.trim(), Math.round(r.width), Math.round(r.height)]; }).filter(([, w, h]) => w < 44 || h < 44));
    console.log(w, h, JSON.stringify(log), 'nut<44:', JSON.stringify(small));
  }
  console.log(errs.join('\n') || 'no page errors');
  await b.close();
})();
