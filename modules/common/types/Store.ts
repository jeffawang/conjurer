import { makeAutoObservable } from "mobx";

export default class Store {
  initialized = false;

  constructor() {
    makeAutoObservable(this);
    setTimeout(() => {
      this.initialized = true;
    }, 1000);
  }
}
