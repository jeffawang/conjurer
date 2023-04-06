import { Block } from "../common/types/Block";
import { ShaderMaterial } from "three";
import { StandardParams } from "../common/types/PatternParams";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import vert from "@/modules/patterns/shaders/default.vert";
import { observer } from "mobx-react-lite";
import { useStore } from "@/modules/common/types/StoreContext";

type BlockViewProps = {
  autorun?: boolean;
  block: Block<StandardParams>;
};

export default observer(function BlockView({ autorun, block }: BlockViewProps) {
  const { globalTime } = useStore();
  const shaderMaterial = useRef<ShaderMaterial>(null);

  const { startTime } = block;
  useFrame(({ clock }) => {
    if (autorun) {
      block.update(clock.elapsedTime, clock.elapsedTime);
    } else {
      block.update(globalTime - startTime, globalTime);
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
