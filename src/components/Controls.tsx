import { observer } from "mobx-react-lite";
import { IconButton } from "@chakra-ui/react";
import { RiZoomInLine, RiZoomOutLine } from "react-icons/ri";
import { BsSoundwave, BsGearFill } from "react-icons/bs";
import { AiOutlineLineChart } from "react-icons/ai";
import { useStore } from "@/src/types/StoreContext";
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
      <IconButton
        aria-label="Toggle waveform style"
        height={6}
        icon={<BsSoundwave size={17} />}
        onClick={action(() => uiStore.toggleWavesurfer())}
      />
      <IconButton
        aria-label="Toggle performance"
        height={6}
        icon={<AiOutlineLineChart size={17} />}
        onClick={action(() => uiStore.togglePerformance())}
      />
      <IconButton
        aria-label="Settings"
        height={6}
        icon={<BsGearFill size={17} />}
        onClick={action(() => {
          // TODO
        })}
      />
    </>
  );
});
