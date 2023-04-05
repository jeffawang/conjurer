import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { ShaderMaterial } from "three";

import vert from "@/modules/patterns/shaders/default.vert";
import {
  Pattern,
  PatternParameter,
  PatternParameters,
} from "@/modules/common/types/Pattern";
import { Block } from "../common/types/Block";

type BlockViewComponent<T extends PatternParameters> = React.FC<{
  block: Block<T>;
}>;

const BlockView: BlockViewComponent<PatternParameters> = ({ block }) => {
  const shaderMaterial = useRef<ShaderMaterial>(null);

  useFrame(({ clock }) => {
    block.update(clock.elapsedTime, clock.elapsedTime);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={shaderMaterial}
        uniforms={block.pattern.parameters}
        fragmentShader={block.pattern.src}
        vertexShader={vert}
      />
    </mesh>
  );
};

export default BlockView;
