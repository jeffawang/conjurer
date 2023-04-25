import Block from "@/src/types/Block";
import { ExtraParams } from "@/src/types/PatternParams";
import ParameterView from "@/src/components/ParameterView";
import { VStack } from "@chakra-ui/react";
import { memo } from "react";

const uniformNamesToExclude = ["u_time", "u_global_time", "u_texture"];

type ParametersListProps = {
  block: Block<ExtraParams>;
};

export default memo(function ParametersList({ block }: ParametersListProps) {
  return (
    <VStack spacing={0} width="100%">
      {Object.entries(block.pattern.params).map(([uniformName, patternParam]) =>
        uniformNamesToExclude.includes(uniformName) ? null : (
          <ParameterView
            key={uniformName}
            uniformName={uniformName}
            patternParam={patternParam}
            block={block}
          />
        )
      )}
    </VStack>
  );
});
