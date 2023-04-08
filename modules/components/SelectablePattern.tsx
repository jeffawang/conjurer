import { Card, Text, VStack } from "@chakra-ui/react";
import { useRef, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Pattern } from "@/modules/common/types/Pattern";
import { useStore } from "@/modules/common/types/StoreContext";
import { action } from "mobx";

type SelectablePatternProps = {
  pattern: Pattern;
  selected: boolean;
  onSelect: () => void;
  onPatternInsert: () => void;
};

export default function SelectablePattern({
  pattern,
  selected,
  onSelect,
  onPatternInsert,
}: SelectablePatternProps) {
  const store = useStore();
  const dragNodeRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleStart = action((e: DraggableEvent) => {
    store.draggingPattern = true;
  });
  const handleDrag = action((e: DraggableEvent, data: DraggableData) => {
    setPosition({ x: data.x, y: data.y });
  });
  const handleStop = action((e: DraggableEvent) => {
    setPosition({ x: 0, y: 0 });
    store.draggingPattern = false;
    // TODO: check if dropped on timeline, if so, insert new block for this pattern
  });

  return (
    <Draggable
      nodeRef={dragNodeRef}
      position={position}
      onStart={handleStart}
      onDrag={handleDrag}
      onStop={handleStop}
      onMouseDown={onSelect}
    >
      <Card
        ref={dragNodeRef}
        border="solid"
        borderWidth={1}
        zIndex={2}
        alignItems="center"
        cursor="move"
        onDoubleClick={onPatternInsert}
      >
        <VStack width="150px" height={10} justify="center">
          <Text userSelect="none" color={selected ? "teal.200" : "ButtonText"}>
            {selected ? `> ${pattern.name} <` : pattern.name}
          </Text>
        </VStack>
      </Card>
    </Draggable>
  );
}
