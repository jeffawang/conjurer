import { Block } from "@/modules/common/types/Block";
import { StandardParams } from "@/modules/common/types/PatternParams";
import { useStore } from "@/modules/common/types/StoreContext";
import { timeToX, xToTime } from "@/modules/common/utils/time";
import TimelineBlockBound from "@/modules/components/TimelineBlockBound";
import { Box, Card, Text, VStack } from "@chakra-ui/react";
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
    setPosition({ x: data.x, y: 0 });
  };
  const onDragStop = action(() => {
    block.startTime += xToTime(position.x);
    // TODO: potentially reorder blocks
    // TODO: prevent block overlaps for now
    setPosition({ x: 0, y: 0 });
    console.log("drag stop", block.startTime, block.duration);
  });

  const handleMouseDown = action((e: MouseEvent) => {
    lastMouseDown.current = e.clientX;
  });

  const handleClick = action((e: any) => {
    if (Math.abs(e.clientX - lastMouseDown.current) > 5) return;

    if (selectedBlocks.includes(block)) {
      store.deselectBlock(block);
    } else {
      // TODO: if shift is pressed, add to selection
      store.selectBlock(block);
    }
  });

  const isSelected = selectedBlocks.includes(block);

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
      >
        <Box
          color={isSelected ? "blue.500" : "gray.300"}
          className="handle"
          position="absolute"
          top={2}
          cursor="move"
        >
          <MdDragIndicator size={30} />
        </Box>

        <TimelineBlockBound
          leftBound
          onBoundChange={action((delta) => {
            if (delta > block.duration) return;
            block.startTime += delta;
            block.duration -= delta;
          })}
        />
        <TimelineBlockBound
          rightBound
          onBoundChange={action((delta) => {
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
