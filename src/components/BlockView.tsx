import Block from "../types/Block";
import { ShaderMaterial } from "three";
import { StandardParams } from "../types/PatternParams";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/types/StoreContext";
import vert from "@/src/patterns/shaders/default.vert";

type BlockViewProps = {
  autorun?: boolean;
  block: Block<StandardParams>;
};

export default observer(function BlockView({ autorun, block }: BlockViewProps) {
  const shaderMaterial = useRef<ShaderMaterial>(null);

  const { timer } = useStore();
  useFrame(({ clock }) => {
    // mobx linting will complain about these lines if observableRequiresReaction is enabled, but
    // it's fine. We don't want this function to react to changes in these variables - it runs every
    // frame already.
    const { globalTime } = timer;
    const { startTime } = block;

    if (autorun) {
      block.updateParameters(clock.elapsedTime, clock.elapsedTime);
    } else {
      block.updateParameters(globalTime - startTime, globalTime);
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={shaderMaterial}
        uniforms={block.pattern.params}
        fragmentShader={block.pattern.src}
        vertexShader={vert}
      />
    </mesh>
  );
});
