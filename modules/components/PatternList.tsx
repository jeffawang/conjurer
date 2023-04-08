import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { Block } from "../common/types/Block";
import BlockView from "@/modules/components/BlockView";
import { Canvas } from "@react-three/fiber";
import { LED_COUNTS } from "@/modules/common/utils/size";
import SelectablePattern from "@/modules/components/SelectablePattern";
import { action } from "mobx";
import { useStore } from "@/modules/common/types/StoreContext";
import { observer } from "mobx-react-lite";

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
          <BlockView key={selectedPattern.name} autorun block={block} />
        </Canvas>
      </Box>

      <VStack>
        {patterns.map((p) => (
          <SelectablePattern
            key={p.name}
            pattern={p}
            selected={p === selectedPattern}
            onSelect={action(() => {
              store.selectedPattern = p;
            })}
            onPatternInsert={action(() => store.insertCloneOfPattern(p))}
          />
        ))}
      </VStack>
    </VStack>
  );
});
