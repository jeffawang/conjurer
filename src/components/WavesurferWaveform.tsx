import { useStore } from "@/src/types/StoreContext";
import { INITIAL_PIXELS_PER_SECOND } from "@/src/utils/time";
import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRef, useEffect } from "react";
import { clamp } from "three/src/math/MathUtils";
import { useDebouncedCallback } from "use-debounce";
import type WaveSurfer from "wavesurfer.js";
import {
  AUDIO_BUCKET_NAME,
  AUDIO_BUCKET_PREFIX,
  AUDIO_BUCKET_REGION,
} from "@/src/utils/audio";

export default observer(function WaveSurferWaveform() {
  const didInitialize = useRef(false);
  const ready = useRef(false);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const waveformRef = useRef(null);

  const { audioStore, timer, uiStore } = useStore();

  useEffect(() => {
    if (didInitialize.current) return;
    didInitialize.current = true;

    const create = async () => {
      // Can't be run on the server, so we need to use dynamic imports
      const [{ default: WaveSurfer }, { default: TimelinePlugin }] =
        await Promise.all([
          import("wavesurfer.js"),
          import("wavesurfer.js/dist/plugins/timeline"),
        ]);

      const timeline = TimelinePlugin.create({
        height: 40,
        insertPosition: "beforebegin",
        timeInterval: 0.25,
        primaryLabelInterval: 5,
        secondaryLabelInterval: 0,
        style: {
          fontSize: "12px",
          color: "#000000",
          zIndex: 10,
        } as any,
      });

      // https://wavesurfer-js.org/docs/options.html
      const options = {
        container: waveformRef.current!,
        waveColor: "#ddd",
        progressColor: "#0178FF",
        cursorColor: "#00000000",
        responsive: true,
        height: 40,
        normalize: true,
        partialRender: true,
        hideScrollbar: true,
        fillParent: false,
        interact: false,
        minPxPerSec: uiStore.pixelsPerSecond,
        plugins: [timeline],
      };
      wavesurferRef.current = WaveSurfer.create(options);
      await wavesurferRef.current.load(
        `https://${AUDIO_BUCKET_NAME}.s3.${AUDIO_BUCKET_REGION}.amazonaws.com/${AUDIO_BUCKET_PREFIX}${audioStore.selectedAudioFile}`
      );
      wavesurferRef.current?.zoom(uiStore.pixelsPerSecond);
      ready.current = true;
    };

    create();
  }, [audioStore.selectedAudioFile, uiStore.pixelsPerSecond]);

  useEffect(() => {
    if (!didInitialize.current || !ready.current) return;

    const changeAudioFile = async () => {
      if (didInitialize.current) {
        await wavesurferRef.current?.load(
          `https://${AUDIO_BUCKET_NAME}.s3.${AUDIO_BUCKET_REGION}.amazonaws.com/${AUDIO_BUCKET_PREFIX}${audioStore.selectedAudioFile}`
        );
        wavesurferRef.current?.seekTo(0);
      }
    };
    changeAudioFile();
  }, [audioStore.selectedAudioFile]);

  useEffect(() => {
    if (timer.playing) {
      wavesurferRef.current?.play();
    } else {
      wavesurferRef.current?.pause();
    }
  }, [timer.playing]);

  const zoomDebounced = useDebouncedCallback(
    (pixelsPerSecond: number) => wavesurferRef.current?.zoom(pixelsPerSecond),
    5
  );

  useEffect(() => {
    if (ready.current && wavesurferRef.current)
      zoomDebounced(uiStore.pixelsPerSecond);
  }, [zoomDebounced, uiStore.pixelsPerSecond]);

  useEffect(() => {
    if (ready.current && wavesurferRef.current) {
      const duration = wavesurferRef.current.getDuration();
      const progress = duration > 0 ? timer.lastCursor.position / duration : 0;
      wavesurferRef.current.seekTo(clamp(progress, 0, 1));
    }
  }, [timer.lastCursor]);

  return <Box position="absolute" top={0} id="waveform" ref={waveformRef} />;
});
