import { FRAMES_PER_SECOND, MAX_TIME } from "@/src/utils/time";
import { makeAutoObservable, runInAction } from "mobx";

export default class Timer {
  _lastStartedAtDateTime = 0;
  _globalTime = 0;
  _lastCursorPosition = 0;

  playing = false;

  get globalTime() {
    return this._globalTime;
  }

  set globalTime(time: number) {
    this._globalTime = time < 0 ? 0 : time;
  }

  get lastCursorPosition() {
    return this._lastCursorPosition;
  }

  set lastCursorPosition(time: number) {
    this._lastCursorPosition = time < 0 ? 0 : time;
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
      this._lastStartedAtDateTime = Date.now();
      this.lastCursorPosition = this._globalTime;
    }
  };

  tick = () => {
    if (!this.playing) return;

    if (this.globalTime > MAX_TIME) {
      this.playing = false;
      return;
    }

    this.globalTime =
      this.lastCursorPosition +
      (Date.now() - this._lastStartedAtDateTime) / 1000;
  };

  setTime = (time: number) => {
    this.globalTime = time;
    this.lastCursorPosition = time;
    this._lastStartedAtDateTime = Date.now();
  };

  skipBackward = () => {
    this.setTime(this.globalTime - 0.2);
  };

  skipForward = () => {
    this.setTime(this.globalTime + 0.2);
  };
}
