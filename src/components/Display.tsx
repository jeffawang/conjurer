import { Box, Heading, VStack } from "@chakra-ui/react";
import CanopyCanvas from "@/src/components/CanopyCanvas";
import DisplayControls from "@/src/components/DisplayControls";
import { memo } from "react";

export default memo(function Display() {
  return (
    <Box position="relative" height="100%">
      <VStack position="absolute" width="100%" marginY="2" zIndex={1}>
        <Heading>Conjurer</Heading>
      </VStack>
      <DisplayControls />
      <Box
        height="100%"
        borderStyle="solid"
        borderColor="black"
        borderBottomWidth={1}
      >
        <CanopyCanvas />
      </Box>
    </Box>
  );
});
