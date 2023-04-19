import { Grid, GridItem, HStack, Heading, VStack } from "@chakra-ui/react";
import TimerReadout from "@/src/components/TimerReadout";
import TimerControls from "@/src/components/TimerControls";
import Controls from "@/src/components/Controls";
import Timeline from "@/src/components/Timeline";
import { memo } from "react";

export default memo(function Arrangement() {
  return (
    <Grid
      height="100%"
      templateAreas={`"timerControls  controls"
                      "left          right"`}
      gridTemplateColumns="150px calc(100vw - 165px - 150px)" // TODO: do better
      gridTemplateRows="auto 1fr"
      fontWeight="bold"
    >
      <GridItem area="timerControls">
        <HStack my={2} width="100%" justify="center">
          <TimerControls />
        </HStack>
      </GridItem>
      <GridItem area="controls">
        <HStack my={2} width="100%">
          <Controls />
        </HStack>
      </GridItem>
      <GridItem area="left">
        <VStack height={10} bgColor="gray.500" justify="center">
          <TimerReadout />
        </VStack>
        <VStack height="100%" justify="center">
          <Heading userSelect="none" size="md">
            Pattern
          </Heading>
        </VStack>
      </GridItem>
      <GridItem area="right">
        <Timeline />
      </GridItem>
    </Grid>
  );
});
