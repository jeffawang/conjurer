import { WebGLRenderTarget } from "three";
import { useFrame } from "@react-three/fiber";
import { FunctionComponent, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/types/StoreContext";
import black from "@/src/patterns/shaders/black.frag";
import RenderNode from "@/src/components/RenderNode";
import Block from "@/src/types/Block";

type RenderPipelineProps = {
  autorun?: boolean;
  block?: Block;
  Output: FunctionComponent<{ renderTarget: WebGLRenderTarget }>;
};

export default observer(function RenderPipeline({
  autorun,
  block,
  Output,
}: RenderPipelineProps) {
  const renderTargetA = useMemo(() => new WebGLRenderTarget(512, 512), []);
  const renderTargetB = useMemo(() => new WebGLRenderTarget(512, 512), []);

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
      targetBlock.updateParameters(clock.elapsedTime, clock.elapsedTime);
    } else {
      targetBlock.updateParameters(globalTime - startTime, globalTime);
    }
  }, 0);

  const numberEffects = targetBlock?.blockEffects.length ?? 0;
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
      {targetBlock?.blockEffects.map((effect, i) => {
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
      {/* TODO: use children instead of this janky Output prop */}
      <Output renderTarget={renderTargetB} />
    </>
  );
});
