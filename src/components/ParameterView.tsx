import { ExtraParams, PatternParam } from "@/src/types/PatternParams";
import { Box, Button, Divider, HStack, Text, VStack } from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import { BsCaretDown, BsCaretUp } from "react-icons/bs";
import Variation from "@/src/types/Variations/Variation";
import VariationGraph from "@/src/components/VariationGraph/VariationGraph";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import { reorder } from "@/src/utils/algorithm";
import Block from "@/src/types/Block";
import { action } from "mobx";
import VariationBound from "@/src/components/VariationBound";
import NewVariationButtons from "@/src/components/NewVariationButtons";

type ParameterProps = {
  uniformName: string;
  patternParam: PatternParam;
  block: Block<ExtraParams>;
  variations: Variation[];
  width: number;
};

export default memo(function ParameterView({
  uniformName,
  patternParam,
  block,
  variations,
  width,
}: ParameterProps) {
  const [isExpanded, setExpanded] = useState(false);

  // only expand once we are on the client, otherwise strange errors
  useEffect(() => setExpanded(true), [setExpanded]);

  const domain: [number, number] = [0, 1];
  for (const variation of variations) {
    const [min, max] = variation.computeDomain();
    domain[0] = Math.min(domain[0], min);
    domain[1] = Math.max(domain[1], max);
  }

  const onDragEnd: OnDragEndResponder = action((result) => {
    // dropped outside the list, delete
    if (!result.destination) {
      block.removeVariation(uniformName, variations[result.source.index]);
      return;
    }

    block.parameterVariations[uniformName] = reorder(
      variations,
      result.source.index,
      result.destination.index
    );
  });
  return (
    <>
      <Divider borderWidth={1} borderColor="gray.500" />
      <Button
        variant="ghost"
        width="100%"
        height={5}
        borderRadius={0}
        onClick={() => setExpanded(!isExpanded)}
      >
        <HStack width="100%" justify="center">
          <Text
            lineHeight={1}
            userSelect={"none"}
            fontSize={10}
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
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId={block.id + uniformName}
              direction="horizontal"
            >
              {(provided, snapshot) => (
                <HStack
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  width="100%"
                  justify="start"
                  spacing={0}
                >
                  {variations.map((variation, index) => (
                    <>
                      <Draggable
                        key={variation.id}
                        draggableId={variation.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <VStack
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <VariationGraph
                              uniformName={uniformName}
                              variation={variation}
                              width={
                                variation.duration < 0
                                  ? width
                                  : (variation.duration / block.duration) *
                                    width
                              }
                              domain={domain}
                              block={block}
                            />
                          </VStack>
                        )}
                      </Draggable>
                      {/* <Box width={1} /> */}
                    </>
                  ))}
                  {provided.placeholder}
                  <NewVariationButtons
                    uniformName={uniformName}
                    block={block}
                  />
                </HStack>
              )}
            </Droppable>
          </DragDropContext>
        ))}
      {isExpanded && (
        <HStack alignSelf="flex-start" justify="start" spacing={0} pb={2}>
          {variations.map((variation) => (
            <VariationBound
              key={variation.id}
              uniformName={uniformName}
              block={block}
              variation={variation}
            />
          ))}
        </HStack>
      )}
    </>
  );
});
