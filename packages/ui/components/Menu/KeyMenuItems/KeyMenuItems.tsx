import { useRef, useState, useEffect, ReactNode } from "react";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { Canvas } from "@react-three/fiber";
import CameraController from "./CameraController";
import KeyObject from "./KeyObject";
import { menuItem } from "../assets/menuItems";
import { gsap } from "gsap";

type Props = {
  initHomeStates?: () => void;
};

/**
 * 鍵のメニューを表示するコンポーネント
 * @param param0
 * @returns
 */
const KeyMenuItems: React.FC<Props> = ({ initHomeStates }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { length } = menuItem.map((item) => item.show).filter((item) => item);
  const [rotate, setRotate] = useState<number>(0);
  const [downX, setDownX] = useState<number | null>(null);

  const { isWide } = useWindowSize();
  const loop = isWide ? 4 : 2;
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

  // 自動で定位置まで移動
  useEffect(() => {
    if (!downX) {
      const value = { value: rotate };
      const per = 360 / (length * loop);
      const goal =
        Math.round((rotate % 360) / per) * per + Math.trunc(rotate / 360) * 360;
      gsap.to(value, {
        value: goal,
        duration: 0.2,
        onUpdate() {
          setRotate(value.value);
        },
      });
    }
  }, [downX]);

  // メニュー項目の鍵を一周分追加する
  const createOneLoop = (loop: number, id: number) =>
    menuItem
      .filter((item) => item.show)
      .map(
        (item, index) =>
          item.show && (
            <KeyObject
              item={{
                name: item.name,
                keyImage: item.keyImage,
                loadImage: item.loadImage,
                link: item.link,
              }}
              index={length * id + index}
              length={length * loop}
              rotate={rotate}
              setRotate={setRotate}
              key={item.name}
              initHomeStates={initHomeStates}
            />
          )
      );

  // メニュー項目の鍵を「項目数 x ループ数」生成する
  const getMenuItems = () => {
    const res: ReactNode[] = [];

    Array(loop)
      .fill(0)
      .map((v, i) => {
        // console.log(v, i)
        res.push(createOneLoop(loop, i));
      });
    return res;
  };

  return (
    <div className="w-full h-full" ref={canvasRef}>
      <Canvas
        className="z-0"
        camera={{
          fov: 100,
          position: [0, isWide ? 0 : 1, isWide ? 17 : 13],
        }}
        dpr={1}
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
        {getMenuItems()}
      </Canvas>
    </div>
  );
};

export default KeyMenuItems;
