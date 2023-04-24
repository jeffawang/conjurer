import {
  Box,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react";
import Variation from "@/src/types/Variations/Variation";
import Block from "@/src/types/Block";
import VariationControls from "@/src/components/VariationControls";
import LinearVariation4 from "@/src/types/Variations/LinearVariation4";
import ScalarVariationGraph from "@/src/components/VariationGraph/ScalarVariationGraph";
import LinearVariationGraph4 from "@/src/components/VariationGraph/LinearVariationGraph4";

type VariationGraphProps = {
  uniformName: string;
  variation: Variation;
  width: number;
  domain: [number, number];
  block: Block;
};

export default (function VariationGraph({
  uniformName,
  variation,
  width,
  domain,
  block,
}: VariationGraphProps) {
  const variationGraph =
    variation instanceof LinearVariation4 ? (
      <LinearVariationGraph4
        uniformName={uniformName}
        variation={variation}
        width={width}
        domain={domain}
        block={block}
      />
    ) : (
      <ScalarVariationGraph
        uniformName={uniformName}
        variation={variation}
        width={width}
        domain={domain}
        block={block}
      />
    );

  return (
    <Popover
      placement="bottom"
      isLazy
      returnFocusOnClose={false}
      // closeOnBlur={false}
      openDelay={0}
      closeDelay={0}
    >
      <PopoverTrigger>
        <Box>{variationGraph}</Box>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <VariationControls
            variation={variation}
            uniformName={uniformName}
            block={block}
          />
        </PopoverContent>
      </Portal>
    </Popover>
  );
});
