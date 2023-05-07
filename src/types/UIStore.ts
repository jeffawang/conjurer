import { INITIAL_PIXELS_PER_SECOND } from "@/src/utils/time";
import { makeAutoObservable, runInAction } from "mobx";

const MAX_PIXELS_PER_SECOND = 90;
const MIN_PIXELS_PER_SECOND = 4;

/**
 * MobX store for UI state.
 *
 * @export
 * @class UIStore
 */
export class UIStore {
  showingPerformance = false;
  displayingCanopy = true;
  showingWaveformOverlay = false;

  pixelsPerSecond = INITIAL_PIXELS_PER_SECOND; // the zoom of the timeline
  beatLength = 1; // length of a beat in seconds

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

  togglePerformance = () => {
    this.showingPerformance = !this.showingPerformance;
  };

  toggleCanopyDisplay = () => {
    this.displayingCanopy = !this.displayingCanopy;
  };

  toggleWaveformOverlay = () => {
    this.showingWaveformOverlay = !this.showingWaveformOverlay;
  };

  serialize = () => ({
    showingPerformance: this.showingPerformance,
    displayingCanopy: this.displayingCanopy,
    pixelsPerSecond: this.pixelsPerSecond,
    beatLength: this.beatLength,
  });

  deserialize = (data: any) => {
    this.showingPerformance =
      data?.showingPerformance ?? this.showingPerformance;
    this.displayingCanopy = data?.displayingCanopy ?? this.displayingCanopy;
    this.beatLength = data?.beatLength ?? 1;
    this.pixelsPerSecond = data?.pixelsPerSecond ?? this.pixelsPerSecond;
  };
}
