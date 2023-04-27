import { memo, useEffect } from "react";
import { useThree } from "@react-three/fiber";

// RenderingGate should only be used with a <Canvas frameloop="demand">. It will advance the render
// loop (which will call all useFrame functions) only when shouldRender is true.
export default memo(function RenderingGate({
  shouldRender,
}: {
  shouldRender: boolean;
}) {
  const advance = useThree((state) => state.advance);

  useEffect(() => {
    let looping = true;
    function loop(t: number) {
      if (shouldRender) advance(t);
      if (looping) requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    return () => {
      looping = false;
    };
  }, [shouldRender, advance]);

  return null;
});
