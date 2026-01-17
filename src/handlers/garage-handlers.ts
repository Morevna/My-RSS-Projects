import { state } from '../state/state';
import { getCars, createCar, deleteCar, updateCar } from '../api/garage';
import { generateRandomCarName, getRandomColor } from '../data/car-names';
import { GarageHandlers, Car } from '../types/index';
const PAGE_NEXT = 1;
const PAGE_PREV = -1;

let refreshApp: () => void;

const updateState = async (): Promise<void> => {
  const { items, count } = await getCars(state.garagePage);
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
    onEngineStart: async (id: number): Promise<void> => console.log('Start', id),
    onEngineStop: async (id: number): Promise<void> => console.log('Stop', id),
  };
};
