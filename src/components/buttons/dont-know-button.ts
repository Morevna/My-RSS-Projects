import type { SentenceCheckModel } from '../../pages/game/models/sentence-check-model';
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
    const sentence = this.model.getCurrentSentence();
    if (!sentence) return;

    const correctWords = sentence.textExample.split(' ');

    // собрать все существующие карточки
    const allCards = [
      ...Array.from(this.sourceBlock.children),
      ...Array.from(this.resultBlock.children),
    ] as HTMLElement[];

    // очистить resultBlock
    this.resultBlock.innerHTML = '';

    // разложить карточки в правильном порядке
    correctWords.forEach((word) => {
      const cardIndex = allCards.findIndex((c) => c.textContent === word);

      if (cardIndex >= 0) {
        const card = allCards.splice(cardIndex, 1)[0];
        card.classList.remove('incorrect');
        card.classList.add('correct');
        card.style.pointerEvents = 'none';
        this.resultBlock.appendChild(card);
      }
    });

    this.sourceBlock.innerHTML = '';
    this.checkButton.setContinue();
  }
}
