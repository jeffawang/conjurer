import { Pattern } from "@/src/types/Pattern";
import sunCycle from "./shaders/sunCycle.frag";

export const SunCycle = () => {
  const params = {
    u_speed: {
      name: "Speed",
      value: 0.5,
    },
  };
  return new Pattern<typeof params>("Sun Cycle", sunCycle, params);
};
