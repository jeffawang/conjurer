import { Canvas } from "@react-three/fiber";
import Canopy from "@/src/components/Canopy";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { PerspectiveCamera as PerspectiveCameraThree, Vector3 } from "three";
import { memo, useRef } from "react";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

export default memo(function CanopyCanvas() {
  const cameraRef = useRef<PerspectiveCameraThree>();
  return (
    <Canvas>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={new Vector3(0, 0, 20)}
      />
      <OrbitControls camera={cameraRef.current} />

      <Canopy />
      <EffectComposer>
        {/* EffectComposer upon initializing causes the warning: WebGL context was lost. */}
        <Bloom
          // TODO: play with these values more
          intensity={0.1}
          luminanceThreshold={0.01}
        />
      </EffectComposer>
    </Canvas>
  );
});
