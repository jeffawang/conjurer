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
import { FiPlusSquare } from "react-icons/fi";
import { effects } from "@/src/effects/effects";
import { memo } from "react";

type TimelineBlockEffectsProps = {
  block: Block;
};

export default memo(function AddEffectButton({
  block,
}: TimelineBlockEffectsProps) {
  return (
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
            <Text userSelect="none" textOverflow="clip" overflowWrap="anywhere">
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
  );
});
