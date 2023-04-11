import { observer } from "mobx-react-lite";
import TimelineBlock from "@/src/components/TimelineBlock";
import { useStore } from "@/src/types/StoreContext";

export default observer(function LayerBlocks() {
  const { blocks } = useStore();

  return (
    <>
      {blocks.map((block) => (
        <TimelineBlock key={block.id} block={block} />
      ))}
    </>
  );
});
