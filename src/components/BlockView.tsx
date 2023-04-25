import Block from "../types/Block";
import { WebGLRenderTarget } from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/types/StoreContext";
import vert from "@/src/patterns/shaders/default.vert";
import fromTexture from "@/src/patterns/shaders/fromTexture.frag";
import RenderNode from "@/src/components/RenderNode";
import black from "@/src/patterns/shaders/black.frag";

type BlockViewProps = {
  autorun?: boolean;
  block: Block | null;
};

export default observer(function BlockView({ autorun, block }: BlockViewProps) {
  const renderTargetA = useMemo(() => new WebGLRenderTarget(512, 512), []);
  const renderTargetB = useMemo(() => new WebGLRenderTarget(512, 512), []);

  const outputMesh = useRef<THREE.Mesh>(null);
  const outputUniforms = useRef({ u_tex: { value: renderTargetB.texture } });

  const { timer } = useStore();

  // initial pass: update parameters (uniforms)
  useFrame(({ clock, gl, camera }) => {
    if (!block) return;

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
    if (!outputMesh.current || !block) return;

    gl.setRenderTarget(null);
    gl.render(outputMesh.current, camera);
  }, 100);

  return (
    <>
      <RenderNode
        priority={1}
        shaderMaterialKey={block?.id}
        uniforms={block?.pattern.params}
        fragmentShader={block ? block?.pattern.src : black}
        renderTargetOut={renderTargetA}
      />
      <RenderNode
        priority={2}
        uniforms={block?.blockEffect?.pattern.params}
        fragmentShader={block?.blockEffect?.pattern.src}
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
