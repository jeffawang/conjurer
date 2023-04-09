export const DEFAULT_BLOCK_DURATION = 3;
export const MAX_TIME = 90;
export const FRAMES_PER_SECOND = 60;

export const PIXELS_PER_SECOND = 40;

export const timeToX = (time: number) => `${time * PIXELS_PER_SECOND}px`;
export const xToTime = (x: number) => x / PIXELS_PER_SECOND;
