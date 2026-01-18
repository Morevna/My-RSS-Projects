import { startEngine, driveMode } from '../api/garage';

const CAR_OFFSET_PX = 100;

export const animateCar = async (id: number): Promise<void> => {
  const carTrack = document.querySelector(`[data-id="${id}"]`) as HTMLElement | null;
  const btnA = carTrack?.querySelector('button:nth-child(3)') as HTMLButtonElement | null;

  if (btnA !== null) btnA.disabled = true;

  try {
    const { velocity, distance } = await startEngine(id);
    const time = Math.round(distance / velocity);

    const carModel = carTrack?.querySelector('.car-svg') as HTMLElement | null;

    if (carModel !== null && carTrack !== null) {
      const trackWidth = carTrack.offsetWidth - CAR_OFFSET_PX;

      carModel.style.transition = `transform ${time}ms linear`;
      carModel.style.transform = `translateX(${trackWidth}px)`;

      const response = await driveMode(id);

      if (response.success === false) {
        const currentPos = getComputedStyle(carModel).transform;
        carModel.style.transition = 'none';
        carModel.style.transform = currentPos;
      }
    }
  } catch (error) {
    if (btnA !== null) btnA.disabled = false;
    console.error('Engine start failed:', error);
  }
};

export const resetAnimation = (id: number): void => {
  const carTrack = document.querySelector(`[data-id="${id}"]`) as HTMLElement | null;
  const carModel = carTrack?.querySelector('.car-svg') as HTMLElement | null;
  const btnA = carTrack?.querySelector('button:nth-child(3)') as HTMLButtonElement | null;

  if (carModel !== null) {
    carModel.style.transition = 'none';
    carModel.style.transform = 'translateX(0)';
  }
  if (btnA !== null) {
    btnA.disabled = false;
  }
};
