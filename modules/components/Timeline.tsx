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
import { useEffect, useState } from "react";
import TimelineBlock from "@/modules/components/TimelineBlock";
import {
  FRAMES_PER_SECOND,
  MAX_TIME,
  timeToX,
  xToTime,
} from "@/modules/common/utils/time";
import Ruler from "@/modules/components/Ruler";
import { useStore } from "@/modules/common/types/StoreContext";
import { action } from "mobx";

export default observer(function Timeline() {
  const store = useStore();
  const { globalTime, blocks } = store;
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const interval = setInterval(
      action(() => {
        if (playing) {
          if (globalTime >= MAX_TIME) {
            setPlaying(false);
          } else {
            store.tick();
          }
        }
      }),
      1000 / FRAMES_PER_SECOND,
    );
    return () => clearInterval(interval);
  }, [playing]);

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
              store.globalTime = 0;
            })}
          />
          <IconButton
            aria-label="Play"
            color={playing ? "orange" : "green"}
            height={6}
            icon={playing ? <FaPause size={10} /> : <FaPlay size={10} />}
            onClick={() => setPlaying(!playing)}
          />
          <IconButton
            aria-label="Forward"
            height={6}
            icon={<FaStepForward size={10} />}
            onClick={action(() => {
              store.globalTime = MAX_TIME;
              setPlaying(false);
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
            store.globalTime = xToTime(
              e.clientX - (e.target as HTMLElement).getBoundingClientRect().x,
            );
          })}
        >
          <Ruler />
          <Box position="absolute" top={0} left={timeToX(globalTime)}>
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
        <Box
          position="relative"
          borderBottom="solid"
          borderColor="white"
          height={200}
          bgColor="gray.400"
        >
          <Box
            position="absolute"
            top={0}
            left={timeToX(globalTime)}
            bgColor="red"
            width="1px"
            height="100%"
            zIndex={1}
          />
          {blocks.map((block, index) => (
            <TimelineBlock key={index} block={block} />
          ))}
        </Box>
      </GridItem>
    </Grid>
  );
});
