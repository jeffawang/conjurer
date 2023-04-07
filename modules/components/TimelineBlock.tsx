import { Block } from "@/modules/common/types/Block";
import { StandardParams } from "@/modules/common/types/PatternParams";
import { timeToX, xToTime } from "@/modules/common/utils/time";
import TimelineBlockBound from "@/modules/components/TimelineBlockBound";
import { Box, Card, HStack, Text, VStack } from "@chakra-ui/react";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useRef, useState } from "react";
import Draggable from "react-draggable";
import { MdDragIndicator } from "react-icons/md";

type TimelineBlockProps = {
  block: Block<StandardParams>;
};

export default observer(function TimelineBlock({ block }: TimelineBlockProps) {
  const dragNodeRef = useRef(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const handleDrag = (e: any, data: any) => {
    setPosition({ x: data.x, y: 0 });
  };
  const onDragStop = action(() => {
    block.startTime += xToTime(position.x);
    setPosition({ x: 0, y: 0 });
  });

  const rightBoundDragNodeRef = useRef(null);
  const [rightBoundDragging, setRightBoundDragging] = useState(false);
  const [rightBoundPosition, setLeftBoundPosition] = useState({ x: 0, y: 0 });
  const handleRightBoundDrag = (e: any, data: any) => {
    setLeftBoundPosition({ x: data.x, y: 0 });
  };
  const onRightBoundDragStop = action(() => {
    block.duration += xToTime(rightBoundPosition.x);
    setLeftBoundPosition({ x: 0, y: 0 });
    setRightBoundDragging(false);
  });

  return (
    <Draggable
      nodeRef={dragNodeRef}
      handle=".handle"
      axis="x"
      bounds="parent"
      onDrag={handleDrag}
      onStop={onDragStop}
      position={position}
    >
      <Card
        ref={dragNodeRef}
        position="absolute"
        top={0}
        left={timeToX(block.startTime)}
        width={timeToX(block.duration)}
        height="100%"
        border="solid"
        borderWidth={1}
        alignItems="center"
      >
        <Box className="handle" position="absolute" top={2} cursor="move">
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
          <Text textOverflow="clip" overflowWrap="anywhere">
            {block.pattern.name}
          </Text>
        </VStack>
      </Card>
    </Draggable>
  );
});
