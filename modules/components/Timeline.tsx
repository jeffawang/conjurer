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
import GradientPattern from "@/modules/patterns/GradientPattern";
import { Block } from "@/modules/common/types/Block";
import TestPattern from "@/modules/patterns/TestPattern";
import { timeToX } from "@/modules/common/utils/time";

const MAX_TIME = 90;
const FRAMES_PER_SECOND = 60;

// TEMPORARY
const blocks = [new Block(GradientPattern()), new Block(TestPattern())];

blocks[0].startTime = 0;
blocks[0].duration = 8;

blocks[1].startTime = 9;
blocks[1].duration = 12;
// TEMPORARY

const Timeline = () => {
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
      templateAreas={`"controls   time"
                        "l1Left       l1Right"`}
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
      <GridItem area="time">
        <Box
          position="relative"
          height={8}
          borderY="solid"
          borderColor="white"
          bgColor="gray.500"
        >
          <Box position="absolute" top={0} left={timeToX(time)}>
            {/* TODO: https://www.bandlab.com/studio copy how they do SVG timeline tics */}
            <FaLongArrowAltDown
              style={{ position: "absolute", left: "-12px" }}
              size={25}
              color="red"
            />
          </Box>
        </Box>
      </GridItem>
      <GridItem area="l1Left">
        <VStack height="100%" justify="center">
          <Heading size="md">Layer 1</Heading>
        </VStack>
      </GridItem>
      <GridItem area="l1Right">
        <Box
          position="relative"
          borderBottom="solid"
          borderColor="white"
          height={200}
          bgColor="gray.400"
        >
          {blocks.map((block, index) => (
            <TimelineBlock key={index} block={block} />
          ))}
        </Box>
      </GridItem>
    </Grid>
  );
};
export default Timeline;
