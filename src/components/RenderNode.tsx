import { WebGLRenderTarget } from "three";
import { useFrame } from "@react-three/fiber";
import { memo, useRef } from "react";
import vert from "@/src/patterns/shaders/default.vert";
import redTint from "@/src/patterns/shaders/redTint.frag";

type RenderNodeProps = {
  shaderMaterialKey?: string;
  uniforms?: any;
  fragmentShader?: string;
  priority: number;
  renderTargetIn: WebGLRenderTarget;
  renderTargetOut: WebGLRenderTarget;
};

export default memo(function RenderNode({
  shaderMaterialKey,
  uniforms,
  fragmentShader,
  priority,
  renderTargetIn,
  renderTargetOut,
}: RenderNodeProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const effectUniforms = useRef({ u_tex: { value: renderTargetIn.texture } });

  useFrame(({ gl, camera }) => {
    if (!mesh.current) return;

    gl.setRenderTarget(renderTargetOut);
    gl.render(mesh.current, camera);
  }, priority);

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        key={shaderMaterialKey}
        uniforms={uniforms ?? effectUniforms.current}
        fragmentShader={fragmentShader ?? redTint}
        vertexShader={vert}
      />
    </mesh>
  );
});
