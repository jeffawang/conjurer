import { BufferAttribute, BufferGeometry, WebGLRenderTarget } from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import canopyVert from "@/src/patterns/shaders/canopy.vert";
import fromTexture from "@/src/patterns/shaders/fromTexture.frag";
import {
  APEX_HEIGHT,
  APEX_RADIUS,
  BASE_RADIUS,
  LED_COUNTS,
  STRIP_LENGTH,
} from "@/src/utils/size";
import { catenary } from "@/src/utils/catenary";

type CanopyViewProps = {
  renderTarget: WebGLRenderTarget;
};

export const Canopy = function Canopy({ renderTarget }: CanopyViewProps) {
  const canopyMesh = useRef<THREE.Points>(null);
  const canopyUniforms = useRef({ u_texture: { value: renderTarget.texture } });

  const bufferGeometry = useMemo(() => {
    // TODO: persist this calculation in a file somewhere
    const catenaryCoordinates = catenary(
      { x: APEX_RADIUS, y: APEX_HEIGHT },
      { x: BASE_RADIUS, y: 0 },
      STRIP_LENGTH,
      LED_COUNTS.y
    );
    const ledPositions = [];
    const uv = [];
    for (let x = 0; x < LED_COUNTS.x; x++) {
      for (let y = 0; y < LED_COUNTS.y; y++) {
        const normalizedX = x / (LED_COUNTS.x - 1);
        const normalizedY = y / (LED_COUNTS.y - 1);
        const theta = normalizedX * 2 * Math.PI;

        uv.push(normalizedX, normalizedY);
        ledPositions.push(
          catenaryCoordinates[y][0] * Math.cos(theta),
          catenaryCoordinates[y][0] * Math.sin(theta),
          -catenaryCoordinates[y][1]
        );
      }
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(ledPositions), 3)
    );
    geometry.setAttribute("uv", new BufferAttribute(new Float32Array(uv), 2));
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
