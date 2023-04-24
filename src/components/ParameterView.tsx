import { ExtraParams, PatternParam } from "@/src/types/PatternParams";
import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BsCaretDown, BsCaretUp } from "react-icons/bs";
import Block from "@/src/types/Block";
import NewVariationButtons from "@/src/components/NewVariationButtons";
import ParameterVariations from "@/src/components/ParameterVariations";
import { observer } from "mobx-react-lite";

type ParameterProps = {
  uniformName: string;
  patternParam: PatternParam;
  block: Block<ExtraParams>;
};

export default observer(function ParameterView({
  uniformName,
  patternParam,
  block,
}: ParameterProps) {
  const variations = block.parameterVariations[uniformName] ?? [];
  const [isExpanded, setExpanded] = useState(false);

  // only expand once we are on the client, otherwise strange errors
  useEffect(() => setExpanded(true), [setExpanded]);

  return (
    <Box width="100%" mb={isExpanded ? 2 : 0}>
      <Button
        variant="ghost"
        width="100%"
        height={7}
        p={0}
        borderTopWidth={1}
        borderColor="gray.500"
        borderStyle="solid"
        borderRadius={0}
        onClick={() => setExpanded(!isExpanded)}
      >
        <HStack width="100%" justify="center">
          <Text
            lineHeight={1}
            userSelect="none"
            fontSize={14}
            color={isExpanded ? "orange" : "white"}
          >
            {patternParam.name}
          </Text>
          {isExpanded ? (
            <BsCaretUp size={10} color="orange" />
          ) : (
            <BsCaretDown size={10} />
          )}
        </HStack>
      </Button>

      {isExpanded &&
        (variations.length === 0 ? (
          <HStack>
            <Text py={2} fontSize={10}>
              Click to add a variation:
            </Text>
            <NewVariationButtons uniformName={uniformName} block={block} />
          </HStack>
        ) : (
          <ParameterVariations
            uniformName={uniformName}
            block={block}
            variations={variations}
          />
        ))}
    </Box>
  );
});
