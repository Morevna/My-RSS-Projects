// src/state/state.ts
import { AppState } from '../types';

const getInitialPage = (): number => {
  const saved = localStorage.getItem('garagePage');
  if (saved !== null) {
    return Number(saved);
  }
  return 1;
};

const getInitialView = (): 'garage' | 'winners' => {
  const saved = localStorage.getItem('currentView');
  if (saved === 'garage' || saved === 'winners') {
    return saved;
  }
  return 'garage';
};

export const state: AppState = {
  currentView: getInitialView(),
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
