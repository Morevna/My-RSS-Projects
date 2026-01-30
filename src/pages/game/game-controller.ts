// pages/game/game-controller.ts
import { LevelService } from '../../core/utils/level-service';
import { SentenceCheckModel } from './models/sentence-check-model';
import { getLevelData } from '../../core/api/data-service';
import type { IGameState } from '../../core/types/types';

const TOTAL_LEVELS = 6;

export class GameController {
  private model: SentenceCheckModel;

  constructor(model: SentenceCheckModel) {
    this.model = model;
  }

  public async nextStep(): Promise<IGameState> {
    const { level, round } = LevelService.load();
    const data = await getLevelData(level + 1);

    if (round < data.rounds.length - 1) {
      const nextRound = round + 1;
      LevelService.save({ level, round: nextRound });
      this.model.setSentences(data.rounds[nextRound].words);
      this.model.resetCurrentIndex();
      return {
        level,
        round: nextRound,
        sentencesCount: data.rounds[nextRound].words.length,
      };
    }
    let nextLevel = level + 1;
    if (nextLevel >= TOTAL_LEVELS) nextLevel = 0;

    const nextData = await getLevelData(nextLevel + 1);
    LevelService.save({ level: nextLevel, round: 0 });
    this.model.setSentences(nextData.rounds[0].words);
    this.model.resetCurrentIndex();
    return {
      level: nextLevel,
      round: 0,
      sentencesCount: nextData.rounds[0].words.length,
    };
  }
}
