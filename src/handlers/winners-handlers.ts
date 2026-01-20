// src/handlers/winners-handlers.ts
import { state } from '../state/state';
import { getWinners, getCar } from '../api/garage';
import { Winner, WinnersActions } from '../types/index';

const WINNERS_PER_PAGE = 10;
const PAGE_STEP = 1;
let refreshApp: () => void;

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

export const initWinnersHandlers = (renderCallback: () => void): WinnersActions => {
  refreshApp = renderCallback;
  return {
    onWinnersNext: (): void => {
      state.winnersPage += PAGE_STEP;
      localStorage.setItem('winnersPage', String(state.winnersPage));
      void updateWinnersState();
    },
    onWinnersPrev: (): void => {
      state.winnersPage -= PAGE_STEP;
      localStorage.setItem('winnersPage', String(state.winnersPage));
      void updateWinnersState();
    },
    onSort: async (type: 'wins' | 'time'): Promise<void> => {
      state.order = state.sort === type && state.order === 'ASC' ? 'DESC' : 'ASC';
      state.sort = type;
      await updateWinnersState();
    },
  };
};
