import {
  ParamValues,
  ParamsProxy,
  PatternParams,
  StandardParams,
} from "./PatternParams";
import { LED_COUNTS } from "@/modules/common/utils/size";

export default class Pattern {
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
        value: LED_COUNTS.clone(),
      },
      ...parameters,
    };
    this.paramValues = ParamsProxy(this.params);
  }
}
