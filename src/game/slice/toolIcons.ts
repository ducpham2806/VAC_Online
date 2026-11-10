/** Biểu tượng công cụ (GP-02) dùng chung cho scene và HUD bản thử. */
import type { Tool } from '../../domain/tools';

export const TOOL_EMOJI: Record<Tool, string> = {
  HOE: '⛏️',
  SEED: '🌱',
  WATER: '🚿',
  SICKLE: '🌾',
  FEED: '🌽',
  ROD: '🎣',
  AXE: '🪓',
  HAMMER: '🔨',
  HAND: '✋',
  NONE: '',
};
