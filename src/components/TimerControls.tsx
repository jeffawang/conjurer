import { observer } from "mobx-react-lite";
import { IconButton } from "@chakra-ui/react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from "react-icons/fa";
import { MAX_TIME } from "@/src/utils/time";
import { useStore } from "@/src/types/StoreContext";
import { action } from "mobx";

export default observer(function TimerControls() {
  const { timer } = useStore();

  return (
    <>
      <IconButton
        aria-label="Backward"
        height={6}
        icon={<FaStepBackward size={10} />}
        onClick={action(() => {
          timer.setTime(0);
        })}
      />
      <IconButton
        aria-label="Play"
        color={timer.playing ? "orange" : "green"}
        height={6}
        icon={timer.playing ? <FaPause size={10} /> : <FaPlay size={10} />}
        onClick={action(timer.togglePlaying)}
      />
      <IconButton
        aria-label="Forward"
        height={6}
        icon={<FaStepForward size={10} />}
        onClick={action(() => {
          timer.globalTime = MAX_TIME;
          timer.playing = false;
        })}
      />
    </>
  );
});
