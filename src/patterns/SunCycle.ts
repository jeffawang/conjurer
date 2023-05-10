import { Pattern } from "@/src/types/Pattern";
import sunCycle from "./shaders/sunCycle.frag";

export const SunCycle = () => {
  const params = {
    u_time_factor: {
      name: "Time Factor",
      value: 1,
    },
    u_time_offset: {
      name: "Time Offset",
      value: 0,
    },
  };
  return new Pattern<typeof params>("Sun Cycle", sunCycle, params);
};
