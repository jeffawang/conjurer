import {
  APEX_HEIGHT,
  APEX_RADIUS,
  BASE_RADIUS,
  LED_COUNTS,
  STRIP_LENGTH,
} from "../utils/size";
import { catenary } from "../utils/catenary";
import * as fs from "fs";
import { Vector2 } from "three";

export const saveJson = (filename: string, data: any) =>
  fs.writeFileSync(
    filename,
    JSON.stringify(data, (key, val) =>
      val.toFixed ? Number(val.toFixed(3)) : val
    )
  );

const CANOPY_GEOMETRY_OUTPUT_PATH = "./src/data/canopyGeometry.json";

const main = async () => {
  console.log("Generating canopy geometry...");

  const catenaryCoordinates = catenary(
    { x: APEX_RADIUS, y: APEX_HEIGHT },
    { x: BASE_RADIUS, y: 0 },
    STRIP_LENGTH,
    LED_COUNTS.y
  );
  const catenaryNormal = [];
  for (let i = 0; i < catenaryCoordinates.length; i++) {
    const point1Index = i === 0 ? 0 : i - 1;
    const point2Index = i === catenaryCoordinates.length - 1 ? i : i + 1;

    const x1 = catenaryCoordinates[point1Index][0];
    const y1 = catenaryCoordinates[point1Index][1];
    const x2 = catenaryCoordinates[point2Index][0];
    const y2 = catenaryCoordinates[point2Index][1];

    const slope = (y2 - y1) / (x2 - x1);
    const normalSlope = -1 / slope;
    const normal = new Vector2(1, normalSlope).normalize().toArray();
    if (normal[1] > 0) {
      normal[0] = -normal[0];
      normal[1] = -normal[1];
    }
    catenaryNormal.push(normal);
  }

  const uv = [];
  const position = [];
  const normal = [];
  for (let x = 0; x < LED_COUNTS.x; x++) {
    for (let y = 0; y < LED_COUNTS.y; y++) {
      const normalizedX = x / (LED_COUNTS.x - 1);
      const normalizedY = y / (LED_COUNTS.y - 1);
      const theta = (x / LED_COUNTS.x) * 2 * Math.PI;

      uv.push(normalizedX, normalizedY);
      position.push(
        catenaryCoordinates[y][0] * Math.cos(theta),
        catenaryCoordinates[y][0] * Math.sin(theta),
        -catenaryCoordinates[y][1]
      );
      normal.push(
        catenaryNormal[y][0] * Math.cos(theta),
        catenaryNormal[y][0] * Math.sin(theta),
        -catenaryNormal[y][1]
      );
    }
  }

  saveJson(CANOPY_GEOMETRY_OUTPUT_PATH, { position, uv, normal });
  console.log("Complete!", CANOPY_GEOMETRY_OUTPUT_PATH);
};

main();
