import { useStore } from "@/src/types/StoreContext";
import { useCallback, useEffect } from "react";

export default function useWheelZooming(element: HTMLElement | null) {
  const { uiStore } = useStore();

  const wheelZooming = useCallback(
    (e: WheelEvent) => {
      // If scrolling horizontally, don't zoom
      if (e.deltaX > 1 || e.deltaX < -1) return;

      if (e.deltaY > 1) {
        uiStore.zoomOut();
        e.preventDefault();
      } else if (e.deltaY < -1) {
        uiStore.zoomIn();
        e.preventDefault();
      }
    },
    [uiStore]
  );

  useEffect(() => {
    element?.addEventListener("wheel", wheelZooming);
    return () => {
      element?.removeEventListener("wheel", wheelZooming);
    };
  }, [wheelZooming, element]);
}
