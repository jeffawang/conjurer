import BlockView from "@/modules/components/BlockView";
import { Box, HStack } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import { Block } from "../common/types/Block";
import { StandardParams } from "@/modules/common/types/PatternParams";

const DISPLAY_FACTOR = 3;
const LED_COUNTS = { width: 96, height: 75 };

type DisplayProps = {
  block: Block<StandardParams>;
};

export default function Display({ block }: DisplayProps) {
  return (
    <HStack py={4} justify="center">
      <Box
        width={`${LED_COUNTS.width * DISPLAY_FACTOR}px`}
        height={`${LED_COUNTS.height * DISPLAY_FACTOR}px`}
      >
        <Canvas>
          <BlockView key={block.pattern.name} block={block} />
        </Canvas>
      </Box>{" "}
    </HStack>
  );
}
