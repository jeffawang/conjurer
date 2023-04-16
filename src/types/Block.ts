import { makeAutoObservable } from "mobx";
import Pattern from "./Pattern";
import { ExtraParams, PatternParams } from "./PatternParams";
import { clone } from "@/src/utils/object";
import Variation from "@/src/types/Variation";

type PatternParamsController<PP extends PatternParams> = {
  [K in keyof PP]?: ({ sp, time }: { sp: PP[K]; time: number }) => void;
};

export default class Block<T extends ExtraParams = {}> {
  id: string = Math.random().toString(16).slice(2); // unique id
  pattern: Pattern<T>;
  // spc: PatternParamsController<T>;
  parameterVariations: { [K in keyof T]?: Variation[] } = {};

  startTime: number = 0; // global time that block starts playing at in seconds
  duration: number = 5; // duration that block plays for in seconds

  get endTime() {
    return this.startTime + this.duration;
  }

  constructor(
    pattern: Pattern<T>
    // spc: PatternParamsController<T> = {} as PatternParamsController<T>
  ) {
    this.pattern = pattern;
    // this.spc = spc;

    makeAutoObservable(this, {
      pattern: false,
      // spc: false,
      updateParameters: false,
    });
  }

  setTiming = ({
    startTime,
    duration,
  }: {
    startTime: number;
    duration: number;
  }) => {
    this.startTime = startTime;
    this.duration = duration;
  };

  updateParameters = (time: number, globalTime: number) => {
    this.pattern.paramValues.u_time = time;

    for (const parameter of Object.keys(this.parameterVariations)) {
      this.updateParameter(parameter, time);
    }

    // Object.entries(this.spc).map(([u, f]) => {
    //   f({ sp: this.pattern.params[u], time, globalTime });
    // });
  };

  updateParameter = (parameter: keyof T, time: number) => {
    const variations = this.parameterVariations[parameter];
    if (!variations) return;

    let variationTime = 0;
    for (const variation of variations) {
      if (
        // if infinite duration variation, OR
        variation.duration < 0 ||
        // this is the variation that is active at this time
        time < variationTime + variation.duration
      ) {
        this.pattern.paramValues[parameter] = variation.valueAtTime(
          this.pattern.paramValues[parameter],
          time - variationTime
        );
        break;
      }

      variationTime += variation.duration;
    }
  };

  clone = () => new Block(clone(this.pattern));
}
