import { FRAMES_PER_SECOND, MAX_TIME } from "@/src/utils/time";
import { makeAutoObservable, runInAction } from "mobx";

export default class Timer {
  _lastStartedAt = 0;
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

    if (this.playing) {
      this._lastStartedAt = Date.now();
    }
  };

  tick = () => {
    if (!this.playing) return;

    if (this.globalTime > MAX_TIME) {
      this.playing = false;
      return;
    }

    this.globalTime = (Date.now() - this._lastStartedAt) / 1000;
  };
}
