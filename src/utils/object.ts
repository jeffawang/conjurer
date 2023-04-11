export const clone = (orig: Object) =>
  Object.assign(Object.create(Object.getPrototypeOf(orig)), orig);
