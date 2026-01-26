export interface HintStates {
  isAudioEnabled: boolean;
  isTranslationEnabled: boolean;
  isPuzzleEnabled: boolean;
}

const STORAGE_KEY = 'rs-puzzle-hints';

const DEFAULT_SETTINGS: HintStates = {
  isAudioEnabled: true,
  isTranslationEnabled: true,
  isPuzzleEnabled: true,
};

export const SettingsService = {
  save(settings: Partial<HintStates>): void {
    const current = this.load();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  load(): HintStates {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { ...DEFAULT_SETTINGS };
  },

  reset(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
