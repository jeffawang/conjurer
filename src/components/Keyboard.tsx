import { useStore } from "@/src/types/StoreContext";
import { Text, VStack } from "@chakra-ui/react";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

export default observer(function Keyboard() {
  const store = useStore();
  const { timer, uiStore } = store;

  useEffect(() => {
    const handleKeyDown = action((e: KeyboardEvent) => {
      if (
        e.key === " " &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !e.shiftKey
      ) {
        timer.togglePlaying();
        e.preventDefault();
      } else if (e.key === "ArrowLeft") timer.skipBackward();
      else if (e.key === "ArrowRight") timer.skipForward();
      // else if (e.key === "z" && e.ctrlKey) store.undo();
      // else if (e.key === "y" && e.ctrlKey) store.redo();
      else if (e.key === "a" && (e.ctrlKey || e.metaKey)) {
        store.selectAllBlocks();
        e.preventDefault();
      } else if (e.key === "Escape") store.deselectAllBlocks();
      else if (e.key === "Delete" || e.key === "Backspace") {
        // TODO: triggers when trying to backspace a number in an input field, fix
        // store.deleteSelectedBlocks();
      } else if (e.key === "d" && (e.ctrlKey || e.metaKey)) {
        store.duplicateBlocks();
        e.preventDefault();
      } else if (e.key === "+" || e.key === "=") uiStore.zoomIn();
      else if (e.key === "-") uiStore.zoomOut();
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
  }, [store, timer, uiStore]);

  return (
    <VStack justifyContent="center">
      <Text fontSize={9} userSelect="none">
        spacebar: play/pause
      </Text>
      <Text fontSize={9} userSelect="none">
        ←/→: scan backward/forward
      </Text>
      <Text fontSize={9} userSelect="none">
        +/-: zoom in/out
      </Text>
      <Text fontSize={9} userSelect="none">
        cmd+c: copy block(s)
      </Text>
      <Text fontSize={9} userSelect="none">
        cmd+v: paste block(s)
      </Text>
      <Text fontSize={9} userSelect="none">
        cmd+d: duplicate block(s)
      </Text>
      <Text fontSize={9} userSelect="none">
        cmd+a: select all blocks
      </Text>
      <Text fontSize={9} userSelect="none">
        delete: delete selected block(s)
      </Text>
      {/* <Text>cmd+z: undo</Text> */}
      {/* <Text>cmd+shift+z: redo</Text> */}
    </VStack>
  );
});
