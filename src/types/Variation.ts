import { ParamType } from "@/src/types/PatternParams";
import { Texture, Vector2 } from "three";

type VariationType =
  | "flat"
  | "linear"
  | "random"
  | "sine"
  | "saw"
  | "square"
  | "triangle";

export default class Variation {
  type: VariationType;
  duration: number;

  constructor(type: VariationType, duration: number) {
    this.type = type;
    this.duration = duration;
  }

  valueAtTime = (paramValue: ParamType, time: number) => {
    // TODO: actually implement
    if (typeof paramValue === "number") {
      return paramValue;
    } else if (paramValue instanceof Vector2) {
      return paramValue;
      // return new Vector2(0, 0);
    } else if (paramValue instanceof Texture) {
      return paramValue;
      // return new Texture();
    }

    return 0;
  };
}
