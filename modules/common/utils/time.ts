const PIXELS_PER_SECOND = 16;

export const timeToX = (time: number) => `${time * PIXELS_PER_SECOND}px`;
export const xToTime = (x: number) => x / PIXELS_PER_SECOND;
