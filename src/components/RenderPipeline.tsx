import { WebGLRenderTarget } from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/types/StoreContext";
import black from "@/src/patterns/shaders/black.frag";
import { RenderNode } from "@/src/components/RenderNode";
import { Block } from "@/src/types/Block";

// This size greatly affects performance. Somewhat arbitrarily chosen for now. We can lower this as
// needed in the future.
const RENDER_TARGET_SIZE = 256;

type RenderPipelineProps = {
  autorun?: boolean;
  block?: Block;
  children: (renderTarget: WebGLRenderTarget) => JSX.Element;
};

export const RenderPipeline = observer(function RenderPipeline({
  autorun,
  block,
  children,
}: RenderPipelineProps) {
  const renderTargetA = useMemo(
    () => new WebGLRenderTarget(RENDER_TARGET_SIZE, RENDER_TARGET_SIZE),
    []
  );
  const renderTargetB = useMemo(
    () => new WebGLRenderTarget(RENDER_TARGET_SIZE, RENDER_TARGET_SIZE),
    []
  );

  const { currentBlock, timer } = useStore();
  const targetBlock = block ?? currentBlock;

  // initial pass: update parameters (uniforms)
  useFrame(({ clock }) => {
    if (!targetBlock) return;

    // mobx linting will complain about these lines if observableRequiresReaction is enabled, but
    // it's fine. We don't want this function to react to changes in these variables - it runs every
    // frame already.
    const { globalTime } = timer;
    const { startTime } = targetBlock;

    if (autorun) {
      // Don't let the elapsed time go over five minutes
      const elapsedTime = clock.elapsedTime % (1000 * 60 * 5);
      targetBlock.updateParameters(elapsedTime, elapsedTime);
    } else {
      targetBlock.updateParameters(globalTime - startTime, globalTime);
    }
  }, 0);

  const numberEffects = targetBlock?.effectBlocks.length ?? 0;
  const evenNumberOfEffects = numberEffects % 2 === 0;
  return (
    <>
      <RenderNode
        priority={1}
        shaderMaterialKey={targetBlock?.id}
        uniforms={targetBlock?.pattern.params}
        fragmentShader={targetBlock?.pattern.src ?? black}
        renderTargetOut={evenNumberOfEffects ? renderTargetB : renderTargetA}
      />
      {targetBlock?.effectBlocks.map((effect, i) => {
        const isEven = i % 2 === 0;
        const swap = isEven && evenNumberOfEffects;
        return (
          <RenderNode
            key={effect.id}
            priority={i + 2}
            uniforms={effect.pattern.params}
            fragmentShader={effect.pattern.src}
            renderTargetIn={swap ? renderTargetB : renderTargetA}
            renderTargetOut={swap ? renderTargetA : renderTargetB}
          />
        );
      })}
      {children(renderTargetB)}
    </>
  );
});
