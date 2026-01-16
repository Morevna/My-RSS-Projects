import { state } from '../state/state';

export function renderGarage(container: HTMLElement): void {
  const title = document.createElement('h1');
  title.textContent = `Garage (Page #${state.garagePage})`;

  container.append(title);
}
