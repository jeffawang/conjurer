import { Pattern } from "@/src/types/Pattern";
import barcode from "./shaders/barcode.frag";

export const Barcode = () => {
  const params = {
    u_segments: {
      name: "Segments",

      value: 4,
    },
    u_stutter_frequency: {
      name: "Stutter Frequency",
      value: 0.8,
    },
    u_go_nuts: {
      name: "Go Nuts",
      value: 0,
    },
  };
  return new Pattern<typeof params>("Barcode", barcode, params);
};
