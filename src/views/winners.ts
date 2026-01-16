import { state } from '../state/state';

export function renderWinners(container: HTMLElement): void {
  const title = document.createElement('h1');
  title.textContent = `Winners (Page #${state.winnersPage})`;

  container.append(title);
}
