import { IconButton, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/types/StoreContext";
import { action } from "mobx";
import { FaDotCircle } from "react-icons/fa";
import { TbRectangleFilled } from "react-icons/tb";
import { AiOutlineLineChart } from "react-icons/ai";

export const DisplayControls = observer(function DisplayControls() {
  const { uiStore } = useStore();
  return (
    <VStack p={2} position="absolute" top={0} left={0} zIndex={1}>
      <IconButton
        aria-label="Toggle canopy view"
        title="Toggle canopy view"
        height={6}
        icon={
          uiStore.displayingCanopy ? (
            <TbRectangleFilled size={17} />
          ) : (
            <FaDotCircle size={17} />
          )
        }
        onClick={action(() => uiStore.toggleCanopyDisplay())}
      />
      <IconButton
        aria-label="Toggle performance"
        title="Toggle performance"
        height={6}
        icon={<AiOutlineLineChart size={17} />}
        onClick={action(() => uiStore.togglePerformance())}
      />
    </VStack>
  );
});
