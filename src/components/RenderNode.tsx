import { Vector4, WebGLRenderTarget } from "three";
import { useFrame } from "@react-three/fiber";
import { memo, useRef } from "react";
import vert from "@/src/patterns/shaders/default.vert";

type RenderNodeProps = {
  shaderMaterialKey?: string;
  uniforms?: any;
  fragmentShader: string;
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
  const effectUniforms = useRef({
    u_color: { value: new Vector4(0, 1, 1, 1) },
    u_intensity: { value: 0.3 },
    u_tex: { value: renderTargetIn.texture },
  });

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
        fragmentShader={fragmentShader}
        vertexShader={vert}
      />
    </mesh>
  );
});
