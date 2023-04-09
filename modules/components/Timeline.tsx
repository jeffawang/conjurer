import { observer } from "mobx-react-lite";
import { Box, Grid, GridItem, Heading, VStack } from "@chakra-ui/react";
import { xToTime } from "@/modules/common/utils/time";
import Ruler from "@/modules/components/Ruler";
import { useStore } from "@/modules/common/types/StoreContext";
import { action } from "mobx";
import Layer from "@/modules/components/Layer";
import TimeMarker from "@/modules/components/TimeMarker";
import TimerReadout from "@/modules/components/TimerReadout";
import Controls from "@/modules/components/Controls";

export default observer(function Timeline() {
  const { timer } = useStore();

  return (
    <Grid
      templateAreas={`"controls       ruler"
                      "layersHeader   layers"`}
      gridTemplateColumns="150px 1fr"
      fontWeight="bold"
    >
      <GridItem area="controls">
        <Controls />
      </GridItem>
      <GridItem area="ruler">
        <Box
          position="relative"
          height={9}
          bgColor="gray.500"
          onClick={action((e) => {
            timer.globalTime = xToTime(
              e.clientX - (e.target as HTMLElement).getBoundingClientRect().x,
            );
          })}
        >
          <TimerReadout />
          <Ruler />
          <TimeMarker />
        </Box>
      </GridItem>
      <GridItem area="layersHeader">
        <VStack height="100%" justify="center">
          <Heading userSelect="none" size="md">
            Layer
          </Heading>
        </VStack>
      </GridItem>
      <GridItem area="layers">
        <Layer />
      </GridItem>
    </Grid>
  );
});
