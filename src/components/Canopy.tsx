import { BufferAttribute, BufferGeometry, WebGLRenderTarget } from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/types/StoreContext";
import vert from "@/src/patterns/shaders/default.vert";
import canopyVert from "@/src/patterns/shaders/canopy.vert";
import black from "@/src/patterns/shaders/black.frag";
import fromTexture from "@/src/patterns/shaders/fromTexture.frag";
import { LED_COUNTS, STRIP_LENGTH } from "@/src/utils/size";
import catenary from "@/src/utils/catenary";
import RenderNode from "@/src/components/RenderNode";

type CanopyViewProps = {};

export default observer(function Canopy({}: CanopyViewProps) {
  const { currentBlock } = useStore();

  const renderTargetA = useMemo(() => new WebGLRenderTarget(512, 512), []);
  const renderTargetB = useMemo(() => new WebGLRenderTarget(512, 512), []);

  const patternMesh = useRef<THREE.Mesh>(null);

  const canopyMesh = useRef<THREE.Points>(null);
  const canopyUniforms = useRef({ u_tex: { value: renderTargetB.texture } });

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

  const { timer } = useStore();
  useFrame(({ gl, camera }) => {
    // mobx linting will complain about these lines if observableRequiresReaction is enabled, but
    // it's fine. We don't want this function to react to changes in these variables - it runs every
    // frame already.
    const { globalTime } = timer;

    if (currentBlock)
      currentBlock.updateParameters(
        globalTime - currentBlock.startTime,
        globalTime
      );

    if (!patternMesh.current) return;

    gl.setRenderTarget(renderTargetA);
    gl.render(patternMesh.current, camera);
  }, 0);

  // final render: render the canopy
  useFrame(({ gl, camera }) => {
    if (!canopyMesh.current) return;

    gl.setRenderTarget(null);
    gl.render(canopyMesh.current, camera);
  }, 100);

  return (
    <>
      <mesh ref={patternMesh}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          key={currentBlock?.id}
          uniforms={currentBlock?.pattern.params}
          fragmentShader={currentBlock ? currentBlock.pattern.src : black}
          vertexShader={vert}
        />
      </mesh>

      <RenderNode
        priority={2}
        renderTargetIn={renderTargetA}
        renderTargetOut={renderTargetB}
      />
      <points ref={canopyMesh}>
        <primitive attach="geometry" object={bufferGeometry} />
        <shaderMaterial
          uniforms={canopyUniforms.current}
          fragmentShader={fromTexture}
          vertexShader={canopyVert}
        />
      </points>
    </>
  );
});
