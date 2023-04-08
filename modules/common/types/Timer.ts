import { FRAMES_PER_SECOND, MAX_TIME } from "@/modules/common/utils/time";
import { makeAutoObservable, runInAction } from "mobx";

export default class Timer {
  globalTime = 0;
  playing = false;

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
