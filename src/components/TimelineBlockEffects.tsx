import Block from "@/src/types/Block";
import { useStore } from "@/src/types/StoreContext";
import { Button, HStack, Heading, IconButton, Text } from "@chakra-ui/react";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { RxCaretUp, RxCaretDown } from "react-icons/rx";
import { FiPlusSquare } from "react-icons/fi";
import ParametersList from "@/src/components/ParametersList";
import { MouseEvent as ReactMouseEvent } from "react";

type TimelineBlockEffectsProps = {
  block: Block;
  handleBlockClick: (e: ReactMouseEvent) => void;
};

export default observer(function TimelineBlockEffects({
  block,
  handleBlockClick,
}: TimelineBlockEffectsProps) {
  const store = useStore();
  const { selectedBlocks } = store;

  const lastBlockEffectIndex = block.blockEffects.length - 1;
  const isSelected = selectedBlocks.has(block);
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
            <Heading
              size="md"
              userSelect="none"
              textOverflow="clip"
              overflowWrap="anywhere"
              cursor="grab"
              color={isSelected ? "blue.500" : "white"}
              onClick={handleBlockClick}
            >
              {`Effect: ${blockEffect.pattern.name}`}
            </Heading>

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
      <HStack
        width="100%"
        borderTopWidth={2}
        borderColor="gray.500"
        borderStyle="solid"
        borderRadius={0}
        justify="center"
      >
        <Button variant="ghost" width="100%">
          <FiPlusSquare size={20} />
          <Text
            userSelect="none"
            textOverflow="clip"
            overflowWrap="anywhere"
            onClick={handleBlockClick}
          >
            &nbsp; Add effect
          </Text>
        </Button>
      </HStack>
    </>
  );
});
