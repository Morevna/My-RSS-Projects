import { createHeader } from '../components/header';

export function renderMainPage(userName: string): HTMLElement {
  const container = document.createElement('div');
  container.className = 'main-page';

  const header = createHeader(userName);
  container.append(header);

  const mainContent = document.createElement('div');
  mainContent.className = 'main-content';
  mainContent.textContent = 'Main Page';
  container.append(mainContent);

  return container;
}
