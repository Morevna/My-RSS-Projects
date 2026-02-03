//src/pages/main.ts
import './styles.css';
export function renderMainPage(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'main-page';

  const mainContent = document.createElement('div');
  mainContent.className = 'main-content';
  mainContent.textContent = 'Main Page';
  container.append(mainContent);

  return container;
}
