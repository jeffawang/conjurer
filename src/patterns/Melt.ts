import { Pattern } from "@/src/types/Pattern";
import melt from "./shaders/melt.frag";

export const Melt = () => {
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
  return new Pattern<typeof params>("Melt", melt, params);
};