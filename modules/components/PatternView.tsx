import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { ShaderMaterial } from "three";

import vert from "@/modules/patterns/shaders/default.vert";
import { Pattern } from "@/modules/common/types/Pattern";

const PatternView = ({ pattern }: { pattern: Pattern }) => {
  const shaderMaterial = useRef<ShaderMaterial>(null);

  useFrame((_, delta) => {
    pattern.update(delta);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={shaderMaterial}
        uniforms={pattern.parameters}
        fragmentShader={pattern.src}
        vertexShader={vert}
      />
    </mesh>
  );
};

export default PatternView;
