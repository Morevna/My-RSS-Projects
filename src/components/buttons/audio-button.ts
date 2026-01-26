import { ENV } from '../../app/env';

export class AudioButton {
  private element: HTMLButtonElement;
  private audio: HTMLAudioElement | null = null;

  constructor() {
    this.element = document.createElement('button');
    this.element.className = 'audio-btn';
    this.element.title = 'Listen';
    this.element.innerHTML = `
      <svg class="audio-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path class="wave" d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      </svg>`;

    this.element.onclick = () => this.play();
  }

  public setAudio(audioPath: string | undefined): void {
    if (!audioPath) return;
    const fullUrl = `${ENV.DATA_URL}${audioPath}`;

    this.stop();

    this.audio = new Audio(fullUrl);

    this.audio.onended = () => {
      this.element.classList.remove('playing');
    };
  }

  public play(): void {
    if (!this.audio) return;

    this.element.classList.add('playing');
    this.audio.currentTime = 0;

    this.audio.play().catch(() => {
      this.element.classList.remove('playing');
    });
  }

  public stop(): void {
    if (!this.audio) return;

    this.audio.pause();
    this.audio.currentTime = 0;
    this.element.classList.remove('playing');
  }

  public getElement(): HTMLButtonElement {
    return this.element;
  }
}
