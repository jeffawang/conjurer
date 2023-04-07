import { patterns } from "@/modules/patterns/patterns";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { Block } from "../common/types/Block";
import BlockView from "@/modules/components/BlockView";
import { Canvas } from "@react-three/fiber";
import { LED_COUNTS } from "@/modules/common/utils/size";
import SelectablePattern from "@/modules/components/SelectablePattern";
import { action } from "mobx";
import { useStore } from "@/modules/common/types/StoreContext";

const PATTERN_PREVIEW_DISPLAY_FACTOR = 1.5;

export default function PatternList() {
  const store = useStore();

  const [selectedPatternIndex, setSelectedPatternIndex] = useState(0);
  const pattern = patterns[selectedPatternIndex];
  const block = useMemo(() => new Block(pattern), [pattern]);

  return (
    <VStack mt={6}>
      <Heading size="md">Pattern List</Heading>
      <Text fontSize="xs">previewing</Text>
      <Text lineHeight={0.5}>{pattern.name}</Text>
      <Box
        width={`${LED_COUNTS.x * PATTERN_PREVIEW_DISPLAY_FACTOR}px`}
        height={`${LED_COUNTS.y * PATTERN_PREVIEW_DISPLAY_FACTOR}px`}
      >
        <Canvas>
          <BlockView key={pattern.name} autorun block={block} />
        </Canvas>
      </Box>

      <VStack>
        {patterns.map((p, i) => (
          <SelectablePattern
            key={p.name}
            pattern={p}
            selected={i === selectedPatternIndex}
            onSelect={() => setSelectedPatternIndex(i)}
            onPatternInsert={action(() => store.insertClonedPattern(p))}
          />
        ))}
      </VStack>
    </VStack>
  );
}
