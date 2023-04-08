import { useStore } from "@/modules/common/types/StoreContext";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

export default observer(function KeyboardListener() {
  const store = useStore();
  const { timer } = store;

  useEffect(() => {
    const handleKeyDown = action((e: KeyboardEvent) => {
      if (e.key === " ") timer.togglePlaying();
      else if (e.key === "ArrowLeft") timer.globalTime -= 0.2;
      else if (e.key === "ArrowRight") timer.globalTime += 0.2;
      // else if (e.key === "c" && e.ctrlKey) store.copyBlocks();
      // else if (e.key === "v" && e.ctrlKey) store.pasteBlocks();
      // else if (e.key === "z" && e.ctrlKey) store.undo();
      // else if (e.key === "y" && e.ctrlKey) store.redo();
      else if (e.key === "a" && (e.ctrlKey || e.metaKey)) {
        store.selectAllBlocks();
        e.preventDefault();
      } else if (e.key === "Escape") store.deselectAllBlocks();
      else if (e.key === "Delete" || e.key === "Backspace")
        store.deleteSelectedBlocks();
    });
    window.addEventListener("keydown", handleKeyDown);

    const handleCopy = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      store.copyBlocks(e.clipboardData);
      e.preventDefault();
    };
    window.addEventListener("copy", handleCopy);

    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      store.pasteBlocks(e.clipboardData);
      e.preventDefault();
    };
    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("copy", handleCopy);
      window.removeEventListener("paste", handlePaste);
    };
  }, [store, timer]);

  return null;
});
