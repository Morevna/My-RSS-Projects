import { LoginView } from '../pages/login/login-view';
import { StartView } from '../pages/start/start-view';

export function initApp(): void {
  const userData = localStorage.getItem('rss-puzzle-user');

  if (userData) {
    new StartView().draw();
  } else {
    new LoginView().draw();
  }
}
