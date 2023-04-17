import { ExtraParams, PatternParam } from "@/src/types/PatternParams";
import {
  Box,
  Button,
  Divider,
  HStack,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { memo, useRef, useState } from "react";
import { BsArrowUpRight, BsCaretDown, BsCaretUp } from "react-icons/bs";
import { BiArrowToRight } from "react-icons/bi";
import { TbWaveSine } from "react-icons/tb";
import { MdTrendingFlat } from "react-icons/md";
import Variation from "@/src/types/Variations/Variation";
import VariationGraph from "@/src/components/VariationGraph";
import Draggable from "react-draggable";
import { reorder } from "@/src/utils/algorithm";
import { useStore } from "@/src/types/StoreContext";
import Block from "@/src/types/Block";
import { action } from "mobx";
import FlatVariation from "@/src/types/Variations/FlatVariation";
import LinearVariation from "@/src/types/Variations/LinearVariation";
import SineVariation from "@/src/types/Variations/SineVariation";
import { observer } from "mobx-react-lite";

type ParameterProps = {
  uniformName: string;
  block: Block<ExtraParams>;
  variation: Variation;
};

export default observer(function VariationBound({
  uniformName,
  block,
  variation,
}: ParameterProps) {
  const store = useStore();

  const dragNodeRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const handleDrag = (e: any, data: any) => {
    setPosition({ x: data.x, y: 0 });
  };
  const handleStop = action(() => {
    // onBoundChange(uiStore.xToTime(position.x));
    block.applyVariationDurationDelta(
      uniformName,
      variation,
      store.uiStore.xToTime(position.x)
    );
    setPosition({ x: 0, y: 0 });
  });

  return (
    <HStack
      width={store.uiStore.timeToXPixels(
        variation.duration < 0 ? block.duration : variation.duration
      )}
      height={2}
      justify="flex-end"
    >
      <Draggable
        nodeRef={dragNodeRef}
        axis="x"
        onDrag={handleDrag}
        onStop={handleStop}
        position={position}
      >
        <Box
          ref={dragNodeRef}
          position="absolute"
          cursor="col-resize"
          borderRadius="5px"
          borderStyle="solid"
        >
          <BiArrowToRight size={17} />
        </Box>
      </Draggable>
    </HStack>
  );
});
