import { HeaderView } from '../../components/header/header-view';
import { getLevelData } from '../../core/api/data-service';
import { SentenceCheckModel } from './models/sentence-check-model';
import { CheckButton } from '../../components/buttons/check-button';
import { TranslateButton } from '../../components/buttons/translate-button';
import { PuzzleButton } from '../../components/buttons/puzzle-button';
import { DontKnowButton } from '../../components/buttons/dont-know-button';
import { AudioButton } from '../../components/buttons/audio-button';
import { VisibleAudioButton } from '../../components/buttons/visiblle-audio-button';
import { DragAndDrop } from './drag-drop';
import { loadImage, splitImageBySentences } from '../../core/utils/image-utils';
import { ENV } from '../../app/env';

import './game.css';

const SHUFFLE_COEFFICIENT = 0.5;

export class GameView {
  private container: HTMLElement;
  private resultBlock!: HTMLElement;
  private sourceBlock!: HTMLElement;
  private translationBlock!: HTMLElement;
  private mainBtn!: HTMLButtonElement;
  private dontKnowBtn!: HTMLButtonElement;
  private puzzleButton!: PuzzleButton;
  private isImageHintActive: boolean = true;

  private model = new SentenceCheckModel();
  private checkButton!: CheckButton;
  private translateButton!: TranslateButton;
  private audioButton!: AudioButton;
  private audioTumbler!: VisibleAudioButton;
  private dragDrop!: DragAndDrop;

  private imageFragments: {
    sentenceIndex: number;
    word: string;
    canvas: HTMLCanvasElement;
  }[] = [];

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'game-container';
    this.initLayout();
    this.loadGameData();
  }

  private async loadImageFragments(): Promise<void> {
    const data = await getLevelData(1);
    const round = data.rounds[0];
    const sentences = round.words;

    const imagePath = round.levelData.imageSrc;

    const imgUrl = `${ENV.DATA_URL}images/${imagePath}`;
    const img = await loadImage(imgUrl);

    this.imageFragments = splitImageBySentences(img, sentences);
  }

  private async loadGameData(): Promise<void> {
    const data = await getLevelData(1);
    this.model.setSentences(data.rounds[0].words);
    await this.loadImageFragments();
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

    this.puzzleButton = new PuzzleButton((state) => {
      this.isImageHintActive = state;
      this.renderNewSentence();
    });

    translationWrapper.prepend(this.puzzleButton.getElement());
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

    this.dontKnowBtn.addEventListener('click', () => {
      this.updateTranslationVisibility();
      this.onStateChange();
    });

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
      this.puzzleButton.setEnabled(false);

      this.resultBlock
        .querySelectorAll<HTMLElement>('.word-card')
        .forEach((card) => {
          card.classList.remove('incorrect');
          card.classList.add('correct');

          const word = card.textContent || '';
          const fragment = this.imageFragments.find(
            (f) =>
              f.word === word &&
              f.sentenceIndex === this.model.getCurrentIndex(),
          );

          if (fragment) {
            card.style.backgroundImage = `url(${fragment.canvas.toDataURL()})`;
          }
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

    if (this.puzzleButton) {
      this.puzzleButton.setEnabled(true);
    }

    this.updateTranslationVisibility();
    this.updateAudioVisibility();

    const words = currentData.textExample.split(' ');
    const shuffledWords = [...words].sort(
      () => Math.random() - SHUFFLE_COEFFICIENT,
    );

    shuffledWords.forEach((word) => {
      const card = this.createWordCard(word, this.model.getCurrentIndex());
      this.sourceBlock.appendChild(card);
      this.dragDrop.makeDraggable(card);
    });

    this.checkButton.updateStatus();
  }

  private createWordCard(word: string, sentenceIndex: number): HTMLElement {
    const card = document.createElement('div');
    card.className = 'word-card';
    card.textContent = word;

    const fragment = this.imageFragments.find(
      (f) => f.word === word && f.sentenceIndex === sentenceIndex,
    );

    if (fragment) {
      card.style.width = `${fragment.canvas.width}px`;
      card.style.height = `${fragment.canvas.height}px`;
      const isFinished = this.mainBtn.textContent === 'Continue';

      if (this.isImageHintActive || isFinished) {
        card.style.backgroundImage = `url(${fragment.canvas.toDataURL()})`;
      } else {
        card.style.backgroundImage = 'none';
      }
    }

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
