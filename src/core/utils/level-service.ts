// core/utils/level-service.ts
const LEVEL_STORAGE_KEY = 'rs-puzzle-level-state';

export interface LevelState {
  level: number;
  round: number;
}

export const LevelService = {
  save(state: LevelState): void {
    localStorage.setItem(LEVEL_STORAGE_KEY, JSON.stringify(state));
  },

  load(): LevelState {
    const saved = localStorage.getItem(LEVEL_STORAGE_KEY);
    try {
      return saved ? (JSON.parse(saved) as LevelState) : { level: 0, round: 0 };
    } catch {
      return { level: 0, round: 0 };
    }
  },

  reset(): void {
    localStorage.removeItem(LEVEL_STORAGE_KEY);
  },
};
