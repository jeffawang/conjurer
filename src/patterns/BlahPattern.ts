import Pattern from "@/src/types/Pattern";
import blah from "./shaders/blah.frag";

type BlahPatternParams = {
  u_blah: {
    name: "Blah";
    value: number;
  };
};

const BlahPattern = () =>
  new Pattern<BlahPatternParams>("Blah", blah, {
    u_blah: {
      name: "Blah",
      value: 0,
    },
  });
export default BlahPattern;
