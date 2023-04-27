import Block from "../types/Block";
import { Canvas } from "@react-three/fiber";
import { useStore } from "@/src/types/StoreContext";
import { observer } from "mobx-react-lite";
import CartesianView from "@/src/components/CartesianView";
import RenderPipeline from "@/src/components/RenderPipeline";
import RenderingGate from "@/src/components/RenderingGate";

type PreviewCanvasProps = {
  block: Block;
};

export default observer(function PreviewCanvas({ block }: PreviewCanvasProps) {
  const { timer } = useStore();

  return (
    <Canvas frameloop="demand">
      <RenderingGate shouldRender={!timer.playing} />
      <RenderPipeline block={block} autorun>
        {(renderTarget) => <CartesianView renderTarget={renderTarget} />}
      </RenderPipeline>
    </Canvas>
  );
});
