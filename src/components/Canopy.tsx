import { BufferAttribute, BufferGeometry, WebGLRenderTarget } from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import canopyVert from "@/src/patterns/shaders/canopy.vert";
import fromTexture from "@/src/patterns/shaders/fromTexture.frag";
import { LED_COUNTS, STRIP_LENGTH } from "@/src/utils/size";
import catenary from "@/src/utils/catenary";

type CanopyViewProps = {
  renderTarget: WebGLRenderTarget;
};

export default function Canopy({ renderTarget }: CanopyViewProps) {
  const canopyMesh = useRef<THREE.Points>(null);
  const canopyUniforms = useRef({ u_texture: { value: renderTarget.texture } });

  const bufferGeometry = useMemo(() => {
    // TODO: fix this horrible hack
    const catenaryCoordinates = catenary(
      { x: 1, y: 0 },
      { x: 8, y: 0 },
      STRIP_LENGTH,
      LED_COUNTS.y
    );
    const ledPositions = [];
    for (let x = 0; x < LED_COUNTS.x; x++) {
      for (let y = 0; y < LED_COUNTS.y; y++) {
        ledPositions.push(
          x / (LED_COUNTS.x - 1),
          y / (LED_COUNTS.y - 1),
          -catenaryCoordinates[y][1]
        );
      }
    }
    const positionsFloatArray = new Float32Array(ledPositions);

    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new BufferAttribute(positionsFloatArray, 3)
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
}
