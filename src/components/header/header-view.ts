import './header.css';

export class HeaderView {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('header');
    this.element.className = 'main-header';
    this.createElements();
  }

  private createElements(): void {
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Logout';
    logoutBtn.className = 'logout-btn';

    logoutBtn.addEventListener('click', () => {
      if (confirm('Do you really want to logout?')) {
        localStorage.removeItem('rss-puzzle-user');
        location.reload();
      }
    });

    this.element.append(logoutBtn);
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
