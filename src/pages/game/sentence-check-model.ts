import type { IWord } from '../../core/types';

export class SentenceCheckModel {
  private sentences: IWord[] = [];
  private currentIndex = 0;

  public setSentences(sentences: IWord[]): void {
    this.sentences = sentences;
  }

  public getCurrentSentence(): IWord {
    return this.sentences[this.currentIndex];
  }

  public getCheckResults(userWords: string[]): boolean[] {
    const originalWords = this.getCurrentSentence().textExample.split(' ');
    return userWords.map((word, index) => word === originalWords[index]);
  }

  public next(): boolean {
    if (this.currentIndex < this.sentences.length - 1) {
      this.currentIndex++;
      return true;
    }
    return false;
  }
}
