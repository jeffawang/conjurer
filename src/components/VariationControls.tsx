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
  VStack,
} from "@chakra-ui/react";
import { memo, useMemo, useState } from "react";
import { LineChart, Line, Tooltip, YAxis } from "recharts";
import Variation from "@/src/types/Variations/Variation";
import { action } from "mobx";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import Block from "@/src/types/Block";
import FlatVariation from "@/src/types/Variations/FlatVariation";
import LinearVariation from "@/src/types/Variations/LinearVariation";

type VariationControlsProps = {
  uniformName: string;
  variation: Variation;
  // width: number;
  // domain: [number, number];
  block: Block;
};

export default (function VariationControls(props: VariationControlsProps) {
  const { uniformName, variation, block } = props;

  let controls = <></>;
  if (variation instanceof FlatVariation) {
    controls = (
      <FlatVariationControls
        uniformName={uniformName}
        block={block}
        variation={variation}
      />
    );
  } else if (variation instanceof LinearVariation) {
    controls = (
      <LinearVariationControls
        uniformName={uniformName}
        block={block}
        variation={variation}
      />
    );
  }

  return (
    <VStack m={1}>
      {controls}
      <IconButton
        aria-label="Delete"
        variant="ghost"
        size="xs"
        color="gray.400"
        icon={<FaTrashAlt size={12} />}
        onClick={action(() => block.removeVariation(uniformName, variation))}
      />
    </VStack>
  );
});

type FlatVariationControlsProps = {
  uniformName: string;
  variation: FlatVariation;
  block: Block;
};

function FlatVariationControls({
  uniformName,
  variation,
  block,
}: FlatVariationControlsProps) {
  const [value, setValue] = useState(variation.value.toString());

  return (
    <>
      <HStack m={1}>
        <Text>Value:</Text>
        <NumberInput
          size="md"
          onChange={(valueString) => {
            variation.value = parseFloat(valueString);
            setValue(valueString);
            block.triggerVariationReactions(uniformName);
          }}
          value={value}
        >
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

type LinearVariationControlsProps = {
  uniformName: string;
  variation: LinearVariation;
  block: Block;
};

function LinearVariationControls({
  uniformName,
  variation,
  block,
}: LinearVariationControlsProps) {
  const [from, setFrom] = useState(variation.from.toString());
  const [to, setTo] = useState(variation.to.toString());

  return (
    <>
      <HStack m={1}>
        <Text>From:</Text>
        <NumberInput
          size="md"
          onChange={(valueString) => {
            variation.from = parseFloat(valueString);
            setFrom(valueString);
            block.triggerVariationReactions(uniformName);
          }}
          value={from}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </HStack>
      <HStack m={1}>
        <Text>To:</Text>
        <NumberInput
          size="md"
          onChange={(valueString) => {
            variation.to = parseFloat(valueString);
            setTo(valueString);
            block.triggerVariationReactions(uniformName);
          }}
          value={to}
        >
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
