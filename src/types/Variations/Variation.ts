import { ParamType } from "@/src/types/PatternParams";

// TODO: implement more variation types
type VariationType =
  | "flat"
  | "linear"
  | "random"
  | "sine"
  | "saw"
  | "square"
  | "triangle";

export default abstract class Variation<T extends ParamType = ParamType> {
  id: string = Math.random().toString(16).slice(2); // unique id
  type: VariationType;
  duration: number;

  constructor(type: VariationType, duration: number) {
    this.type = type;
    this.duration = duration;
  }

  abstract valueAtTime: (time: number) => T;
  abstract computeDomain: () => [number, number];
}
