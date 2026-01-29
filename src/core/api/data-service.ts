// core/api/data-service.ts
import { ENV } from '../../app/env';
import type { ILevelData } from '../types/types';

export async function getLevelData(level: number): Promise<ILevelData> {
  const response = await fetch(
    `${ENV.DATA_URL}data/wordCollectionLevel${level}.json`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch level data: ${response.statusText}`);
  }
  return response.json() as Promise<ILevelData>;
}
