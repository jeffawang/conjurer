import Clouds from "@/src/patterns/Clouds";
import Disc from "@/src/patterns/Disc";
import BlahPattern from "@/src/patterns/BlahPattern";
import Rainbow from "@/src/patterns/Rainbow";
import SunCycle from "@/src/patterns/SunCycle";
import LogSpirals from "./LogSpirals";
import Pattern from "@/src/types/Pattern";

const patterns: Pattern[] = [
  LogSpirals(),
  SunCycle(),
  Disc(),
  Rainbow(),
  BlahPattern(),
  Clouds(),
];

const patternMap: { [key: string]: Pattern } = {};
for (const pattern of patterns) {
  patternMap[pattern.name] = pattern;
}

export { patterns, patternMap };
