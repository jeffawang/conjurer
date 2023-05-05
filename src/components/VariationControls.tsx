import {
  Box,
  Button,
  HStack,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import Variation from "@/src/types/Variations/Variation";
import { action } from "mobx";
import { FaTrashAlt } from "react-icons/fa";
import { BiDuplicate } from "react-icons/bi";
import Block from "@/src/types/Block";
import FlatVariation from "@/src/types/Variations/FlatVariation";
import LinearVariation from "@/src/types/Variations/LinearVariation";
import SineVariation from "@/src/types/Variations/SineVariation";
import LinearVariation4 from "@/src/types/Variations/LinearVariation4";
import { HexColorPicker } from "react-colorful";
import { hexToRgb, vector4ToHex } from "@/src/utils/color";
import { HexColorInput } from "react-colorful";
import SplineVariation from "@/src/types/Variations/SplineVariation";

type VariationControlsProps = {
  uniformName: string;
  variation: Variation;
  block: Block;
};

export default (function VariationControls(props: VariationControlsProps) {
  const { uniformName, variation, block } = props;

  let controls = <Text>Needs implementation!</Text>;
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
  } else if (variation instanceof SineVariation) {
    controls = (
      <SineVariationControls
        uniformName={uniformName}
        block={block}
        variation={variation}
      />
    );
    // } else if (variation instanceof SplineVariation) {
    //   controls = (
    //     <SplineVariationControls
    //       uniformName={uniformName}
    //       block={block}
    //       variation={variation}
    //     />
    //   );
  } else if (variation instanceof LinearVariation4) {
    controls = (
      <LinearVariation4Controls
        uniformName={uniformName}
        block={block}
        variation={variation}
      />
    );
  }

  return (
    <VStack m={1}>
      {controls}
      <HStack>
        <Button
          aria-label="Duplicate"
          variant="ghost"
          size="xs"
          color="gray.400"
          leftIcon={<BiDuplicate size={17} />}
          onClick={action(() =>
            block.duplicateVariation(uniformName, variation)
          )}
        >
          Duplicate
        </Button>
        <Button
          aria-label="Delete"
          variant="ghost"
          size="xs"
          color="gray.400"
          leftIcon={<FaTrashAlt size={15} />}
          onClick={action(() => block.removeVariation(uniformName, variation))}
        >
          Delete
        </Button>
      </HStack>
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
      <Text>Flat</Text>
      <HStack m={1}>
        <Text>Value:</Text>
        <NumberInput
          size="md"
          step={0.1}
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

type LinearVariation4ControlsProps = {
  uniformName: string;
  variation: LinearVariation4;
  block: Block;
};

function LinearVariation4Controls({
  uniformName,
  variation,
  block,
}: LinearVariation4ControlsProps) {
  const [fromColor, setFromColor] = useState(vector4ToHex(variation.from));
  const [toColor, setToColor] = useState(vector4ToHex(variation.to));

  const onFromColorChange = (newHex: string) => {
    setFromColor(newHex);
    const rgb = hexToRgb(newHex);
    variation.from.set(rgb.r / 255, rgb.g / 255, rgb.b / 255, 1);
    block.triggerVariationReactions(uniformName);
  };

  const onToColorChange = (newHex: string) => {
    setToColor(newHex);
    const rgb = hexToRgb(newHex);
    variation.to.set(rgb.r / 255, rgb.g / 255, rgb.b / 255, 1);
    block.triggerVariationReactions(uniformName);
  };

  return (
    <>
      <Text>Color Variation</Text>
      <HStack width="100%" justify="space-around">
        <HexColorInput
          className="hexColorInput"
          color={fromColor}
          onChange={onFromColorChange}
        />
        <Box width={6} height={6} bgColor={fromColor} />
        <Text>→</Text>
        <Box width={6} height={6} bgColor={toColor} />
        <HexColorInput
          className="hexColorInput"
          color={toColor}
          onChange={onToColorChange}
        />
      </HStack>
      <HStack m={1} className="colorPickerContainer">
        <HexColorPicker color={fromColor} onChange={onFromColorChange} />
        <HexColorPicker color={toColor} onChange={onToColorChange} />
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
      <Text>Linear</Text>
      <HStack m={1}>
        <Text>From:</Text>
        <NumberInput
          size="md"
          step={0.1}
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
          step={0.1}
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

type SineVariationControlsProps = {
  uniformName: string;
  variation: SineVariation;
  block: Block;
};

function SineVariationControls({
  uniformName,
  variation,
  block,
}: SineVariationControlsProps) {
  const [amplitude, setAmplitude] = useState(variation.amplitude.toString());
  const [frequency, setFrequency] = useState(variation.frequency.toString());
  const [phase, setPhase] = useState(variation.phase.toString());
  const [offset, setOffset] = useState(variation.offset.toString());

  return (
    <>
      <Text>Sine</Text>
      <HStack m={1}>
        <Text>Amplitude:</Text>
        <NumberInput
          size="md"
          step={0.1}
          onChange={(valueString) => {
            variation.amplitude = parseFloat(valueString);
            setAmplitude(valueString);
            block.triggerVariationReactions(uniformName);
          }}
          value={amplitude}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </HStack>
      <HStack m={1}>
        <Text>Frequency:</Text>
        <NumberInput
          size="md"
          step={0.1}
          onChange={(valueString) => {
            variation.frequency = parseFloat(valueString);
            setFrequency(valueString);
            block.triggerVariationReactions(uniformName);
          }}
          value={frequency}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </HStack>
      <HStack m={1}>
        <Text>Phase:</Text>
        <NumberInput
          size="md"
          step={0.1}
          onChange={(valueString) => {
            variation.phase = parseFloat(valueString);
            setPhase(valueString);
            block.triggerVariationReactions(uniformName);
          }}
          value={phase}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </HStack>
      <HStack m={1}>
        <Text>Offset:</Text>
        <NumberInput
          size="md"
          step={0.1}
          onChange={(valueString) => {
            variation.offset = parseFloat(valueString);
            setOffset(valueString);
            block.triggerVariationReactions(uniformName);
          }}
          value={offset}
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
