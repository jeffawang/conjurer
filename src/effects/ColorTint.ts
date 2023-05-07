import { Pattern } from "@/src/types/Pattern";
import colorTint from "./shaders/colorTint.frag";
import { Vector4 } from "three";

type ColorTintParams = {
  u_color: {
    name: "Color";
    value: Vector4;
  };
  u_intensity: {
    name: "Intensity";
    value: number;
  };
};

const ColorTint = () =>
  new Pattern<ColorTintParams>("Color Tint", colorTint, {
    u_color: {
      name: "Color",
      value: new Vector4(1, 0, 0, 1),
    },
    u_intensity: {
      name: "Intensity",
      value: 0.3,
    },
  });

export default ColorTint;
