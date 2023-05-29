import {
  OrbitControls,
  OrthographicCamera,
  PerformanceMonitor,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { BasicShadowMap } from "three";
import useHomePlaneSize from "@/hooks/useHomePlaneSize";
import useHomeStore from "@/stores/homeStore";
import AnimationContainer from "./AnimationContainer";
import EndPhaseVideo from "./phases/EndPhaseVideo";
import { CanvasDprContext } from "@/context/canvasDpr";
import { useContext } from "react";

const HomeCanvas = () => {
  const debugMode = useHomeStore((state) => state.debugMode);

  const { planeWidth, planeHeight } = useHomePlaneSize();

  // dprの取得
  const { dpr, setMonitorFactor } = useContext(CanvasDprContext);

  return (
    <>
      <div className="w-full h-full">
        <Canvas shadows={{ type: BasicShadowMap }} dpr={dpr} flat>
          <PerformanceMonitor
            onChange={({ factor }) => {
              console.log("factor: " + factor);
              setMonitorFactor(factor);
              // round((0.3 + 0.7 * factor) * window.devicePixelRatio, 1)
            }}
          />
          <OrthographicCamera makeDefault position={[0, 0, 500]} />
          {debugMode ? <OrbitControls /> : <OrbitControls enabled={false} />}
          <AnimationContainer
            planeWidth={planeWidth}
            planeHeight={planeHeight}
          />
        </Canvas>
      </div>
      <EndPhaseVideo />
    </>
  );
};

export default HomeCanvas;
