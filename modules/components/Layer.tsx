import { observer } from "mobx-react-lite";
import { Box } from "@chakra-ui/react";
import { timeToX } from "@/modules/common/utils/time";
import { useStore } from "@/modules/common/types/StoreContext";
import LayerBlocks from "@/modules/components/LayerBlocks";

export default observer(function Layer() {
  const { timer } = useStore();

  return (
    <Box
      position="relative"
      borderBottom="solid"
      borderColor="white"
      height={200}
      bgColor="gray.400"
    >
      {/* <Box
        position="absolute"
        top={0}
        transform={`translateX(${timeToX(timer.globalTime)})`}
        bgColor="red"
        width="1px"
        height="100%"
        zIndex={1}
      /> */}
      <LayerBlocks />
    </Box>
  );
});
