import { LoginView } from './pages/login/login-view';
import { StartView } from './pages/start/start-view';

function initApp() {
  const userData = localStorage.getItem('rss-puzzle-user');

  if (userData) {
    const startPage = new StartView();
    startPage.draw();
  } else {
    const loginPage = new LoginView();
    loginPage.draw();
  }
}

initApp();
