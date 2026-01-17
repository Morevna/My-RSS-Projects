// src/api/garage.ts
import type { Car } from '../state/state';

const BASE_URL = 'http://127.0.0.1:3000';
const GARAGE_ENDPOINT = '/garage';

export type CarsResponse = {
  cars: Car[];
  totalCount: number;
};

export async function getCars(page: number, limit: number): Promise<CarsResponse> {
  const response = await fetch(`${BASE_URL}${GARAGE_ENDPOINT}?_page=${page}&_limit=${limit}`);

  const cars: Car[] = await response.json();
  const totalCountHeader = response.headers.get('X-Total-Count');

  return {
    cars,
    totalCount: totalCountHeader == null ? 0 : Number(totalCountHeader),
  };
}
