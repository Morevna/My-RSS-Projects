// src/state/state.ts
import { AppState } from '../types';

export const state: AppState = {
  currentView: 'garage',
  garagePage: 1,
  winnersPage: 1,
  cars: [],
  winners: [],
  carsCount: 0,
};
