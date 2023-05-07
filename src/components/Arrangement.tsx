import { Grid, GridItem } from "@chakra-ui/react";
import Controls from "@/src/components/Controls";
import Timeline from "@/src/components/Timeline";
import { memo } from "react";

export default memo(function Arrangement() {
  return (
    <Grid
      height="100%"
      templateAreas={`"controls"
                      "right"`}
      gridTemplateColumns="100%"
      gridTemplateRows="auto 1fr"
      fontWeight="bold"
    >
      <GridItem area="controls">
        <Controls />
      </GridItem>
      <GridItem area="right" bgColor="gray.400">
        <Timeline />
      </GridItem>
    </Grid>
  );
});
