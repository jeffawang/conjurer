import { AudioRegion } from "@/src/types/AudioRegion";
import { Timer } from "@/src/types/Timer";
import { makeAutoObservable } from "mobx";

export class AudioStore {
  timer: Timer;
  audioInitialized = false;
  availableAudioFiles: string[] = [];
  selectedAudioFile: string = "cloudkicker-explorebecurious.mp3";

  audioMuted = false;
  audioLooping = false;

  selectedRegion: AudioRegion | null = null;

  constructor(timer: Timer) {
    makeAutoObservable(this);
    this.timer = timer;
    this.timer.addTickListener(this.onTick);
  }

  toggleAudioMuted = () => {
    this.audioMuted = !this.audioMuted;
  };

  toggleAudioLooping = () => {
    this.audioLooping = !this.audioLooping;
  };

  onTick = (time: number) => {
    if (!this.selectedRegion || !this.audioLooping) return;
    if (time > this.selectedRegion.end) {
      this.timer.setTime(this.selectedRegion.start);
    }
  };

  serialize = () => ({
    selectedAudioFile: this.selectedAudioFile,
    audioMuted: this.audioMuted,
  });

  deserialize = (data: any) => {
    this.selectedAudioFile = data.selectedAudioFile;
    this.audioMuted = !!data.audioMuted;
  };
}
