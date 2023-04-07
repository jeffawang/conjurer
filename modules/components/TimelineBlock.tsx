import { Block } from "@/modules/common/types/Block";
import { StandardParams } from "@/modules/common/types/PatternParams";
import { timeToX, xToTime } from "@/modules/common/utils/time";
import { Box, Card, Text, VStack } from "@chakra-ui/react";
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
    console.log(block.startTime);
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

        <VStack height="100%" justify="center">
          <Text>{block.pattern.name}</Text>
        </VStack>
      </Card>
    </Draggable>
  );
});
