import GradientPattern from "@/modules/patterns/GradientPattern";
import TestPattern from "@/modules/patterns/TestPattern";
import { Vector2 } from "three";

const patterns = [
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
  TestPattern(),
];
export { patterns };
