import { renderLoginPage } from '../pages/login';
import { renderMainPage } from '../pages/main';
import { renderAboutPage } from '../pages/about';

let currentUser: string | null = null;

export function initRouter(): void {
  window.addEventListener('popstate', renderRoute);
  renderRoute();
}

export function navigate(path: string, userName?: string): void {
  if (userName) currentUser = userName;
  history.pushState({}, '', path);
  renderRoute();
}

function renderRoute(): void {
  const path = window.location.pathname;
  document.body.innerHTML = '';

  if (path === '/login') {
    document.body.append(renderLoginPage());
    return;
  }

  if (path === '/' || path === '/main') {
    if (!currentUser) {
      document.body.append(renderLoginPage());
      return;
    }
    document.body.append(renderMainPage(currentUser));
    return;
  }

  if (path === '/about') {
    document.body.append(renderAboutPage());
    return;
  }

  document.body.append(renderLoginPage());
}
