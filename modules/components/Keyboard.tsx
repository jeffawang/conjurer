import { useStore } from "@/modules/common/types/StoreContext";
import { Text, VStack } from "@chakra-ui/react";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

export default observer(function Keyboard() {
  const store = useStore();
  const { timer } = store;

  useEffect(() => {
    const handleKeyDown = action((e: KeyboardEvent) => {
      if (e.key === " ") {
        timer.togglePlaying();
        e.preventDefault();
      } else if (e.key === "ArrowLeft") timer.globalTime -= 0.2;
      else if (e.key === "ArrowRight") timer.globalTime += 0.2;
      // else if (e.key === "c" && e.ctrlKey) store.copyBlocks();
      // else if (e.key === "v" && e.ctrlKey) store.pasteBlocks();
      // else if (e.key === "z" && e.ctrlKey) store.undo();
      // else if (e.key === "y" && e.ctrlKey) store.redo();
      else if (e.key === "a" && (e.ctrlKey || e.metaKey)) {
        store.selectAllBlocks();
        e.preventDefault();
      } else if (e.key === "Escape") store.deselectAllBlocks();
      if (e.key === "Delete" || e.key === "Backspace")
        store.deleteSelectedBlocks();
      else if (e.key === "d" && (e.ctrlKey || e.metaKey)) {
        store.duplicateBlocks();
        e.preventDefault();
      }
    });
    window.addEventListener("keydown", handleKeyDown);

    const handleCopy = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      store.copyBlocksToClipboard(e.clipboardData);
      e.preventDefault();
    };
    window.addEventListener("copy", handleCopy);

    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      store.pasteBlocksFromClipboard(e.clipboardData);
      e.preventDefault();
    };
    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("copy", handleCopy);
      window.removeEventListener("paste", handlePaste);
    };
  }, [store, timer]);

  return (
    <VStack justifyContent="center">
      <Text userSelect="none">spacebar: play/pause</Text>
      <Text userSelect="none">←/→: scan backward/forward</Text>
      <Text userSelect="none">cmd+c: copy block(s)</Text>
      <Text userSelect="none">cmd+v: paste block(s)</Text>
      <Text userSelect="none">cmd+d: duplicate block(s)</Text>
      <Text userSelect="none">cmd+a: select all blocks</Text>
      <Text userSelect="none">delete: delete selected block(s)</Text>
      {/* <Text>cmd+z: undo</Text> */}
      {/* <Text>cmd+shift+z: redo</Text> */}
    </VStack>
  );
});
