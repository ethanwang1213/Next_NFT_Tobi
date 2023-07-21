import { useRef, useState } from "react";
import { useWindowSize } from "../../../../hooks/useWindowSize";
import { Canvas } from "@react-three/fiber";
import CameraController from "./CameraController";
import Keyholes from "./Keyholes/Keyholes";
import { useCanvasDprContext } from "../../../../contexts/canvasDprContext";

type Props = {
  basePath: string;
  initHomeStates?: () => void;
};

/**
 * 鍵のメニューを表示するコンポーネント
 * @param param0
 * @returns
 */
const KeyholeMenuCanvas: React.FC<Props> = ({ basePath, initHomeStates }) => {
  const { dpr } = useCanvasDprContext();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState<number>(0);
  const [downX, setDownX] = useState<number | null>(null);
  const { isWide } = useWindowSize();
  const rotSpeed = isWide ? 0.13 : 0.4;

  // マウス/タッチイベントの処理
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX } = e;
    setDownX(clientX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (downX) {
      const { clientX } = e;
      const diff = clientX - downX;
      setRotate(rotate + diff * rotSpeed);
      setDownX(clientX);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const { clientX } = e.touches[0];
    setDownX(clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (downX) {
      const { clientX } = e.touches[0];
      const diff = clientX - downX;
      setRotate(rotate + diff * rotSpeed);
      setDownX(clientX);
    }
  };

  const handleUp = () => {
    setDownX(null);
  };

  return (
    <div className="w-full h-full" ref={canvasRef}>
      <Canvas
        className="z-0"
        camera={{
          fov: 100,
          position: [0, isWide ? 0 : 1, isWide ? 17 : 13],
        }}
        dpr={dpr ? dpr : 0.5}
        frameloop="demand"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleUp}
      >
        <fog
          attach="fog"
          color="#1e293b"
          near={isWide ? 2 : 10}
          far={isWide ? 9 : 14}
        />
        <ambientLight />
        <CameraController />
        <Keyholes
          basePath={basePath}
          rotate={rotate}
          downX={downX}
          setRotate={setRotate}
          initHomeStates={initHomeStates}
        />
      </Canvas>
    </div>
  );
};

export default KeyholeMenuCanvas;
