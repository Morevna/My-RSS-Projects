import { Car } from '../types';

const BASE_URL = 'http://127.0.0.1:3000';

export async function getCars(page: number, limit = 7): Promise<{ items: Car[]; count: number }> {
  const response = await fetch(`${BASE_URL}/garage?_page=${page}&_limit=${limit}`);
  const items = (await response.json()) as Car[];

  const totalCountHeader = response.headers.get('X-Total-Count');

  let count = 0;
  count = totalCountHeader === null ? Math.max(items.length, 0) : Number(totalCountHeader);

  return {
    items,
    count,
  };
}

export async function createCar(name: string, color: string): Promise<Car> {
  const response = await fetch(`${BASE_URL}/garage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });
  return response.json();
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
  return response.json();
}
