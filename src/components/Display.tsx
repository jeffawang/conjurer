import { Box, Heading, VStack } from "@chakra-ui/react";
import { DisplayCanvas } from "@/src/components/DisplayCanvas";
import { DisplayControls } from "@/src/components/DisplayControls";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/types/StoreContext";

export const Display = observer(function Display() {
  const { uiStore } = useStore();

  return (
    <Box
      resize={uiStore.horizontalLayout ? "vertical" : undefined}
      overflow="auto"
      position="relative"
      height={uiStore.horizontalLayout ? "40vh" : "100vh"}
    >
      <VStack position="absolute" width="100%" marginY="2" zIndex={1}>
        <Heading>Conjurer</Heading>
      </VStack>
      <DisplayControls />
      <Box height="100%" bgColor="gray.900">
        <DisplayCanvas />
      </Box>
    </Box>
  );
});
