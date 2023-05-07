import { Box, Heading, VStack } from "@chakra-ui/react";
import DisplayCanvas from "@/src/components/DisplayCanvas";
import DisplayControls from "@/src/components/DisplayControls";
import { memo } from "react";

export default memo(function Display() {
  return (
    <Box resize="vertical" overflow="auto" position="relative" height="50vh">
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
