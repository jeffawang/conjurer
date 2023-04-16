import Variation from "@/src/types/Variation";

export default class FlatVariation extends Variation<number> {
  value: number;

  constructor(duration: number, value: number) {
    super("flat", duration);

    this.value = value;
  }

  valueAtTime = () => {
    return this.value;
  };
}
