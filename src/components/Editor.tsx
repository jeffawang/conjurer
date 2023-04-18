import Arrangement from "@/src/components/Arrangement";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import Display from "@/src/components/Display";
import PatternList from "@/src/components/PatternList";

export default function Editor() {
  return (
    <Box w="100vw" h="100vh">
      <Grid
        templateAreas={`"patterns display"
                        "patterns timeline"
                        "patterns instructions"`}
        gridTemplateColumns="165px calc(100vw - 165px)"
        gridTemplateRows="auto auto 1fr"
        height="100vh"
        fontWeight="bold"
      >
        <GridItem area="header"></GridItem>
        <GridItem px="2" area="patterns" bgColor="gray.600">
          <PatternList />
        </GridItem>
        <GridItem area="display">
          <Display />
        </GridItem>
        <GridItem area="timeline">
          <Arrangement />
        </GridItem>
        <GridItem area="instructions"></GridItem>
      </Grid>
    </Box>
  );
}
