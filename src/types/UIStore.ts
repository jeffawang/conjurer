import { makeAutoObservable, runInAction } from "mobx";

const MAX_PIXELS_PER_SECOND = 100;
const MIN_PIXELS_PER_SECOND = 12;

/**
 * MobX store for UI state.
 *
 * @export
 * @class UIStore
 */
export default class UIStore {
  pixelsPerSecond = 40; // this controls the zoom of the timeline

  constructor() {
    makeAutoObservable(this);

    runInAction(() => this.initialize());
  }

  initialize = () => {};

  timeToXPixels = (time: number) => `${time * this.pixelsPerSecond}px`;
  timeToX = (time: number) => time * this.pixelsPerSecond;
  xToTime = (x: number) => x / this.pixelsPerSecond;

  zoomOut = () => {
    this.pixelsPerSecond -= 2;
    if (this.pixelsPerSecond < MIN_PIXELS_PER_SECOND) {
      this.pixelsPerSecond = MIN_PIXELS_PER_SECOND;
    }
  };

  zoomIn = () => {
    this.pixelsPerSecond += 2;
    if (this.pixelsPerSecond > MAX_PIXELS_PER_SECOND) {
      this.pixelsPerSecond = MAX_PIXELS_PER_SECOND;
    }
  };
}