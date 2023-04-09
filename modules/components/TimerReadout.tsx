import { observer } from "mobx-react-lite";
import { Text } from "@chakra-ui/react";
import { useStore } from "@/modules/common/types/StoreContext";

// Display the time in minutes and seconds: 00:00.00
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds.toFixed(2)}`;
};

export default observer(function TimerReadout() {
  const { timer } = useStore();

  return (
    <Text
      position="absolute"
      left={1}
      fontSize={17}
      bgColor="gray.500"
      color="black"
      userSelect="none"
      lineHeight={1.2}
    >
      {formatTime(timer.globalTime)}
    </Text>
  );
});
