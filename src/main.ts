import { LoginView } from './pages/login/login-view';

function initApp() {
  const userData = localStorage.getItem('rss-puzzle-user');

  if (userData) {
    showStartPage();
  } else {
    const loginPage = new LoginView();
    loginPage.draw();
  }
}

function showStartPage() {
  document.body.innerHTML = `
    <div class="start-page">
      <h1>Welcome to the Game!</h1>
      <button id="logout-btn" class="login-button">Logout</button>
    </div>
  `;

  document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('rss-puzzle-user');
    location.reload();
  });
}

initApp();
