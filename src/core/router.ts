// src/core/router.ts
import { createHeader } from '../components/header';
import { createFooter } from '../components/footer';
import { renderLoginPage } from '../pages/login';
import { renderAboutPage } from '../pages/about';
import { renderMainPage } from '../pages/main';
import { state } from './state';

type Routes = Record<string, () => HTMLElement>;

const routes: Routes = {
  '/': () => (!state.authenticated ? renderLoginPage() : renderMainPage()),
  '/login': () => (state.authenticated ? renderMainPage() : renderLoginPage()),
  '/about': renderAboutPage,
};

let mainLayout: HTMLElement | null = null;
let header: HTMLElement | null = null;
let lastPath = '';
let lastAuthState = state.authenticated;

function renderCurrentPath(): void {
  const path = window.location.hash.slice(1) || '/';
  if (path === lastPath && state.authenticated === lastAuthState) return;

  lastPath = path;
  lastAuthState = state.authenticated;

  const renderFunction = path in routes ? routes[path] : routes['/'];
  if (mainLayout) {
    mainLayout.replaceChildren(renderFunction());
  }
}

function initLayout(): void {
  header = createHeader(state.user || 'Guest');
  mainLayout = document.createElement('main');
  mainLayout.id = 'main-content';
  const footer = createFooter();

  document.body.append(header, mainLayout, footer);

  state.subscribe(() => {
    if (state.authenticated !== lastAuthState) {
      if (header) {
        const currentUserName = state.user || 'Guest';
        const newHeader = createHeader(currentUserName);
        document.body.replaceChild(newHeader, header);
        header = newHeader;
      }
      renderCurrentPath();
    }
  });
}

export function initRouter(): void {
  if (!mainLayout) {
    initLayout();
  }
  renderCurrentPath();

  window.addEventListener('hashchange', renderCurrentPath);
}

export function navigate(path: string): void {
  window.location.hash = path;
  renderCurrentPath();
}
