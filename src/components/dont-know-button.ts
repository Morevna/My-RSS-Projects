import type { SentenceCheckModel } from '../pages/game/sentence-check-model';
import type { CheckButton } from './check-button';

export class DontKnowButton {
  private button: HTMLButtonElement;
  private model: SentenceCheckModel;
  private resultBlock: HTMLElement;
  private sourceBlock: HTMLElement;
  private checkButton: CheckButton;

  constructor(
    button: HTMLButtonElement,
    model: SentenceCheckModel,
    resultBlock: HTMLElement,
    sourceBlock: HTMLElement,
    checkButton: CheckButton,
  ) {
    this.button = button;
    this.model = model;
    this.resultBlock = resultBlock;
    this.sourceBlock = sourceBlock;
    this.checkButton = checkButton;

    this.button.addEventListener('click', () => this.handleClick());
  }

  private handleClick(): void {
    const words = this.model.getCurrentSentence().textExample.split(' ');

    this.resultBlock.innerHTML = '';
    this.sourceBlock.innerHTML = '';

    // все слова в resultBlock, помечаем correct
    words.forEach((word) => {
      const card = document.createElement('div');
      card.className = 'word-card correct';
      card.textContent = word;
      this.resultBlock.appendChild(card);
    });

    // Check в режим Continue
    this.checkButton.setContinue();
  }
}
