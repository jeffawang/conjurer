import { Block } from "@/modules/common/types/Block";
import { StandardParams } from "@/modules/common/types/PatternParams";
import { timeToX } from "@/modules/common/utils/time";
import { Card, Text, VStack } from "@chakra-ui/react";
import { isObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { useRef } from "react";
import Draggable from "react-draggable";

type TimelineBlockProps = {
  block: Block<StandardParams>;
};

export default observer(function TimelineBlock({ block }: TimelineBlockProps) {
  const dragNodeRef = useRef(null);

  const handleDrag = (e: any, data: any) => {
    // TODO:
    // block.startTime += xToTime(data.x);
  };

  return (
    <Draggable
      nodeRef={dragNodeRef}
      axis="x"
      bounds="parent"
      onDrag={handleDrag}
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
      >
        <VStack height="100%" justify="center">
          <Text>{block.pattern.name}</Text>
        </VStack>
      </Card>
    </Draggable>
  );
});
