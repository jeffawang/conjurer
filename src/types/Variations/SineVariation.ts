import Variation from "@/src/types/Variations/Variation";

export default class SineVariation extends Variation<number> {
  duration: number;
  amplitude: number;
  frequency: number;
  phase: number;
  offset: number;

  constructor(
    duration: number,
    amplitude: number,
    frequency: number,
    phase: number,
    offset: number
  ) {
    super("sine", duration);

    this.duration = duration;
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.phase = phase;
    this.offset = offset;
  }

  valueAtTime = (time: number) => {
    return (
      Math.sin(time * this.frequency + this.phase) * this.amplitude +
      this.offset
    );
  };

  computeDomain = () => {
    return [-this.amplitude + this.offset, this.amplitude + this.offset] as [
      number,
      number
    ];
  };
}
