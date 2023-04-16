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

export default class Variation<T extends ParamType = ParamType> {
  id: string = Math.random().toString(16).slice(2); // unique id
  type: VariationType;
  duration: number;

  constructor(type: VariationType, duration: number) {
    this.type = type;
    this.duration = duration;
  }

  valueAtTime = (time: number, paramValue: T) => {
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
