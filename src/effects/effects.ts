import ColorTint from "@/src/effects/ColorTint";
import Pattern from "@/src/types/Pattern";

const effects: Pattern[] = [ColorTint()];

const effectMap: { [key: string]: Pattern } = {};
for (const effect of effects) {
  effectMap[effect.name] = effect;
}

export { effects, effectMap };
