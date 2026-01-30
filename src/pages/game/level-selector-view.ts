// pages/game/level-selector-view.ts
import { LevelService } from '../../core/utils/level-service';

const TOTAL_LEVELS = 6;
const DEFAULT_ROUNDS_COUNT = 30;
const RADIX = 10;

export class LevelSelectorView {
  private container: HTMLElement;
  private levelSelect!: HTMLSelectElement;
  private roundSelect!: HTMLSelectElement;
  private onSelect: (level: number, round: number) => void;

  constructor(onSelect: (level: number, round: number) => void) {
    this.container = document.createElement('div');
    this.container.className = 'level-selector';
    this.onSelect = onSelect;
    this.createElements();
  }

  public updateRounds(roundsCount: number, currentRound: number): void {
    this.roundSelect.innerHTML = '';
    for (let i = 0; i < roundsCount; i += 1) {
      const option = document.createElement('option');
      option.value = i.toString();
      option.textContent = `Round ${i + 1}`;
      if (i === currentRound) option.selected = true;
      this.roundSelect.appendChild(option);
    }
    this.roundSelect.value = currentRound.toString();
  }

  public setCurrentRound(roundIndex: number): void {
    this.roundSelect.value = roundIndex.toString();
  }

  public setCurrentLevel(levelIndex: number): void {
    this.levelSelect.value = levelIndex.toString();
  }

  public updateLevelAndRound(
    level: number,
    round: number,
    roundsCount: number,
  ): void {
    this.levelSelect.value = level.toString();
    this.updateRounds(roundsCount, round);
    this.levelSelect.selectedIndex = level;
  }

  public syncWithStorage(roundsCount: number): void {
    const state = LevelService.load();
    this.updateLevelAndRound(state.level, state.round, roundsCount);
  }

  private createElements(): void {
    const { level, round } = LevelService.load();

    this.levelSelect = this.createSelect(TOTAL_LEVELS, level, 'Level');

    this.roundSelect = this.createSelect(DEFAULT_ROUNDS_COUNT, round, 'Round');

    this.levelSelect.onchange = () => this.handleUpdate();
    this.roundSelect.onchange = () => this.handleUpdate();

    this.container.append(this.levelSelect, this.roundSelect);
  }

  private createSelect(
    count: number,
    current: number,
    label: string,
  ): HTMLSelectElement {
    const select = document.createElement('select');
    select.className = 'custom-select';
    for (let i = 0; i < count; i += 1) {
      const option = document.createElement('option');
      option.value = i.toString();
      option.textContent = `${label} ${i + 1}`;
      if (i === current) option.selected = true;
      select.appendChild(option);
    }
    return select;
  }

  private handleUpdate(): void {
    const level = parseInt(this.levelSelect.value, RADIX);
    const round = parseInt(this.roundSelect.value, RADIX);
    LevelService.save({ level, round });
    this.onSelect(level, round);
  }

  public getElement(): HTMLElement {
    return this.container;
  }
}
