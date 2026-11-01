/** Hàm điều phối dùng chung cho các slice: gọi RPC (online) hoặc áp luật domain (offline). */
import type { StoreApi } from 'zustand';
import { FarmResult } from '../domain/farm';
import { FarmRpcName, FarmSnapshot, callFarmRpc } from '../services/farmGateway';
import type { GameData, GameState } from './gameTypes';
import { fromFarmSave, snapshotToState } from './initialState';

export type StoreSet = StoreApi<GameState>['setState'];
export type StoreGet = StoreApi<GameState>['getState'];

export interface StoreHelpers {
  runCloud: (
    name: FarmRpcName,
    args: Record<string, unknown>,
    message: (snap: FarmSnapshot, prev: GameData) => string
  ) => Promise<boolean>;
  applyLocal: (result: FarmResult) => void;
}

export function createStoreHelpers(set: StoreSet, get: StoreGet): StoreHelpers {
  /** Gọi RPC nông trại, áp ảnh chụp server vào state và hiện thông báo. */
  const runCloud = async (
    name: FarmRpcName,
    args: Record<string, unknown>,
    message: (snap: FarmSnapshot, prev: GameData) => string
  ): Promise<boolean> => {
    if (get().farmBusy) return false;
    set({ farmBusy: true });
    const prev = get();
    const r = await callFarmRpc(name, args);
    if (r.ok) {
      set({ ...snapshotToState(r.snapshot, get()), farmBusy: false, toastMessage: message(r.snapshot, prev) });
      return true;
    }
    set({ farmBusy: false, toastMessage: r.message });
    return false;
  };

  /** Áp kết quả luật domain (chế độ offline). */
  const applyLocal = (result: FarmResult): void => {
    if (result.ok) set({ ...fromFarmSave(result.save), toastMessage: result.message });
    else set({ toastMessage: result.message });
  };

  return { runCloud, applyLocal };
}
