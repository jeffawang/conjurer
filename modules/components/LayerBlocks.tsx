import { observer } from "mobx-react-lite";
import TimelineBlock from "@/modules/components/TimelineBlock";
import { useStore } from "@/modules/common/types/StoreContext";

export default observer(function LayerBlocks() {
  const { blocks } = useStore();

  return (
    <>
      {blocks.map((block, index) => (
        <TimelineBlock key={index} block={block} />
      ))}
    </>
  );
});
