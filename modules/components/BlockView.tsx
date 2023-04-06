import { Block } from "../common/types/Block";
import { ShaderMaterial } from "three";
import { StandardParams } from "../common/types/PatternParams";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import vert from "@/modules/patterns/shaders/default.vert";

type BlockViewProps = {
  block: Block<StandardParams>;
};

export default function BlockView({ block }: BlockViewProps) {
  const shaderMaterial = useRef<ShaderMaterial>(null);

  useFrame(({ clock }) => {
    block.update(clock.elapsedTime, clock.elapsedTime);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={shaderMaterial}
        uniforms={block.pattern.params}
        fragmentShader={block.pattern.src}
        vertexShader={vert}
      />
    </mesh>
  );
}
