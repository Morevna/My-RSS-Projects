import { state } from '../state/state';
import { getCars, createCar, deleteCar } from '../api/garage';
import { generateRandomCarName, getRandomColor } from '../data/car-names';
import { GarageHandlers, Car } from '../types';

let refreshApp: () => void;

const updateState = async (): Promise<void> => {
  const { items, count } = await getCars(state.garagePage);
  state.cars = items;
  state.carsCount = count;
  refreshApp();
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
    onCreate: async (name: string, color: string): Promise<void> => {
      await createCar(name, color);
      await updateState();
    },
    onRemove: async (id: number): Promise<void> => {
      await deleteCar(id);
      await updateState();
    },
    onNext: async (): Promise<void> => {
      state.garagePage += 1;
      await updateState();
    },
    onPrev: async (): Promise<void> => {
      state.garagePage -= 1;
      await updateState();
    },
    onGenerate: handleGenerate,
    onUpdate: async (n: string, c: string): Promise<void> => {
      console.log(n, c);
    },
    onRace: (): void => {
      console.log('Race');
    },
    onReset: (): void => {
      console.log('Reset');
    },
    onSelectCar: (car: Car): void => {
      console.log(car);
    },
    onEngineStart: async (id: number): Promise<void> => {
      console.log(id);
    },
    onEngineStop: async (id: number): Promise<void> => {
      console.log(id);
    },
  };
};
