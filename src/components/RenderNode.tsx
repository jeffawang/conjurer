import { WebGLRenderTarget } from "three";
import { useFrame } from "@react-three/fiber";
import { memo, useRef } from "react";
import vert from "@/src/patterns/shaders/default.vert";
import redTint from "@/src/patterns/shaders/redTint.frag";

type RenderNodeProps = {
  priority: number;
  renderTargetIn: WebGLRenderTarget;
  renderTargetOut: WebGLRenderTarget;
};

export default memo(function RenderNode({
  priority,
  renderTargetIn,
  renderTargetOut,
}: RenderNodeProps) {
  const effectMesh = useRef<THREE.Mesh>(null);
  const effectUniforms = useRef({ u_tex: { value: renderTargetIn.texture } });

  useFrame(({ gl, camera }) => {
    if (!effectMesh.current) return;

    gl.setRenderTarget(renderTargetOut);
    gl.render(effectMesh.current, camera);
  }, priority);

  return (
    <mesh ref={effectMesh}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        uniforms={effectUniforms.current}
        fragmentShader={redTint}
        vertexShader={vert}
      />
    </mesh>
  );
});
