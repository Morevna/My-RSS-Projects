import type { SentenceCheckModel } from '../../pages/game/models/sentence-check-model';

export class CheckButton {
  private button: HTMLButtonElement;
  private model: SentenceCheckModel;
  private resultBlock: HTMLElement;
  private dontKnowBtn: HTMLButtonElement;

  constructor(
    button: HTMLButtonElement,
    model: SentenceCheckModel,
    resultBlock: HTMLElement,
    dontKnowBtn: HTMLButtonElement,
  ) {
    this.button = button;
    this.model = model;
    this.resultBlock = resultBlock;
    this.dontKnowBtn = dontKnowBtn;

    this.button.disabled = true;
    this.button.textContent = 'Check';

    this.button.addEventListener('click', () => this.handleClick());
  }

  public updateStatus(): void {
    const userWords = Array.from(this.resultBlock.children);
    const currentSentence = this.model.getCurrentSentence();
    const targetWordsCount = currentSentence.textExample.split(' ').length;

    if (userWords.length === targetWordsCount) {
      this.button.disabled = false;
    } else {
      this.button.disabled = true;
      this.button.textContent = 'Check';
      this.button.classList.remove('continue-style');
    }
  }

  private handleClick(): void {
    if (this.button.textContent === 'Check') {
      this.checkAnswer();
    } else {
      this.continueToNext();
    }
  }

  private checkAnswer(): void {
    const userWords = Array.from(this.resultBlock.children).map(
      (c) => c.textContent?.trim() || '',
    );

    const results = this.model.getCheckResults(userWords);
    const cards = Array.from(this.resultBlock.children) as HTMLElement[];

    let allCorrect = true;
    results.forEach((isCorrect, index) => {
      cards[index].classList.remove('correct', 'incorrect');
      cards[index].classList.add(isCorrect ? 'correct' : 'incorrect');
      if (!isCorrect) allCorrect = false;
    });

    if (allCorrect) {
      this.setContinue();
    }
  }

  private continueToNext(): void {
    this.button.dispatchEvent(
      new CustomEvent('nextSentence', { bubbles: true }),
    );

    this.button.textContent = 'Check';
    this.button.classList.remove('continue-style');
    this.button.disabled = true;
    this.dontKnowBtn.disabled = false;
  }

  public setContinue(): void {
    this.button.textContent = 'Continue';
    this.button.disabled = false;
    this.button.classList.add('continue-style');
    this.dontKnowBtn.disabled = true;
  }
}
