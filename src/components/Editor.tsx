import Timeline from "@/src/components/Timeline";
import { Box, Grid, GridItem, Heading, VStack } from "@chakra-ui/react";
import Display from "@/src/components/Display";
import PatternList from "@/src/components/PatternList";
import Keyboard from "@/src/components/Keyboard";

export default function Editor() {
  return (
    <Box w="100vw" h="100vh">
      <Grid
        templateAreas={`"patterns header"
                        "patterns display"
                        "patterns timeline"
                        "patterns instructions"`}
        gridTemplateColumns="165px 1fr"
        gridTemplateRows="auto auto auto 1fr"
        gap={2}
        height="100vh"
        fontWeight="bold"
      >
        <GridItem marginY="2" area="header">
          <VStack justifyContent="center">
            <Heading>Conjurer</Heading>
          </VStack>
        </GridItem>
        <GridItem px="2" area="patterns" bgColor="gray.600">
          <PatternList />
        </GridItem>
        <GridItem pl="2" area="display">
          <Display />
        </GridItem>
        <GridItem pl="2" area="timeline">
          <Timeline />
        </GridItem>
        <GridItem pl="2" area="instructions">
          <Keyboard />
        </GridItem>
      </Grid>
    </Box>
  );
}