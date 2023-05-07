import { observer } from "mobx-react-lite";
import TimelineBlockStack from "@/src/components/TimelineBlockStack";
import { useStore } from "@/src/types/StoreContext";
import { Box } from "@chakra-ui/react";
import { MAX_TIME } from "@/src/utils/time";

export default observer(function TimelineBlockStacks() {
  const { blocks, uiStore } = useStore();

  return (
    <Box position="relative" width={uiStore.timeToXPixels(MAX_TIME)}>
      {blocks.map((block) => (
        <TimelineBlockStack key={block.id} block={block} />
      ))}
    </Box>
  );
});
