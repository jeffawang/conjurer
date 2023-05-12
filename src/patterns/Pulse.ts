import { Pattern } from "@/src/types/Pattern";
import pulse from "./shaders/pulse.frag";

export const Pulse = () => {
  const params = {};
  return new Pattern<typeof params>("Pulse", pulse, params);
};
