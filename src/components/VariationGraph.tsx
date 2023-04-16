import { PatternParam } from "@/src/types/PatternParams";
import { Divider, HStack, Text } from "@chakra-ui/react";
import { memo, useMemo } from "react";
import { LineChart, Line, CartesianGrid, Tooltip, YAxis } from "recharts";
import { BsCaretDown, BsCaretUp } from "react-icons/bs";
import Variation from "@/src/types/Variations/Variation";
import FlatVariation from "@/src/types/Variations/FlatVariation";
import LinearVariation from "@/src/types/Variations/LinearVariation";

type VariationGraphProps = {
  variation: Variation;
  width: number;
  domain: [number, number];
  blockDuration: number;
};

export default memo(function VariationGraph({
  variation,
  width,
  domain,
  blockDuration,
}: VariationGraphProps) {
  const data = useMemo(() => {
    if (variation instanceof FlatVariation) {
      return [
        {
          value: variation.value,
        },
        {
          value: variation.value,
        },
      ];
    } else if (variation instanceof LinearVariation) {
      return [
        {
          value: variation.from,
        },
        {
          value: variation.to,
        },
      ];
    }
    const sampleRate = 50;
    const data = [];
    for (let i = 0; i < sampleRate; i++) {
      data.push({
        value: variation.valueAtTime((blockDuration * i) / (sampleRate - 1)),
      });
    }
    return data;
  }, [variation, blockDuration]);

  return (
    <>
      <LineChart
        width={width}
        height={30}
        data={data}
        margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <Line
          isAnimationActive={false}
          type="monotone"
          dataKey="value"
          stroke="#ff7300"
          yAxisId={0}
        />
        <Tooltip content={<CustomTooltip />} />
        <YAxis type="number" domain={domain} hide allowDataOverflow={false} />
      </LineChart>
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

  return <Text fontSize={12}>{`${payload[0].value}`}</Text>;
};
