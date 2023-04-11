import { FRAMES_PER_SECOND, MAX_TIME } from "@/src/utils/time";
import { makeAutoObservable, runInAction } from "mobx";

export default class Timer {
  _globalTime = 0;
  playing = false;

  get globalTime() {
    return this._globalTime;
  }

  set globalTime(time: number) {
    this._globalTime = time < 0 ? 0 : time;
  }

  constructor() {
    makeAutoObservable(this);

    runInAction(() => this.initialize());
  }

  initialize = () => {
    setInterval(this.tick, 1000 / FRAMES_PER_SECOND);
  };

  togglePlaying = () => {
    this.playing = !this.playing;
  };

  tick = () => {
    if (!this.playing) return;

    if (this.globalTime > MAX_TIME) {
      this.playing = false;
      return;
    }

    this.globalTime += 1 / FRAMES_PER_SECOND;
  };
}
