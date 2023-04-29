import { makeAutoObservable } from "mobx";
import Pattern from "./Pattern";
import { ExtraParams } from "./PatternParams";
import { clone } from "@/src/utils/object";
import Variation from "@/src/types/Variations/Variation";
import { MINIMUM_VARIATION_DURATION } from "@/src/utils/time";
import { patternMap } from "@/src/patterns/patterns";
import { deserializeVariation } from "@/src/types/Variations/variations";
import { effectMap } from "@/src/effects/effects";

type SerializedBlock = {
  pattern: string;
  parameterVariations: { [key: string]: any[] | undefined };
  startTime: number;
  duration: number;
  blockEffects: SerializedBlock[];
};

export default class Block<T extends ExtraParams = {}> {
  id: string = Math.random().toString(16).slice(2); // unique id
  pattern: Pattern<T>;
  parameterVariations: { [K in keyof T]?: Variation[] } = {};

  parentBlock: Block | null = null; // if this is an effect block, this is the block that it is applied to
  blockEffects: Block[] = [];

  startTime: number = 0; // global time that block starts playing at in seconds
  duration: number = 5; // duration that block plays for in seconds

  get endTime() {
    return this.startTime + this.duration;
  }

  constructor(pattern: Pattern<T>, parentBlock: Block | null = null) {
    this.pattern = pattern;
    this.parentBlock = parentBlock;

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

    for (const effect of this.blockEffects) {
      effect.updateParameters(time, globalTime);
    }
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
          time - variationTime
        );
        return;
      }

      variationTime += variation.duration;
    }

    if (variations.length === 0) return;

    // if the current time is beyond the end of the last variation, use the last variation's last value
    const lastVariation = variations[variations.length - 1];
    this.pattern.paramValues[parameter] = lastVariation.valueAtTime(
      lastVariation.duration
    );
  };

  addVariation = (uniformName: string, variation: Variation) => {
    const variations = this.parameterVariations[uniformName];
    if (!variations) {
      this.parameterVariations[uniformName as keyof T] = [variation];
    } else {
      variations.push(variation);
      this.triggerVariationReactions(uniformName);
    }
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

  duplicateVariation = (uniformName: string, variation: Variation) => {
    const variations = this.parameterVariations[uniformName];
    if (!variations) return;

    const index = variations.indexOf(variation);
    if (index > -1) {
      variations.splice(index, 0, variation.clone());
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
    if (index < 0) return;

    if (variation.duration + delta < MINIMUM_VARIATION_DURATION) return;

    variation.duration += delta;
    this.triggerVariationReactions(uniformName);
  };

  applyMaxVariationDurationDelta = (
    uniformName: string,
    variation: Variation
  ) => {
    const variations = this.parameterVariations[uniformName];
    if (!variations) return;

    const index = variations.indexOf(variation);
    if (index < 0) return;

    const totalVariationDuration = variations.reduce(
      (total, variation) => total + variation.duration,
      0
    );

    // use the parent block's duration if this is an effect block
    const duration = this.parentBlock?.duration ?? this.duration;
    if (totalVariationDuration < duration) {
      variation.duration += duration - totalVariationDuration;
      this.triggerVariationReactions(uniformName);
    }
  };

  triggerVariationReactions = (uniformName: string) => {
    const variations = this.parameterVariations[uniformName];
    if (!variations) return;

    // create a new array so that mobx can detect the change
    this.parameterVariations[uniformName as keyof T] = [...variations];
  };

  reorderBlockEffect = (block: Block, delta: number) => {
    const index = this.blockEffects.indexOf(block);
    if (index < 0) return;

    const newIndex = index + delta;
    if (newIndex < 0 || newIndex >= this.blockEffects.length) return;

    this.blockEffects.splice(index, 1);
    this.blockEffects.splice(newIndex, 0, block);
  };

  removeBlockEffect = (block: Block) => {
    const index = this.blockEffects.indexOf(block);
    if (index > -1) {
      this.blockEffects.splice(index, 1);
    }
  };

  clone = () => new Block(clone(this.pattern));

  serializeParameterVariations = () => {
    const serialized: { [K in keyof T]?: any[] } = {};
    for (const parameter of Object.keys(this.parameterVariations)) {
      serialized[parameter as keyof T] = this.parameterVariations[
        parameter as keyof T
      ]?.map((variation) => variation.serialize());
    }
    return serialized;
  };

  serialize = (): SerializedBlock => ({
    pattern: this.pattern.name,
    startTime: this.startTime,
    duration: this.duration,
    parameterVariations: this.serializeParameterVariations(),
    blockEffects: this.blockEffects.map((blockEffect) =>
      blockEffect.serialize()
    ),
  });

  static deserialize = (data: any, effect?: boolean, parentBlock?: Block) => {
    const block = new Block<ExtraParams>(
      clone(effect ? effectMap[data.pattern] : patternMap[data.pattern])
    );

    block.setTiming({
      startTime: data.startTime,
      duration: data.duration,
    });
    block.parentBlock = parentBlock ?? null;

    for (const parameter of Object.keys(data.parameterVariations)) {
      block.parameterVariations[parameter] = data.parameterVariations[
        parameter
      ]?.map((variationData: any) => deserializeVariation(variationData));
    }

    block.blockEffects = data.blockEffects.map((blockEffectData: any) =>
      Block.deserialize(blockEffectData, true, block)
    );

    return block;
  };
}
