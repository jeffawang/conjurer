import { Box, useToken } from "@chakra-ui/react";
import Block from "@/src/types/Block";
import { memo, useEffect, useRef } from "react";
import SplineVariation from "@/src/types/Variations/SplineVariation";

type ScalarVariationGraphProps = {
  uniformName: string;
  variation: SplineVariation;
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
      for (let i = 0; i < variation.points.length; i++) {
        const { x, y } = variation.points[i];
        const xLocked = i === 0 || i === variation.points.length - 1;
        const safe = i === 0 || i === variation.points.length - 1;
        spliner.add({ x, y, xLocked, safe });
      }
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

      // TODO: attach listeners

      spliner.draw();
    };

    create();
  }, [variation.points, id, width, orange, blue]);

  return (
    <Box
      className="spline-container"
      id={id}
      bgColor="gray.600"
      // _hover={{ bgColor: "gray.500" }}
    />
  );
});
