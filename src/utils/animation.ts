//src/utils/animation.ts
import { startEngine, driveMode } from '../api/garage';

const CAR_OFFSET_PX = 100;
const MS_IN_SEC = 1000;
const DECIMAL_PLACES = 2;

export const animateCar = async (
  id: number,
): Promise<{ id: number; success: boolean; time: number }> => {
  const carTrack = document.querySelector(`[data-id="${id}"]`) as HTMLElement | null;
  const buttonA = carTrack?.querySelector('button:nth-child(3)') as HTMLButtonElement | null;

  if (buttonA !== null) buttonA.disabled = true;

  try {
    const { velocity, distance } = await startEngine(id);
    const timeInMs = Math.round(distance / velocity);
    const timeInSeconds = Number((timeInMs / MS_IN_SEC).toFixed(DECIMAL_PLACES));

    const carModel = carTrack?.querySelector('.car-svg') as HTMLElement | null;

    if (carModel !== null && carTrack !== null) {
      const trackWidth = carTrack.offsetWidth - CAR_OFFSET_PX;

      carModel.style.transition = `transform ${timeInMs}ms linear`;
      carModel.style.transform = `translateX(${trackWidth}px)`;

      const response = await driveMode(id);

      if (response.success === false) {
        const currentPos = getComputedStyle(carModel).transform;
        carModel.style.transition = 'none';
        carModel.style.transform = currentPos;
        return { id, success: false, time: timeInSeconds };
      }

      return { id, success: true, time: timeInSeconds };
    }

    return { id, success: false, time: 0 };
  } catch (error) {
    if (buttonA !== null) buttonA.disabled = false;
    console.error('Engine start failed:', error);
    return { id, success: false, time: 0 };
  }
};

export const resetAnimation = (id: number): void => {
  const carTrack = document.querySelector(`[data-id="${id}"]`) as HTMLElement | null;
  const carModel = carTrack?.querySelector('.car-svg') as HTMLElement | null;
  const buttonA = carTrack?.querySelector('button:nth-child(3)') as HTMLButtonElement | null;

  if (carModel !== null) {
    carModel.style.transition = 'none';
    carModel.style.transform = 'translateX(0)';
  }
  if (buttonA !== null) {
    buttonA.disabled = false;
  }
};
