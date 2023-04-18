import Pattern from "@/src/types/Pattern";
import sunCycle from "./shaders/sunCycle.frag";

type SunCycleParams = {
  u_speed: {
    name: "Speed";
    value: number;
  };
};

const SunCycle = () =>
  new Pattern<SunCycleParams>("Sun Cycle", sunCycle, {
    u_speed: {
      name: "Speed",
      value: 0.5,
    },
  });
export default SunCycle;
