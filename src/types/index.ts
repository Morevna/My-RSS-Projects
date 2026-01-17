//src/types/index.ts
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
  carsCount: number;
  selectedCar: Car | null;
};

export type GarageHandlers = {
  onCreate: (name: string, color: string) => Promise<void>;
  onUpdate: (name: string, color: string) => Promise<void>;
  onRace: () => void;
  onReset: () => void;
  onSelectCar: (car: Car) => void;
  onEngineStart: (id: number) => Promise<void>;
  onEngineStop: (id: number) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
  onPrev: () => void;
  onNext: () => void;
  onGenerate: () => Promise<void>;
};
