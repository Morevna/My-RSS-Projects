import { HeaderView } from '../../components/header/header-view';
import { getLevelData } from '../../core/data-service';
import './game.css';

export class GameView {
  private container: HTMLElement;
  private resultBlock!: HTMLElement;
  private sourceBlock!: HTMLElement;
  private translationBlock!: HTMLElement;
  private continueBtn!: HTMLButtonElement;

  private sentences: any[] = [];
  private currentSentenceIndex = 0;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'game-container';
    this.initLayout();
    this.loadGameData();
  }

  private async loadGameData(): Promise<void> {
    const data = await getLevelData(1);
    this.sentences = data.rounds[0].words;
    this.renderNewSentence();
  }

  private initLayout(): void {
    document.body.innerHTML = '';
    const header = new HeaderView();
    document.body.append(header.getElement());

    this.translationBlock = document.createElement('p');
    this.translationBlock.className = 'translation-hint';

    this.resultBlock = document.createElement('div');
    this.resultBlock.className = 'result-block';

    this.sourceBlock = document.createElement('div');
    this.sourceBlock.className = 'source-block';

    this.continueBtn = document.createElement('button');
    this.continueBtn.textContent = 'Continue';
    this.continueBtn.className = 'continue-btn';
    this.continueBtn.disabled = true;
    this.continueBtn.onclick = () => this.nextSentence();

    this.container.append(
      this.translationBlock,
      this.resultBlock,
      this.sourceBlock,
      this.continueBtn,
    );
    document.body.append(this.container);
  }

  private renderNewSentence(): void {
    const currentData = this.sentences[this.currentSentenceIndex];
    if (!currentData) return;

    this.translationBlock.textContent = currentData.textExampleTranslate;

    this.resultBlock.innerHTML = '';
    this.sourceBlock.innerHTML = '';

    this.continueBtn.disabled = true;
    this.continueBtn.classList.remove('btn-active');

    const words = currentData.textExample.split(' ');
    const shuffledWords = this.shuffle([...words]);

    shuffledWords.forEach((word) => {
      this.sourceBlock.append(this.createWordCard(word));
    });
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
      this.checkResult();
    });
    return card;
  }

  private checkResult(): void {
    const currentOriginal =
      this.sentences[this.currentSentenceIndex].textExample;
    const currentResult = Array.from(this.resultBlock.children)
      .map((card) => card.textContent)
      .join(' ');

    if (currentOriginal === currentResult) {
      this.continueBtn.disabled = false;
      this.continueBtn.classList.add('btn-active');
    } else {
      this.continueBtn.disabled = true;
      this.continueBtn.classList.remove('btn-active');
    }
  }

  private nextSentence(): void {
    this.currentSentenceIndex++;
    if (this.currentSentenceIndex < this.sentences.length) {
      this.renderNewSentence();
    } else {
      alert('Round Completed!');
    }
  }

  private shuffle(array: string[]): string[] {
    return array.sort(() => Math.random() - 0.5);
  }
}
