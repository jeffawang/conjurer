import Block from "@/src/types/Block";
import { useStore } from "@/src/types/StoreContext";
import TimelineBlockBound from "@/src/components/TimelineBlockBound";
import { Card, HStack, Text, VStack } from "@chakra-ui/react";
import { action } from "mobx";
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
import { MdDragIndicator } from "react-icons/md";
import ParametersList from "@/src/components/ParametersList";

type TimelineBlockProps = {
  block: Block;
};

export default observer(function TimelineBlock({ block }: TimelineBlockProps) {
  const store = useStore();
  const { selectedBlocks, uiStore } = store;

  const dragNodeRef = useRef(null);
  const lastMouseDown = useRef(0);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const handleDrag = useCallback((e: DraggableEvent, data: DraggableData) => {
    // TODO: implement optional snapping here
    setPosition({ x: data.x, y: 0 });
  }, []);
  // handle moving a block to a new start time
  const handleDragStop = action(() => {
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

  const handleClick = useCallback(
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

  const isSelected = selectedBlocks.has(block);

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
        height="100%"
        border="solid"
        borderColor={isSelected ? "blue.500" : "gray.300"}
        borderWidth={3}
        alignItems="center"
      >
        <TimelineBlockBound block={block} leftBound />
        <TimelineBlockBound block={block} rightBound />

        <HStack
          py={2}
          width="100%"
          color={isSelected ? "blue.500" : "gray.300"}
          className="handle"
          justifyContent="center"
          cursor="move"
          spacing={0}
          onClick={handleClick}
          role="button"
        >
          <MdDragIndicator size={30} />
          <Text userSelect="none" textOverflow="clip" overflowWrap="anywhere">
            {block.pattern.name}
          </Text>
        </HStack>
        <ParametersList block={block} />
      </Card>
    </Draggable>
  );
});
