import { CROP_SEASONS } from '../src/data/seasons';
import { canSowInSeason, SEASON_EPOCH_MS, SEASON_LENGTH_DAYS, SEASON_ORDER, seasonAt } from '../src/domain/season';

const durationMs = seasonAt(SEASON_EPOCH_MS).nextSeasonAt - SEASON_EPOCH_MS;
const riceSowingSeasons = SEASON_ORDER.filter((season) => canSowInSeason(CROP_SEASONS.CROP_01, season));

process.stdout.write(`# Sinh từ src/domain/season.ts và src/data/seasons.ts.
extends RefCounted

const EPOCH_MS := ${SEASON_EPOCH_MS}
const DURATION_MS := ${durationMs}
const DAYS := ${SEASON_LENGTH_DAYS}
const ORDER := ${JSON.stringify(SEASON_ORDER)}
const RICE_SOWING_SEASONS := ${JSON.stringify(riceSowingSeasons)}
`);
