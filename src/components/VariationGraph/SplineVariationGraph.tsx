import { Box, useToken } from "@chakra-ui/react";
import Variation from "@/src/types/Variations/Variation";
import Block from "@/src/types/Block";
import { memo, useEffect, useRef } from "react";

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
  const didInitialize = useRef(false);
  const id = `spline-${variation.id}`;

  const [orange, blue] = useToken("colors", ["orange.400", "blue.400"]);

  useEffect(() => {
    if (didInitialize.current) return;
    didInitialize.current = true;

    const create = async () => {
      // Cannot be run on the server, so we need to use dynamic import
      const CanvasSpliner = (await import("CanvasSpliner")).CanvasSpliner;

      const spliner = new CanvasSpliner(id, width, 58);
      spliner.add({ x: 0, y: 0, xLocked: true, safe: true });
      spliner.add({ x: 0.1, y: 0.4 });
      spliner.add({ x: 0.3, y: 0.45 });
      spliner.add({ x: 0.6, y: 1 });
      spliner.add({ x: 1, y: 0.6, xLocked: true, safe: true });
      spliner.setControlPointRadius(5);
      spliner.setControlPointColor("idle", orange);
      spliner.setControlPointColor("hovered", blue);
      spliner.setControlPointColor("grabbed", blue);
      spliner.setCurveColor("idle", orange);
      // spliner.setGridColor(5);
      spliner.setGridStep(0.25);
      spliner.setTextColor("#ffffff");
      // spliner.setCurveThickness(5);
      // spliner.setBackgroundColor(null);
      spliner.draw();
    };

    create();
  }, [id, width, orange, blue]);

  return (
    <Box
      className="spline-container"
      id={id}
      bgColor="gray.600"
      // _hover={{ bgColor: "gray.500" }}
    />
  );
});
