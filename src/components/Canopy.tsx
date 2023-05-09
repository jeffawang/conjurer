import {
  BufferAttribute,
  BufferGeometry,
  Scene,
  WebGLRenderTarget,
} from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import canopyVert from "@/src/patterns/shaders/canopy.vert";
import fromTexture from "@/src/patterns/shaders/fromTexture.frag";
import canopyGeometry from "@/src/data/canopyGeometry.json";
import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
} from "postprocessing";

type CanopyViewProps = {
  renderTarget: WebGLRenderTarget;
};

export const Canopy = function Canopy({ renderTarget }: CanopyViewProps) {
  const scene = useRef<Scene>(null);
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

  const { gl, camera } = useThree();

  // build an EffectComposer with imperative style three js because of shortcomings of
  // Drei <EffectComposer> (lack of render priority, ability to specify scene/singular mesh to render)
  const effectComposer = useMemo(() => {
    const effectComposer = new EffectComposer(gl);
    effectComposer.setSize(
      gl.domElement.clientWidth,
      gl.domElement.clientHeight
    );

    if (!scene.current) return effectComposer;

    effectComposer.addPass(new RenderPass(scene.current, camera));
    effectComposer.addPass(
      new EffectPass(
        camera,
        new BloomEffect({
          luminanceThreshold: 0.001,
          intensity: 0.2,
        })
      )
    );
    return effectComposer;
  }, [gl, camera]);

  // render the effect composer, including the canopy render pass and bloom effect
  useFrame(() => effectComposer.render(), 100);

  return (
    <scene ref={scene}>
      <points>
        <primitive attach="geometry" object={bufferGeometry} />
        <shaderMaterial
          uniforms={canopyUniforms.current}
          fragmentShader={fromTexture}
          vertexShader={canopyVert}
        />
      </points>
    </scene>
  );
};
