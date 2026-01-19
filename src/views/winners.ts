// src/views/winners.ts
import { state } from '../state/state';
import { GarageHandlers, Car, Winner } from '../types';
import carSVGText from '../assets/car.svg?raw';

type WinnerWithDetails = Winner & Car;
const WINNERS_PER_PAGE = 10;

function createTableHead(handlers: GarageHandlers): HTMLElement {
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');

  const columns = [
    { id: 'number', text: 'Number' },
    { id: 'car', text: 'Car' },
    { id: 'name', text: 'Name' },
    { id: 'wins', text: 'Wins', sortable: true },
    { id: 'time', text: 'Best Time (s)', sortable: true },
  ];

  columns.forEach((col) => {
    const th = document.createElement('th');
    th.textContent = col.text;

    if (col.sortable === true) {
      th.classList.add('sortable');
      if (state.sort === col.id) {
        th.textContent += state.order === 'ASC' ? ' ↑' : ' ↓';
      }
      th.addEventListener('click', () => handlers.onSort(col.id as 'wins' | 'time'));
    }
    tr.append(th);
  });

  thead.append(tr);
  return thead;
}

function createWinnerRow(winner: WinnerWithDetails, index: number): HTMLTableRowElement {
  const row = document.createElement('tr');

  const numTd = document.createElement('td');
  numTd.textContent = String((state.winnersPage - 1) * WINNERS_PER_PAGE + index + 1);

  const svgTd = document.createElement('td');
  svgTd.className = 'winner-car-svg';
  svgTd.innerHTML = carSVGText;
  const svg = svgTd.querySelector('svg');
  if (svg) svg.style.fill = winner.color;

  const nameTd = document.createElement('td');
  nameTd.textContent = winner.name;

  const winsTd = document.createElement('td');
  winsTd.textContent = String(winner.wins);

  const timeTd = document.createElement('td');
  timeTd.textContent = String(winner.time);

  row.append(numTd, svgTd, nameTd, winsTd, timeTd);
  return row;
}

export function renderWinners(container: HTMLElement, handlers: GarageHandlers): void {
  container.innerHTML = '';

  const title = document.createElement('h1');
  title.textContent = `Winners (${state.winnersCount})`;

  const pageTitle = document.createElement('h2');
  pageTitle.textContent = `Page #${state.winnersPage}`;

  const table = document.createElement('table');
  table.className = 'winners-table';
  table.append(createTableHead(handlers));

  const tbody = document.createElement('tbody');
  state.winners.forEach((winner, index) => {
    tbody.append(createWinnerRow(winner as WinnerWithDetails, index));
  });

  table.append(tbody);

  const pagination = createPagination(handlers);
  container.append(title, pageTitle, table, pagination);
}

function createPagination(handlers: GarageHandlers): HTMLElement {
  const pagination = document.createElement('div');
  pagination.className = 'pagination';

  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'PREV';
  prevBtn.disabled = state.winnersPage <= 1;
  prevBtn.addEventListener('click', () => handlers.onWinnersPrev());

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'NEXT';
  const totalPages = Math.ceil(state.winnersCount / WINNERS_PER_PAGE);
  nextBtn.disabled = state.winnersPage >= totalPages || state.winnersCount === 0;
  nextBtn.addEventListener('click', () => handlers.onWinnersNext());

  pagination.append(prevBtn, nextBtn);
  return pagination;
}
