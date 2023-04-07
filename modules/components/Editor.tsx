import Timeline from "@/modules/components/Timeline";
import { Box, Grid, GridItem, Heading, VStack } from "@chakra-ui/react";
import Display from "@/modules/components/Display";
import PatternList from "@/modules/components/PatternList";

export default function Editor() {
  return (
    <Box w="100vw" h="100vh">
      <Grid
        templateAreas={`".        header"
                        "patterns display"
                        "patterns timeline"`}
        gridTemplateColumns="150px 1fr"
        gap="1"
        fontWeight="bold"
      >
        <GridItem marginY="2" area="header">
          <VStack justifyContent="center">
            <Heading>Conjurer</Heading>
          </VStack>
        </GridItem>
        <GridItem pl="2" area="patterns">
          <PatternList />
        </GridItem>
        <GridItem pl="2" area="display">
          <Display />
        </GridItem>
        <GridItem pl="2" area="timeline">
          <Timeline />
        </GridItem>
      </Grid>
    </Box>
  );
}
