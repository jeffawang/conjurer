import { Vector2 } from "three";
import {
  ParamValues,
  ParamsProxy,
  PatternParams,
  StandardParams,
} from "./PatternParams";

export class Pattern {
  name: string;
  src: string;
  params: StandardParams & PatternParams;
  paramValues: ParamValues<StandardParams & PatternParams>;

  constructor(name: string, src: string, parameters?: PatternParams) {
    this.name = name;
    this.src = src;

    this.params = {
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
        // TODO: pipe this through from elsewhere
        value: new Vector2(96, 75),
      },
      ...parameters,
    };
    this.paramValues = ParamsProxy(this.params);
  }
}
