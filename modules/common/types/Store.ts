import { Block } from "@/modules/common/types/Block";
import { Pattern } from "@/modules/common/types/Pattern";
import { StandardParams } from "@/modules/common/types/PatternParams";
import Timer from "@/modules/common/types/Timer";
import Rainbow from "@/modules/patterns/Rainbow";
import SunCycle from "@/modules/patterns/SunCycle";
import { makeAutoObservable, configure, runInAction } from "mobx";

// Enforce MobX strict mode, which can make many noisy console warnings, but can help use learn MobX better.
// Feel free to comment out the following if you want to silence the console messages.

configure({
  enforceActions: "always",
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: false, // This will trigger false positives sometimes, so turning off
});

export default class Store {
  initialized = false;
  timer = new Timer();

  blocks: Block<StandardParams>[] = [];
  selectedBlocks: Block<StandardParams>[] = [];

  // TODO: make this more efficient, do binary search
  get currentBlock() {
    return this.blocks.find(
      (b) =>
        b.startTime <= this.timer.globalTime &&
        this.timer.globalTime < b.startTime + b.duration,
    );
  }

  get endTime() {
    const lastBlock = this.blocks[this.blocks.length - 1];
    return lastBlock.startTime + lastBlock.duration;
  }

  constructor() {
    makeAutoObservable(this);

    runInAction(() => this.initialize());
  }

  initialize = () => {
    // Temporary hard-coded blocks
    this.blocks.push(new Block(SunCycle()), new Block(Rainbow()));
    this.blocks[0].setTiming(0, 7);
    this.blocks[1].setTiming(7, 3);
    this.initialized = true;
  };

  insertCloneOfPattern = (pattern: Pattern) => {
    const clonedPattern = clone(pattern);
    const newBlock = new Block(clonedPattern);
    newBlock.setTiming(this.endTime, 3);
    this.blocks.push(newBlock);
  };

  selectBlock = (block: Block<StandardParams>) => {
    this.selectedBlocks = [block];
  };

  deselectBlock = (block: Block<StandardParams>) => {
    this.selectedBlocks = this.selectedBlocks.filter((b) => b !== block);
  };
}

const clone = (orig: Object) =>
  Object.assign(Object.create(Object.getPrototypeOf(orig)), orig);
