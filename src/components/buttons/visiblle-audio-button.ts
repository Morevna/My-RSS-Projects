export class VisibleAudioButton {
  private element: HTMLButtonElement;
  public isActive: boolean;
  private onToggle: (isActive: boolean) => void;

  constructor(onToggle: (isActive: boolean) => void, initialState: boolean) {
    this.isActive = initialState;
    this.onToggle = onToggle;
    this.element = document.createElement('button');
    this.element.className = 'audio-tumbler';
    this.element.classList.toggle('active', this.isActive);

    this.updateUI();

    this.element.onclick = () => {
      this.isActive = !this.isActive;
      this.element.classList.toggle('active', this.isActive);
      this.updateUI();
      this.onToggle(this.isActive);
    };
  }

  private updateUI(): void {
    this.element.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      </svg>
    `;

    this.element.title = this.isActive ? 'Sound off' : 'Sound on';
  }

  public getElement(): HTMLButtonElement {
    return this.element;
  }
}
