import { Card, Text, VStack } from "@chakra-ui/react";
import { useRef, useState } from "react";
import Draggable from "react-draggable";
import { Pattern } from "@/modules/common/types/Pattern";
type SelectablePatternProps = {
  pattern: Pattern;
  selected: boolean;
  onSelect: () => void;
};

export default function SelectablePattern({
  pattern,
  selected,
  onSelect,
}: SelectablePatternProps) {
  const dragNodeRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const handleDrag = (e: any, data: any) => {
    setPosition({ x: data.x, y: data.y });
  };
  const handleStop = () => {
    setPosition({ x: 0, y: 0 });
  };
  return (
    <Draggable
      nodeRef={dragNodeRef}
      position={position}
      onDrag={handleDrag}
      onStop={handleStop}
    >
      <Card
        ref={dragNodeRef}
        onClick={onSelect}
        border="solid"
        borderWidth={1}
        zIndex={2}
        alignItems="center"
        cursor="move"
      >
        <VStack width="150px" height={10} justify="center">
          <Text color={selected ? "teal.200" : "ButtonText"}>
            {selected ? `> ${pattern.name} <` : pattern.name}
          </Text>
        </VStack>
      </Card>
    </Draggable>
  );
}
