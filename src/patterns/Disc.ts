import Pattern from "@/src/types/Pattern";
import disc from "./shaders/disc.frag";

type DiscParams = {
  u_radius: {
    name: "Radius";
    value: number;
  };
  u_fuzziness: {
    name: "Fuzziness";
    value: number;
  };
};

const Disc = () =>
  new Pattern<DiscParams>("Disc", disc, {
    u_radius: {
      name: "Radius",
      value: 0.5,
    },
    u_fuzziness: {
      name: "Fuzziness",
      value: 0.2,
    },
  });
export default Disc;
