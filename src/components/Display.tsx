import BlockView from "@/src/components/BlockView";
import { Box, Heading, VStack } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/types/StoreContext";
import { LED_COUNTS } from "@/src/utils/size";
import CanopyCanvas from "@/src/components/CanopyCanvas";

// Multiplier on the base LED size for the main display only
const BLOCK_DISPLAY_FACTOR = 3;

export default observer(function Display() {
  const { currentBlock } = useStore();
  return (
    <Box position="relative" height="100%">
      <VStack position="absolute" width="100%" marginY="2" zIndex={1}>
        <Heading>Conjurer</Heading>
      </VStack>
      {/* <Box
        position="absolute"
        bottom={0}
        left={0}
        width={`${LED_COUNTS.x * BLOCK_DISPLAY_FACTOR}px`}
        height={`${LED_COUNTS.y * BLOCK_DISPLAY_FACTOR}px`}
        zIndex={1}
      >
        <Canvas>

        </Canvas>
      </Box> */}
      <Box
        height="100%"
        borderStyle="solid"
        borderColor="black"
        borderBottomWidth={1}
      >
        <CanopyCanvas />
      </Box>
    </Box>
  );
});
