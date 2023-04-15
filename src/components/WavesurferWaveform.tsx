import { useStore } from "@/src/types/StoreContext";
import { INITIAL_PIXELS_PER_SECOND } from "@/src/utils/time";
import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRef, useEffect } from "react";
import type WaveSurfer from "wavesurfer.js";

export default observer(function WaveSurferWaveform() {
  const initialized = useRef(false);
  const ready = useRef(false);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const waveformRef = useRef(null);

  const { timer, uiStore } = useStore();

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const create = async () => {
      // Cannot be run on the server, so we need to use dynamic import
      const WaveSurfer = (await import("wavesurfer.js")).default;

      // https://wavesurfer-js.org/docs/options.html
      const options = {
        container: waveformRef.current!,
        waveColor: "#ddd",
        progressColor: "#0178FF",
        cursorColor: "#00000000",
        barWidth: 2,
        barRadius: 2,
        responsive: true,
        height: 32,
        normalize: true,
        partialRender: true,
        hideScrollbar: true,
        fillParent: false,
        interact: false,
        minPxPerSec: INITIAL_PIXELS_PER_SECOND,
      };
      wavesurferRef.current = WaveSurfer.create(options);
      await wavesurferRef.current.load("/cloudkicker-explorebecurious.mp3");
      ready.current = true;
    };

    create();

    return () => wavesurferRef.current?.destroy();
  }, []);

  useEffect(() => {
    if (timer.playing) {
      wavesurferRef.current?.play();
    } else {
      wavesurferRef.current?.pause();
    }
  }, [timer.playing]);

  useEffect(() => {
    if (ready.current && wavesurferRef.current)
      wavesurferRef.current.zoom(uiStore.pixelsPerSecond);
  }, [uiStore.pixelsPerSecond]);

  useEffect(() => {
    if (ready.current && wavesurferRef.current) {
      const duration = wavesurferRef.current.getDuration();
      const progress = duration > 0 ? timer.lastCursor.position / duration : 0;
      wavesurferRef.current.seekTo(progress);
    }
  }, [timer.lastCursor]);

  return (
    <Box position="absolute" top={1.5}>
      <div id="waveform" ref={waveformRef} />
    </Box>
  );
});
