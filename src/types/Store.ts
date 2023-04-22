import Block from "@/src/types/Block";
import Pattern from "@/src/types/Pattern";
import Timer from "@/src/types/Timer";
import UIStore from "@/src/types/UIStore";
import { binarySearchForBlockAtTime } from "@/src/utils/algorithm";
import { clone } from "@/src/utils/object";
import { DEFAULT_BLOCK_DURATION } from "@/src/utils/time";
import { patterns } from "@/src/patterns/patterns";
import { makeAutoObservable, configure, runInAction } from "mobx";
import FlatVariation from "@/src/types/Variations/FlatVariation";
import LinearVariation from "@/src/types/Variations/LinearVariation";
import SineVariation from "@/src/types/Variations/SineVariation";
import LinearVariation4 from "@/src/types/Variations/LinearVariation4";
import { Vector4 } from "three";
import Clouds from "@/src/patterns/Clouds";
import AudioStore from "@/src/types/AudioStore";

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
  uiStore = new UIStore();
  audioStore = new AudioStore();

  blocks: Block[] = [];
  selectedBlocks: Set<Block> = new Set();

  patterns: Pattern[] = patterns;
  selectedPattern: Pattern = patterns[0];
  draggingPattern: boolean = false;

  _lastComputedCurrentBlock: Block | null = null;

  // returns the block that the global time is inside of, or null if none
  // runs every frame, so we keep this performant with caching + a binary search
  get currentBlock() {
    if (
      this._lastComputedCurrentBlock &&
      this._lastComputedCurrentBlock.startTime <= this.timer.globalTime &&
      this.timer.globalTime < this._lastComputedCurrentBlock.endTime
    ) {
      return this._lastComputedCurrentBlock;
    }

    const currentBlockIndex = binarySearchForBlockAtTime(
      this.blocks,
      this.timer.globalTime
    );
    this._lastComputedCurrentBlock = this.blocks[currentBlockIndex] ?? null;
    return this._lastComputedCurrentBlock;
  }

  get endTime() {
    if (this.blocks.length === 0) return 0;

    const lastBlock = this.blocks[this.blocks.length - 1];
    return lastBlock.endTime;
  }

  constructor() {
    makeAutoObservable(this, {
      _lastComputedCurrentBlock: false, // don't make this observable, since it's just a cache
    });

    runInAction(() => this.initialize());
  }

  initialize = () => {
    // Temporary hard-coded blocks
    this.blocks.push(new Block(Clouds()));
    this.blocks[0].setTiming({ startTime: 0, duration: 45 });
    this.blocks[0].parameterVariations = {
      u_color: [
        new LinearVariation4(
          5,
          new Vector4(0.0588, 1.0, 0.9216, 1),
          new Vector4(0, 0.5, 1, 1)
        ),
        new LinearVariation4(
          10,
          new Vector4(0, 0.5, 1, 1),
          new Vector4(0.4588, 0.2, 0.7216, 1)
        ),
        new LinearVariation4(
          10,
          new Vector4(0.4588, 0.2, 0.7216, 1),
          new Vector4(0.9, 0.5, 0.2, 1)
        ),
      ],
      u_speed: [
        new SineVariation(4, 0.5, 1, 0, -0.1),
        new FlatVariation(1.5, 0.1),
        new LinearVariation(2, 0.1, 1),
        new LinearVariation(30, 1, 1),
      ],
      u_scale: [
        new LinearVariation(5.5, 0.5, 1),
        new LinearVariation(5, 1, 0.5),
      ],
    };

    this.initialized = true;
  };

  insertCloneOfPattern = (pattern: Pattern) => {
    const newBlock = new Block(clone(pattern));
    const nextGap = this.nextFiniteGap(this.timer.globalTime);
    newBlock.setTiming(nextGap);
    this.addBlock(newBlock);
  };

  addBlock = (block: Block) => {
    // insert block in sorted order
    const index = this.blocks.findIndex((b) => b.startTime > block.startTime);
    if (index === -1) {
      this.blocks.push(block);
      return;
    }

    this.blocks.splice(index, 0, block);
  };

  removeBlock = (block: Block) => {
    this.blocks = this.blocks.filter((b) => b !== block);
  };

  /**
   * Changes a blocks starting time, and reorders it in the list of blocks
   *
   * @param {Block} block
   * @param {number} newStartTime
   * @memberof Store
   */
  changeBlockStartTime = (block: Block, newStartTime: number) => {
    block.startTime = newStartTime;
    this.reorderBlock(block);
  };

  reorderBlock = (block: Block) => {
    this.removeBlock(block);
    this.addBlock(block);
  };

  selectBlock = (block: Block) => {
    this.selectedBlocks = new Set([block]);
  };

  addBlockToSelection = (block: Block) => {
    this.selectedBlocks.add(block);
  };

  deselectBlock = (block: Block) => {
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
        .join(",")
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
        blockToCopy.duration
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
        selectedBlock.duration
      );
      newBlock.setTiming(nextGap);
      this.addBlock(newBlock);
      this.addBlockToSelection(newBlock);
    }
  };

  /**
   * Returns the next gap in the timeline, starting from the given time.
   * A missing duration means that the gap is infinite.
   *
   * @param {number} fromTime
   * @memberof Store
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
   * @param {number} fromTime
   * @param {number} [maxDuration=DEFAULT_BLOCK_DURATION]
   * @memberof Store
   */
  nextFiniteGap = (
    fromTime: number,
    maxDuration: number = DEFAULT_BLOCK_DURATION
  ): { startTime: number; duration: number } => {
    const gap = this.nextGap(fromTime);
    return {
      startTime: gap.startTime,
      duration: gap.duration
        ? Math.min(gap.duration, maxDuration)
        : maxDuration,
    };
  };

  nearestValidStartTimeDelta = (block: Block, desiredDeltaTime: number) => {
    const desiredStartTime = block.startTime + desiredDeltaTime;
    const desiredEndTime = block.endTime + desiredDeltaTime;
    for (const otherBlock of this.blocks) {
      if (otherBlock === block) continue;

      // check if desired time span overlaps with other block
      if (
        (desiredStartTime >= otherBlock.startTime &&
          desiredStartTime < otherBlock.endTime) ||
        (desiredEndTime > otherBlock.startTime &&
          desiredEndTime <= otherBlock.endTime)
      )
        // TODO: actually find the nearest valid delta time
        return 0;
    }

    return desiredDeltaTime;
  };

  resizeBlockLeftBound = (block: Block, delta: number) => {
    const desiredStartTime = block.startTime + delta;

    // do not allow changing start of this block past end of self
    if (desiredStartTime >= block.endTime) return;

    // do not allow changing start of this block before end of prior block
    const previousBlock = this.blocks[this.blocks.indexOf(block) - 1];
    if (previousBlock && desiredStartTime < previousBlock.endTime) {
      block.duration = block.endTime - previousBlock.endTime;
      block.startTime = previousBlock.endTime;
      return;
    }

    // do not allow changing start of block past start of timeline
    if (desiredStartTime < 0) {
      block.duration = block.endTime;
      block.startTime = 0;
      return;
    }

    block.startTime += delta;
    block.duration -= delta;
  };

  resizeBlockRightBound = (block: Block, delta: number) => {
    const desiredEndTime = block.endTime + delta;

    // do not allow changing end of block past start of self
    if (desiredEndTime <= block.startTime) return;

    // do not allow changing end of block past start of next block
    const nextBlock = this.blocks[this.blocks.indexOf(block) + 1];
    if (nextBlock && desiredEndTime > nextBlock.startTime) {
      block.duration = nextBlock.startTime - block.startTime;
      return;
    }

    block.duration += delta;
  };

  saveToLocalStorage = () => {
    localStorage.setItem("arrangement", JSON.stringify(this.serialize()));
  };

  serialize = () => ({
    audioStore: this.audioStore.serialize(),
    blocks: this.blocks.map((b) => b.serialize()),
  });

  loadFromLocalStorage = () => {
    const arrangement = localStorage.getItem("arrangement");
    if (arrangement) {
      this.deserialize(JSON.parse(arrangement));
    }
  };

  deserialize = (data: any) => {
    this.audioStore.deserialize(data.audioStore);
    this.blocks = data.blocks.map((b: any) => Block.deserialize(b));
  };
}
