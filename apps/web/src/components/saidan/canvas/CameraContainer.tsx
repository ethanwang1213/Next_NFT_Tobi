import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { a, config, useSpring } from "@react-spring/web";
import { useReducer, useEffect, useMemo, useState, RefObject } from "react";
import { Camera } from "three";
import useSaidanStore from "@/stores/saidanStore";
import useWindowSize from "@/hooks/useWindowSize";

type Props = {
  cameraRef: RefObject<Camera>;
};

const CameraContainer = ({ cameraRef }: Props) => {
  const tutorialPhase = useSaidanStore((state) => state.tutorialPhase);
  const proceedTutorial = useSaidanStore((state) => state.proceedTutorial);
  const isCameraMode = useSaidanStore((state) => state.isCameraMode);

  const [isCameraInit, completeCameraSetUp] = useReducer(() => true, false);
  const [{ camX, camY, camZ }, api] = useSpring(
    () => ({
      from: {
        camX: 0,
        camY: 8,
        camZ: -50,
      },
      to: {
        camX: 0,
        camY: 5,
        camZ: -10,
      },
      config: config.default,
      pause: true,
      delay: 100,
      onResolve: () => {
        completeCameraSetUp();
        proceedTutorial();
      },
    }),
    []
  );
  useEffect(() => {
    if (tutorialPhase === "ZOOM_UP") {
      if (isCameraInit) {
        proceedTutorial();
      } else {
        api.resume();
        api.start();
      }
    } else if (tutorialPhase === "END") {
      if (!isCameraInit) {
        api.resume();
        api.start();
      }
    }
  }, [tutorialPhase]);

  const { displayWidth, displayHeight } = useWindowSize();
  const [maxCameraDist, setMaxCameraDist] = useState(0);
  useEffect(() => {
    // displayWidthに収まるmaxDistanceの値から割り出したある程度の近似関数
    let newDist = 4500 / (displayWidth - 10) + 4;
    const min = 10;
    if (newDist < min) {
      newDist = min;
    }
    setMaxCameraDist(newDist);
  }, [displayWidth, displayHeight]);

  const ACamera = useMemo(() => a(PerspectiveCamera), []);

  return (
    <>
      <ACamera
        attach="camera"
        position-x={camX}
        position-y={camY}
        position-z={camZ}
        makeDefault
        ref={cameraRef}
      />
      <OrbitControls
        attach="orbitControls"
        enablePan={false}
        enableRotate={isCameraMode}
        rotateSpeed={0.3}
        enableZoom={isCameraMode}
        target={[0, 1.5, -2.0]}
        minDistance={6}
        maxDistance={isCameraInit ? maxCameraDist : 100}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(Math.PI * 1.6) / 3}
        minAzimuthAngle={(-Math.PI * 3.4) / 3}
        maxAzimuthAngle={(Math.PI * 3.4) / 3}
      />
      {/* <OrbitControls
            enablePan={isCameraMode}
            enableRotate={isCameraMode}
            enableZoom={isCameraMode}
        /> */}
    </>
  );
};

export default CameraContainer;
