import { makeAutoObservable } from "mobx";
import Pattern from "./Pattern";
import { PatternParams } from "./PatternParams";

type PatternParamsController<PP extends PatternParams> = {
  [K in keyof PP]?: ({ sp, time }: { sp: PP[K]; time: number }) => void;
};

export default class Block<T extends PatternParams> {
  id: string = Math.random().toString(16).slice(2); // unique id
  pattern: Pattern;
  spc: PatternParamsController<T>;

  startTime: number = 0; // global time that block starts playing at in seconds
  duration: number = 5; // duration that block plays for in seconds

  get endTime() {
    return this.startTime + this.duration;
  }

  constructor(
    pattern: Pattern,
    spc: PatternParamsController<T> = {} as PatternParamsController<T>,
  ) {
    this.pattern = pattern;
    this.spc = spc;

    makeAutoObservable(this, { pattern: false, spc: false, update: false });
  }

  setTiming = (startTime: number, duration: number) => {
    this.startTime = startTime;
    this.duration = duration;
  };

  update = (time: number, globalTime: number) => {
    this.pattern.paramValues.u_time = time;
    Object.entries(this.spc).map(([u, f]) => {
      f({ sp: this.pattern.params[u], time, globalTime });
    });
  };
}
