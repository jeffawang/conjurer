import { PIXELS_PER_SECOND } from "@/modules/common/utils/time";

const Ruler = () => (
  <svg width="1000" height="36">
    <defs>
      <pattern
        id="mix-editor-grid-pattern"
        x="0"
        y="0"
        width={`${PIXELS_PER_SECOND}`}
        height="36"
        patternUnits="userSpaceOnUse"
      >
        <rect width="0.5" height="3240" x="0" y="0" />
        <rect
          width="0.5"
          height="3240"
          x={`${PIXELS_PER_SECOND * 0.25}`}
          y="30"
        />
        <rect
          width="0.5"
          height="3240"
          x={`${PIXELS_PER_SECOND * 0.5}`}
          y="30"
        />
        <rect
          width="0.5"
          height="3240"
          x={`${PIXELS_PER_SECOND * 0.75}`}
          y="30"
        />
      </pattern>
    </defs>
    <rect
      fill="url(#mix-editor-grid-pattern)"
      x="0"
      y="0"
      width="1000"
      height="36"
    />
  </svg>
);

export default Ruler;
