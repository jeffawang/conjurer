import Pattern from "@/src/types/Pattern";
import disc from "./shaders/disc.frag";
import { Vector4 } from "three";

type DiscParams = {
  u_color: {
    name: "Color";
    value: Vector4;
  };
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
    u_color: {
      name: "Color",
      value: new Vector4(1, 1, 1, 1),
    },
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
