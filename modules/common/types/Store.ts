import { Block } from "@/modules/common/types/Block";
import { PatternParams } from "@/modules/common/types/PatternParams";
import GradientPattern from "@/modules/patterns/GradientPattern";
import SunCycle from "@/modules/patterns/SunCycle";
import { makeAutoObservable, configure, runInAction } from "mobx";
import { Vector2 } from "three";

// Enforce MobX strict mode, which can make many noisy console warnings, but can help use learn MobX better.
// Feel free to comment out the following if you want to silence the console messages.

configure({
  enforceActions: "always",
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
});

export default class Store {
  initialized = false;
  blocks: Block<PatternParams>[] = [];

  constructor() {
    makeAutoObservable(this);

    runInAction(() => this.initialize());
  }

  initialize = () => {
    // Temporary hard-coded blocks
    this.blocks.push(
      new Block(SunCycle()),
      new Block(
        GradientPattern({
          u_blah: {
            name: "Blah",
            value: 0,
          },
          u_a: {
            name: "A",
            value: new Vector2(),
          },
        }),
      ),
    );
    this.blocks[0].setTiming(0, 3);
    this.blocks[1].setTiming(3, 10);
    this.initialized = true;
  };
}
