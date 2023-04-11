import { observer } from "mobx-react-lite";
import { IconButton } from "@chakra-ui/react";
import { RiZoomInLine, RiZoomOutLine } from "react-icons/ri";
import { useStore } from "@/modules/common/types/StoreContext";
import { action } from "mobx";

export default observer(function TimerControls() {
  const { uiStore } = useStore();

  return (
    <>
      <IconButton
        aria-label="Zoom in"
        height={6}
        icon={<RiZoomInLine size={17} />}
        onClick={action(() => uiStore.zoomIn())}
      />
      <IconButton
        aria-label="Zoom out"
        height={6}
        icon={<RiZoomOutLine size={17} />}
        onClick={action(() => uiStore.zoomOut())}
      />
    </>
  );
});
