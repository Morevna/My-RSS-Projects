import { navigate } from '../core/router';

export function createAboutButton(): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'About';

  button.addEventListener('click', () => {
    navigate('/about');
  });
  return button;
}
