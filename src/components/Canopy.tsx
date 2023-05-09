import { BufferAttribute, BufferGeometry, WebGLRenderTarget } from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import canopyVert from "@/src/patterns/shaders/canopy.vert";
import fromTexture from "@/src/patterns/shaders/fromTexture.frag";
import canopyGeometry from "@/src/data/canopyGeometry.json";

type CanopyViewProps = {
  renderTarget: WebGLRenderTarget;
};

export const Canopy = function Canopy({ renderTarget }: CanopyViewProps) {
  const canopyMesh = useRef<THREE.Points>(null);
  const canopyUniforms = useRef({ u_texture: { value: renderTarget.texture } });

  const bufferGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(canopyGeometry.position), 3)
    );
    geometry.setAttribute(
      "uv",
      new BufferAttribute(new Float32Array(canopyGeometry.uv), 2)
    );
    return geometry;
  }, []);

  // render the canopy
  useFrame(({ gl, camera }) => {
    if (!canopyMesh.current) return;

    gl.setRenderTarget(null);
    gl.render(canopyMesh.current, camera);
  }, 100);

  return (
    <points ref={canopyMesh}>
      <primitive attach="geometry" object={bufferGeometry} />
      <shaderMaterial
        uniforms={canopyUniforms.current}
        fragmentShader={fromTexture}
        vertexShader={canopyVert}
      />
    </points>
  );
};
