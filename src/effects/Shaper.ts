import Pattern from "@/src/types/Pattern";
import shaper from "./shaders/shaper.frag";

type ShaperParams = {
  u_tiling: {
    name: "Tiling";
    value: number;
  };
  u_rotation: {
    name: "Rotation";
    value: number;
  };
  u_box_size: {
    name: "Box Size";
    value: number;
  };
  u_circle_size: {
    name: "Circle Size";
    value: number;
  };
  u_box_smooth: {
    name: "Box Smooth";
    value: number;
  };
  u_circle_smooth: {
    name: "Circle Smooth";
    value: number;
  };
  u_brick_offset_x: {
    name: "Brick Offset X";
    value: number;
  };
  u_brick_offset_y: {
    name: "Brick Offset Y";
    value: number;
  };
};

const Shaper = () =>
  new Pattern<ShaperParams>("Shaper", shaper, {
    u_tiling: {
      name: "Tiling",
      value: 8,
    },
    u_rotation: {
      name: "Rotation",
      value: 0,
    },
    u_box_size: {
      name: "Box Size",
      value: 0.6,
    },
    u_circle_size: {
      name: "Circle Size",
      value: 0.5,
    },
    u_box_smooth: {
      name: "Box Smooth",
      value: 0.01,
    },
    u_circle_smooth: {
      name: "Circle Smooth",
      value: 0.0,
    },
    u_brick_offset_x: {
      name: "Brick Offset X",
      value: 0.0,
    },
    u_brick_offset_y: {
      name: "Brick Offset Y",
      value: 0.0,
    },
  });

export default Shaper;
