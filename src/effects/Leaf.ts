import { Pattern } from "@/src/types/Pattern";
import leaf from "./shaders/leaf.frag";

export const Leaf = () => {
  const params = {
    u_tiling: {
      name: "Tiling",
      value: 1,
    },
    u_coordinate_offset: {
      name: "Coordinate Offset",
      value: 0.5,
    },
    u_time_factor: {
      name: "Time Factor",
      value: 1,
    },
    u_time_offset: {
      name: "Time Offset",
      value: 0,
    },
  };
  return new Pattern<typeof params>("Leaf", leaf, params);
};
