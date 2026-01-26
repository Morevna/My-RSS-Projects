export class PuzzleButton {
  private button: HTMLButtonElement;
  private isActive: boolean;

  constructor(onClick: (state: boolean) => void, initialState: boolean) {
    this.isActive = initialState;

    this.button = document.createElement('button');
    this.button.className = 'puzzle-hint-btn';
    this.button.innerHTML = '🧩';

    this.button.classList.toggle('active', this.isActive);

    this.button.addEventListener('click', () => {
      if (this.button.disabled) return;

      this.isActive = !this.isActive;
      this.button.classList.toggle('active', this.isActive);
      onClick(this.isActive);
    });
  }

  public setEnabled(status: boolean): void {
    this.button.disabled = !status;

    if (!status) {
      this.button.classList.remove('active');
    } else {
      this.button.classList.toggle('active', this.isActive);
    }
  }

  public getElement(): HTMLButtonElement {
    return this.button;
  }
}
