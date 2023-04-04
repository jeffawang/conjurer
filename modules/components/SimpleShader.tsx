import { useFrame } from "@react-three/fiber";

import { useMemo, useRef } from "react";
import { ShaderMaterial, Vector2 } from "three";

import gradientShader from "@/modules/shaders/gradient.frag";
import vert from "@/modules/shaders/default.vert";

const SimpleShader = () => {
  // useFrame((state) => {});
  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new Vector2(100, 100) },
    }),
    [],
  );

  const shaderMaterial = useRef<ShaderMaterial>(null);

  useFrame((_, delta) => {
    uniforms.u_time.value += delta;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={shaderMaterial}
        uniforms={uniforms}
        fragmentShader={gradientShader}
        vertexShader={vert}
      />
    </mesh>
  );
};

export default SimpleShader;
