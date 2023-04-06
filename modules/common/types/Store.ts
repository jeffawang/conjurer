import { makeAutoObservable, configure, action } from "mobx";

// Enforce MobX strict mode, which can make many noisy console warnings, but can help use learn MobX better.
// Feel free to comment out the following if you want to silence the console messages.
// configure({
//   enforceActions: "always",
//   computedRequiresReaction: true,
//   reactionRequiresObservable: true,
//   observableRequiresReaction: true,
// });

export default class Store {
  initialized = false;

  constructor() {
    makeAutoObservable(this);
    setTimeout(
      action(() => {
        this.initialized = true;
      }),
      1000,
    );
  }
}
