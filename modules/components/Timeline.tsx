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
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaLongArrowAltDown,
} from "react-icons/fa";
import { MAX_TIME, timeToX, xToTime } from "@/modules/common/utils/time";
import Ruler from "@/modules/components/Ruler";
import { useStore } from "@/modules/common/types/StoreContext";
import { action } from "mobx";
import Layer from "@/modules/components/Layer";

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
          height={10}
          borderY="solid"
          borderColor="white"
          bgColor="gray.500"
          onClick={action((e) => {
            timer.globalTime = xToTime(
              e.clientX - (e.target as HTMLElement).getBoundingClientRect().x,
            );
          })}
        >
          <Ruler />
          <Box position="absolute" top={0} left={timeToX(timer.globalTime)}>
            <FaLongArrowAltDown
              style={{ position: "absolute", top: "8px", left: "-12px" }}
              size={25}
              color="red"
            />
          </Box>
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
