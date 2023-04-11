import Store from "@/src/types/Store";
import { createContext, useContext } from "react";

// Keep this in its own file so that it is not refreshed upon a next fast refresh
const StoreContext = createContext<Store>(new Store());

const useStore = () => useContext(StoreContext);

export { useStore };
export default StoreContext;
