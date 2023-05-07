import { HStack, Text } from "@chakra-ui/react";
import Variation from "@/src/types/Variations/Variation";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/types/StoreContext";
import { MdDragIndicator } from "react-icons/md";

type VariationHandleProps = {
  variation: Variation;
};

export default observer(function VariationHandle({
  variation,
}: VariationHandleProps) {
  const { selectedVariation } = useStore();
  return (
    <HStack
      spacing={0}
      color={selectedVariation?.id === variation.id ? "blue.500" : "white"}
    >
      <MdDragIndicator size={18} />
      <Text pointerEvents="none" fontSize="x-small">
        {variation.type}
      </Text>
    </HStack>
  );
});
