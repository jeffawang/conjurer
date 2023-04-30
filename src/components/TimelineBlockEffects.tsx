import Block from "@/src/types/Block";
import {
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { FiPlusSquare } from "react-icons/fi";
import { MouseEvent as ReactMouseEvent } from "react";
import { effects } from "@/src/effects/effects";
import TimelineBlockEffect from "@/src/components/TimelineBlockEffect";

type TimelineBlockEffectsProps = {
  block: Block;
  handleBlockClick: (e: ReactMouseEvent) => void;
};

export default observer(function TimelineBlockEffects({
  block,
  handleBlockClick,
}: TimelineBlockEffectsProps) {
  return (
    <>
      {block.blockEffects.map((blockEffect, index) => (
        <TimelineBlockEffect
          effect={blockEffect}
          effectIndex={index}
          handleBlockClick={handleBlockClick}
          key={blockEffect.id}
        />
      ))}
      <Box
        width="100%"
        borderTopWidth={2}
        borderColor="gray.500"
        borderStyle="solid"
      >
        <Menu>
          <MenuButton
            as={Button}
            variant="ghost"
            width="100%"
            textAlign={"center"}
          >
            <HStack
              userSelect="none"
              textOverflow="clip"
              overflowWrap="anywhere"
              justify="center"
            >
              <FiPlusSquare size={20} />
              <Text
                userSelect="none"
                textOverflow="clip"
                overflowWrap="anywhere"
                onClick={handleBlockClick}
              >
                Add effect
              </Text>
            </HStack>
          </MenuButton>
          <MenuList>
            {effects.map((effect) => (
              <MenuItem
                key={effect.name}
                onClick={action(() => block.addCloneOfEffect(effect))}
              >
                {effect.name}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Box>
    </>
  );
});
