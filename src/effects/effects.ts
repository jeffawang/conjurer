import { CartesianProjection } from "@/src/effects/CartesianProjection";
import { ColorTint } from "@/src/effects/ColorTint";
import { Shaper } from "@/src/effects/Shaper";
import { Leaf } from "@/src/effects/Leaf";
import { Pattern } from "@/src/types/Pattern";
import { Rotate } from "./Rotate";

const effects: Pattern[] = [
  Shaper(),
  Leaf(),
  ColorTint(),
  CartesianProjection(),
  Rotate(),
];

const effectMap: { [key: string]: Pattern } = {};
for (const effect of effects) {
  effectMap[effect.name] = effect;
}

export { effects, effectMap };
