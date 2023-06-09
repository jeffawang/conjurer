import { observer } from "mobx-react-lite";
import { Text, VStack } from "@chakra-ui/react";
import { useStore } from "@/src/types/StoreContext";

// Display the time in minutes and seconds: 00:00.0
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds.toFixed(1)}`;
};

export const TimerReadout = observer(function TimerReadout() {
  const { timer } = useStore();

  return (
    <VStack pl={2} justify="center" width="100px">
      <Text color="gray.200" textAlign="center" fontSize={18} userSelect="none">
        {formatTime(timer.globalTimeRounded)}
      </Text>
    </VStack>
  );
});
