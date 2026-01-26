import { SettingsService } from '../../core/utils/settings-service';
import { LoginView } from '../../pages/login/login-view';
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
      if (window.confirm('Do you really want to logout?')) {
        localStorage.removeItem('rss-puzzle-user');
        SettingsService.reset();
        const loginPage = new LoginView();
        loginPage.draw();
      }
    });

    this.element.append(logoutBtn);
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
