import { patterns } from "@/modules/patterns/patterns";
import { Box, Button, VStack } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { Block } from "../common/types/Block";
import BlockView from "@/modules/components/BlockView";
import { Canvas } from "@react-three/fiber";
import { LED_COUNTS } from "@/modules/common/utils/size";

export default function PatternList() {
  const [pattern, setPattern] = useState(patterns[0]);

  const block = useMemo(() => new Block(pattern), [pattern]);

  return (
    <VStack>
      <Box width={`${LED_COUNTS.x}px`} height={`${LED_COUNTS.y}px`}>
        <Canvas>
          <BlockView key={block.pattern.name} autorun block={block} />
        </Canvas>
      </Box>

      {patterns.map((p) => (
        <Button
          key={p.name}
          colorScheme="teal"
          variant="outline"
          onClick={() => setPattern(p)}
        >
          {p.name}
        </Button>
      ))}
    </VStack>
  );
}
