import { useStore } from "@/src/types/StoreContext";
import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRef, useEffect } from "react";
import { clamp } from "three/src/math/MathUtils";
import { useDebouncedCallback } from "use-debounce";
import type WaveSurfer from "wavesurfer.js";
import type { WaveSurferOptions } from "wavesurfer.js";
import type TimelinePlugin from "wavesurfer.js/dist/plugins/timeline";
import type { TimelinePluginOptions } from "wavesurfer.js/dist/plugins/timeline";
import type RegionsPlugin from "wavesurfer.js/dist/plugins/regions";
import type { GenericPlugin } from "wavesurfer.js/dist/base-plugin";
import {
  AUDIO_BUCKET_NAME,
  AUDIO_BUCKET_PREFIX,
  AUDIO_BUCKET_REGION,
} from "@/src/utils/audio";

// https://wavesurfer-js.org/docs/options.html
const DEFAULT_WAVESURFER_OPTIONS: Partial<WaveSurferOptions> = {
  waveColor: "#ddd",
  progressColor: "#0178FF",
  cursorColor: "#00000000",
  height: 40,
  hideScrollbar: true,
  fillParent: false,
  interact: false,
  autoScroll: false,
  autoCenter: false,
};

const DEFAULT_TIMELINE_OPTIONS: TimelinePluginOptions = {
  height: 40,
  insertPosition: "beforebegin" as const,
  timeInterval: 0.25,
  primaryLabelInterval: 5,
  secondaryLabelInterval: 0,
  style: {
    fontSize: "14px",
    color: "#000000",
    zIndex: 10,
  } as any,
};

export const WavesurferWaveform = observer(function WavesurferWaveform() {
  const didInitialize = useRef(false);
  const ready = useRef(false);

  const wavesurferConstructors = useRef<{
    WaveSurfer: typeof WaveSurfer | null;
    TimelinePlugin: typeof TimelinePlugin | null;
    RegionsPlugin: typeof RegionsPlugin | null;
  }>({ WaveSurfer: null, TimelinePlugin: null, RegionsPlugin: null });

  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const overlayCanvas = useRef<HTMLCanvasElement>(null);

  const { audioStore, timer, uiStore } = useStore();

  useEffect(() => {
    if (didInitialize.current) return;
    didInitialize.current = true;

    const create = async () => {
      // Can't be run on the server, so we need to use dynamic imports
      const [
        { default: WaveSurfer },
        { default: TimelinePlugin },
        { default: RegionsPlugin },
      ] = await Promise.all([
        import("wavesurfer.js"),
        import("wavesurfer.js/dist/plugins/timeline"),
        import("wavesurfer.js/dist/plugins/regions"),
      ]);
      wavesurferConstructors.current = {
        WaveSurfer,
        TimelinePlugin,
        RegionsPlugin,
      };

      const timeline = TimelinePlugin.create(DEFAULT_TIMELINE_OPTIONS);
      const regions = RegionsPlugin.create();

      // https://wavesurfer-js.org/docs/options.html
      const options: WaveSurferOptions = {
        ...DEFAULT_WAVESURFER_OPTIONS,
        container: waveformRef.current!,
        minPxPerSec: uiStore.pixelsPerSecond,
        plugins: [timeline, regions],
      };
      wavesurferRef.current = WaveSurfer.create(options);
      await wavesurferRef.current.load(
        `https://${AUDIO_BUCKET_NAME}.s3.${AUDIO_BUCKET_REGION}.amazonaws.com/${AUDIO_BUCKET_PREFIX}${audioStore.selectedAudioFile}`
      );
      wavesurferRef.current?.zoom(uiStore.pixelsPerSecond);

      regions.addRegion({
        start: 4,
        end: 17,
        content: "test region",
        color: "rgba(255,0,0,0.1)",
      });

      ready.current = true;

      cloneCanvas();
    };

    create();
  }, [audioStore.selectedAudioFile, uiStore.pixelsPerSecond]);

  useEffect(() => {
    if (!didInitialize.current || !ready.current) return;

    const changeAudioFile = async () => {
      if (
        didInitialize.current &&
        wavesurferRef.current &&
        wavesurferConstructors.current.TimelinePlugin
      ) {
        wavesurferRef.current.stop();

        const plugins = wavesurferRef.current.getActivePlugins();
        plugins.forEach((plugin: GenericPlugin) => plugin.destroy?.());
        // TODO: we destroy the plugin, but it remains in the array. Small memory leak here

        const { TimelinePlugin } = wavesurferConstructors.current;

        const timeline = TimelinePlugin.create(DEFAULT_TIMELINE_OPTIONS);
        wavesurferRef.current.registerPlugin(timeline);
        await wavesurferRef.current.load(
          `https://${AUDIO_BUCKET_NAME}.s3.${AUDIO_BUCKET_REGION}.amazonaws.com/${AUDIO_BUCKET_PREFIX}${audioStore.selectedAudioFile}`
        );
        wavesurferRef.current.seekTo(0);
        timer.lastCursorPosition = 0;
      }
    };
    changeAudioFile();
    cloneCanvas();
  }, [audioStore.selectedAudioFile, timer]);

  useEffect(() => {
    if (timer.playing) {
      wavesurferRef.current?.play();
    } else {
      wavesurferRef.current?.pause();
    }
  }, [timer.playing]);

  useEffect(() => {
    if (!wavesurferRef.current) return;
    wavesurferRef.current.setMuted(audioStore.audioMuted);
  }, [audioStore.audioMuted]);

  const zoomDebounced = useDebouncedCallback((pixelsPerSecond: number) => {
    wavesurferRef.current?.zoom(pixelsPerSecond);
    cloneCanvas();
  }, 5);

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

  useEffect(() => {
    if (uiStore.showingWaveformOverlay) cloneCanvas();
  }, [uiStore.showingWaveformOverlay]);

  const cloneCanvas = () => {
    if (!overlayCanvas.current) return;

    // This is all a bit brittle...
    const shadowRoot = document.querySelector("#waveform div")!.shadowRoot!;
    const sourceCanvas = shadowRoot.querySelector(
      "canvas"
    ) as HTMLCanvasElement;

    const destinationCanvas = overlayCanvas.current;
    destinationCanvas.width = sourceCanvas.width;
    destinationCanvas.height = sourceCanvas.height;

    const destCtx = destinationCanvas.getContext("2d")!;
    destCtx.drawImage(sourceCanvas, 0, 0);
  };

  return (
    <>
      <Box position="absolute" top={0} id="waveform" ref={waveformRef} />
      {uiStore.showingWaveformOverlay && (
        <Box position="absolute" top="80px" id="waveform2" pointerEvents="none">
          <canvas ref={overlayCanvas} className="waveformClone" />
        </Box>
      )}
    </>
  );
});
