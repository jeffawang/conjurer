import { Texture, Vector2 } from "three";

export type StandardParameters = {
  u_time: {
    name: "Time";
    value: number;
  };
  u_global_time: {
    name: "Global Time";
    value: number;
  };
  u_resolution: {
    name: "Resolution";
    value: Vector2;
  };
};

export type ShaderParameter<T = number | Vector2 | Texture> = {
  name: string;
  value: T;
};
export type ShaderParameters = Record<string, ShaderParameter>;

export class Pattern {
  name: string;
  src: string;
  parameters: StandardParameters & ShaderParameters;

  constructor(name: string, src: string, parameters?: ShaderParameters) {
    this.name = name;
    this.src = src;

    this.parameters = {
      u_time: {
        name: "Time",
        value: 0,
      },
      u_global_time: {
        name: "Global Time",
        value: 0,
      },
      u_resolution: {
        name: "Resolution",
        value: new Vector2(96, 75),
      },
      ...parameters,
    };
  }
  update = (delta: number) => {
    this.parameters.u_time.value += delta;
  };
}
