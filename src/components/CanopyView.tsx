import Block from "../types/Block";
import { BufferAttribute, BufferGeometry, ShaderMaterial } from "three";
import { StandardParams } from "../types/PatternParams";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/types/StoreContext";
import vert from "@/src/patterns/shaders/canopy.vert";
import { LED_COUNTS } from "@/src/utils/size";

type CanopyViewProps = {
  block: Block<StandardParams>;
};

export default observer(function CanopyView({ block }: CanopyViewProps) {
  const shaderMaterial = useRef<ShaderMaterial>(null);

  const bufferGeometry = useMemo(() => {
    const ledPositions = [];
    for (let x = 0; x < LED_COUNTS.x; x++) {
      for (let y = 0; y < LED_COUNTS.y; y++) {
        ledPositions.push(x, y, 0);
      }
    }
    const positionsFloatArray = new Float32Array(ledPositions);

    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new BufferAttribute(positionsFloatArray, 3),
    );
    return geometry;
  }, []);

  const { timer } = useStore();
  useFrame(({ clock }) => {
    // mobx linting will complain about these lines if observableRequiresReaction is enabled, but
    // it's fine. We don't want this function to react to changes in these variables - it runs every
    // frame already.
    const { globalTime } = timer;
    const { startTime } = block;

    block.update(globalTime - startTime, globalTime);
  });

  return (
    <points>
      <primitive attach="geometry" object={bufferGeometry} />
      <shaderMaterial
        ref={shaderMaterial}
        uniforms={block.pattern.params}
        fragmentShader={block.pattern.src}
        vertexShader={vert}
      />
    </points>
  );
});
