import { ExtraParams } from "@/src/types/PatternParams";
import { HStack, IconButton } from "@chakra-ui/react";
import { memo } from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { TbWaveSine } from "react-icons/tb";
import { MdTrendingFlat, MdColorLens } from "react-icons/md";
import Block from "@/src/types/Block";
import { action } from "mobx";
import FlatVariation from "@/src/types/Variations/FlatVariation";
import LinearVariation from "@/src/types/Variations/LinearVariation";
import SineVariation from "@/src/types/Variations/SineVariation";
import { Vector4 } from "three";
import LinearVariation4 from "@/src/types/Variations/LinearVariation4";
import { DEFAULT_Variation_DURATION } from "@/src/utils/time";

type NewVariationButtonsProps = {
  uniformName: string;
  block: Block<ExtraParams>;
};

export default memo(function NewVariationButtons({
  uniformName,
  block,
}: NewVariationButtonsProps) {
  return block.pattern.paramValues[uniformName] instanceof Vector4 ? (
    <HStack>
      <IconButton
        size="xs"
        aria-label="Linear4"
        height={6}
        icon={<MdColorLens size={17} />}
        onClick={action(() =>
          block.addVariation(
            uniformName,
            new LinearVariation4(
              DEFAULT_Variation_DURATION,
              new Vector4(0, 0, 0, 1), // TODO: start from last color of previous variation
              new Vector4(0.32, 0.1, 0.6, 1)
            )
          )
        )}
      />
    </HStack>
  ) : (
    <HStack>
      <IconButton
        size="xs"
        aria-label="Flat"
        height={6}
        icon={<MdTrendingFlat size={17} />}
        onClick={action(() =>
          block.addVariation(
            uniformName,
            new FlatVariation(DEFAULT_Variation_DURATION, 1)
          )
        )}
      />
      <IconButton
        size="xs"
        aria-label="Linear"
        height={6}
        icon={<BsArrowUpRight size={17} />}
        onClick={action(() =>
          block.addVariation(
            uniformName,
            new LinearVariation(DEFAULT_Variation_DURATION, 1, 2)
          )
        )}
      />
      <IconButton
        size="xs"
        aria-label="Sine"
        height={6}
        icon={<TbWaveSine size={17} />}
        onClick={action(() =>
          block.addVariation(
            uniformName,
            new SineVariation(DEFAULT_Variation_DURATION, 0.5, 0.5, 0, 0.5)
          )
        )}
      />
    </HStack>
  );
});
