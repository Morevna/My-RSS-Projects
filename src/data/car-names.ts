// src/data/car-names.ts
export const brands = [
  'Tesla',
  'Ford',
  'BMW',
  'Audi',
  'Mercedes',
  'Toyota',
  'Honda',
  'Nissan',
  'Chevrolet',
  'Lexus',
];

export const models = [
  'Model S',
  'Mustang',
  'X5',
  'A4',
  'C-Class',
  'Corolla',
  'Civic',
  'Altima',
  'Camaro',
  'RX 350',
];

const NAME_PARTS = 6;
const COLOR_MAX = 16;

export function getRandomItem(array: string[]): string {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < NAME_PARTS; i++) {
    color += letters[Math.floor(Math.random() * COLOR_MAX)];
  }
  return color;
}

export function generateRandomCarName(): string {
  return `${getRandomItem(brands)} ${getRandomItem(models)}`;
}
