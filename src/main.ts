import { state } from './state/state';
import { renderGarage } from './views/garage';
import { renderWinners } from './views/winners';
import { createNavigation } from './components/navigation';
import { initHandlers } from './handlers/garage-handlers';
import { getCars } from './api/garage';
import './style.css';

const appContainer = document.createElement('div');
appContainer.id = 'app';
document.body.append(appContainer);

const handlers = initHandlers(renderApp);

function renderApp(): void {
  appContainer.innerHTML = '';

  const nav = createNavigation(renderApp);
  appContainer.append(nav);

  const viewContainer = document.createElement('div');
  appContainer.append(viewContainer);

  if (state.currentView === 'garage') {
    renderGarage(viewContainer, handlers);
  } else {
    renderWinners(viewContainer);
  }
}

try {
  const { items, count } = await getCars(state.garagePage);
  state.cars = items;
  state.carsCount = count;
  renderApp();
} catch (error) {
  console.error('Failed to load app:', error);
}
