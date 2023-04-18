import Pattern from "@/src/types/Pattern";
import disc from "./shaders/disc.frag";

type DiscParams = {
  u_radius: {
    name: "Radius";
    value: number;
  };
};

const Disc = () =>
  new Pattern<DiscParams>("Disc", disc, {
    u_radius: {
      name: "Radius",
      value: 0.5,
    },
  });
export default Disc;
