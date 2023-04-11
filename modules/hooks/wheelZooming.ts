import { useStore } from "@/modules/common/types/StoreContext";
import { useCallback, useEffect } from "react";

export default function useWheelZooming(element: HTMLElement | null) {
  const { uiStore } = useStore();

  // TODO: fix zooming on trackpads
  const wheelZooming = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        uiStore.zoomOut();
      } else {
        uiStore.zoomIn();
      }
    },
    [uiStore],
  );

  useEffect(() => {
    element?.addEventListener("wheel", wheelZooming);
    return () => {
      element?.removeEventListener("wheel", wheelZooming);
    };
  }, [wheelZooming, element]);
}
