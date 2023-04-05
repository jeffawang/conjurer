import { Pattern } from "./Pattern";
import { PatternParams } from "./PatternParams";

type PatternParamsController<PP extends PatternParams> = {
  [K in keyof PP]?: ({ sp, time }: { sp: PP[K]; time: number }) => void;
};

export class Block<T extends PatternParams> {
  pattern: Pattern;
  spc: PatternParamsController<T>;

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
      f({ sp: this.pattern.params[u], time: time, globalTime: globalTime });
    });
  };
}
