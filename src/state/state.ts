export type Car = {
  id: number;
  name: string;
  color: string;
};

export type Winner = {
  id: number;
  wins: number;
  time: number;
};

export type AppState = {
  currentView: 'garage' | 'winners';
  garagePage: number;
  winnersPage: number;
  cars: Car[];
  winners: Winner[];
};

export const state: AppState = {
  currentView: 'garage',
  garagePage: 1,
  winnersPage: 1,
  cars: [],
  winners: [],
};
