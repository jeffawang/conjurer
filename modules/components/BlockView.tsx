import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { ShaderMaterial } from "three";

import vert from "@/modules/patterns/shaders/default.vert";
import { Block } from "../common/types/Block";
import { PatternParams } from "../common/types/PatternParams";

type BlockViewComponent<T extends PatternParams> = React.FC<{
  block: Block<T>;
}>;

const BlockView: BlockViewComponent<PatternParams> = ({ block }) => {
  const shaderMaterial = useRef<ShaderMaterial>(null);

  useFrame(({ clock }, delta) => {
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
};

export default BlockView;
