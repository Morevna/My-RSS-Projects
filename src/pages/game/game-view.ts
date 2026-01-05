import { HeaderView } from '../../components/header/header-view';
import { getLevelData } from '../../core/data-service';
import { SentenceCheckModel } from './sentence-check-model';
import { CheckButton } from '../../components/check-button';
import { DontKnowButton } from '../../components/dont-know-button';
import { DragAndDrop } from './drag-drop';
import './game.css';

export class GameView {
  private container: HTMLElement;
  private resultBlock!: HTMLElement;
  private sourceBlock!: HTMLElement;
  private translationBlock!: HTMLElement;
  private mainBtn!: HTMLButtonElement;
  private dontKnowBtn!: HTMLButtonElement;

  private model: SentenceCheckModel = new SentenceCheckModel();
  private checkButton!: CheckButton;
  private dragDrop!: DragAndDrop;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'game-container';
    this.initLayout();
    this.loadGameData();
  }

  // данные уровня игры
  private async loadGameData(): Promise<void> {
    const data = await getLevelData(1);
    this.model.setSentences(data.rounds[0].words);
    this.renderNewSentence();
  }

  // DOM
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

    this.mainBtn = document.createElement('button');
    this.mainBtn.className = 'game-btn';

    controlsContainer.append(this.dontKnowBtn, this.mainBtn);

    this.container.append(
      this.translationBlock,
      this.resultBlock,
      this.sourceBlock,
      controlsContainer,
    );
    document.body.append(this.container);

    // CheckButton
    this.checkButton = new CheckButton(
      this.mainBtn,
      this.model,
      this.resultBlock,
      this.dontKnowBtn,
    );

    //DontKnowButton
    new DontKnowButton(
      this.dontKnowBtn,
      this.model,
      this.resultBlock,
      this.sourceBlock,
      this.checkButton,
    );

    //drag & drop
    this.dragDrop = new DragAndDrop(this.sourceBlock, this.resultBlock, () =>
      this.checkButton.updateStatus(),
    );

    //нажать кнопку продолжить
    this.mainBtn.addEventListener('nextSentence', () =>
      this.renderNewSentence(),
    );
  }

  //новое предложение
  private renderNewSentence(): void {
    const currentData = this.model.getCurrentSentence();
    if (!currentData) return;

    this.translationBlock.textContent = currentData.textExampleTranslate;
    this.resultBlock.innerHTML = '';
    this.sourceBlock.innerHTML = '';

    const words = currentData.textExample.split(' ');
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);

    shuffledWords.forEach((word) => {
      const card = this.createWordCard(word);
      this.sourceBlock.appendChild(card);
      this.dragDrop.makeDraggable(card);
    });

    this.checkButton.updateStatus();
  }

  // создаю карточку
  private createWordCard(word: string): HTMLElement {
    const card = document.createElement('div');
    card.className = 'word-card';
    card.textContent = word;

    //перемещение по клику
    card.onclick = () => {
      if (this.mainBtn.textContent === 'Continue') return;

      if (card.parentElement === this.sourceBlock) {
        this.resultBlock.appendChild(card);
      } else {
        this.sourceBlock.appendChild(card);
      }

      this.checkButton.updateStatus();
    };

    return card;
  }
}
