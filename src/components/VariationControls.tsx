import {
  HStack,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
} from "@chakra-ui/react";
import { memo, useMemo, useState } from "react";
import { LineChart, Line, Tooltip, YAxis } from "recharts";
import Variation from "@/src/types/Variations/Variation";
import { action } from "mobx";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import Block from "@/src/types/Block";
import FlatVariation from "@/src/types/Variations/FlatVariation";

type VariationControlsProps = {
  uniformName: string;
  variation: Variation;
  width: number;
  domain: [number, number];
  block: Block;
};

export default memo(function VariationControls({
  uniformName,
  variation,
  width,
  domain,
  block,
}: VariationControlsProps) {
  if (variation instanceof FlatVariation) {
    return (
      <>
        <HStack m={1}>
          <Text>Value:</Text>
          <NumberInput size="md">
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </HStack>
      </>
    );
  }

  return <></>;
});
