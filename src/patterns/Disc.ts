import { Pattern } from "@/src/types/Pattern";
import disc from "./shaders/disc.frag";
import { Vector4 } from "three";

export const Disc = () => {
  const params = {
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
  };
  return new Pattern<typeof params>("Disc", disc, params);
};
