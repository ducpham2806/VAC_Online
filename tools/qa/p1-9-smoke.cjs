/**
 * Kiểm thử khói P1-9 (?p1): chỗ nuôi gà/vịt/cá, Bếp Củi (nấu, lấy món, Nồi Đất, ăn), bảng đơn HTX.
 * Chạm như người chơi (đi tới rồi làm); chỉ dựng sẵn cấp / vàng / Kho và cho chín ngay bằng store (kiểm thử).
 *   npx vite --port 5179 --strictPort &   (cần DEV để có window.__vacSlice)
 *   node tools/qa/p1-9-smoke.cjs docs/screenshots
 */
const { chromium } = require('playwright');
(async () => {
  const out = process.argv[2] || '.';
  const b = await chromium.launch();
  const errs = [];
  let fail = 0;
  const check = (name, cond, extra = '') => {
    if (!cond) fail++;
    console.log(`${cond ? 'OK  ' : 'FAIL'} ${name} ${extra}`);
  };
  for (const [w, h] of [[1280, 720], [844, 390]]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: true });
    p.on('pageerror', (e) => errs.push(`${w} PAGEERROR: ${e.message}`));
    p.on('console', (m) => { if (m.type() === 'error') errs.push(`${w}: ${m.text()}`); });
    await p.goto('http://localhost:5179/?p1');
    await p.evaluate(() => localStorage.clear());
    await p.reload();
    await p.waitForFunction(() => window.__vacSlice && window.__vacSlice.sys.isActive() && window.__vacSliceStore, null, { timeout: 15000 });
    await p.getByTestId('intro-next').click(); await p.getByTestId('intro-next').click();
    await p.getByTestId('choose-EMP').click(); await p.waitForTimeout(200);
    // dựng sẵn: cấp 5, đủ vàng + vật liệu, ẩn hướng dẫn
    await p.evaluate(() => {
      const S = window.__vacSliceStore; const s = S.getState();
      S.setState({ save: { ...s.save, level: 5, gold: 5000, stamina: 20, inventory: { MAT_GO: 8, MAT_DA: 4, CROP_01: 10 } } });
      s.setTutorialHidden(true);
    });
    const S = (f) => p.evaluate(f);
    const tile = (id) => S(new Function(`return window.__vacSliceStore.getState().save.tiles.find((t) => t.id === '${id}')`));
    const toScreen = (tx, ty) => p.evaluate(([tx, ty]) => { const c = window.__vacSlice.cameras.main;
      return { x: (tx * 32 + 16 - c.worldView.x) * c.zoom, y: (ty * 32 + 16 - c.worldView.y) * c.zoom }; }, [tx, ty]);
    const tapUntil = async (tx, ty, cond, arg) => {
      const r = await toScreen(tx, ty);
      const onCanvas = r.x >= 0 && r.y >= 0 && r.x <= w && r.y <= h && (await p.evaluate(([x, y]) => document.elementFromPoint(x, y)?.tagName === 'CANVAS', [r.x, r.y]));
      if (!onCanvas || (r.x < w / 3 && r.y > h * 0.6)) await p.evaluate(([tx, ty]) => window.__vacSlice.tapWorld(tx * 32 + 16, ty * 32 + 16), [tx, ty]);
      else await p.mouse.click(r.x, r.y);
      await p.waitForFunction(cond, arg, { timeout: 15000 }).catch(async (e) => {
        console.log('tapUntil', tx, ty, JSON.stringify(await S(() => { const s = window.__vacSliceStore.getState(); return { me: s.playerTile, toast: s.toasts.at(-1)?.text }; })));
        throw e;
      });
      await p.waitForTimeout(150);
    };
    const ripe = () => S(() => { const X = window.__vacSliceStore; const s = X.getState(); const n = Date.now();
      X.setState({ save: { ...s.save, tiles: s.save.tiles.map((t) => (t.itemId ? { ...t, plantedAt: n - 9e6, matureAt: n - 1 } : t)) }, now: n }); });

    // 0) ruộng đủ 5 cây bản thử ở các giai đoạn (ảnh PO P1-9) — chỉ để chụp
    await S(() => { const X = window.__vacSliceStore; const s = X.getState(); const n = Date.now(); const ids = ['CROP_01', 'CROP_02', 'CROP_03', 'CROP_04', 'CROP_05'];
      let k = 0; X.setState({ save: { ...s.save, tiles: s.save.tiles.map((t) => (t.zoneType !== 'LAND' ? t : (() => { const i = k++;
        return { ...t, itemId: ids[i % 5], plantedAt: n - (i % 4) * 100000 - 1, matureAt: n - (i % 4) * 100000 + 300000, watered: i % 2 === 0 }; })())) }, now: n }); });
    await p.evaluate(() => window.__vacSlice.tapWorld(8 * 32 + 16, 6 * 32 + 16));
    await p.waitForFunction(() => !window.__vacSlice.debugState().moving, null, { timeout: 15000 }); await p.waitForTimeout(400);
    await p.screenshot({ path: `${out}/p1-9-crops-${w}x${h}.png` });
    await S(() => { const X = window.__vacSliceStore; const s = X.getState(); X.setState({ save: { ...s.save, tiles: s.save.tiles.map((t) => (t.zoneType === 'LAND' ? { ...t, itemId: null, plantedAt: null, matureAt: null, watered: false } : t)) } }); });
    // 1) sửa Chuồng gà (chạm sân) → hỏi lại → đồng ý → 4 chỗ gà
    await tapUntil(18, 13, () => !!window.__vacSliceStore.getState().pending);
    await p.getByTestId('confirm-yes').click(); await p.waitForTimeout(200);
    const hens = await S(() => window.__vacSliceStore.getState().save.tiles.filter((t) => t.zoneType === 'COOP').length);
    check('sửa chuồng → 4 chỗ gà', hens === 4, hens);
    // 2) thả gà, vịt, cá bằng chạm
    await tapUntil(20, 13, () => window.__vacSliceStore.getState().save.tiles.find((t) => t.id === 'P20_13')?.itemId === 'ANI_01');
    await tapUntil(21, 14, () => window.__vacSliceStore.getState().save.tiles.find((t) => t.id === 'P21_14')?.itemId === 'ANI_01');
    await tapUntil(25, 8, () => window.__vacSliceStore.getState().save.tiles.find((t) => t.id === 'P25_8')?.itemId === 'AQUA_01');
    await tapUntil(24, 6, () => window.__vacSliceStore.getState().save.tiles.find((t) => t.id === 'P24_6')?.itemId === 'ANI_03');
    check('thả gà, cá, vịt — lời nhắn không bảo tưới', !(await S(() => window.__vacSliceStore.getState().toasts.map((t) => t.text).join(' '))).includes('Tưới'));
    await ripe(); await p.waitForTimeout(900);
    await p.screenshot({ path: `${out}/p1-9-pond-${w}x${h}.png` });
    // 3) tới lứa → chạm thu (trứng / cá vào Kho, còn lứa)
    await tapUntil(25, 8, () => (window.__vacSliceStore.getState().save.inventory.AQUA_01 ?? 0) >= 1);
    const fish = await tile('P25_8');
    check('thu cá: vào Kho, ô còn lứa', fish.itemId === 'AQUA_01' && fish.harvestsLeft >= 1, JSON.stringify({ left: fish.harvestsLeft }));
    await tapUntil(20, 13, () => (window.__vacSliceStore.getState().save.inventory.ANI_01 ?? 0) >= 1);
    check('thu trứng gà', true);
    await p.waitForTimeout(400);
    await p.screenshot({ path: `${out}/p1-9-coop-${w}x${h}.png` });

    // 4) sửa Bếp Củi → chạm Bếp mở bảng nấu → nấu Cơm → lấy món
    await tapUntil(16, 3, () => !!window.__vacSliceStore.getState().pending);
    await p.getByTestId('confirm-yes').click(); await p.waitForTimeout(200);
    check('sửa Bếp Củi → có xưởng MAC_02', !!(await S(() => window.__vacSliceStore.getState().save.machines?.MAC_02)));
    await tapUntil(16, 3, () => window.__vacSliceStore.getState().panel === 'KITCHEN');
    await p.getByTestId('cook-PROD_01').click(); await p.waitForTimeout(200);
    await S(() => { const X = window.__vacSliceStore; const s = X.getState(); X.setState({ save: { ...s.save, machines: { MAC_02: { ...s.save.machines.MAC_02, readyAt: Date.now() - 1 } } }, now: Date.now() }); });
    await p.getByTestId('collect-dish').click(); await p.waitForTimeout(200);
    check('nấu + lấy Cơm Trắng', (await S(() => window.__vacSliceStore.getState().save.inventory.PROD_01)) === 1);
    // 5) Nồi Đất: tìm Canh Cải Cá Rô (cấp 5 ≥ 4)
    await S(() => { const X = window.__vacSliceStore; const s = X.getState(); X.setState({ save: { ...s.save, inventory: { ...s.save.inventory, CROP_05: 2, CROP_04: 1 } } }); });
    for (const id of ['AQUA_01', 'CROP_05', 'CROP_05', 'CROP_04']) await p.getByTestId(`pot-${id}`).click();
    await p.screenshot({ path: `${out}/p1-9-kitchen-${w}x${h}.png` });
    await p.getByTestId('discover-btn').click(); await p.waitForTimeout(200);
    check('Nồi Đất tìm ra Canh Cải Cá Rô', (await S(() => window.__vacSliceStore.getState().save.discoveredRecipes ?? [])).includes('PROD_03'));
    await p.getByRole('button', { name: 'Đóng' }).click(); await p.waitForTimeout(300);
    await p.screenshot({ path: `${out}/p1-9-kitchen-map-${w}x${h}.png` });
    // 6) Kho: ăn Cơm hồi ⚡
    const st0 = await S(() => window.__vacSliceStore.getState().save.stamina);
    await p.getByRole('button', { name: 'Kho' }).click();
    await p.getByTestId('eat-PROD_01').click(); await p.waitForTimeout(200);
    const st1 = await S(() => window.__vacSliceStore.getState().save.stamina);
    check('ăn Cơm hồi ⚡', st1 > st0, `${st0}→${st1}`);
    await p.getByRole('button', { name: 'Đóng' }).click();
    // 7) bảng đơn HTX: mở → 3 đơn; đủ hàng → giao
    await p.getByRole('button', { name: 'Đơn' }).click(); await p.waitForTimeout(300);
    const n = await S(() => window.__vacSliceStore.getState().save.orders?.slots.filter(Boolean).length ?? 0);
    check('bảng đơn có 3 đơn', n === 3, n);
    await S(() => { const X = window.__vacSliceStore; const s = X.getState();
      const inv = { ...s.save.inventory }; for (const o of s.save.orders.slots) for (const l of o.lines) inv[l.itemId] = Math.max(inv[l.itemId] ?? 0, 0) + l.qty;
      X.setState({ save: { ...s.save, inventory: inv } }); });
    await p.waitForTimeout(150);
    await p.screenshot({ path: `${out}/p1-9-orders-${w}x${h}.png` });
    const g0 = await S(() => window.__vacSliceStore.getState().save.gold);
    const reward = await S(() => window.__vacSliceStore.getState().save.orders.slots[0].gold);
    await p.getByTestId('deliver-0').click(); await p.waitForTimeout(200);
    const g1 = await S(() => window.__vacSliceStore.getState().save.gold);
    check('giao đơn +vàng đúng thưởng', g1 - g0 === reward, `${g0}→${g1} (+${reward})`);
    await p.getByTestId('skip-1').click(); await p.waitForTimeout(200);
    check('bỏ đơn → chờ đơn mới', (await p.getByTestId('order-1').textContent()).includes('Đơn mới sau'));
    await p.getByRole('button', { name: 'Đóng' }).click();
    // 8) tải lại giữ chỗ nuôi, bếp, đơn (bản lưu v4)
    const before = await S(() => JSON.stringify([window.__vacSliceStore.getState().save.machines, window.__vacSliceStore.getState().save.orders?.seq]));
    await p.reload();
    await p.waitForFunction(() => window.__vacSlice && window.__vacSlice.sys.isActive() && window.__vacSliceStore, null, { timeout: 15000 });
    const after = await S(() => JSON.stringify([window.__vacSliceStore.getState().save.machines, window.__vacSliceStore.getState().save.orders?.seq]));
    check('tải lại giữ bếp + đơn', before === after);
    const small = await p.evaluate(() => [...document.querySelectorAll('button')].map((b) => { const r = b.getBoundingClientRect(); return [b.getAttribute('aria-label') || b.textContent.trim(), Math.round(r.width), Math.round(r.height)]; }).filter(([, w, h]) => w > 0 && (w < 44 || h < 44)));
    check(`${w}x${h} nút ≥ 44 px`, small.length === 0, JSON.stringify(small));
  }
  check('không lỗi JS', errs.length === 0, errs.join('\n'));
  await b.close();
  process.exit(fail ? 1 : 0);
})();
