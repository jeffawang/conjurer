import { memo } from "react";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

export const ThreeEffects = memo(function ThreeEffects() {
  return (
    <EffectComposer>
      {/* EffectComposer upon initializing causes the warning: WebGL context was lost. */}
      <Bloom
        // TODO: play with these values more
        intensity={0.1}
        luminanceThreshold={0.01}
      />
    </EffectComposer>
  );
});
