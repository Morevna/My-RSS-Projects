import { state } from './state/state';
import { renderGarage } from './views/garage';
import { renderWinners } from './views/winners';
import { createNavigation } from './components/navigation';

const root = document.createElement('div');
document.body.append(root);

const navigation = createNavigation(renderApp);
document.body.prepend(navigation);

function renderApp(): void {
  root.innerHTML = '';

  if (state.currentView === 'garage') {
    renderGarage(root);
  }

  if (state.currentView === 'winners') {
    renderWinners(root);
  }
}

renderApp();
