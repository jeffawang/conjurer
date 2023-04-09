import Block from "../common/types/Block";
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
  const { timer } = useStore();
  useFrame(({ clock }) => {
    // mobx linting will complain about these lines if observableRequiresReaction is enabled, but
    // it's fine. We don't want this function to react to changes in these variables - it runs every
    // frame already.
    const { globalTime } = timer;
    const { startTime } = block;

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
