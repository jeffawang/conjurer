import { useStore } from "@/src/types/StoreContext";
import { INITIAL_PIXELS_PER_SECOND } from "@/src/utils/time";
import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRef, useEffect } from "react";

export default observer(function Waveform() {
  const initialized = useRef(false);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const waveformRef = useRef(null);

  const { timer, uiStore } = useStore();

  useEffect(() => {
    if (initialized.current) return;

    const create = async () => {
      // Cannot be run on the server, so we need to use dynamic import
      const WaveSurfer = (await import("wavesurfer.js")).default;

      // https://wavesurfer-js.org/docs/options.html
      const options = {
        container: waveformRef.current!,
        waveColor: "#eee",
        progressColor: "#0178FF",
        cursorColor: "#00000000",
        barWidth: 2,
        barRadius: 2,
        responsive: true,
        height: 32,
        normalize: true,
        partialRender: true,
        hideScrollbar: true,
        interact: false,
        minPxPerSec: INITIAL_PIXELS_PER_SECOND,
      };
      wavesurferRef.current = WaveSurfer.create(options);
      wavesurferRef.current.zoom(INITIAL_PIXELS_PER_SECOND);

      wavesurferRef.current.load("/cloudkicker-explorebecurious.mp3");
    };

    create();
    initialized.current = true;

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
    wavesurferRef.current?.zoom(uiStore.pixelsPerSecond);
  }, [uiStore.pixelsPerSecond]);

  useEffect(() => {
    if (wavesurferRef.current) {
      const duration = wavesurferRef.current.getDuration();
      const progress = duration > 0 ? timer.globalTime / wavesurferRef.current.getDuration() : 0;
      wavesurferRef.current.seekTo(progress);
    }
  }, [timer.globalTime]);

  return (
    <Box position="absolute" top={1.5} width="100%">
      <div id="waveform" ref={waveformRef} />
    </Box>
  );
});
