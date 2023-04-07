import { Block } from "../common/types/Block";
import { ShaderMaterial, Vector2 } from "three";
import { StandardParams } from "../common/types/PatternParams";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/modules/common/types/StoreContext";
import vert from "@/modules/patterns/shaders/default.vert";

type BlockViewProps = {
  autorun?: boolean;
  block: Block<StandardParams>;
};

export default observer(function BlockView({ autorun, block }: BlockViewProps) {
  const shaderMaterial = useRef<ShaderMaterial>(null);

  const { size } = useThree();
  useEffect(() => {
    // whenever the block or canvas size changes, reset the shader resolution
    block.pattern.paramValues.u_resolution = new Vector2(
      size.width,
      size.height,
    );
  }, [block, size.width, size.height]);

  // dereference block.startTime here so that we are not accessing an observable inside the useFrame callback
  const { startTime } = block;
  const { timer } = useStore();
  const { globalTime } = timer; // this accessing of global time means that every BlockView will re-render every frame. Maybe optimize this later
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
