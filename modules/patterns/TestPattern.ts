import { Pattern } from "@/modules/common/types/Pattern";
import test from "./shaders/test.frag";

export default class TestPattern extends Pattern {
  constructor() {
    super("Test Pattern", test);
  }
}
