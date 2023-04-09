import Block from "@/modules/common/types/Block";
import Pattern from "@/modules/common/types/Pattern";
import { StandardParams } from "@/modules/common/types/PatternParams";
import Timer from "@/modules/common/types/Timer";
import { clone } from "@/modules/common/utils/object";
import { DEFAULT_BLOCK_DURATION } from "@/modules/common/utils/time";
import Rainbow from "@/modules/patterns/Rainbow";
import SunCycle from "@/modules/patterns/SunCycle";
import { patterns } from "@/modules/patterns/patterns";
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
  selectedBlocks: Set<Block<StandardParams>> = new Set();

  patterns: Pattern[] = patterns;
  selectedPattern: Pattern = patterns[0];
  draggingPattern: boolean = false;

  // TODO: make this more efficient, do binary search
  get currentBlock() {
    return this.blocks.find(
      (b) =>
        b.startTime <= this.timer.globalTime &&
        this.timer.globalTime < b.startTime + b.duration,
    );
  }

  get endTime() {
    if (this.blocks.length === 0) return 0;

    const lastBlock = this.blocks[this.blocks.length - 1];
    return lastBlock.endTime;
  }

  constructor() {
    makeAutoObservable(this);

    runInAction(() => this.initialize());
  }

  initialize = () => {
    // Temporary hard-coded blocks
    this.blocks.push(new Block(SunCycle()), new Block(Rainbow()));
    this.blocks[0].setTiming({ startTime: 0, duration: 7 });
    this.blocks[1].setTiming({ startTime: 7, duration: 3 });

    this.initialized = true;
  };

  insertCloneOfPattern = (pattern: Pattern) => {
    const newBlock = new Block(clone(pattern));
    const nextGap = this.nextFiniteGap(this.timer.globalTime);
    newBlock.setTiming(nextGap);
    this.addBlock(newBlock);
  };

  addBlock = (block: Block<StandardParams>) => {
    // insert block in sorted order
    const index = this.blocks.findIndex((b) => b.startTime > block.startTime);
    if (index === -1) {
      this.blocks.push(block);
      return;
    }

    this.blocks.splice(index, 0, block);
  };

  selectBlock = (block: Block<StandardParams>) => {
    this.selectedBlocks = new Set([block]);
  };

  addBlockToSelection = (block: Block<StandardParams>) => {
    this.selectedBlocks.add(block);
  };

  deselectBlock = (block: Block<StandardParams>) => {
    this.selectedBlocks.delete(block);
  };

  selectAllBlocks = () => {
    this.selectedBlocks = new Set(this.blocks);
  };

  deselectAllBlocks = () => {
    this.selectedBlocks = new Set();
  };

  deleteSelectedBlocks = () => {
    this.blocks = this.blocks.filter((b) => !this.selectedBlocks.has(b));
    this.selectedBlocks = new Set();
  };

  copyBlocksToClipboard = (clipboardData: DataTransfer) => {
    clipboardData.setData(
      "text/plain",
      Array.from(this.selectedBlocks)
        .map((b) => b.id)
        .join(","),
    );
  };

  pasteBlocksFromClipboard = (clipboardData: DataTransfer) => {
    const ids = clipboardData.getData("text/plain").split(",");
    const blocksToCopy = this.blocks.filter((b) => ids.includes(b.id));
    if (blocksToCopy.length === 0) return;

    this.selectedBlocks = new Set();
    for (const blockToCopy of blocksToCopy) {
      const newBlock = blockToCopy.clone();
      const nextGap = this.nextFiniteGap(
        this.timer.globalTime,
        blockToCopy.duration,
      );
      newBlock.setTiming(nextGap);
      this.addBlock(newBlock);
      this.addBlockToSelection(newBlock);
    }
  };

  duplicateBlocks = () => {
    if (this.selectedBlocks.size === 0) return;

    const selectedBlocks = Array.from(this.selectedBlocks);
    this.selectedBlocks = new Set();
    for (const selectedBlock of selectedBlocks) {
      const newBlock = selectedBlock.clone();
      const nextGap = this.nextFiniteGap(
        selectedBlock.endTime,
        selectedBlock.duration,
      );
      newBlock.setTiming(nextGap);
      this.addBlock(newBlock);
      this.addBlockToSelection(newBlock);
    }
  };

  /**
   * Returns the next gap in the timeline, starting from the given time.
   * A missing duration means that the gap is infinite.
   */
  nextGap = (fromTime: number): { startTime: number; duration?: number } => {
    // no blocks
    if (this.blocks.length === 0) return { startTime: fromTime };

    // fromTime is before first block
    const firstBlock = this.blocks[0];
    if (fromTime < firstBlock.startTime) {
      return {
        startTime: fromTime,
        duration: firstBlock.startTime - fromTime,
      };
    }

    // fromTime is after last block
    if (fromTime >= this.endTime) {
      return { startTime: fromTime };
    }

    // fromTime is in between start of first block and end of last block
    for (let i = 0; i < this.blocks.length; i++) {
      const block = this.blocks[i];
      const nextBlock = this.blocks[i + 1];

      // fromTime is in this block
      if (block.startTime <= fromTime && fromTime < block.endTime) {
        if (!nextBlock) return { startTime: block.endTime };

        // check if next block is far enough away for a gap
        if (nextBlock.startTime - block.endTime > 0.1) {
          return {
            startTime: block.endTime,
            duration: nextBlock.startTime - block.endTime,
          };
        }
        continue;
      }

      // fromTime is after this block and before next block
      if (
        nextBlock &&
        fromTime >= block.endTime &&
        fromTime < nextBlock.startTime &&
        nextBlock.startTime - fromTime > 0.1
      ) {
        return {
          startTime: fromTime,
          duration: nextBlock.startTime - fromTime,
        };
      }
    }

    return { startTime: this.endTime };
  };

  /**
   * Returns the next gap in the timeline, starting from the given time.
   * The gap will always be of a finite duration, and no more than the given maxDuration.
   */
  nextFiniteGap = (
    fromTime: number,
    maxDuration: number = DEFAULT_BLOCK_DURATION,
  ): { startTime: number; duration: number } => {
    const gap = this.nextGap(fromTime);
    return {
      startTime: gap.startTime,
      duration: gap.duration
        ? Math.min(gap.duration, maxDuration)
        : maxDuration,
    };
  };
}
