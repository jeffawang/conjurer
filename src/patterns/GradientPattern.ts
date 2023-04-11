import Pattern from "@/src/types/Pattern";
import gradient from "./shaders/gradient.frag";
import { Vector2 } from "three";

type params = {
  u_blah: {
    name: "Blah";
    value: number;
  };
  u_a: {
    name: "A";
    value: Vector2;
  };
};

const GradientPattern = (p: params) => new Pattern("Gradient", gradient, p);
export default GradientPattern;
