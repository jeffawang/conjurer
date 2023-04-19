import Arrangement from "@/src/components/Arrangement";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import Display from "@/src/components/Display";
import PatternList from "@/src/components/PatternList";

export default function Editor() {
  return (
    <Box w="100vw" h="100vh">
      <Grid
        templateAreas={`"patterns display"
                        "patterns arrangement"`}
        gridTemplateColumns="165px calc(100vw - 165px)"
        gridTemplateRows="50vh 50vh"
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
        <GridItem area="arrangement">
          <Arrangement />
        </GridItem>
      </Grid>
    </Box>
  );
}
