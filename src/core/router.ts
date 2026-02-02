import { createHeader } from '../components/header';
import { createFooter } from '../components/footer';
import { renderLoginPage } from '../pages/login';
import { renderAboutPage } from '../pages/about';
import { renderMainPage } from '../pages/main';
import { state } from './state';

type Routes = Record<string, () => HTMLElement>;

const routes: Routes = {
  '/': () => {
    if (!state.authenticated) {
      window.history.pushState({}, '', '/login');
      return renderLoginPage();
    }
    return renderMainPage();
  },
  '/login': () => {
    if (state.authenticated) {
      window.history.pushState({}, '', '/');
      return renderMainPage();
    }
    return renderLoginPage();
  },
  '/about': renderAboutPage,
};

export function navigate(path: string): void {
  window.history.pushState({}, '', path);
  initRouter();
}

let mainLayout: HTMLElement | null = null;
let header: HTMLElement | null = null;
function initLayout(): void {
  header = createHeader(state.user || 'Guest');

  mainLayout = document.createElement('main');
  mainLayout.id = 'main-content';

  const footer = createFooter();

  document.body.append(header, mainLayout, footer);

  state.subscribe(() => {
    if (header) {
      const newHeader = createHeader(state.user || 'Guest');
      document.body.replaceChild(newHeader, header);
      header = newHeader;
    }

    if (mainLayout) {
      const path = window.location.pathname;
      const renderFunction = path in routes ? routes[path] : routes['/'];
      mainLayout.innerHTML = '';
      mainLayout.appendChild(renderFunction());
    }
  });
}

export function initRouter(): void {
  if (!mainLayout) {
    initLayout();
  }

  const path = window.location.pathname;
  const renderFunction = path in routes ? routes[path] : routes['/'];

  if (mainLayout) {
    mainLayout.innerHTML = '';
    mainLayout.appendChild(renderFunction());
  }
}
