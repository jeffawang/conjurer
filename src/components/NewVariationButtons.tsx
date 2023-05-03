import { ExtraParams } from "@/src/types/PatternParams";
import { IconButton, VStack } from "@chakra-ui/react";
import { memo } from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { TbWaveSine, TbVectorSpline } from "react-icons/tb";
import { MdTrendingFlat, MdColorLens } from "react-icons/md";
import Block from "@/src/types/Block";
import { action } from "mobx";
import FlatVariation from "@/src/types/Variations/FlatVariation";
import LinearVariation from "@/src/types/Variations/LinearVariation";
import SineVariation from "@/src/types/Variations/SineVariation";
import { Vector4 } from "three";
import LinearVariation4 from "@/src/types/Variations/LinearVariation4";
import { DEFAULT_VARIATION_DURATION } from "@/src/utils/time";
import SplineVariation from "@/src/types/Variations/SplineVariation";

type NewVariationButtonsProps = {
  uniformName: string;
  block: Block<ExtraParams>;
};

export default memo(function NewVariationButtons({
  uniformName,
  block,
}: NewVariationButtonsProps) {
  const newVariationButtons =
    block.pattern.paramValues[uniformName] instanceof Vector4 ? (
      <>
        <IconButton
          size="xs"
          aria-label="Linear4"
          title="Linear color change"
          height={6}
          icon={<MdColorLens size={17} />}
          onClick={action(() => {
            // grab the starting color from the previous variation if it exists
            // TODO: move this into a method somewhere
            const variationsCount =
              block.parameterVariations[uniformName]?.length ?? 0;
            const lastVariation =
              block.parameterVariations[uniformName]?.[variationsCount - 1];
            if (
              variationsCount > 0 &&
              lastVariation instanceof LinearVariation4
            ) {
              block.addVariation(
                uniformName,
                new LinearVariation4(
                  DEFAULT_VARIATION_DURATION,
                  lastVariation.to.clone(),
                  new Vector4(0.32, 0.1, 0.6, 1)
                )
              );
              return;
            }

            block.addVariation(
              uniformName,
              new LinearVariation4(
                DEFAULT_VARIATION_DURATION,
                new Vector4(0, 0, 0, 1),
                new Vector4(0.32, 0.1, 0.6, 1)
              )
            );
          })}
        />
      </>
    ) : (
      <>
        <IconButton
          size="xs"
          aria-label="Flat"
          title="Flat"
          height={6}
          icon={<MdTrendingFlat size={17} />}
          onClick={action(() =>
            block.addVariation(
              uniformName,
              new FlatVariation(DEFAULT_VARIATION_DURATION, 1)
            )
          )}
        />
        <IconButton
          size="xs"
          aria-label="Linear"
          title="Linear"
          height={6}
          icon={<BsArrowUpRight size={17} />}
          onClick={action(() =>
            block.addVariation(
              uniformName,
              new LinearVariation(DEFAULT_VARIATION_DURATION, 1, 2)
            )
          )}
        />
        <IconButton
          size="xs"
          aria-label="Sine"
          title="Sine"
          height={6}
          icon={<TbWaveSine size={17} />}
          onClick={action(() =>
            block.addVariation(
              uniformName,
              new SineVariation(DEFAULT_VARIATION_DURATION, 0.5, 0.5, 0, 0.5)
            )
          )}
        />
        <IconButton
          size="xs"
          aria-label="Spline"
          title="Spline"
          height={6}
          icon={<TbVectorSpline size={17} />}
          onClick={action(() =>
            block.addVariation(
              uniformName,
              new SplineVariation(DEFAULT_VARIATION_DURATION)
            )
          )}
        />
      </>
    );

  return (
    <VStack
      wrap="wrap"
      pl={1}
      gap={1}
      spacing={0}
      height="60px"
      justify="center"
    >
      {newVariationButtons}
    </VStack>
  );
});
