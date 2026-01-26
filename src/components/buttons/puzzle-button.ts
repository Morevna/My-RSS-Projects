export class PuzzleButton {
  private button: HTMLButtonElement;
  private isActive: boolean = true;

  constructor(onClick: (state: boolean) => void) {
    this.button = document.createElement('button');
    this.button.className = 'puzzle-hint-btn active';
    this.button.innerHTML = '🧩';

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
      this.button.classList.add('active');
    }
  }

  public getElement(): HTMLButtonElement {
    return this.button;
  }
}
