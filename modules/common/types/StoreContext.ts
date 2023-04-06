import Store from "@/modules/common/types/Store";
import { createContext } from "react";

// Keep this in its own file so that it is not refreshed upon a next fast refresh
const StoreContext = createContext<Store>(new Store());

export default StoreContext;
