import { renderLoginPage } from '../pages/login';
import { renderMainPage } from '../pages/main';
import { renderAboutPage } from '../pages/about';

export function initRouter(): void {
  window.addEventListener('popstate', renderRoute);
  renderRoute();
}

export function navigate(path: string): void {
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
    document.body.append(renderMainPage());
    return;
  }

  if (path === '/about') {
    document.body.append(renderAboutPage());
    return;
  }

  document.body.append(renderLoginPage());
}
