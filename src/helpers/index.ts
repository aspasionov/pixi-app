const getRundomItemFromArray = <T>(array: T[]): T => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

const getRandomXposition = () => {
  return Math.floor(Math.random() * window.innerWidth);
};

export const FOOTER_AND_HEADER_HEIGHT = 120;
export const MILLISECONDS_PER_SECOND = 1000;
export const STAR_POINTS = 5;
export const SHAPE_SPAWN_Y_OFFSET = -100;
export const TRIANGLE_SIDES = 3;
export const SQUARE_SIDES = 4;
export const PENTAGON_SIDES = 5;
export const HEXAGON_SIDES = 6;
export const DEFAULT_GRAVITY = 2;
export const DEFAULT_SHAPES_PER_SECOND = 1;
export const BACKGROUND_COLOR = "#1099bb";

const throttle = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  let timeoutId: number | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    } else {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(
        () => {
          lastCall = Date.now();
          func(...args);
          timeoutId = null;
        },
        delay - (now - lastCall),
      );
    }
  };
};

export { getRundomItemFromArray, getRandomXposition, throttle };
