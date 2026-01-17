// src/views/garage.ts
import { state } from '../state/state';
import { Car, GarageHandlers } from '../types';
import carSVGText from '../assets/car.svg?raw';

function createControls(handlers: GarageHandlers): HTMLElement {
  const container = document.createElement('div');
  container.id = 'controls-block';

  const createGroup = document.createElement('div');
  createGroup.className = 'input-group';
  const nameInput = document.createElement('input');
  nameInput.id = 'create-name';
  nameInput.placeholder = 'Car name...';
  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  colorInput.id = 'create-color';
  colorInput.value = '#e67e22';
  const createBtn = document.createElement('button');
  createBtn.textContent = 'CREATE';
  createBtn.addEventListener('click', (): void => {
    if (nameInput.value) {
      handlers.onCreate(nameInput.value, colorInput.value);
      nameInput.value = '';
    }
  });
  createGroup.append(nameInput, colorInput, createBtn);

  const actionGroup = document.createElement('div');
  actionGroup.className = 'input-group';
  const genBtn = document.createElement('button');
  genBtn.textContent = 'GENERATE 100 CARS';
  genBtn.addEventListener('click', (): void => {
    handlers.onGenerate();
  });
  actionGroup.append(genBtn);

  container.append(createGroup, actionGroup);
  return container;
}

function createPagination(handlers: GarageHandlers): HTMLElement {
  const pagination = document.createElement('div');
  pagination.id = 'pagination';

  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'PREV';
  prevBtn.disabled = state.garagePage <= 1;
  prevBtn.addEventListener('click', (): void => {
    handlers.onPrev();
  });

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'NEXT';
  const totalPages = Math.ceil(state.carsCount / 7);
  nextBtn.disabled = state.garagePage >= totalPages || state.carsCount === 0;
  nextBtn.addEventListener('click', (): void => {
    handlers.onNext();
  });

  pagination.append(prevBtn, nextBtn);
  return pagination;
}

function createCarItem(car: Car, handlers: GarageHandlers): HTMLDivElement {
  const item = document.createElement('div');
  item.className = 'car-track';
  const controlPanel = document.createElement('div');

  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'REMOVE';
  removeBtn.addEventListener('click', (): void => {
    handlers.onRemove(car.id);
  });

  const carName = document.createElement('span');
  carName.className = 'car-name';
  carName.textContent = car.name;

  const svgWrapper = document.createElement('div');
  svgWrapper.className = 'car-svg';
  svgWrapper.innerHTML = carSVGText;
  const svg = svgWrapper.querySelector('svg');
  if (svg) svg.style.fill = car.color;

  controlPanel.append(removeBtn, carName);
  item.append(controlPanel, svgWrapper);
  return item;
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
