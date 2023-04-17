import {
  Box,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
} from "@chakra-ui/react";
import { LineChart, Line, Tooltip, YAxis } from "recharts";
import Variation from "@/src/types/Variations/Variation";
import Block from "@/src/types/Block";
import VariationControls from "@/src/components/VariationControls";

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
              height={30}
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
