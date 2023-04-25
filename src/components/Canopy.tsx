import { BufferAttribute, BufferGeometry, WebGLRenderTarget } from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/types/StoreContext";
import canopyVert from "@/src/patterns/shaders/canopy.vert";
import black from "@/src/patterns/shaders/black.frag";
import fromTexture from "@/src/patterns/shaders/fromTexture.frag";
import { LED_COUNTS, STRIP_LENGTH } from "@/src/utils/size";
import catenary from "@/src/utils/catenary";
import RenderNode from "@/src/components/RenderNode";
import BlockView from "@/src/components/BlockView";

type CanopyViewProps = {};

export default observer(function Canopy({}: CanopyViewProps) {
  const renderTargetA = useMemo(() => new WebGLRenderTarget(512, 512), []);
  const renderTargetB = useMemo(() => new WebGLRenderTarget(512, 512), []);

  const canopyMesh = useRef<THREE.Points>(null);
  const canopyUniforms = useMemo(
    () => ({
      u_texture: { value: renderTargetB.texture },
    }),
    [renderTargetB]
  );

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

  const { currentBlock, timer } = useStore();

  // initial pass: update parameters (uniforms)
  useFrame(({ gl, camera }) => {
    if (!currentBlock) return;

    // mobx linting will complain about these lines if observableRequiresReaction is enabled, but
    // it's fine. We don't want this function to react to changes in these variables - it runs every
    // frame already.
    const { globalTime } = timer;

    currentBlock.updateParameters(
      globalTime - currentBlock.startTime,
      globalTime
    );
  }, 0);

  // final render: render the canopy
  useFrame(({ gl, camera }) => {
    if (!canopyMesh.current || !currentBlock) return;

    gl.setRenderTarget(null);
    gl.render(canopyMesh.current, camera);
  }, 100);

  return (
    <>
      <RenderNode
        priority={1}
        shaderMaterialKey={currentBlock?.id}
        uniforms={currentBlock?.pattern.params}
        fragmentShader={currentBlock?.pattern.src ?? black}
        renderTargetOut={renderTargetA}
      />
      <RenderNode
        priority={2}
        uniforms={currentBlock?.blockEffect?.pattern.params}
        fragmentShader={currentBlock?.blockEffect?.pattern.src}
        renderTargetIn={renderTargetA}
        renderTargetOut={renderTargetB}
      />
      <points ref={canopyMesh}>
        <primitive attach="geometry" object={bufferGeometry} />
        <shaderMaterial
          uniforms={canopyUniforms}
          fragmentShader={fromTexture}
          vertexShader={canopyVert}
        />
      </points>
    </>
  );
});
