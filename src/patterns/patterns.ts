import GradientPattern from "@/src/patterns/GradientPattern";
import Rainbow from "@/src/patterns/Rainbow";
import SunCycle from "@/src/patterns/SunCycle";
import { Vector2 } from "three";

const patterns = [
  SunCycle(),
  Rainbow(),
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

export { patterns };
