// core/api/data-service.ts
import { ENV } from '../../app/env';

export async function getLevelData(level: number) {
  const response = await fetch(
    `${ENV.DATA_URL}data/wordCollectionLevel${level}.json`,
  );
  return response.json();
}
