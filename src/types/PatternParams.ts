import { Texture, Vector4 } from "three";

export type ParamType = number | Vector4 | Texture | null;

export type PatternParam<T = ParamType> = {
  name: string;
  value: T;
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
  // for effects
  u_texture: {
    name: "Input Texture";
    value: Texture | null;
  };
};

export type ExtraParams = Record<string, PatternParam>;

export type PatternParams = StandardParams & ExtraParams;

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
