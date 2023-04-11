import styles from "@/styles/Ruler.module.css";
import { observer } from "mobx-react-lite";
import { useStore } from "@/modules/common/types/StoreContext";

export default observer(function Ruler() {
  const { uiStore } = useStore();
  const { pixelsPerSecond } = uiStore;

  return (
    <svg width="1000" height="36">
      <defs>
        <pattern
          id="mix-editor-grid-pattern"
          x="0"
          y="0"
          width={`${pixelsPerSecond}`}
          height="36"
          patternUnits="userSpaceOnUse"
        >
          <rect width="0.5" height="3240" x="0" y="0" />
          <rect
            width="0.5"
            height="3240"
            x={`${pixelsPerSecond * 0.25}`}
            y="30"
          />
          <rect
            width="0.5"
            height="3240"
            x={`${pixelsPerSecond * 0.5}`}
            y="30"
          />
          <rect
            width="0.5"
            height="3240"
            x={`${pixelsPerSecond * 0.75}`}
            y="30"
          />
        </pattern>
      </defs>

      {Array.from({ length: 60 }).map((_, i) => (
        <text
          key={i}
          className={styles.rulerText}
          x={i * pixelsPerSecond + 3}
          y="12"
        >
          {i % 60}
        </text>
      ))}
      <rect
        fill="url(#mix-editor-grid-pattern)"
        x="0"
        y="0"
        width="1000"
        height="36"
      />
    </svg>
  );
});
