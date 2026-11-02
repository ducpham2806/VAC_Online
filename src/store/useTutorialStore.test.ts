import { beforeEach, describe, expect, it } from 'vitest';
import { createFreshState, useGameStore } from './useGameStore';
import { useTutorialStore, watchFirstSale } from './useTutorialStore';

describe('Hướng dẫn tân thủ — nhận biết lần bán HTX đầu tiên', () => {
  beforeEach(() => {
    useGameStore.setState({ ...createFreshState(), inventory: { CROP_01: 2 } });
    useTutorialStore.setState({ dismissed: false, soldOnce: false });
  });

  it('bán trong cửa sổ Kho → soldOnce', () => {
    const stop = watchFirstSale();
    useGameStore.setState({ activeModal: 'WAREHOUSE' });
    useGameStore.getState().sellToHtx('CROP_01', 2);
    expect(useGameStore.getState().gold).toBe(2508);
    expect(useTutorialStore.getState().soldOnce).toBe(true);
    stop();
  });

  it('vàng tăng vì lý do khác (không mở Kho) thì không tính', () => {
    const stop = watchFirstSale();
    useGameStore.setState({ gold: 9999 });
    expect(useTutorialStore.getState().soldOnce).toBe(false);
    stop();
  });

  it('Ẩn hướng dẫn được lưu lại', () => {
    useTutorialStore.getState().dismiss();
    expect(JSON.parse(localStorage.getItem('vac_tutorial_v1') ?? '{}').state.dismissed).toBe(true);
  });
});
