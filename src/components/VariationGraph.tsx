import {
  Box,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
} from "@chakra-ui/react";
import { LineChart, Line, Tooltip, YAxis, BarChart, Bar } from "recharts";
import Variation from "@/src/types/Variations/Variation";
import Block from "@/src/types/Block";
import VariationControls from "@/src/components/VariationControls";
import LinearVariation4 from "@/src/types/Variations/LinearVariation4";
import { Vector4 } from "three";
import { vector4ToColor } from "@/src/utils/color";

type VariationGraphProps = {
  uniformName: string;
  variation: Variation;
  width: number;
  domain: [number, number];
  block: Block;
};

export default (function VariationGraph({
  uniformName,
  variation,
  width,
  domain,
  block,
}: VariationGraphProps) {
  if (variation instanceof LinearVariation4)
    return (
      <LinearVariationGraph4
        uniformName={uniformName}
        variation={variation}
        width={width}
        domain={domain}
        block={block}
      />
    );

  const data = variation.computeSampledData(variation.duration);

  return (
    <>
      <Popover placement="bottom" isLazy openDelay={0} closeDelay={0}>
        <PopoverTrigger>
          <Box
            py={1}
            bgColor="gray.600"
            onClick={(e: any) => e.stopPropagation()}
            _hover={{ bgColor: "gray.500" }}
          >
            <LineChart
              width={width}
              height={50}
              data={data}
              margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
            >
              <Line
                dot={false}
                isAnimationActive={false}
                type="monotone"
                dataKey="value"
                stroke="#ff7300"
                yAxisId={0}
              />
              <Tooltip content={<CustomTooltip />} />
              <YAxis
                type="number"
                domain={domain}
                hide
                allowDataOverflow={false}
              />
            </LineChart>
          </Box>
        </PopoverTrigger>
        <Portal>
          <PopoverContent>
            <VariationControls
              variation={variation}
              uniformName={uniformName}
              block={block}
            />
          </PopoverContent>
        </Portal>
      </Popover>
    </>
  );
});

type LinearVariationGraph4Props = {
  uniformName: string;
  variation: LinearVariation4;
  width: number;
  domain: [number, number];
  block: Block;
};

function LinearVariationGraph4({
  uniformName,
  variation,
  width,
  block,
}: LinearVariationGraph4Props) {
  const fromColor = vector4ToColor(variation.from);
  const toColor = vector4ToColor(variation.to);

  return (
    <>
      <Popover placement="bottom" isLazy openDelay={0} closeDelay={0}>
        <PopoverTrigger>
          <Box
            py={1}
            onClick={(e: any) => e.stopPropagation()}
            _hover={{ bgColor: "gray.500" }}
          >
            <svg width={width} height={50}>
              <defs>
                <linearGradient
                  id={`gradient${variation.id}`}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop offset="0%" stopColor={fromColor}></stop>
                  <stop offset="100%" stopColor={toColor}></stop>
                </linearGradient>
              </defs>
              <rect
                width="100%"
                height="100%"
                x="0"
                y="0"
                fill={`url(#gradient${variation.id})`}
              />
            </svg>
          </Box>
        </PopoverTrigger>
        <Portal>
          <PopoverContent>
            <VariationControls
              variation={variation}
              uniformName={uniformName}
              block={block}
            />
          </PopoverContent>
        </Portal>
      </Popover>
    </>
  );
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any;
}) => {
  if (!(active && payload && payload.length)) {
    return null;
  }
  let value = payload[0].value;
  if (typeof payload[0].value === "number") {
    value = payload[0].value.toFixed(2);
  }

  return <Text fontSize={12}>{`${value}`}</Text>;
};
