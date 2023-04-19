import { observer } from "mobx-react-lite";
import TimelineBlock from "@/src/components/TimelineBlock";
import { useStore } from "@/src/types/StoreContext";
import { Box } from "@chakra-ui/react";
import { MAX_TIME } from "@/src/utils/time";

export default observer(function PatternBlocks() {
  const store = useStore();
  const { blocks, uiStore } = useStore();

  return (
    <>
      <Box
        position="relative"
        height={350}
        width={uiStore.timeToXPixels(MAX_TIME)}
        bgColor="gray.400"
        onClick={store.deselectAllBlocks}
      >
        {blocks.map((block) => (
          <TimelineBlock key={block.id} block={block} />
        ))}
      </Box>
    </>
  );
});
