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
      Math.sin(time * this.frequency * 2 * Math.PI + this.phase) *
        this.amplitude +
      this.offset
    );
  };

  computeDomain = () => {
    return [-this.amplitude + this.offset, this.amplitude + this.offset] as [
      number,
      number
    ];
  };

  computeSampledData = (duration: number) => {
    const samplingFrequency = 8 * this.frequency;
    const sampleRate = Math.ceil(duration * samplingFrequency);
    const data = [];
    for (let i = 0; i < sampleRate; i++) {
      data.push({
        value: this.valueAtTime((duration * i) / (sampleRate - 1)),
      });
    }
    return data;
  };
}
