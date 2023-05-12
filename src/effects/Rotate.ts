import { Pattern } from "@/src/types/Pattern";
import rotate from "./shaders/rotate.frag";

export const Rotate = () => {
  const params = {
    u_speed: {
      name: "Speed",
      value: 5,
    },
  };
  return new Pattern<typeof params>("Rotate", rotate, params);
};
