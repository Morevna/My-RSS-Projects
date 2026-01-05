import type { SentenceCheckModel } from '../pages/game/sentence-check-model';

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
    if (this.button.textContent === 'Check') {
      const totalWords = this.model
        .getCurrentSentence()
        .textExample.split(' ').length;
      const currentWords = this.resultBlock.children.length;
      this.button.disabled = currentWords !== totalWords;
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
      (c) => c.textContent,
    );
    const results = this.model.getCheckResults(userWords);
    const cards = Array.from(this.resultBlock.children) as HTMLElement[];

    let allCorrect = true;
    results.forEach((isCorrect, index) => {
      cards[index].classList.add(isCorrect ? 'correct' : 'incorrect');
      if (!isCorrect) allCorrect = false;
    });

    if (allCorrect) {
      this.button.textContent = 'Continue';
      this.button.classList.add('continue-style');
      this.dontKnowBtn.disabled = true;
    }
  }

  private continueToNext(): void {
    if (this.model.next()) {
      this.button.dispatchEvent(new CustomEvent('nextSentence'));
    } else {
      alert('Round Completed!');
    }

    // Сброс на Check для след предложения
    this.button.textContent = 'Check';
    this.button.classList.remove('continue-style');
    this.dontKnowBtn.disabled = false;
  }

  public setContinue(): void {
    this.button.textContent = 'Continue';
    this.button.disabled = false;
    this.button.classList.add('continue-style');
    this.dontKnowBtn.disabled = true;
  }
}
