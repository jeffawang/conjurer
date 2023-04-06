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
import { useContext, useEffect, useState } from "react";
import TimelineBlock from "@/modules/components/TimelineBlock";
import GradientPattern from "@/modules/patterns/GradientPattern";
import { Block } from "@/modules/common/types/Block";
import TestPattern from "@/modules/patterns/TestPattern";
import { timeToX, xToTime } from "@/modules/common/utils/time";
import Ruler from "@/modules/components/Ruler";
import { Vector2 } from "three";
import StoreContext from "@/modules/common/types/StoreContext";

const MAX_TIME = 90;
const FRAMES_PER_SECOND = 60;

// TEMPORARY
const blocks = [
  new Block(
    GradientPattern({
      u_blah: {
        name: "Blah",
        value: 0,
      },
      u_a: {
        name: "A",
        value: new Vector2(),
      },
    }),
  ),
  new Block(TestPattern()),
];

blocks[0].startTime = 0;
blocks[0].duration = 8;

blocks[1].startTime = 9;
blocks[1].duration = 12;
// TEMPORARY

export default observer(function Timeline() {
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playing) {
        if (time >= MAX_TIME) setPlaying(false);
        else setTime((t) => t + 1 / FRAMES_PER_SECOND);
      }
    }, 1000 / FRAMES_PER_SECOND);
    return () => clearInterval(interval);
  });

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
            onClick={() => setTime(0)}
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
            onClick={() => {
              setTime(MAX_TIME);
              setPlaying(false);
            }}
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
          onClick={(e) =>
            setTime(
              xToTime(
                e.clientX - (e.target as HTMLElement).getBoundingClientRect().x,
              ),
            )
          }
        >
          <Ruler />
          <Box position="absolute" top={0} left={timeToX(time)}>
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
            left={timeToX(time)}
            bgColor="red"
            width="1px"
            height="100%"
            zIndex={1}
          ></Box>
          {blocks.map((block, index) => (
            <TimelineBlock key={index} block={block} />
          ))}
        </Box>
      </GridItem>
    </Grid>
  );
});
