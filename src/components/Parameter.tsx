import { PatternParam } from "@/src/types/PatternParams";
import { Divider, HStack, Text } from "@chakra-ui/react";
import { memo } from "react";
import { BsCaretDown, BsCaretUp } from "react-icons/bs";
import Variation from "@/src/types/Variations/Variation";
import VariationGraph from "@/src/components/VariationGraph";

type ParameterProps = {
  uniformName: string;
  patternParam: PatternParam;
  variations: Variation[];
  blockDuration: number;
  width: number;
  isSelected: boolean;
  handleClick: (e: any, uniformName: string) => void;
};

export default memo(function Parameter({
  uniformName,
  patternParam,
  variations,
  blockDuration,
  width,
  isSelected,
  handleClick,
}: ParameterProps) {
  const domain: [number, number] = [0, 1];
  for (const variation of variations) {
    const [min, max] = variation.computeDomain();
    domain[0] = Math.min(domain[0], min);
    domain[1] = Math.max(domain[1], max);
  }

  return (
    <>
      <Divider />
      <HStack
        width="100%"
        onClick={(e) => handleClick(e, uniformName)}
        justify="center"
      >
        <Text lineHeight={1} userSelect={"none"} fontSize={10}>
          {patternParam.name}
        </Text>
        {isSelected ? <BsCaretUp size={10} /> : <BsCaretDown size={10} />}
      </HStack>

      {isSelected &&
        (variations.length === 0 ? null : (
          // TODO: no variations case
          <HStack width="100%" gap={0} justify={"start"} spacing={0}>
            {variations.map((variation) => (
              <VariationGraph
                key={variation.id}
                variation={variation}
                width={
                  variation.duration < 0
                    ? width
                    : (variation.duration / blockDuration) * width
                }
                domain={domain}
                blockDuration={blockDuration}
              />
            ))}
          </HStack>
        ))}
    </>
  );
});
