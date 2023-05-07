import CartesianProjection from "@/src/effects/CartesianProjection";
import ColorTint from "@/src/effects/ColorTint";
import Shaper from "@/src/effects/Shaper";
import { Pattern } from "@/src/types/Pattern";

const effects: Pattern[] = [ColorTint(), CartesianProjection(), Shaper()];

const effectMap: { [key: string]: Pattern } = {};
for (const effect of effects) {
  effectMap[effect.name] = effect;
}

export { effects, effectMap };
