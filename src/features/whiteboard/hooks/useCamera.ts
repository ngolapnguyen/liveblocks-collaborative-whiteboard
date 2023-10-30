import { useCallback, useMemo, useRef, useState } from "react";
import { Camera } from "..";

export const useCamera = () => {
  const [camera, setCamera] = useState<Camera>({
    position: {
      x: 0,
      y: 0,
    },
  });
  const cameraRef = useRef(camera);
  cameraRef.current = camera;

  const onWheel = useCallback((e: React.WheelEvent) => {
    // Pan the camera based on the wheel delta
    setCamera((camera) => ({
      position: {
        x: camera.position.x - e.deltaX,
        y: camera.position.y - e.deltaY,
      },
    }));
  }, []);

  const cameraHandlers = useMemo(() => {
    return {
      onWheel,
    };
  }, [onWheel]);

  return {
    camera,
    setCamera,
    cameraRef,
    cameraHandlers,
  };
};
