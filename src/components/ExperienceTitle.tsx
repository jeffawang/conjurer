import { memo } from "react";
import { Editable, EditableInput, EditablePreview } from "@chakra-ui/react";

export const ExperienceTitle = memo(function ExperienceTitle() {
  return (
    <Editable defaultValue="Untitled" onSubmit={(value) => console.log(value)}>
      <EditablePreview />
      <EditableInput />
    </Editable>
  );
});
