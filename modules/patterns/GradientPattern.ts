import { Pattern } from "@/modules/common/types/Pattern";
import gradient from "./shaders/gradient.frag";

const GradientPattern = () =>
  new Pattern("Gradient", gradient, {
    u_blah: {
      name: "Hi",
      value: 1,
    },
  });
export default GradientPattern;
