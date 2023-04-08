import { observer } from "mobx-react-lite";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from "react-icons/fa";
import { MAX_TIME, xToTime } from "@/modules/common/utils/time";
import Ruler from "@/modules/components/Ruler";
import { useStore } from "@/modules/common/types/StoreContext";
import { action } from "mobx";
import Layer from "@/modules/components/Layer";
import TimeMarker from "@/modules/components/TimeMarker";
import TimerReadout from "@/modules/components/TimerReadout";

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
        <HStack height="100%">
          <IconButton
            aria-label="Backward"
            height={6}
            icon={<FaStepBackward size={10} />}
            onClick={action(() => {
              timer.globalTime = 0;
            })}
          />
          <IconButton
            aria-label="Play"
            color={timer.playing ? "orange" : "green"}
            height={6}
            icon={timer.playing ? <FaPause size={10} /> : <FaPlay size={10} />}
            onClick={action(timer.togglePlaying)}
          />
          <IconButton
            aria-label="Forward"
            height={6}
            icon={<FaStepForward size={10} />}
            onClick={action(() => {
              timer.globalTime = MAX_TIME;
              timer.playing = false;
            })}
          />
        </HStack>
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
          <Heading size="md">Layer 1</Heading>
        </VStack>
      </GridItem>
      <GridItem area="layers">
        <Layer />
      </GridItem>
    </Grid>
  );
});
