// src/handlers/garage-handlers.ts
import { state } from '../state/state';
import {
  getCars,
  createCar,
  deleteCar,
  updateCar,
  stopEngine,
  getWinners,
  getCar,
  getWinner,
  updateWinner,
  createWinner,
} from '../api/garage';
import { animateCar, resetAnimation } from '../utils/animation';
import { generateRandomCarName, getRandomColor } from '../data/car-names';
import { GarageHandlers, Winner, Car } from '../types/index';

const PAGE_STEP = 1;
const WINNERS_PER_PAGE = 10;
let refreshApp: () => void;

// Helpers, State Update
export const updateWinnersState = async (): Promise<void> => {
  const { items, count } = await getWinners(
    state.winnersPage,
    state.sort,
    state.order,
    WINNERS_PER_PAGE,
  );
  state.winners = await Promise.all(
    items.map(async (w: Winner) => ({ ...w, ...(await getCar(w.id)) })),
  );
  state.winnersCount = count;
  refreshApp();
};

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

//Garage Methods
const handleCreate = async (name: string, color: string): Promise<void> => {
  await createCar(name, color);
  await updateState();
};

const handleRemove = async (id: number): Promise<void> => {
  await deleteCar(id);
  await updateState();
  await updateWinnersState();
};

const handleUpdate = async (name: string, color: string): Promise<void> => {
  if (state.selectedCar !== null) {
    await updateCar(state.selectedCar.id, name, color);
  }
  state.selectedCar = null;
  await updateState();
  await updateWinnersState();
};

const handlePagination = (direction: number): void => {
  state.garagePage += direction;
  localStorage.setItem('garagePage', String(state.garagePage));
  void updateState();
};

const handleGenerate = async (): Promise<void> => {
  const promises = Array.from({ length: 100 }, () =>
    createCar(generateRandomCarName(), getRandomColor()),
  );
  await Promise.all(promises);
  await updateState();
};

//Race Methods
const handleRace = async (): Promise<void> => {
  const tracks = document.querySelectorAll('.car-track');
  const ids = [...tracks].map((el) => Number((el as HTMLElement).dataset.id));
  const results = await Promise.all(ids.map((id) => animateCar(id)));
  const finished = results
    .filter((r): r is { id: number; success: true; time: number } => r.success)
    .sort((a, b) => a.time - b.time);

  if (finished.length > 0) {
    const winner = finished[0];
    alert(`Winner: ID ${winner.id} (${winner.time}s)`);
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

const handleReset = async (): Promise<void> => {
  const tracks = document.querySelectorAll('.car-track');
  const ids = [...tracks].map((el) => Number((el as HTMLElement).dataset.id));
  await Promise.all(
    ids.map(async (id) => {
      await stopEngine(id);
      resetAnimation(id);
    }),
  );
};

//Winners Methods
const handleWinnersPage = (direction: number): void => {
  state.winnersPage += direction;
  localStorage.setItem('winnersPage', String(state.winnersPage));
  void updateWinnersState();
};

//Final Handlers Object
export const initHandlers = (renderCallback: () => void): GarageHandlers => {
  refreshApp = renderCallback;
  return {
    onCreate: handleCreate,
    onRemove: handleRemove,
    onUpdate: handleUpdate,
    onNext: (): void => handlePagination(PAGE_STEP),
    onPrev: (): void => handlePagination(-PAGE_STEP),
    onGenerate: handleGenerate,
    onSelectCar: (car: Car): void => {
      state.selectedCar = car;
      refreshApp();
    },
    onRace: (): Promise<void> => handleRace(),
    onReset: (): Promise<void> => handleReset(),
    onEngineStart: async (id: number): Promise<void> => {
      await animateCar(id);
    },
    onEngineStop: async (id: number): Promise<void> => {
      await stopEngine(id);
      resetAnimation(id);
    },
    onWinnersNext: (): void => handleWinnersPage(PAGE_STEP),
    onWinnersPrev: (): void => handleWinnersPage(-PAGE_STEP),
    onSort: async (type: 'wins' | 'time'): Promise<void> => {
      state.order = state.sort === type && state.order === 'ASC' ? 'DESC' : 'ASC';
      state.sort = type;
      await updateWinnersState();
    },
  };
};
