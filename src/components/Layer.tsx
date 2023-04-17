import { Box } from "@chakra-ui/react";
import LayerBlocks from "@/src/components/LayerBlocks";
import { useStore } from "@/src/types/StoreContext";
import { MAX_TIME } from "@/src/utils/time";

export default function Layer() {
  const store = useStore();
  const { uiStore } = store;
  return (
    <Box
      position="relative"
      height={250}
      width={uiStore.timeToXPixels(MAX_TIME)}
      bgColor="gray.400"
      onClick={store.deselectAllBlocks}
    >
      <LayerBlocks />
    </Box>
  );
}
