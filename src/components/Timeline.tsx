import { observer } from "mobx-react-lite";
import { Box } from "@chakra-ui/react";
import Ruler from "@/src/components/Ruler";
import { useStore } from "@/src/types/StoreContext";
import { action } from "mobx";
import PlayHead from "@/src/components/PlayHead";
import { useRef } from "react";
import { useWheelZooming } from "@/src/hooks/wheelZooming";
import ShaderWaveform from "@/src/components/ShaderWaveform";
import WavesurferWaveform from "@/src/components/WavesurferWaveform";
import { MAX_TIME } from "@/src/utils/time";
import PatternBlocks from "@/src/components/PatternBlocks";

export default observer(function Timeline() {
  const store = useStore();
  const { timer, uiStore } = store;
  const rulerBoxRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useWheelZooming(timelineRef.current);

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
    <Box
      ref={timelineRef}
      height="100%"
      overflowX="scroll"
      overscrollBehavior="none"
      onClick={store.deselectAllBlocks}
    >
      <Box
        ref={rulerBoxRef}
        position="relative"
        height={10}
        width={uiStore.timeToXPixels(MAX_TIME)}
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
        {uiStore.usingWavesurfer ? <WavesurferWaveform /> : <ShaderWaveform />}
        <Ruler />
        <PlayHead />
      </Box>
      <PatternBlocks />
    </Box>
  );
});
