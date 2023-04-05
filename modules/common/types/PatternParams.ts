import { Texture, Vector2 } from "three";

export type PatternParam<T = Vector2 | number | Texture> = {
  name: string;
  value: T;
};
export type PatternParams = {
  [key: string]: PatternParam;
};

export type StandardParams = {
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

export type ParamValues<T extends PatternParams> = {
  [K in keyof T]: T[K]["value"];
};

type ParamsProxyConstructor = {
  new <T extends PatternParams, H extends ParamValues<T>>(
    target: T,
    handler: ProxyHandler<H>
  ): H;
};

const MyProxy = Proxy as ParamsProxyConstructor;

export const ParamsProxy = function <T extends PatternParams>(a: T) {
  return new MyProxy<T, ParamValues<T>>(a, {
    get: (_, p, rec) => {
      return a[p as keyof T]["value"];
    },
    set: (_, p, newVal, rec) => {
      a[p as keyof T]["value"] = newVal;
      return true;
    },
  });
};
