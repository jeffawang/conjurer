import {
  APEX_HEIGHT,
  APEX_RADIUS,
  BASE_RADIUS,
  LED_COUNTS,
  STRIP_LENGTH,
} from "../utils/size";
import { catenary } from "../utils/catenary";
import * as fs from "fs";

export const saveJson = (filename: string, data: any) =>
  fs.writeFileSync(filename, JSON.stringify(data));

const CANOPY_GEOMETRY_OUTPUT_PATH = "./src/data/canopyGeometry.json";

const main = async () => {
  console.log("Generating canopy geometry...");

  const catenaryCoordinates = catenary(
    { x: APEX_RADIUS, y: APEX_HEIGHT },
    { x: BASE_RADIUS, y: 0 },
    STRIP_LENGTH,
    LED_COUNTS.y
  );
  const ledPositions = [];
  const uv = [];
  for (let x = 0; x < LED_COUNTS.x; x++) {
    for (let y = 0; y < LED_COUNTS.y; y++) {
      const normalizedX = x / (LED_COUNTS.x - 1);
      const normalizedY = y / (LED_COUNTS.y - 1);
      const theta = normalizedX * 2 * Math.PI;

      uv.push(normalizedX, normalizedY);
      ledPositions.push(
        catenaryCoordinates[y][0] * Math.cos(theta),
        catenaryCoordinates[y][0] * Math.sin(theta),
        -catenaryCoordinates[y][1]
      );
    }
  }

  saveJson(CANOPY_GEOMETRY_OUTPUT_PATH, { position: ledPositions, uv });
  console.log("Complete!", CANOPY_GEOMETRY_OUTPUT_PATH);
};

main();
