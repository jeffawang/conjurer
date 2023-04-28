import Pattern from "@/src/types/Pattern";
import cartesianProjection from "./shaders/cartesianProjection.frag";

type CartesianProjectionParams = {};

const CartesianProjection = () =>
  new Pattern<CartesianProjectionParams>(
    "Cartesian Projection",
    cartesianProjection,
    {}
  );

export default CartesianProjection;
