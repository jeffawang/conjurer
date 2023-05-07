import { makeAutoObservable } from "mobx";

export class AudioStore {
  audioInitialized = false;
  availableAudioFiles: string[] = [];
  selectedAudioFile: string = "cloudkicker-explorebecurious.mp3";

  constructor() {
    makeAutoObservable(this);
  }

  serialize = () => ({
    selectedAudioFile: this.selectedAudioFile,
  });

  deserialize = (data: any) => {
    this.selectedAudioFile = data.selectedAudioFile;
  };
}
