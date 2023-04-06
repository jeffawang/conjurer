import { Block } from "@/modules/common/types/Block";
import {
  PatternParams,
  StandardParams,
} from "@/modules/common/types/PatternParams";
import GradientPattern from "@/modules/patterns/GradientPattern";
import SunCycle from "@/modules/patterns/SunCycle";
import { makeAutoObservable, configure, action, runInAction } from "mobx";
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
    this.blocks[0].startTime = 0;
    this.blocks[0].duration = 8;
    this.blocks[1].startTime = 9;
    this.blocks[1].duration = 12;
    this.initialized = true;
  };
}
