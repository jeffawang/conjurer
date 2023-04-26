import { Box, Divider, Heading, Text, VStack } from "@chakra-ui/react";
import { useMemo } from "react";
import Block from "../types/Block";
import { Canvas } from "@react-three/fiber";
import { LED_COUNTS } from "@/src/utils/size";
import SelectablePattern from "@/src/components/SelectablePattern";
import { useStore } from "@/src/types/StoreContext";
import { observer } from "mobx-react-lite";
import Keyboard from "@/src/components/Keyboard";
import CartesianView from "@/src/components/CartesianView";
import RenderPipeline from "@/src/components/RenderPipeline";

const PATTERN_PREVIEW_DISPLAY_FACTOR = 1.5;

export default observer(function PatternList() {
  const store = useStore();
  const { patterns, selectedPattern } = store;
  const block = useMemo(() => new Block(selectedPattern), [selectedPattern]);

  return (
    <VStack mt={6}>
      <Heading size="md">Pattern List</Heading>
      <Text userSelect="none" fontSize="xs">
        previewing
      </Text>
      <Text userSelect="none" lineHeight={0.5}>
        {selectedPattern.name}
      </Text>
      <Box
        width={`${LED_COUNTS.x * PATTERN_PREVIEW_DISPLAY_FACTOR}px`}
        height={`${LED_COUNTS.y * PATTERN_PREVIEW_DISPLAY_FACTOR}px`}
      >
        <Canvas>
          <RenderPipeline Output={CartesianView} block={block} autorun />
        </Canvas>
      </Box>

      <VStack>
        {patterns.map((p) => (
          <SelectablePattern
            key={p.name}
            pattern={p}
            selected={p === selectedPattern}
          />
        ))}
      </VStack>
      <Text userSelect="none" fontSize="xs">
        click to preview
      </Text>
      <Text userSelect="none" fontSize="xs">
        double click to insert
      </Text>
      <Divider />
      <Keyboard />
    </VStack>
  );
});
