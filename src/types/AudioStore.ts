import { makeAutoObservable } from "mobx";

export class AudioStore {
  audioInitialized = false;
  availableAudioFiles: string[] = [];
  selectedAudioFile: string = "cloudkicker-explorebecurious.mp3";

  audioMuted = false;

  constructor() {
    makeAutoObservable(this);
  }

  toggleAudioMuted = () => {
    this.audioMuted = !this.audioMuted;
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
