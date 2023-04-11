import { useStore } from "@/modules/common/types/StoreContext";
import { Box } from "@chakra-ui/react";
import { action } from "mobx";
import { useRef, useState } from "react";
import Draggable from "react-draggable";

type TimelineBlockProps = {
  onBoundChange: (delta: number) => void;
  leftBound?: boolean;
  rightBound?: boolean;
};

export default function TimelineBlockBound({
  onBoundChange,
  leftBound,
  rightBound,
}: TimelineBlockProps) {
  const { uiStore } = useStore();

  const dragNodeRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const handleDrag = (e: any, data: any) => {
    setPosition({ x: data.x, y: 0 });
  };
  const handleStop = action(() => {
    onBoundChange(uiStore.xToTime(position.x));
    setPosition({ x: 0, y: 0 });
    setDragging(false);
  });

  return (
    <Draggable
      nodeRef={dragNodeRef}
      axis="x"
      onStart={() => setDragging(true)}
      onDrag={handleDrag}
      onStop={handleStop}
      position={position}
    >
      <Box
        ref={dragNodeRef}
        position="absolute"
        left={leftBound ? 0 : "auto"}
        right={rightBound ? 0 : "auto"}
        width="5px"
        height="100%"
        cursor="col-resize"
        borderRadius="5px"
        bgColor={dragging ? "gray.100" : "none"}
      />
    </Draggable>
  );
}
