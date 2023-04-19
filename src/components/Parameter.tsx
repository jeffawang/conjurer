import { ExtraParams, PatternParam } from "@/src/types/PatternParams";
import { Button, Divider, HStack, Text, VStack } from "@chakra-ui/react";
import { MouseEvent, memo } from "react";
import { BsCaretDown, BsCaretUp } from "react-icons/bs";
import Variation from "@/src/types/Variations/Variation";
import VariationGraph from "@/src/components/VariationGraph";
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
  isSelected: boolean;
  handleClick: (e: MouseEvent, uniformName: string) => void;
};

export default memo(function Parameter({
  uniformName,
  patternParam,
  block,
  variations,
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
      <Divider />
      <Button
        variant="ghost"
        size="xs"
        width="95%"
        height={4}
        onClick={(e: MouseEvent) => handleClick(e, uniformName)}
      >
        <HStack width="100%" justify="center">
          <Text
            lineHeight={1}
            userSelect={"none"}
            fontSize={10}
            color={isSelected ? "orange" : "white"}
          >
            {patternParam.name}
          </Text>
          {isSelected ? (
            <BsCaretUp size={10} color="orange" />
          ) : (
            <BsCaretDown size={10} />
          )}
        </HStack>
      </Button>

      {isSelected &&
        (variations.length === 0 ? (
          <Text fontSize={10}>Click a button below to add a variation!</Text>
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
                                : (variation.duration / block.duration) * width
                            }
                            domain={domain}
                            block={block}
                          />
                        </VStack>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </HStack>
              )}
            </Droppable>
          </DragDropContext>
        ))}
      {isSelected && (
        <HStack alignSelf="flex-start" justify="start" spacing={0}>
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
      {isSelected && (
        <NewVariationButtons uniformName={uniformName} block={block} />
      )}
    </>
  );
});
