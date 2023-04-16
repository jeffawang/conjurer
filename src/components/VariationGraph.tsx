import { PatternParam } from "@/src/types/PatternParams";
import { Divider, HStack, Text } from "@chakra-ui/react";
import { memo, useMemo } from "react";
import { LineChart, Line, CartesianGrid, Tooltip, YAxis } from "recharts";
import { BsCaretDown, BsCaretUp } from "react-icons/bs";
import Variation from "@/src/types/Variation";
import FlatVariation from "@/src/types/FlatVariation";
import LinearVariation from "@/src/types/LinearVariation";

type VariationGraphProps = {
  variation: Variation;
  width: number;
  domain: [number, number];
};

export default memo(function VariationGraph({
  variation,
  width,
  domain,
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
    return [];
  }, [variation]);

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

  return <Text>{`${payload[0].value}`}</Text>;
};
