import { makeAutoObservable } from "mobx";
import Pattern from "./Pattern";
import { ExtraParams } from "./PatternParams";
import { clone } from "@/src/utils/object";
import Variation from "@/src/types/Variations/Variation";

export default class Block<T extends ExtraParams = {}> {
  id: string = Math.random().toString(16).slice(2); // unique id
  pattern: Pattern<T>;
  parameterVariations: { [K in keyof T]?: Variation[] } = {};

  startTime: number = 0; // global time that block starts playing at in seconds
  duration: number = 5; // duration that block plays for in seconds

  get endTime() {
    return this.startTime + this.duration;
  }

  constructor(pattern: Pattern<T>) {
    this.pattern = pattern;

    makeAutoObservable(this, {
      pattern: false,
      updateParameters: false,
      updateParameter: false,
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
  };

  updateParameter = (parameter: keyof T, time: number) => {
    const variations = this.parameterVariations[parameter];
    if (!variations) return;

    // TODO: maybe this should be block.startTime instead of 0
    let variationTime = 0;
    for (const variation of variations) {
      if (
        // if infinite duration variation, OR
        variation.duration < 0 ||
        // this is the variation that is active at this time
        time < variationTime + variation.duration
      ) {
        this.pattern.paramValues[parameter] = variation.valueAtTime(
          time - variationTime
        );
        break;
      }

      variationTime += variation.duration;
    }
  };

  addVariation = (uniformName: string, variation: Variation) => {
    const variations = this.parameterVariations[uniformName];
    if (!variations) {
      this.parameterVariations[uniformName as keyof T] = [variation];
    } else {
      variations.push(variation);
    }

    this.triggerVariationReactions(uniformName);
  };

  removeVariation = (uniformName: string, variation: Variation) => {
    const variations = this.parameterVariations[uniformName];
    if (!variations) return;

    const index = variations.indexOf(variation);
    if (index > -1) {
      variations.splice(index, 1);
      this.triggerVariationReactions(uniformName);
    }
  };

  applyVariationDurationDelta = (
    uniformName: string,
    variation: Variation,
    delta: number
  ) => {
    const variations = this.parameterVariations[uniformName];
    if (!variations) return;

    const index = variations.indexOf(variation);
    if (index < 0) {
      console.log("variation not found in block");
      return;
    }

    if (variation.duration + delta < 1) return;

    variation.duration += delta;
    this.triggerVariationReactions(uniformName);
  };

  triggerVariationReactions = (uniformName: string) => {
    const variations = this.parameterVariations[uniformName];
    if (!variations) return;

    // create a new array so that mobx can detect the change
    this.parameterVariations[uniformName as keyof T] = [...variations];
  };

  clone = () => new Block(clone(this.pattern));
}
