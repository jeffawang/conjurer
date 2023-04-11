import { makeAutoObservable, runInAction } from "mobx";

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
  };

  zoomIn = () => {
    this.pixelsPerSecond += 2;
  };
}
