import Block from "../types/Block";
import { WebGLRenderTarget } from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/types/StoreContext";
import vert from "@/src/patterns/shaders/default.vert";
import redTint from "@/src/patterns/shaders/redTint.frag";
import fromTexture from "@/src/patterns/shaders/fromTexture.frag";

type BlockViewProps = {
  autorun?: boolean;
  block: Block;
};

export default observer(function BlockView({ autorun, block }: BlockViewProps) {
  const renderTarget = useMemo(() => new WebGLRenderTarget(512, 512), []);
  const renderTarget2 = useMemo(() => new WebGLRenderTarget(512, 512), []);

  const patternMesh = useRef<THREE.Mesh>(null);

  const effectMesh = useRef<THREE.Mesh>(null);
  const effectUniforms = useRef({ u_tex: { value: renderTarget.texture } });

  const outputMesh = useRef<THREE.Mesh>(null);
  const outputUniforms = useRef({ u_tex: { value: renderTarget2.texture } });

  const { timer } = useStore();
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

    if (!patternMesh.current) return;

    gl.setRenderTarget(renderTarget);
    gl.render(patternMesh.current, camera);
  }, 1);

  useFrame(({ gl, camera }) => {
    if (!effectMesh.current) return;

    gl.setRenderTarget(renderTarget2);
    gl.render(effectMesh.current, camera);
  }, 2);

  useFrame(({ gl, camera }) => {
    if (!outputMesh.current) return;

    gl.setRenderTarget(null);
    gl.render(outputMesh.current, camera);
  }, 3);

  return (
    <>
      <mesh ref={patternMesh}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          uniforms={block.pattern.params}
          fragmentShader={block.pattern.src}
          vertexShader={vert}
        />
      </mesh>
      <mesh ref={effectMesh}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          uniforms={effectUniforms.current}
          fragmentShader={redTint}
          vertexShader={vert}
        />
      </mesh>
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
