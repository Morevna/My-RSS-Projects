// src/pages/about.ts
import './styles.css';
import { navigate } from '../core/router';

export function renderAboutPage(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'about-page';

  const title = document.createElement('h1');
  title.textContent = 'About Fun Chat';

  const description = document.createElement('p');
  description.textContent =
    'Fun Chat is a simple SPA chat application built with TypeScript.';

  const authorLink = document.createElement('a');
  authorLink.href = 'https://github.com/Morevna';
  authorLink.textContent = 'Maria Breslavets';
  authorLink.target = '_blank';
  authorLink.rel = 'noopener noreferrer';

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.textContent = 'Back';

  backButton.addEventListener('click', () => {
    navigate('/');
  });

  container.append(title, description, authorLink, backButton);

  return container;
}
