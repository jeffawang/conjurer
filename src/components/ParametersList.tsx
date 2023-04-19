import Block from "@/src/types/Block";
import { ExtraParams } from "@/src/types/PatternParams";
import Parameter from "@/src/components/Parameter";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/types/StoreContext";
import { VStack } from "@chakra-ui/react";

const uniformNamesToExclude = ["u_resolution", "u_time", "u_global_time"];

type ParametersListProps = {
  block: Block<ExtraParams>;
};

export default observer(function ParametersList({
  block,
}: ParametersListProps) {
  const { uiStore } = useStore();
  const width = uiStore.timeToX(block.duration);

  return (
    <VStack spacing={0} width="100%">
      {Object.entries(block.pattern.params).map(([uniformName, patternParam]) =>
        uniformNamesToExclude.includes(uniformName) ? null : (
          <Parameter
            key={uniformName}
            uniformName={uniformName}
            patternParam={patternParam}
            block={block}
            variations={block.parameterVariations[uniformName] ?? []}
            width={width}
          />
        )
      )}
    </VStack>
  );
});
