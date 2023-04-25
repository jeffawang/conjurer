import Block from "../types/Block";
import { WebGLRenderTarget } from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/types/StoreContext";
import vert from "@/src/patterns/shaders/default.vert";
import fromTexture from "@/src/patterns/shaders/fromTexture.frag";
import colorTint from "@/src/effects/shaders/colorTint.frag";
import RenderNode from "@/src/components/RenderNode";

type BlockViewProps = {
  autorun?: boolean;
  block: Block;
};

export default observer(function BlockView({ autorun, block }: BlockViewProps) {
  const renderTargetA = useMemo(() => new WebGLRenderTarget(512, 512), []);
  const renderTargetB = useMemo(() => new WebGLRenderTarget(512, 512), []);

  const outputMesh = useRef<THREE.Mesh>(null);
  const outputUniforms = useRef({ u_tex: { value: renderTargetB.texture } });

  const { timer } = useStore();

  // initial pass: update parameters (uniforms)
  useFrame(({ clock, gl, camera }) => {
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
  }, 0);

  // final render: render to screen
  useFrame(({ gl, camera }) => {
    if (!outputMesh.current) return;

    gl.setRenderTarget(null);
    gl.render(outputMesh.current, camera);
  }, 100);

  return (
    <>
      <RenderNode
        uniforms={block.pattern.params}
        fragmentShader={block.pattern.src}
        priority={1}
        renderTargetIn={renderTargetB}
        renderTargetOut={renderTargetA}
      />
      <RenderNode
        priority={2}
        fragmentShader={colorTint}
        renderTargetIn={renderTargetA}
        renderTargetOut={renderTargetB}
      />
      <mesh ref={outputMesh}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          uniforms={outputUniforms.current}
          fragmentShader={fromTexture}
          vertexShader={vert}
        />
      </mesh>
    </>
  );
});
