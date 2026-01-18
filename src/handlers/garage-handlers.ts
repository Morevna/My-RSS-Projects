import { state } from '../state/state';
import { getCars, createCar, deleteCar, updateCar, stopEngine } from '../api/garage';
import { animateCar, resetAnimation } from '../utils/animation';
import { generateRandomCarName, getRandomColor } from '../data/car-names';
import { GarageHandlers, Car } from '../types/index';
const PAGE_NEXT = 1;
const PAGE_PREV = -1;
const CARS_PER_PAGE = 7;

let refreshApp: () => void;

const updateState = async (): Promise<void> => {
  const { items, count } = await getCars(state.garagePage);
  if (items.length === 0 && count > 0 && state.garagePage > 1) {
    state.garagePage = Math.ceil(count / CARS_PER_PAGE);
    localStorage.setItem('garagePage', String(state.garagePage));
    await updateState();
    return;
  }
  state.cars = items;
  state.carsCount = count;
  refreshApp();
};

const handleCreate = async (name: string, color: string): Promise<void> => {
  await createCar(name, color);
  await updateState();
};

const handleRemove = async (id: number): Promise<void> => {
  await deleteCar(id);
  await updateState();
};

const handleUpdate = async (name: string, color: string): Promise<void> => {
  if (state.selectedCar) {
    await updateCar(state.selectedCar.id, name, color);
    state.selectedCar = null;
    await updateState();
  }
};

const handlePagination = async (direction: number): Promise<void> => {
  state.garagePage += direction;
  localStorage.setItem('garagePage', String(state.garagePage));
  await updateState();
};

const handleGenerate = async (): Promise<void> => {
  const promises = Array.from({ length: 100 }).map(() =>
    createCar(generateRandomCarName(), getRandomColor()),
  );
  await Promise.all(promises);
  await updateState();
};

export const initHandlers = (renderCallback: () => void): GarageHandlers => {
  refreshApp = renderCallback;

  return {
    onCreate: handleCreate,
    onRemove: handleRemove,
    onUpdate: handleUpdate,
    onNext: () => handlePagination(PAGE_NEXT),
    onPrev: () => handlePagination(PAGE_PREV),
    onGenerate: handleGenerate,
    onSelectCar: (car: Car): void => {
      state.selectedCar = car;
      refreshApp();
    },
    onRace: (): void => console.log('Race'),
    onReset: (): void => console.log('Reset'),
    onEngineStart: async (id: number): Promise<void> => {
      await animateCar(id);
    },
    onEngineStop: async (id: number): Promise<void> => {
      await stopEngine(id);
      resetAnimation(id);
    },
  };
};
