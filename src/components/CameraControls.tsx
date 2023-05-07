import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { PerspectiveCamera as PerspectiveCameraThree, Vector3 } from "three";
import { memo, useRef } from "react";

export const CameraControls = memo(function CameraControls() {
  const cameraRef = useRef<PerspectiveCameraThree>();
  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={new Vector3(0, 0, 20)}
      />
      <OrbitControls camera={cameraRef.current} />
    </>
  );
});
