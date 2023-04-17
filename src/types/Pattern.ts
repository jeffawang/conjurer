import {
  ExtraParams,
  ParamValues,
  ParamsProxy,
  StandardParams,
} from "./PatternParams";
import { LED_COUNTS } from "@/src/utils/size";

export default class Pattern<T extends ExtraParams = ExtraParams> {
  name: string;
  src: string;
  params: StandardParams & T;
  paramValues: ParamValues<StandardParams & T>;

  constructor(name: string, src: string, parameters: T = {} as T) {
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
