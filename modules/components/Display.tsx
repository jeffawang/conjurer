import BlockView from "@/modules/components/BlockView";
import { Box, HStack } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import { observer } from "mobx-react-lite";
import { useStore } from "@/modules/common/types/StoreContext";

const DISPLAY_FACTOR = 3;
const LED_COUNTS = { width: 96, height: 75 };

type DisplayProps = {};

export default observer(function Display({}: DisplayProps) {
  const { currentBlock } = useStore();
  return (
    <HStack py={4} justify="center">
      <Box
        width={`${LED_COUNTS.width * DISPLAY_FACTOR}px`}
        height={`${LED_COUNTS.height * DISPLAY_FACTOR}px`}
      >
        <Canvas>
          {currentBlock && (
            <BlockView key={currentBlock.pattern.name} block={currentBlock} />
          )}
        </Canvas>
      </Box>
    </HStack>
  );
});
