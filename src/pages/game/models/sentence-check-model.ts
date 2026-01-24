import type { IWord } from '../../../core/types/types';

export class SentenceCheckModel {
  private sentences: IWord[] = [];
  private currentIndex = 0;

  public setSentences(sentences: IWord[]): void {
    this.sentences = sentences;
    this.currentIndex = 0;
  }

  public getCurrentSentence(): IWord {
    return this.sentences[this.currentIndex];
  }

  public getCheckResults(userWords: string[]): boolean[] {
    const correctWords = this.getCurrentSentence().textExample.split(' ');
    return userWords.map(
      (word: string, index: number) => word === correctWords[index],
    );
  }

  public next(): boolean {
    if (this.currentIndex < this.sentences.length - 1) {
      this.currentIndex += 1;
      return true;
    }
    return false;
  }
}
