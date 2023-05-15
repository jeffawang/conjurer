import { Pattern } from "@/src/types/Pattern";
import fire from "./shaders/fire.frag";

export const Fire = () => {
  const params = {
    u_fire_power: {
      name: "Fire Power",
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
  return new Pattern<typeof params>("Fire", fire, params);
};
