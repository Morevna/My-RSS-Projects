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
  };
  words: IWord[];
}
