import { WebGLRenderTarget } from "three";
import { useFrame } from "@react-three/fiber";
import { FunctionComponent, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/types/StoreContext";
import black from "@/src/patterns/shaders/black.frag";
import RenderNode from "@/src/components/RenderNode";

type RenderPipelineProps = {
  Output: FunctionComponent<{ renderTarget: WebGLRenderTarget }>;
};

export default observer(function RenderPipeline({
  Output,
}: RenderPipelineProps) {
  const renderTargetA = useMemo(() => new WebGLRenderTarget(512, 512), []);
  const renderTargetB = useMemo(() => new WebGLRenderTarget(512, 512), []);

  const { currentBlock, timer } = useStore();

  // initial pass: update parameters (uniforms)
  useFrame(({ gl, camera }) => {
    if (!currentBlock) return;

    // mobx linting will complain about these lines if observableRequiresReaction is enabled, but
    // it's fine. We don't want this function to react to changes in these variables - it runs every
    // frame already.
    const { globalTime } = timer;
    const { startTime } = currentBlock;

    currentBlock.updateParameters(globalTime - startTime, globalTime);
  }, 0);

  // TODO: make this handle an arbitrary number of effects
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
      {/* TODO: use children instead of this janky Output prop  */}
      <Output renderTarget={renderTargetB} />
    </>
  );
});
