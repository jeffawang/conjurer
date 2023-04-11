import { Box } from "@chakra-ui/react";
import LayerBlocks from "@/src/components/LayerBlocks";
import { useStore } from "@/src/types/StoreContext";

export default function Layer() {
  const store = useStore();
  return (
    <Box
      position="relative"
      height={200}
      bgColor="gray.400"
      onClick={store.deselectAllBlocks}
    >
      <LayerBlocks />
    </Box>
  );
}
