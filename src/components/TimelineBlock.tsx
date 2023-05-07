import Block from "@/src/types/Block";
import { useStore } from "@/src/types/StoreContext";
import TimelineBlockBound from "@/src/components/TimelineBlockBound";
import { Card } from "@chakra-ui/react";
import { action, computed } from "mobx";
import { observer } from "mobx-react-lite";
import {
  MouseEvent as ReactMouseEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import Draggable from "react-draggable";
import { DraggableData } from "react-draggable";
import { DraggableEvent } from "react-draggable";
import TimelineBlockNode from "@/src/components/TimelineBlockNode";
import AddEffectButton from "@/src/components/AddEffectButton";

type TimelineBlockProps = {
  block: Block;
};

export default observer(function TimelineBlock({ block }: TimelineBlockProps) {
  const store = useStore();
  const { selectedBlocks, uiStore } = store;

  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  const lastMouseDown = useRef(0);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const handleDrag = useCallback((e: DraggableEvent, data: DraggableData) => {
    // TODO: implement optional snapping here
    setPosition({ x: data.x, y: 0 });
  }, []);
  // handle moving a block to a new start time
  const handleDragStop = action((e: DraggableEvent, data: DraggableData) => {
    if (Math.abs(position.x) < 1) return;

    // prevent block overlaps for now by snapping to nearest valid start time
    const validTimeDelta = store.nearestValidStartTimeDelta(
      block,
      uiStore.xToTime(position.x)
    );
    store.changeBlockStartTime(block, block.startTime + validTimeDelta);
    setPosition({ x: 0, y: 0 });
  });

  const handleMouseDown = useCallback((e: MouseEvent) => {
    lastMouseDown.current = e.clientX;
  }, []);

  const handleBlockClick = useCallback(
    (e: ReactMouseEvent) => {
      if (Math.abs(e.clientX - lastMouseDown.current) > 5) return;

      if (selectedBlocks.has(block)) {
        store.deselectBlock(block);
      } else if (e.shiftKey) {
        store.addBlockToSelection(block);
      } else {
        store.selectBlock(block);
      }
      e.stopPropagation();
    },
    [store, block, selectedBlocks]
  );

  // cache this value, see https://mobx.js.org/computeds-with-args.html
  const isSelected = computed(() => store.selectedBlocks.has(block)).get();

  return (
    <Draggable
      nodeRef={dragNodeRef}
      handle=".handle"
      axis="x"
      bounds="parent"
      onDrag={handleDrag}
      onStop={handleDragStop}
      position={position}
      onMouseDown={handleMouseDown}
    >
      <Card
        ref={dragNodeRef}
        position="absolute"
        top={0}
        left={uiStore.timeToXPixels(block.startTime)}
        width={uiStore.timeToXPixels(block.duration)}
        minHeight="100%"
        border="solid"
        borderColor={isSelected ? "blue.500" : "white"}
        borderWidth={3}
        alignItems="center"
      >
        <TimelineBlockBound block={block} leftBound />
        <TimelineBlockBound block={block} rightBound />

        <TimelineBlockNode
          block={block}
          handleBlockClick={handleBlockClick}
          isSelected={isSelected}
        />
        {block.blockEffects.map((blockEffect, index) => (
          <TimelineBlockNode
            key={blockEffect.id}
            block={blockEffect}
            effectIndex={index}
            handleBlockClick={handleBlockClick}
            isSelected={isSelected}
          />
        ))}
        <AddEffectButton block={block} />
      </Card>
    </Draggable>
  );
});
