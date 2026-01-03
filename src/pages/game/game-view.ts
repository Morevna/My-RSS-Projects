import { HeaderView } from '../../components/header/header-view';
import './game.css';

export class GameView {
  private container: HTMLElement;
  private resultBlock!: HTMLElement;
  private sourceBlock!: HTMLElement;

  // Временно
  private sentence = 'The quick brown fox jumps over the lazy dog';

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'game-container';
  }

  private shuffle(array: string[]): string[] {
    return array.sort(() => Math.random() - 0.5);
  }

  private createWordCard(word: string): HTMLElement {
    const card = document.createElement('div');
    card.className = 'word-card';
    card.textContent = word;

    card.addEventListener('click', () => {
      if (card.parentElement === this.sourceBlock) {
        this.resultBlock.append(card);
      } else {
        this.sourceBlock.append(card);
      }
    });
    return card;
  }

  public draw(): void {
    document.body.innerHTML = '';
    const header = new HeaderView();
    document.body.append(header.getElement());

    this.resultBlock = document.createElement('div');
    this.resultBlock.className = 'result-block';

    this.sourceBlock = document.createElement('div');
    this.sourceBlock.className = 'source-block';

    const words = this.sentence.split(' ');
    const shuffledWords = this.shuffle([...words]);

    shuffledWords.forEach((word) => {
      const card = this.createWordCard(word);
      this.sourceBlock.append(card);
    });

    this.container.append(this.resultBlock, this.sourceBlock);
    document.body.append(this.container);
  }
}
