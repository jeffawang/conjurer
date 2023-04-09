import Block from "@/modules/common/types/Block";
import { StandardParams } from "@/modules/common/types/PatternParams";
import { useStore } from "@/modules/common/types/StoreContext";
import { timeToX, xToTime } from "@/modules/common/utils/time";
import TimelineBlockBound from "@/modules/components/TimelineBlockBound";
import { Card, HStack, Text, VStack } from "@chakra-ui/react";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useRef, useState } from "react";
import Draggable from "react-draggable";
import { DraggableData } from "react-draggable";
import { DraggableEvent } from "react-draggable";
import { MdDragIndicator } from "react-icons/md";

type TimelineBlockProps = {
  block: Block<StandardParams>;
};

export default observer(function TimelineBlock({ block }: TimelineBlockProps) {
  const store = useStore();
  const { selectedBlocks } = store;

  const dragNodeRef = useRef(null);
  const lastMouseDown = useRef(0);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    // TODO: implement snapping here
    setPosition({ x: data.x, y: 0 });
  };
  const onDragStop = action(() => {
    block.startTime += xToTime(position.x);
    // TODO: potentially reorder blocks
    // TODO: prevent block overlaps for now
    setPosition({ x: 0, y: 0 });
  });

  const handleMouseDown = action((e: MouseEvent) => {
    lastMouseDown.current = e.clientX;
  });

  const handleClick = action((e: any) => {
    if (Math.abs(e.clientX - lastMouseDown.current) > 5) return;

    if (selectedBlocks.has(block)) {
      store.deselectBlock(block);
    } else if (e.shiftKey) {
      store.addBlockToSelection(block);
    } else {
      store.selectBlock(block);
    }
    e.stopPropagation();
  });

  const isSelected = selectedBlocks.has(block);

  return (
    <Draggable
      nodeRef={dragNodeRef}
      handle=".handle"
      axis="x"
      bounds="parent"
      onDrag={handleDrag}
      onStop={onDragStop}
      position={position}
      onMouseDown={handleMouseDown}
    >
      <Card
        ref={dragNodeRef}
        position="absolute"
        top={0}
        left={timeToX(block.startTime)}
        width={timeToX(block.duration)}
        height="100%"
        border="solid"
        borderColor={isSelected ? "blue.500" : "gray.300"}
        borderWidth={3}
        alignItems="center"
        onClick={handleClick}
        role="button"
      >
        <HStack
          color={isSelected ? "blue.500" : "gray.300"}
          className="handle"
          position="absolute"
          top={2}
          justifyContent="center"
          cursor="move"
        >
          <MdDragIndicator size={30} />
        </HStack>

        <TimelineBlockBound
          leftBound
          onBoundChange={action((delta) => {
            // Do not allow start of block to be dragged after end of block
            if (delta > block.duration) return;
            block.startTime += delta;
            block.duration -= delta;
          })}
        />
        <TimelineBlockBound
          rightBound
          onBoundChange={action((delta) => {
            // Do not allow end of block to be dragged before start of block
            if (block.duration + delta < 0) return;
            block.duration += delta;
          })}
        />

        <VStack pointerEvents="none" height="100%" justify="center">
          <Text userSelect="none" textOverflow="clip" overflowWrap="anywhere">
            {block.pattern.name}
          </Text>
        </VStack>
      </Card>
    </Draggable>
  );
});
