import { Vector4 } from "three";

export const vector4ToColor = (v: Vector4) => {
  const r = Math.floor(v.x * 255);
  const g = Math.floor(v.y * 255);
  const b = Math.floor(v.z * 255);
  const a = Math.floor(v.w * 255);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
