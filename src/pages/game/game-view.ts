import { HeaderView } from '../../components/header/header-view';
import { getLevelData } from '../../core/data-service';
import { SentenceCheckModel } from './sentence-check-model';
import { CheckButton } from '../../components/check-button';
import { TranslateButton } from '../../components/translate-button';
import { DontKnowButton } from '../../components/dont-know-button';
import { AudioButton } from '../../components/audio-button';
import { VisibleAudioButton } from '../../components/visiblle-audio-button';
import { DragAndDrop } from './drag-drop';
import './game.css';

const SHUFFLE_COEFFICIENT = 0.5;

export class GameView {
  private container: HTMLElement;
  private resultBlock!: HTMLElement;
  private sourceBlock!: HTMLElement;
  private translationBlock!: HTMLElement;
  private mainBtn!: HTMLButtonElement;
  private dontKnowBtn!: HTMLButtonElement;

  private model = new SentenceCheckModel();
  private checkButton!: CheckButton;
  private translateButton!: TranslateButton;
  private audioButton!: AudioButton;
  private audioTumbler!: VisibleAudioButton;
  private dragDrop!: DragAndDrop;

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

    const translationWrapper = document.createElement('div');
    translationWrapper.className = 'translation-container';

    this.translationBlock = document.createElement('p');
    this.translationBlock.className = 'translation-hint';

    this.translateButton = new TranslateButton(() =>
      this.updateTranslationVisibility(),
    );
    this.audioButton = new AudioButton();

    this.audioTumbler = new VisibleAudioButton((isActive) => {
      if (!isActive) {
        this.audioButton.stop();
      }
      this.updateAudioVisibility();
    });

    translationWrapper.append(
      this.audioTumbler.getElement(),
      this.audioButton.getElement(),
      this.translationBlock,
      this.translateButton.getElement(),
    );

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
      translationWrapper,
      this.resultBlock,
      this.sourceBlock,
      controlsContainer,
    );
    document.body.append(this.container);

    this.checkButton = new CheckButton(
      this.mainBtn,
      this.model,
      this.resultBlock,
      this.dontKnowBtn,
    );

    new DontKnowButton(
      this.dontKnowBtn,
      this.model,
      this.resultBlock,
      this.sourceBlock,
      this.checkButton,
    );

    this.dontKnowBtn.addEventListener('click', () =>
      this.updateTranslationVisibility(),
    );

    this.dragDrop = new DragAndDrop(this.sourceBlock, this.resultBlock, () =>
      this.onStateChange(),
    );

    this.mainBtn.addEventListener('nextSentence', () =>
      this.renderNewSentence(),
    );
  }

  private onStateChange(): void {
    this.checkButton.updateStatus();

    if (this.mainBtn.textContent === 'Continue') {
      this.resultBlock.querySelectorAll('.word-card').forEach((card) => {
        card.classList.remove('incorrect');
        card.classList.add('correct');
      });
    }

    this.updateTranslationVisibility();
    this.updateAudioVisibility();
  }

  private updateAudioVisibility(): void {
    const isFinished = this.mainBtn.textContent === 'Continue';
    const isEnabled = this.audioTumbler.isActive;

    const shouldShow = isEnabled || isFinished;
    this.audioButton.getElement().classList.toggle('hidden-hint', !shouldShow);

    if (!isEnabled) {
      this.audioButton.stop();
    }
  }

  private updateTranslationVisibility(): void {
    const isVisible =
      this.translateButton.getVisibility() ||
      this.mainBtn.textContent === 'Continue';

    this.translationBlock.classList.toggle('hidden-text', !isVisible);
  }

  private renderNewSentence(): void {
    const currentData = this.model.getCurrentSentence();
    if (!currentData) return;

    this.translationBlock.textContent = currentData.textExampleTranslate;

    this.audioButton.setAudio(currentData.audioExample);

    this.resultBlock.innerHTML = '';
    this.sourceBlock.innerHTML = '';

    this.updateTranslationVisibility();
    this.updateAudioVisibility();

    const words = currentData.textExample.split(' ');
    const shuffledWords = [...words].sort(
      () => Math.random() - SHUFFLE_COEFFICIENT,
    );

    shuffledWords.forEach((word) => {
      const card = this.createWordCard(word);
      this.sourceBlock.appendChild(card);
      this.dragDrop.makeDraggable(card);
    });

    this.checkButton.updateStatus();
  }

  private createWordCard(word: string): HTMLElement {
    const card = document.createElement('div');
    card.className = 'word-card';
    card.textContent = word;

    card.onclick = () => {
      if (this.mainBtn.textContent === 'Continue') return;
      const target =
        card.parentElement === this.sourceBlock
          ? this.resultBlock
          : this.sourceBlock;
      target.appendChild(card);
      this.onStateChange();
    };

    return card;
  }
}
