// src/views/garage.ts
import { state } from '../state/state';
import { Car, GarageHandlers } from '../types/index';
import carSVGText from '../assets/car.svg?raw';
const CARS_PER_PAGE = 7;

function getCreateGroup(handlers: GarageHandlers): HTMLElement {
  const group = document.createElement('div');
  group.className = 'input-group';

  const nameInput = document.createElement('input');
  nameInput.id = 'create-name';
  nameInput.placeholder = 'Car name...';

  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  colorInput.id = 'create-color';

  const button = document.createElement('button');
  button.textContent = 'CREATE';
  button.addEventListener('click', (): void => {
    if (nameInput.value) {
      void handlers.onCreate(nameInput.value, colorInput.value);
      nameInput.value = '';
    }
  });

  group.append(nameInput, colorInput, button);
  return group;
}

function getUpdateGroup(handlers: GarageHandlers): HTMLElement {
  const group = document.createElement('div');
  group.className = 'input-group';

  const nameInput = document.createElement('input');
  nameInput.id = 'update-name';
  nameInput.placeholder = 'Select car to update...';
  nameInput.disabled = !state.selectedCar;
  if (state.selectedCar) nameInput.value = state.selectedCar.name;

  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  colorInput.id = 'update-color';
  colorInput.disabled = !state.selectedCar;
  if (state.selectedCar) colorInput.value = state.selectedCar.color;

  const button = document.createElement('button');
  button.textContent = 'UPDATE';
  button.disabled = !state.selectedCar;
  button.addEventListener('click', (): void => {
    if (state.selectedCar && nameInput.value) {
      void handlers.onUpdate(nameInput.value, colorInput.value);
    }
  });

  group.append(nameInput, colorInput, button);
  return group;
}

function getActionGroup(handlers: GarageHandlers): HTMLElement {
  const group = document.createElement('div');
  group.className = 'input-group';

  const raceButton = document.createElement('button');
  raceButton.textContent = 'RACE';
  raceButton.addEventListener('click', (): void => handlers.onRace());

  const resetButton = document.createElement('button');
  resetButton.textContent = 'RESET';
  resetButton.addEventListener('click', (): void => handlers.onReset());

  const genButton = document.createElement('button');
  genButton.textContent = 'GENERATE CARS';
  genButton.addEventListener('click', (): void => {
    void handlers.onGenerate();
  });

  group.append(raceButton, resetButton, genButton);
  return group;
}

function createControls(handlers: GarageHandlers): HTMLElement {
  const container = document.createElement('div');
  container.id = 'controls-block';

  container.append(getCreateGroup(handlers), getUpdateGroup(handlers), getActionGroup(handlers));
  return container;
}

function createCarItem(car: Car, handlers: GarageHandlers): HTMLDivElement {
  const item = document.createElement('div');
  item.className = 'car-track';
  item.dataset.id = car.id.toString();

  const controlPanel = document.createElement('div');
  controlPanel.className = 'car-controls';

  const selectButton = document.createElement('button');
  selectButton.textContent = 'SELECT';
  selectButton.addEventListener('click', (): void => handlers.onSelectCar(car));

  const removeButton = document.createElement('button');
  removeButton.textContent = 'REMOVE';
  removeButton.addEventListener('click', (): void => {
    void handlers.onRemove(car.id);
  });

  const engineA = document.createElement('button');
  engineA.textContent = 'A';
  engineA.addEventListener('click', (): void => {
    void handlers.onEngineStart(car.id);
  });

  const engineB = document.createElement('button');
  engineB.textContent = 'B';
  engineB.addEventListener('click', (): void => {
    void handlers.onEngineStop(car.id);
  });

  const carName = document.createElement('span');
  carName.className = 'car-name';
  carName.textContent = car.name;

  const svgWrapper = document.createElement('div');
  svgWrapper.className = 'car-svg';
  svgWrapper.innerHTML = carSVGText;
  const svg = svgWrapper.querySelector('svg');
  if (svg) svg.style.fill = car.color;

  controlPanel.append(selectButton, removeButton, engineA, engineB, carName);
  item.append(controlPanel, svgWrapper);
  return item;
}

function createPagination(handlers: GarageHandlers): HTMLElement {
  const pagination = document.createElement('div');
  pagination.id = 'pagination';

  const previousButton = document.createElement('button');
  previousButton.textContent = 'PREV';
  previousButton.disabled = state.garagePage <= 1;
  previousButton.addEventListener('click', (): void => handlers.onPrev());

  const nextButton = document.createElement('button');
  nextButton.textContent = 'NEXT';
  const totalPages = Math.ceil(state.carsCount / CARS_PER_PAGE);
  nextButton.disabled = state.garagePage >= totalPages || state.carsCount === 0;
  nextButton.addEventListener('click', (): void => handlers.onNext());

  pagination.append(previousButton, nextButton);
  return pagination;
}

export function renderGarage(container: HTMLElement, handlers: GarageHandlers): void {
  container.innerHTML = '';

  const title = document.createElement('h1');
  title.textContent = `Garage (${state.carsCount})`;

  const pageTitle = document.createElement('h2');
  pageTitle.textContent = `Page #${state.garagePage}`;

  const garageList = document.createElement('div');
  garageList.id = 'garage-list';
  state.cars.forEach((car) => garageList.append(createCarItem(car, handlers)));

  container.append(
    createControls(handlers),
    title,
    pageTitle,
    garageList,
    createPagination(handlers),
  );
}
