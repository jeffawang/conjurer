import { Canvas } from "@react-three/fiber";
import Canopy from "@/src/components/Canopy";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { PerspectiveCamera as PerspectiveCameraThree, Vector3 } from "three";
import { useRef } from "react";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Perf } from "r3f-perf";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/types/StoreContext";
import BlockView from "@/src/components/BlockView";

export default observer(function CanopyCanvas() {
  const { uiStore } = useStore();

  const cameraRef = useRef<PerspectiveCameraThree>();
  return (
    <Canvas>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={new Vector3(0, 0, 20)}
      />
      {uiStore.showingPerformance && <Perf />}
      <OrbitControls camera={cameraRef.current} />

      {uiStore.displayingCanopy ? <Canopy /> : <BlockView />}
      <EffectComposer>
        {/* EffectComposer upon initializing causes the warning: WebGL context was lost. */}
        <Bloom
          // TODO: maybe play with these values more
          intensity={0.1}
          luminanceThreshold={0.01}
        />
      </EffectComposer>
    </Canvas>
  );
});
