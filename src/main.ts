// src/main.ts
import { state } from './state/state';
import { renderGarage } from './views/garage';
import { renderWinners } from './views/winners';
import { createNavigation } from './components/navigation';
import { initGarageHandlers, updateState } from './handlers/garage-handlers';
import { initWinnersHandlers, updateWinnersState } from './handlers/winners-handlers';
import './style.css';

const appContainer = document.createElement('div');
appContainer.id = 'app';
document.body.append(appContainer);

const garageHandlers = initGarageHandlers(renderApp);
const winnersHandlers = initWinnersHandlers(renderApp);

const handlers = { ...garageHandlers, ...winnersHandlers };

function renderApp(): void {
  appContainer.innerHTML = '';

  const nav = createNavigation(() => {
    const updateFunc = state.currentView === 'garage' ? updateState : updateWinnersState;
    updateFunc().catch(console.error);
  });

  appContainer.append(nav);

  const viewContainer = document.createElement('div');
  appContainer.append(viewContainer);

  if (state.currentView === 'garage') {
    renderGarage(viewContainer, handlers);
  } else {
    renderWinners(viewContainer, handlers);
  }
}

try {
  await (state.currentView === 'garage' ? updateState() : updateWinnersState());
} catch (error) {
  console.error('Failed to load app:', error);
  renderApp();
}
