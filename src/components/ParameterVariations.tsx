import { ExtraParams } from "@/src/types/PatternParams";
import { HStack, VStack } from "@chakra-ui/react";
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
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/types/StoreContext";
import { Fragment } from "react";

type ParameterVariationsProps = {
  uniformName: string;
  block: Block<ExtraParams>;
  variations: Variation[];
};

export default observer(function ParameterVariations({
  uniformName,
  block,
  variations,
}: ParameterVariationsProps) {
  const { uiStore } = useStore();
  const width = uiStore.timeToX(block.duration);

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
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={block.id + uniformName} direction="horizontal">
        {(provided, snapshot) => (
          <HStack
            ref={provided.innerRef}
            {...provided.droppableProps}
            width="100%"
            justify="start"
            spacing={0}
          >
            {variations.map((variation, index) => (
              <Fragment key={variation.id}>
                {/* <Draggable draggableId={variation.id} index={index}>
                  {(provided, snapshot) => (*/}
                <VStack
                  ref={provided.innerRef}
                  // {...provided.draggableProps}
                  // {...provided.dragHandleProps}
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
                {/*  )}
               </Draggable> */}
                <VariationBound
                  uniformName={uniformName}
                  block={block}
                  variation={variation}
                />
              </Fragment>
            ))}
            {provided.placeholder}
            <NewVariationButtons uniformName={uniformName} block={block} />
          </HStack>
        )}
      </Droppable>
    </DragDropContext>
  );
});
