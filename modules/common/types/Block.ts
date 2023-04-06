import { Pattern } from "./Pattern";
import { PatternParams } from "./PatternParams";

type PatternParamsController<PP extends PatternParams> = {
  [K in keyof PP]?: ({ sp, time }: { sp: PP[K]; time: number }) => void;
};

export class Block<T extends PatternParams> {
  pattern: Pattern;
  spc: PatternParamsController<T>;

  startTime: number = 0; // global time that block starts playing at in seconds
  duration: number = 5; // duration that block plays for in seconds

  constructor(
    pattern: Pattern,
    spc: PatternParamsController<T> = {} as PatternParamsController<T>
  ) {
    this.pattern = pattern;
    this.spc = spc;
  }

  update = (time: number, globalTime: number) => {
    this.pattern.paramValues.u_time = time;
    Object.entries(this.spc).map(([u, f]) => {
      // console.log("uniform", u, this.pattern.parameters[u].value);
      f({ sp: this.pattern.parameters[u], time, globalTime });
    });
  };
}
