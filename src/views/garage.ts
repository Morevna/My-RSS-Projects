// src/views/garage.ts
import { state, Car } from '../state/state';
import { getCars } from '../api/garage';
import './garage.css';
import carSVGText from '../assets/car.svg?raw';
const CARS_PER_PAGE = 7;

function renderGarageSkeleton(container: HTMLElement): void {
  container.innerHTML = `
    <h1>Garage</h1>
    <h2 id="total-count"></h2>
    <span id="page-info"></span>
    <div id="cars-list" class="cars-list"></div>
    <div class="pagination">
      <button id="prev-btn">Previous</button>
      <button id="next-btn">Next</button>
    </div>
  `;
}

// Отрисовка машины
function renderCar(car: Car): HTMLDivElement {
  const carItem = document.createElement('div');
  carItem.className = 'car-item';
  carItem.innerHTML = carSVGText;

  carItem.querySelectorAll<SVGElement>('path').forEach((path) => {
    path.setAttribute('fill', car.color);
  });

  const label = document.createElement('p');
  label.textContent = `${car.name}`;
  carItem.append(label);

  return carItem;
}

// Настройка кнопок пагинации
function setupPagination(container: HTMLElement, totalPages: number): void {
  const prevBtn = container.querySelector('#prev-btn') as HTMLButtonElement;
  const nextBtn = container.querySelector('#next-btn') as HTMLButtonElement;
  const pageInfo = container.querySelector('#page-info') as HTMLElement;

  prevBtn.disabled = state.garagePage === 1;
  nextBtn.disabled = state.garagePage >= totalPages;
  pageInfo.textContent = `Page #${state.garagePage}`;

  prevBtn.addEventListener('click', (): void => {
    state.garagePage--;
    renderGarage(container);
  });

  nextBtn.addEventListener('click', (): void => {
    state.garagePage++;
    renderGarage(container);
  });
}

// Главная функция
export async function renderGarage(container: HTMLElement): Promise<void> {
  const { cars, totalCount }: { cars: Car[]; totalCount: number } = await getCars(
    state.garagePage,
    CARS_PER_PAGE,
  );

  state.cars = cars;
  const totalPages = Math.ceil(totalCount / CARS_PER_PAGE);

  renderGarageSkeleton(container);

  container.querySelector('#total-count')!.textContent = `Total cars: ${totalCount}`;

  const carsList = container.querySelector('#cars-list')!;
  cars.forEach((car) => carsList.append(renderCar(car)));

  setupPagination(container, totalPages);
}
