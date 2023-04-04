import { Pattern } from "@/modules/common/types/Pattern";
import gradient from "./shaders/gradient.frag";

export default class GradientPattern extends Pattern {
  constructor() {
    super("Gradient Pattern", gradient);
  }
}
