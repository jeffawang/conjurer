import { observer } from "mobx-react-lite";
import { Box } from "@chakra-ui/react";
import TimelineBlock from "@/modules/components/TimelineBlock";
import { timeToX } from "@/modules/common/utils/time";
import { useStore } from "@/modules/common/types/StoreContext";

export default observer(function Layer() {
  const { timer, blocks } = useStore();

  return (
    <Box
      position="relative"
      borderBottom="solid"
      borderColor="white"
      height={200}
      bgColor="gray.400"
    >
      <Box
        position="absolute"
        top={0}
        left={timeToX(timer.globalTime)}
        bgColor="red"
        width="1px"
        height="100%"
        zIndex={1}
      />
      {blocks.map((block, index) => (
        <TimelineBlock key={index} block={block} />
      ))}
    </Box>
  );
});
