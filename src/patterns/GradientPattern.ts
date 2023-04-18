import Pattern from "@/src/types/Pattern";
import gradient from "./shaders/gradient.frag";
import { Vector2 } from "three";

type GradientPatternParams = {
  u_blah: {
    name: "Blah";
    value: number;
  };
  u_a: {
    name: "A";
    value: Vector2;
  };
};

const GradientPattern = (p: GradientPatternParams) =>
  new Pattern<GradientPatternParams>("Gradient", gradient, p);
export default GradientPattern;
