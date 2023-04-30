import Block from "@/src/types/Block";
import { useStore } from "@/src/types/StoreContext";
import { HStack, Heading, IconButton } from "@chakra-ui/react";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { FaTrashAlt } from "react-icons/fa";
import { RxCaretUp, RxCaretDown } from "react-icons/rx";
import ParametersList from "@/src/components/ParametersList";
import { MouseEvent as ReactMouseEvent } from "react";

type TimelineBlockEffectProps = {
  effect: Block;
  effectIndex: number;
  handleBlockClick: (e: ReactMouseEvent) => void;
};

export default observer(function TimelineBlockEffect({
  effect,
  effectIndex,
  handleBlockClick,
}: TimelineBlockEffectProps) {
  const store = useStore();
  const { selectedBlocks } = store;

  const parentBlock = effect.parentBlock;
  if (!parentBlock) return null;

  const lastEffectIndex = parentBlock.blockEffects.length - 1;
  const isSelected = selectedBlocks.has(parentBlock);
  return (
    <>
      <HStack
        key={effect.id}
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
          {`Effect: ${effect.pattern.name}`}
        </Heading>

        <HStack position="absolute" right={0}>
          {effectIndex < lastEffectIndex && (
            <IconButton
              variant="link"
              aria-label="Move down"
              title="Move down"
              height={6}
              _hover={{ color: "blue.500" }}
              icon={<RxCaretDown size={28} />}
              onClick={action(() => parentBlock.reorderBlockEffect(effect, 1))}
            />
          )}
          {effectIndex > 0 && (
            <IconButton
              variant="link"
              aria-label="Move up"
              title="Move up"
              height={6}
              _hover={{ color: "blue.500" }}
              icon={<RxCaretUp size={28} />}
              onClick={action(() => parentBlock.reorderBlockEffect(effect, -1))}
            />
          )}
          <IconButton
            variant="link"
            aria-label="Delete effect"
            title="Delete effect"
            height={6}
            _hover={{ color: "red.500" }}
            icon={<FaTrashAlt size={12} />}
            onClick={action(() => parentBlock.removeBlockEffect(effect))}
          />
        </HStack>
      </HStack>
      <ParametersList block={effect} />
    </>
  );
});
