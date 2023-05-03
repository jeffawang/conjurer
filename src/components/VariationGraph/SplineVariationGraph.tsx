import { Box } from "@chakra-ui/react";
import Variation from "@/src/types/Variations/Variation";
import Block from "@/src/types/Block";
import { memo, useEffect } from "react";

let didInitialize = false;

type ScalarVariationGraphProps = {
  uniformName: string;
  variation: Variation;
  width: number;
  domain: [number, number];
  block: Block;
};

export default memo(function SplineVariationGraph({
  uniformName,
  variation,
  width,
  domain,
  block,
}: ScalarVariationGraphProps) {
  const id = `spline-${variation.id}`;

  useEffect(() => {
    if (didInitialize) return;
    didInitialize = true;

    const create = async () => {
      // Cannot be run on the server, so we need to use dynamic import
      const CanvasSpliner = (await import("CanvasSpliner")).CanvasSpliner;

      const spliner = new CanvasSpliner(id, 200, 200);
      spliner.add({ x: 0, y: 0, xLocked: true, yLocked: true, safe: true });
      spliner.add({ x: 0.1, y: 0.4 });
      spliner.add({ x: 0.3, y: 0.45 });
      spliner.add({ x: 0.6, y: 1 });
      spliner.add({ x: 1, y: 0.6, xLocked: true, safe: true });
    };

    create();
  }, [id]);

  return (
    <Box
      id={id}
      py={1}
      bgColor="gray.600"
      // _hover={{ bgColor: "gray.500" }}
    />
  );
});
