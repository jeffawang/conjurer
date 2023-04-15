import Block from "@/src/types/Block";
import { PatternParams, StandardParams } from "@/src/types/PatternParams";
import { useStore } from "@/src/types/StoreContext";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useCallback, useRef, useState } from "react";
import { DraggableData } from "react-draggable";
import { DraggableEvent } from "react-draggable";
import { LineChart, Line } from "recharts";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

type ParametersListProps = {
  block: Block<PatternParams>;
  width: number;
};

export default observer(function ParametersList({
  block,
  width,
}: ParametersListProps) {
  // const store = useStore();

  return (
    <LineChart
      width={width}
      height={50}
      data={data}
      // margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
    >
      <Line
        isAnimationActive={false}
        type="monotone"
        dataKey="uv"
        stroke="#ff7300"
        yAxisId={0}
      />
      <Line
        isAnimationActive={false}
        type="monotone"
        dataKey="pv"
        stroke="#387908"
        yAxisId={1}
      />
    </LineChart>
  );
});
