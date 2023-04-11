import { Vector2 } from "three";

export const LED_COUNTS = new Vector2(96, 75);

const FEET_PR_METER = 3.28084;
const STRIP_LENGTH_METERS = 2.5;
export const STRIP_LENGTH = STRIP_LENGTH_METERS * FEET_PR_METER; // feet
