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

  const btn = document.createElement('button');
  btn.textContent = 'CREATE';
  btn.addEventListener('click', (): void => {
    if (nameInput.value) {
      void handlers.onCreate(nameInput.value, colorInput.value);
      nameInput.value = '';
    }
  });

  group.append(nameInput, colorInput, btn);
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

  const btn = document.createElement('button');
  btn.textContent = 'UPDATE';
  btn.disabled = !state.selectedCar;
  btn.addEventListener('click', (): void => {
    if (state.selectedCar && nameInput.value) {
      void handlers.onUpdate(nameInput.value, colorInput.value);
    }
  });

  group.append(nameInput, colorInput, btn);
  return group;
}

function getActionGroup(handlers: GarageHandlers): HTMLElement {
  const group = document.createElement('div');
  group.className = 'input-group';

  const raceBtn = document.createElement('button');
  raceBtn.textContent = 'RACE';
  raceBtn.addEventListener('click', (): void => handlers.onRace());

  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'RESET';
  resetBtn.addEventListener('click', (): void => handlers.onReset());

  const genBtn = document.createElement('button');
  genBtn.textContent = 'GENERATE CARS';
  genBtn.addEventListener('click', (): void => {
    void handlers.onGenerate();
  });

  group.append(raceBtn, resetBtn, genBtn);
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

  const controlPanel = document.createElement('div');
  controlPanel.className = 'car-controls';

  const selectBtn = document.createElement('button');
  selectBtn.textContent = 'SELECT';
  selectBtn.addEventListener('click', (): void => handlers.onSelectCar(car));

  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'REMOVE';
  removeBtn.addEventListener('click', (): void => {
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

  controlPanel.append(selectBtn, removeBtn, engineA, engineB, carName);
  item.append(controlPanel, svgWrapper);
  return item;
}

function createPagination(handlers: GarageHandlers): HTMLElement {
  const pagination = document.createElement('div');
  pagination.id = 'pagination';

  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'PREV';
  prevBtn.disabled = state.garagePage <= 1;
  prevBtn.addEventListener('click', (): void => handlers.onPrev());

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'NEXT';
  const totalPages = Math.ceil(state.carsCount / CARS_PER_PAGE);
  nextBtn.disabled = state.garagePage >= totalPages || state.carsCount === 0;
  nextBtn.addEventListener('click', (): void => handlers.onNext());

  pagination.append(prevBtn, nextBtn);
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
