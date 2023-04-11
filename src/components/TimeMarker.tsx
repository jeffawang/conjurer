import { observer } from "mobx-react-lite";
import { Box } from "@chakra-ui/react";
import { FaLongArrowAltDown } from "react-icons/fa";
import { useStore } from "@/src/types/StoreContext";
import styles from "@/styles/TimeMarker.module.css";
import classNames from "classnames";

export default observer(function TimeMarker() {
  const { timer, uiStore } = useStore();

  // TODO: renders every frame. need to optimize this
  return (
    <Box
      position="absolute"
      top={0}
      // className={classNames(styles.marker, { [styles.playing]: timer.playing })}
      transform={`translateX(${uiStore.timeToXPixels(timer.globalTime)})`}
      willChange="transform"
      overflowY="visible"
      zIndex={1}
    >
      <FaLongArrowAltDown
        style={{ position: "absolute", top: "8px", left: "-12px" }}
        size={25}
        color="red"
      />
      <Box
        position="absolute"
        top="35px"
        bgColor="red"
        width="1px"
        height="200px"
        zIndex={1}
      />
    </Box>
  );
});
