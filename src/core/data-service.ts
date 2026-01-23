import { DATA_URL } from './constants';

export async function getLevelData(level: number) {
  const response = await fetch(
    `${DATA_URL}data/wordCollectionLevel${level}.json`,
  );
  return response.json();
}
