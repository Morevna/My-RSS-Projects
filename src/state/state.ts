// src/state/state.ts
import { AppState } from '../types';

const getInitialPage = (): number => {
  const saved = localStorage.getItem('garagePage');
  if (saved !== null) {
    return Number(saved);
  }
  return 1;
};

export const state: AppState = {
  currentView: 'garage',
  garagePage: getInitialPage(),
  winnersPage: 1,
  cars: [],
  winners: [],
  carsCount: 0,
  winnersCount: 0,
  selectedCar: null,
  sort: 'wins',
  order: 'ASC',
};
