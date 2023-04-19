import Block from "@/src/types/Block";
import { ExtraParams } from "@/src/types/PatternParams";
import { MouseEvent, useCallback, useState } from "react";
import Parameter from "@/src/components/Parameter";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/types/StoreContext";

const uniformNamesToExclude = ["u_resolution", "u_time", "u_global_time"];

type ParametersListProps = {
  block: Block<ExtraParams>;
};

export default observer(function ParametersList({
  block,
}: ParametersListProps) {
  const { uiStore } = useStore();
  const [selectedUniformName, setSelectedUniformName] = useState<string | null>(
    null
  );

  const width = uiStore.timeToX(block.duration);

  const handleClick = useCallback(
    (e: MouseEvent, uniformName: string) => {
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
            <Parameter
              key={uniformName}
              uniformName={uniformName}
              patternParam={patternParam}
              block={block}
              variations={block.parameterVariations[uniformName] ?? []}
              width={width}
              isSelected={isSelected}
              handleClick={handleClick}
            />
          );
        }
      )}
    </>
  );
});
