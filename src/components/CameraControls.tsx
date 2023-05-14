import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { PerspectiveCamera as PerspectiveCameraThree, Vector3 } from "three";
import { memo, useRef } from "react";

type CameraControlsProps = {
  initialPosition?: Vector3;
};

export const CameraControls = memo(function CameraControls({
  initialPosition = new Vector3(0, 0, 20),
}: CameraControlsProps) {
  const cameraRef = useRef<PerspectiveCameraThree>();
  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={initialPosition}
      />
      <OrbitControls camera={cameraRef.current} />
    </>
  );
});
