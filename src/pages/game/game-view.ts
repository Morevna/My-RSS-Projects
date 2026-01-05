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
  private dontKnowBtn!: HTMLButtonElement;

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

    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'controls-container';

    this.dontKnowBtn = document.createElement('button');
    this.dontKnowBtn.className = 'game-btn secondary-btn';
    this.dontKnowBtn.textContent = "I don't know";
    this.dontKnowBtn.onclick = () => this.handleDontKnow();

    this.mainBtn = document.createElement('button');
    this.mainBtn.className = 'game-btn';
    this.mainBtn.textContent = 'Check';
    this.mainBtn.disabled = true;
    this.mainBtn.onclick = () => this.handleButtonClick();

    controlsContainer.append(this.dontKnowBtn, this.mainBtn);

    this.container.append(
      this.translationBlock,
      this.resultBlock,
      this.sourceBlock,
      controlsContainer,
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
    this.mainBtn.disabled = true;
    this.mainBtn.classList.remove('continue-style');
    this.dontKnowBtn.disabled = false;
    this.dontKnowBtn.style.display = 'block';

    const words: string[] = currentData.textExample.split(' ');
    const shuffledWords: string[] = [...words].sort(() => Math.random() - 0.5);

    shuffledWords.forEach((word: string) => {
      const card = this.createWordCard(word);
      this.sourceBlock.append(card);
    });
  }

  private createWordCard(word: string): HTMLElement {
    const card = document.createElement('div');
    card.className = 'word-card';
    card.textContent = word;

    card.onclick = () => {
      if (this.mainBtn.textContent === 'Continue') return;

      this.resetColors();

      if (this.mainBtn.textContent === 'Continue') {
        this.mainBtn.textContent = 'Check';
        this.mainBtn.classList.remove('continue-style');
      }

      if (card.parentElement === this.sourceBlock) {
        this.resultBlock.append(card);
      } else {
        this.sourceBlock.append(card);
      }
      this.updateCheckButtonStatus();
    };
    return card;
  }

  private updateCheckButtonStatus(): void {
    const totalWords = this.model
      .getCurrentSentence()
      .textExample.split(' ').length;
    const currentWords = this.resultBlock.children.length;

    if (this.mainBtn.textContent === 'Check') {
      this.mainBtn.disabled = currentWords !== totalWords;
    }
  }

  private handleDontKnow(): void {
    const words: string[] = this.model
      .getCurrentSentence()
      .textExample.split(' ');
    this.resultBlock.innerHTML = '';
    this.sourceBlock.innerHTML = '';

    words.forEach((word: string) => {
      const card = this.createWordCard(word);
      card.classList.add('correct');
      this.resultBlock.append(card);
    });

    this.mainBtn.textContent = 'Continue';
    this.mainBtn.disabled = false;
    this.mainBtn.classList.add('continue-style');
    this.dontKnowBtn.disabled = true;
  }

  private handleButtonClick(): void {
    if (this.mainBtn.textContent === 'Check') {
      this.processCheck();
    } else {
      this.processNext();
    }
  }

  private processCheck(): void {
    const userWords: string[] = Array.from(this.resultBlock.children).map(
      (c) => c.textContent || '',
    );
    const results: boolean[] = this.model.getCheckResults(userWords);
    const cards = Array.from(this.resultBlock.children) as HTMLElement[];

    let allCorrect = true;
    results.forEach((isCorrect: boolean, index: number) => {
      cards[index].classList.add(isCorrect ? 'correct' : 'incorrect');
      if (!isCorrect) allCorrect = false;
    });

    if (allCorrect) {
      this.mainBtn.textContent = 'Continue';
      this.mainBtn.classList.add('continue-style');
      this.dontKnowBtn.disabled = true;
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
    Array.from(this.resultBlock.children).forEach((card: Element) => {
      card.classList.remove('correct', 'incorrect');
    });
  }
}
