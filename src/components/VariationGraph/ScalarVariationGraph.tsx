import { Box, Text } from "@chakra-ui/react";
import { LineChart, Line, Tooltip, YAxis } from "recharts";
import Variation from "@/src/types/Variations/Variation";
import Block from "@/src/types/Block";
import { memo } from "react";

type ScalarVariationGraphProps = {
  uniformName: string;
  variation: Variation;
  width: number;
  domain: [number, number];
  block: Block;
};

export default memo(function ScalarVariationGraph({
  uniformName,
  variation,
  width,
  domain,
  block,
}: ScalarVariationGraphProps) {
  const data = variation.computeSampledData(variation.duration);
  return (
    <Box py={1} bgColor="gray.600" _hover={{ bgColor: "gray.500" }}>
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
        <Tooltip content={<ScalarValueTooltip />} />
        <YAxis type="number" domain={domain} hide allowDataOverflow={false} />
      </LineChart>
    </Box>
  );
});

const ScalarValueTooltip = ({
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
