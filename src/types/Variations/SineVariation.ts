import Variation from "@/src/types/Variations/Variation";

export default class SineVariation extends Variation<number> {
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

    this.amplitude = amplitude;
    this.frequency = frequency;
    this.phase = phase;
    this.offset = offset;
  }

  valueAtTime = (time: number) =>
    Math.sin(time * this.frequency * 2 * Math.PI + this.phase) *
      this.amplitude +
    this.offset;

  computeDomain = () =>
    [-this.amplitude + this.offset, this.amplitude + this.offset] as [
      number,
      number
    ];

  computeSampledData = (duration: number) => {
    const samplingFrequency = 8 * this.frequency;
    const totalSamples = Math.ceil(duration * samplingFrequency);

    const data = [];
    for (let i = 0; i < totalSamples; i++) {
      data.push({
        value: this.valueAtTime(duration * (i / (totalSamples - 1))),
      });
    }
    return data;
  };

  clone = () =>
    new SineVariation(
      this.duration,
      this.amplitude,
      this.frequency,
      this.phase,
      this.offset
    );

  serialize = () => ({
    type: this.type,
    duration: this.duration,
    amplitude: this.amplitude,
    frequency: this.frequency,
    phase: this.phase,
    offset: this.offset,
  });
}
