import Clouds from "@/src/patterns/Clouds";
import Disc from "@/src/patterns/Disc";
import GradientPattern from "@/src/patterns/GradientPattern";
import Rainbow from "@/src/patterns/Rainbow";
import SunCycle from "@/src/patterns/SunCycle";
import LogSpirals from "./LogSpirals";
import Pattern from "@/src/types/Pattern";
import { Vector2 } from "three";

const patterns: Pattern[] = [
  Clouds(),
  SunCycle(),
  Disc(),
  Rainbow(),
  LogSpirals(),
  GradientPattern({
    u_blah: {
      name: "Blah",
      value: 0,
    },
    u_a: {
      name: "A",
      value: new Vector2(),
    },
  }),
];

const patternMap: { [key: string]: Pattern } = {};
for (const pattern of patterns) {
  patternMap[pattern.name] = pattern;
}

export { patterns, patternMap };
