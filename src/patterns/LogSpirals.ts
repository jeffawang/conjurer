import Pattern from "@/src/types/Pattern";
import logSpiralsShader from "./shaders/logSpirals.frag";
import { Vector4 } from "three";

type LogSpiralsParams = {
  u_spikeMotionTimeScalingFactor: {
      name: "spikeMotionTimeScalingFactor";
      value: number;
  };
  u_globalTimeFactor: {
    name: "globalTimeFactor";
    value: number;
  };
  u_repetitionsPerSpiralTurn: {
      name: "repetitionsPerSpiralTurn";
      value: number;
  };
  u_primaryOscPeriod: {
      name: "primaryOscPeriod";
      value: number;
  };
  u_distCutoff: {
      name: "distCutoff";
      value: number;
  };
  u_colorRangeStart: {
      name: "colorRangeStart";
      value: number;
  };
  u_colorRangeWidth: {
      name: "colorRangeWidth";
      value: number;
  };
  u_waveOffset: {
      name: "waveOffset";
      value: number;
  };
  u_baseAmplitude: {
      name: "baseAmplitude";
      value: number;
  };
  u_spiralGrowthFactor: {
      name: "spiralGrowthFactor";
      value: number;
  };
  u_spiralTightness: {
      name: "spiralTightness";
      value: number;
  };
  u_colorIterations: {
      name: "colorIterations";
      value: number;
  };
  u_spiralCount: {
      name: "spiralCount";
      value: number;
  };
};

const LogSpirals = () =>
  new Pattern<LogSpiralsParams>("LogSpirals", logSpiralsShader, {
    u_spikeMotionTimeScalingFactor: {
      name: "spikeMotionTimeScalingFactor",
      value: -0.4,
    },
    u_globalTimeFactor: {
      name: "globalTimeFactor",
      value: 1.2,
    },
    u_repetitionsPerSpiralTurn: {
        name: "repetitionsPerSpiralTurn",
        value: 14,
    },
    u_primaryOscPeriod: {
        name: "primaryOscPeriod",
        value: 15,
    },
    u_distCutoff: {
        name: "distCutoff",
        value: 1.5,
    },
    u_colorRangeStart: {
        name: "colorRangeStart",
        value: 0.55,
    },
    u_colorRangeWidth: {
        name: "colorRangeWidth",
        value: 0.35,
    },
    u_waveOffset: {
        name: "waveOffset",
        value: 0.0172,
    },
    u_baseAmplitude: {
        name: "baseAmplitude",
        value: 0.04,
    },
    u_spiralGrowthFactor: {
        name: "spiralGrowthFactor",
        value: 0.1,
    },
    u_spiralTightness: {
        name: "spiralTightness",
        value: 0.35,
    },
    u_colorIterations: {
        name: "colorIterations",
        value: 32,
    },
    u_spiralCount: {
        name: "spiralCount",
        value: 4,
    },
  });
export default LogSpirals;
