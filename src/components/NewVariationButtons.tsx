import { ExtraParams } from "@/src/types/PatternParams";
import { HStack, IconButton } from "@chakra-ui/react";
import { memo } from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { TbWaveSine } from "react-icons/tb";
import { MdTrendingFlat } from "react-icons/md";
import Block from "@/src/types/Block";
import { action } from "mobx";
import FlatVariation from "@/src/types/Variations/FlatVariation";
import LinearVariation from "@/src/types/Variations/LinearVariation";
import SineVariation from "@/src/types/Variations/SineVariation";

type NewVariationButtonsProps = {
  uniformName: string;
  block: Block<ExtraParams>;
};

export default memo(function NewVariationButtons({
  uniformName,
  block,
}: NewVariationButtonsProps) {
  return (
    <HStack>
      <IconButton
        size="xs"
        aria-label="Flat"
        height={6}
        icon={<MdTrendingFlat size={17} />}
        onClick={action(() =>
          block.addVariation(uniformName, new FlatVariation(2, 1))
        )}
      />
      <IconButton
        size="xs"
        aria-label="Linear"
        height={6}
        icon={<BsArrowUpRight size={17} />}
        onClick={action(() =>
          block.addVariation(uniformName, new LinearVariation(2, 1, 2))
        )}
      />
      <IconButton
        size="xs"
        aria-label="Sine"
        height={6}
        icon={<TbWaveSine size={17} />}
        onClick={action(() =>
          block.addVariation(uniformName, new SineVariation(2, 1, 0.5, 0, 0))
        )}
      />
    </HStack>
  );
});
