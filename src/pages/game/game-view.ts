import { HeaderView } from '../../components/header/header-view';
import { getLevelData } from '../../core/data-service';
import { SentenceCheckModel } from './sentence-check-model';
import './game.css';

export class GameView {
  private container: HTMLElement;
  private resultBlock!: HTMLElement;
  private sourceBlock!: HTMLElement;
  private translationBlock!: HTMLElement;
  private mainBtn!: HTMLButtonElement;

  private model: SentenceCheckModel = new SentenceCheckModel();

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'game-container';
    this.initLayout();
    this.loadGameData();
  }

  private async loadGameData(): Promise<void> {
    const data = await getLevelData(1);
    this.model.setSentences(data.rounds[0].words);
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

    this.mainBtn = document.createElement('button');
    this.mainBtn.className = 'game-btn hidden';
    this.mainBtn.onclick = () => this.handleButtonClick();

    this.container.append(
      this.translationBlock,
      this.resultBlock,
      this.sourceBlock,
      this.mainBtn,
    );
    document.body.append(this.container);
  }

  private renderNewSentence(): void {
    const currentData = this.model.getCurrentSentence();
    if (!currentData) return;

    this.translationBlock.textContent = currentData.textExampleTranslate;
    this.resultBlock.innerHTML = '';
    this.sourceBlock.innerHTML = '';

    this.mainBtn.textContent = 'Check';
    this.mainBtn.classList.add('hidden');
    this.mainBtn.classList.remove('continue-style');

    const words = currentData.textExample.split(' ');
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);

    shuffledWords.forEach((word) => {
      const card = this.createWordCard(word);
      this.sourceBlock.append(card);
    });
  }

  private createWordCard(word: string): HTMLElement {
    const card = document.createElement('div');
    card.className = 'word-card';
    card.textContent = word;

    card.addEventListener('click', () => {
      this.resetColors();
      this.resetBtnState();

      if (card.parentElement === this.sourceBlock) {
        this.resultBlock.append(card);
      } else {
        this.sourceBlock.append(card);
      }

      this.updateButtonVisibility();
    });
    return card;
  }

  private resetBtnState(): void {
    if (this.mainBtn.textContent === 'Continue') {
      this.mainBtn.textContent = 'Check';
      this.mainBtn.classList.remove('continue-style');
    }
  }

  private updateButtonVisibility(): void {
    const currentSentence = this.model
      .getCurrentSentence()
      .textExample.split(' ');
    if (this.resultBlock.children.length === currentSentence.length) {
      this.mainBtn.classList.remove('hidden');
    } else {
      this.mainBtn.classList.add('hidden');
    }
  }

  private handleButtonClick(): void {
    if (this.mainBtn.textContent === 'Check') {
      this.processCheck();
    } else {
      this.processNext();
    }
  }

  private processCheck(): void {
    const userWords = Array.from(this.resultBlock.children).map(
      (c) => c.textContent || '',
    );
    const results = this.model.getCheckResults(userWords);

    const cards = Array.from(this.resultBlock.children) as HTMLElement[];
    let allCorrect = true;

    results.forEach((isCorrect, index) => {
      cards[index].classList.add(isCorrect ? 'correct' : 'incorrect');
      if (!isCorrect) allCorrect = false;
    });

    if (allCorrect) {
      this.mainBtn.textContent = 'Continue';
      this.mainBtn.classList.add('continue-style');
    }
  }

  private processNext(): void {
    if (this.model.next()) {
      this.renderNewSentence();
    } else {
      alert('Round Completed!');
    }
  }

  private resetColors(): void {
    Array.from(this.resultBlock.children).forEach((card) => {
      card.classList.remove('correct', 'incorrect');
    });
  }
}
