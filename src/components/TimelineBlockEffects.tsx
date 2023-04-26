import Block from "@/src/types/Block";
import { useStore } from "@/src/types/StoreContext";
import TimelineBlockBound from "@/src/components/TimelineBlockBound";
import { Card, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import {
  Fragment,
  MouseEvent as ReactMouseEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import Draggable from "react-draggable";
import { DraggableData } from "react-draggable";
import { DraggableEvent } from "react-draggable";
import { FaTrashAlt } from "react-icons/fa";
import { RxCaretUp, RxCaretDown } from "react-icons/rx";
import ParametersList from "@/src/components/ParametersList";

type TimelineBlockEffectsProps = {
  block: Block;
};

export default observer(function TimelineBlockEffects({
  block,
}: TimelineBlockEffectsProps) {
  const store = useStore();

  const lastBlockEffectIndex = block.blockEffects.length - 1;
  return (
    <>
      {block.blockEffects.map((blockEffect, index) => (
        <Fragment key={blockEffect.id}>
          <HStack
            key={blockEffect.id}
            position="relative"
            pt={1}
            width="100%"
            borderTopWidth={2}
            borderColor="gray.500"
            borderStyle="solid"
            borderRadius={0}
            justify="center"
          >
            <Text userSelect="none" textOverflow="clip" overflowWrap="anywhere">
              {`Effect: ${blockEffect.pattern.name}`}
            </Text>

            <HStack position="absolute" right={0}>
              {index < lastBlockEffectIndex && (
                <IconButton
                  variant="link"
                  aria-label="Move down"
                  title="Move down"
                  height={6}
                  _hover={{ color: "blue.500" }}
                  icon={<RxCaretDown size={28} />}
                  onClick={action(() =>
                    block.reorderBlockEffect(blockEffect, 1)
                  )}
                />
              )}
              {index > 0 && (
                <IconButton
                  variant="link"
                  aria-label="Move up"
                  title="Move up"
                  height={6}
                  _hover={{ color: "blue.500" }}
                  icon={<RxCaretUp size={28} />}
                  onClick={action(() =>
                    block.reorderBlockEffect(blockEffect, -1)
                  )}
                />
              )}
              <IconButton
                variant="link"
                aria-label="Delete effect"
                title="Delete effect"
                height={6}
                _hover={{ color: "red.500" }}
                icon={<FaTrashAlt size={12} />}
                onClick={action(() => block.removeBlockEffect(blockEffect))}
              />
            </HStack>
          </HStack>
          <ParametersList block={blockEffect} />
        </Fragment>
      ))}
    </>
  );
});
