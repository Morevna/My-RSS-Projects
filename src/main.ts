import { state } from './state/state';
import { renderGarage } from './views/garage';
import { renderWinners } from './views/winners';
import { createNavigation } from './components/navigation';
import { initHandlers, updateState, updateWinnersState } from './handlers/garage-handlers';
import './style.css';

const appContainer = document.createElement('div');
appContainer.id = 'app';
document.body.append(appContainer);

const handlers = initHandlers(renderApp);

function renderApp(): void {
  appContainer.innerHTML = '';

  const nav = createNavigation(() => {
    (state.currentView === 'garage' ? updateState : updateWinnersState)().catch(console.error);
  });

  appContainer.append(nav);

  const viewContainer = document.createElement('div');
  appContainer.append(viewContainer);

  (state.currentView === 'garage' ? renderGarage : renderWinners)(viewContainer, handlers);
}

try {
  await (state.currentView === 'garage' ? updateState : updateWinnersState)();
} catch (error) {
  console.error('Failed to load app:', error);
  renderApp();
}
