import Block from "@/src/types/Block";
import { PatternParams } from "@/src/types/PatternParams";
import { Divider, HStack, Text } from "@chakra-ui/react";
import { memo, useCallback, useState } from "react";
import { LineChart, Line } from "recharts";
import { BsCaretDown, BsCaretUp } from "react-icons/bs";

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

const uniformNamesToExclude = ["u_resolution"];

type ParametersListProps = {
  block: Block<PatternParams>;
  width: number;
};

export default memo(function ParametersList({
  block,
  width,
}: ParametersListProps) {
  // const store = useStore();
  const [selectedUniformName, setSelectedUniformName] = useState<string | null>(
    null
  );

  const handleClick = useCallback(
    (e: any, uniformName: string) => {
      setSelectedUniformName(
        uniformName === selectedUniformName ? null : uniformName
      );
      e.stopPropagation();
    },
    [selectedUniformName, setSelectedUniformName]
  );

  return (
    <>
      {Object.entries(block.pattern.params).map(
        ([uniformName, patternParam]) => {
          if (uniformNamesToExclude.includes(uniformName)) return null;

          const isSelected = uniformName === selectedUniformName;

          return (
            <>
              <Divider key={uniformName} />
              <HStack
                key={uniformName + "name"}
                width="100%"
                onClick={(e) => handleClick(e, uniformName)}
                justify="center"
              >
                <Text lineHeight={1} userSelect={"none"} fontSize={10}>
                  {patternParam.name}
                </Text>
                {isSelected ? (
                  <BsCaretUp size={10} />
                ) : (
                  <BsCaretDown size={10} />
                )}
              </HStack>

              {isSelected && (
                <LineChart
                  key={uniformName + "chart"}
                  width={width}
                  height={30}
                  data={data}
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
              )}
            </>
          );
        }
      )}
    </>
  );
});
