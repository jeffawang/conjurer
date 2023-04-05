import { Pattern } from "@/modules/common/types/Pattern";
import gradient from "./shaders/gradient.frag";

const GradientPattern = new Pattern("Gradient", gradient);
export default GradientPattern;
