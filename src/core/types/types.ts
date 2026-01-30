// src/core/types/types.ts

export interface IWord {
  audioExample: string;
  textExample: string;
  textExampleTranslate: string;
  id: number;
  word: string;
}

export interface IRound {
  levelData: {
    author: string;
    imageSrc: string;
    name: string;
    year: string;
    cuttedSrc: string;
  };
  words: IWord[];
}

export interface ILevelData {
  rounds: IRound[];
  roundsCount: number;
}

export interface IGameState {
  level: number;
  round: number;
  sentencesCount: number;
}

export interface IImageFragment {
  sentenceIndex: number;
  word: string;
  canvas: HTMLCanvasElement;
}
