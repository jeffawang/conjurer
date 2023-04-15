import { observer } from "mobx-react-lite";
import { Box, Grid, GridItem, HStack, Heading, VStack } from "@chakra-ui/react";
import Ruler from "@/src/components/Ruler";
import { useStore } from "@/src/types/StoreContext";
import { action } from "mobx";
import Layer from "@/src/components/Layer";
import TimeMarker from "@/src/components/TimeMarker";
import TimerReadout from "@/src/components/TimerReadout";
import TimerControls from "@/src/components/TimerControls";
import { useRef } from "react";
import Controls from "@/src/components/Controls";
import useWheelZooming from "@/src/hooks/wheelZooming";
import ShaderWaveform from "@/src/components/ShaderWaveform";
import WavesurferWaveform from "@/src/components/WavesurferWaveform";

export default observer(function Arrangement() {
  const { timer, uiStore } = useStore();
  const rulerBoxRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useWheelZooming(gridRef.current);

  const rulerDrag = action((e: MouseEvent) => {
    if (rulerBoxRef.current)
      timer.setTime(
        Math.max(
          0,
          uiStore.xToTime(
            e.clientX - rulerBoxRef.current.getBoundingClientRect().x
          )
        )
      );
  });

  return (
    <Grid
      ref={gridRef}
      templateAreas={`"timerControls  controls"
                      "left          right"`}
      gridTemplateColumns="150px calc(100vw - 165px - 150px)" // TODO: do better
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
            Layer
          </Heading>
        </VStack>
      </GridItem>
      <GridItem area="right">
        <Box
          ref={rulerBoxRef}
          position="relative"
          height={10}
          bgColor="gray.500"
          onMouseDown={action((e) => {
            rulerDrag(e.nativeEvent);
            window.addEventListener("mousemove", rulerDrag);
            window.addEventListener(
              "mouseup",
              () => window.removeEventListener("mousemove", rulerDrag),
              { once: true }
            );
          })}
        >
          {uiStore.usingWavesurfer ? (
            <WavesurferWaveform />
          ) : (
            <ShaderWaveform />
          )}
          <Ruler />
          <TimeMarker />
        </Box>
        <Layer />
      </GridItem>
    </Grid>
  );
});
