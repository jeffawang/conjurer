export const PIXELS_PER_SECOND = 40;

export const timeToX = (time: number) => `${time * PIXELS_PER_SECOND}px`;
export const xToTime = (x: number) => x / PIXELS_PER_SECOND;
