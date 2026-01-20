// src/handlers/garage-handlers.ts
import { showMessage } from '../components/message';
import { state } from '../state/state';
import {
  getCars,
  createCar,
  deleteCar,
  updateCar,
  stopEngine,
  getWinner,
  updateWinner,
  createWinner,
  getCar,
} from '../api/garage';
import { animateCar, resetAnimation } from '../utils/animation';
import { generateRandomCarName, getRandomColor } from '../data/car-names';
import { Car, GarageActions } from '../types/index';
import { updateWinnersState } from './winners-handlers';

const PAGE_STEP = 1;
const CARS_PER_GENERATION = 100;
let refreshApp: () => void;

//Logic Helpers

export const updateState = async (): Promise<void> => {
  const { items, count } = await getCars(state.garagePage);
  if (items.length === 0 && count > 0 && state.garagePage > 1) {
    state.garagePage = Math.ceil(count / 7);
    localStorage.setItem('garagePage', String(state.garagePage));
    await updateState();
    return;
  }
  state.cars = items;
  state.carsCount = count;
  refreshApp();
};

const handleRace = async (): Promise<void> => {
  const tracks = document.querySelectorAll('.car-track');
  const ids = [...tracks].map((el) => Number((el as HTMLElement).dataset.id));
  const results = await Promise.all(ids.map((id) => animateCar(id)));
  const finished = results
    .filter((r): r is { id: number; success: true; time: number } => r.success)
    .sort((a, b) => a.time - b.time);

  if (finished.length > 0) {
    const winner = finished[0];
    const carData = state.cars.find((c) => c.id === winner.id) || (await getCar(winner.id));
    showMessage(`${carData.name} went first (${winner.time}s)!`);
    const existing = await getWinner(winner.id);
    await (existing
      ? updateWinner(winner.id, {
          wins: existing.wins + 1,
          time: Math.min(winner.time, existing.time),
        })
      : createWinner({ id: winner.id, wins: 1, time: winner.time }));
    await updateWinnersState();
  }
};

//Split Actions with explicit return types
const getCarManagement = (): Pick<
  GarageActions,
  'onCreate' | 'onRemove' | 'onUpdate' | 'onSelectCar'
> => ({
  onCreate: async (n: string, c: string): Promise<void> => {
    await createCar(n, c);
    await updateState();
  },
  onRemove: async (id: number): Promise<void> => {
    await deleteCar(id);
    await updateState();
    await updateWinnersState();
  },
  onUpdate: async (n: string, c: string): Promise<void> => {
    if (state.selectedCar) await updateCar(state.selectedCar.id, n, c);
    state.selectedCar = null;
    await updateState();
    await updateWinnersState();
  },
  onSelectCar: (car: Car): void => {
    state.selectedCar = car;
    refreshApp();
  },
});

const getRaceAndEngine = (): Pick<
  GarageActions,
  'onRace' | 'onReset' | 'onEngineStart' | 'onEngineStop'
> => ({
  onRace: async (): Promise<void> => handleRace(),
  onReset: async (): Promise<void> => {
    const ids = [...document.querySelectorAll('.car-track')].map((el) =>
      Number((el as HTMLElement).dataset.id),
    );
    await Promise.all(
      ids.map(async (id) => {
        await stopEngine(id);
        resetAnimation(id);
      }),
    );
  },
  onEngineStart: async (id: number): Promise<void> => {
    await animateCar(id);
  },
  onEngineStop: async (id: number): Promise<void> => {
    await stopEngine(id);
    resetAnimation(id);
  },
});

const getNavigation = (): Pick<GarageActions, 'onNext' | 'onPrev' | 'onGenerate'> => ({
  onNext: (): void => {
    state.garagePage += PAGE_STEP;
    void updateState();
  },
  onPrev: (): void => {
    state.garagePage -= PAGE_STEP;
    void updateState();
  },
  onGenerate: async (): Promise<void> => {
    await Promise.all(
      Array.from({ length: CARS_PER_GENERATION }, () =>
        createCar(generateRandomCarName(), getRandomColor()),
      ),
    );
    await updateState();
  },
});

//Main Export
export const initGarageHandlers = (renderCallback: () => void): GarageActions => {
  refreshApp = renderCallback;
  return {
    ...getCarManagement(),
    ...getRaceAndEngine(),
    ...getNavigation(),
  };
};
