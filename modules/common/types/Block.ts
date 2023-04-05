import { Pattern, PatternParameters, StandardParameters } from "./Pattern";

type PatternParameterController<SP extends PatternParameters> = {
  [K in keyof SP]?: ({
    sp,
    time,
    globalTime,
  }: {
    sp: SP[K];
    time: number;
    globalTime: number;
  }) => void;
};

export class Block<T extends PatternParameters> {
  pattern: Pattern<T>;
  spc: PatternParameterController<StandardParameters & T>;

  constructor(
    pattern: Pattern<T>,
    spc: PatternParameterController<
      StandardParameters & T
    > = {} as PatternParameterController<StandardParameters & T>
  ) {
    this.pattern = pattern;
    this.spc = {
      u_time: ({ sp, time }) => {
        sp.value = time;
      },
      u_global_time: ({ sp, globalTime }) => {
        sp.value = globalTime;
      },
      ...spc,
    };
  }

  update = (time: number, globalTime: number) => {
    Object.entries(this.spc).map(([u, f]) => {
      console.log("uniform", u, this.pattern.parameters[u].value);
      f({ sp: this.pattern.parameters[u], time: time, globalTime: globalTime });
    });
  };
}
