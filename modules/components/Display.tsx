import BlockView from "@/modules/components/BlockView";
import { Box, HStack } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import { observer } from "mobx-react-lite";
import { useStore } from "@/modules/common/types/StoreContext";
import { LED_COUNTS } from "@/modules/common/utils/size";
import CanopyView from "@/modules/components/CanopyView";

// Multiplier on the base LED size for the main display only
const DISPLAY_FACTOR = 5;

type DisplayProps = {};

export default observer(function Display({}: DisplayProps) {
  const { currentBlock } = useStore();
  return (
    <HStack py={4} gap={20} justify="center">
      <Box
        width={`${LED_COUNTS.x * DISPLAY_FACTOR}px`}
        height={`${LED_COUNTS.y * DISPLAY_FACTOR}px`}
      >
        <Canvas>
          {currentBlock && (
            <BlockView key={currentBlock.pattern.name} block={currentBlock} />
          )}
        </Canvas>
      </Box>
      <Box
        width={`${LED_COUNTS.y * DISPLAY_FACTOR}px`}
        height={`${LED_COUNTS.y * DISPLAY_FACTOR}px`}
      >
        <Canvas>
          {currentBlock && (
            <CanopyView key={currentBlock.pattern.name} block={currentBlock} />
          )}
        </Canvas>
      </Box>
    </HStack>
  );
});
