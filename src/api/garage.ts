//src/api/garage.ts
import { Car, GetWinnersResponse, Winner } from '../types';

const BASE_URL = 'http://127.0.0.1:3000';

export async function startEngine(id: number): Promise<{ velocity: number; distance: number }> {
  const response = await fetch(`${BASE_URL}/engine?id=${id}&status=started`, { method: 'PATCH' });
  return response.json() as Promise<{ velocity: number; distance: number }>;
}

export async function stopEngine(id: number): Promise<void> {
  await fetch(`${BASE_URL}/engine?id=${id}&status=stopped`, { method: 'PATCH' });
}

export async function driveMode(id: number): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${BASE_URL}/engine?id=${id}&status=drive`, { method: 'PATCH' });
    if (response.status === 500) return { success: false };
    return (await response.json()) as { success: boolean };
  } catch {
    return { success: false };
  }
}

export async function getCars(page: number, limit = 7): Promise<{ items: Car[]; count: number }> {
  const response = await fetch(`${BASE_URL}/garage?_page=${page}&_limit=${limit}`);
  const items = (await response.json()) as Car[];
  const totalCountHeader = response.headers.get('X-Total-Count');
  const count = totalCountHeader === null ? Math.max(items.length, 0) : Number(totalCountHeader);

  return { items, count };
}

export async function createCar(name: string, color: string): Promise<Car> {
  const response = await fetch(`${BASE_URL}/garage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });
  return response.json() as Promise<Car>;
}

export async function deleteCar(id: number): Promise<void> {
  await fetch(`${BASE_URL}/garage/${id}`, { method: 'DELETE' });
  await fetch(`${BASE_URL}/winners/${id}`, { method: 'DELETE' }).catch(() => {});
}

export async function updateCar(id: number, name: string, color: string): Promise<Car> {
  const response = await fetch(`${BASE_URL}/garage/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });
  return response.json() as Promise<Car>;
}

export async function getWinners(
  page: number,
  sort: string | null,
  order: string | null,
  limit = 10,
): Promise<GetWinnersResponse> {
  const sortPart = sort === null ? '' : `&_sort=${sort}`;
  const orderPart = order === null ? '' : `&_order=${order}`;

  const response = await fetch(
    `${BASE_URL}/winners?_page=${page}&_limit=${limit}${sortPart}${orderPart}`,
  );

  const items = (await response.json()) as Winner[];
  const totalCountHeader = response.headers.get('X-Total-Count');
  const count = totalCountHeader === null ? items.length : Number(totalCountHeader);

  return { items, count };
}

//
export async function getWinner(id: number): Promise<Winner | null> {
  const response = await fetch(`${BASE_URL}/winners/${id}`);
  if (response.status === 404) return null;
  return response.json() as Promise<Winner>;
}

export async function createWinner(winner: Winner): Promise<void> {
  await fetch(`${BASE_URL}/winners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(winner),
  });
}

export async function updateWinner(id: number, winner: Omit<Winner, 'id'>): Promise<void> {
  await fetch(`${BASE_URL}/winners/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(winner),
  });
}

export async function getCar(id: number): Promise<Car> {
  const response = await fetch(`${BASE_URL}/garage/${id}`);
  return response.json() as Promise<Car>;
}
