import { Box } from "@chakra-ui/react";
import LayerBlocks from "@/modules/components/LayerBlocks";

export default function Layer() {
  return (
    <Box position="relative" height={200} bgColor="gray.400">
      <LayerBlocks />
    </Box>
  );
}
