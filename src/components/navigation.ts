import { state } from '../state/state';

export function createNavigation(onNavigate: () => void): HTMLElement {
  const nav = document.createElement('nav');

  const garageButton = document.createElement('button');
  garageButton.textContent = 'TO GARAGE';

  const winnersButton = document.createElement('button');
  winnersButton.textContent = 'TO WINNERS';

  garageButton.addEventListener('click', (): void => {
    state.currentView = 'garage';
    onNavigate();
  });

  winnersButton.addEventListener('click', (): void => {
    state.currentView = 'winners';
    onNavigate();
  });

  nav.append(garageButton, winnersButton);
  return nav;
}
