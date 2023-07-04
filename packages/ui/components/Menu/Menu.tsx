/* eslint-disable react/no-unknown-property */
import React, {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { gsap } from "gsap";
import { useRouter } from "next/router";
import menuItem from "@/data/menu.json";
import useWindowSize from "@/hooks/useWindowSize";
import KeyObject from "./KeyObject";
import CameraController from "./CameraController";
import MenuFooter from "./MenuFooter";
import CloseButton from "./CloseButton";
import useHomeStore from "@/stores/homeStore";
import { CanvasDprContext } from "@/context/canvasDpr";

type menuProps = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
};

const Menu: FC<menuProps> = ({ isOpen, setOpen, isVisible, setIsVisible }) => {
  const homeInitStates = useHomeStore((state) => state.initStates);

  const [rotate, setRotate] = useState<number>(0);
  const [downX, setDownX] = useState<number | null>(null);
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { isWide } = useWindowSize();

  const { length } = menuItem.map((item) => item.show).filter((item) => item);
  const loop = isWide ? 4 : 2;
  const rotSpeed = isWide ? 0.13 : 0.4;

  const { displayWidth } = useWindowSize();

  const [isAnimatedOpen, setIsAnimatedOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

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

  useEffect(() => {
    if (isOpen) {
      gsap
        .fromTo(
          menuRef.current,
          {
            x: `${displayWidth}px`,
          },
          {
            x: "0px",
            duration: isAnimatedOpen ? 0 : 0.5,
          }
        )
        .then(() => {
          setIsAnimatedOpen(true);
        });
    } else {
      gsap
        .to(menuRef.current, {
          x: `${displayWidth}px`,
          duration: 0.5,
        })
        .then(() => {
          setIsVisible(false);
          setIsAnimatedOpen(false);
        });
    }
  }, [isOpen, displayWidth]);

  const menu = useMemo(
    () =>
      menuItem.map((item) => {
        if (item.menu) {
          return (
            <div key={item.name}>
              {item.click ? (
                <button
                  onClick={async () => {
                    await router.push(item.link);
                    setOpen(false);
                    if (item.name !== "HOME") {
                      homeInitStates();
                    }
                  }}
                  className="menu-bottom-link"
                >
                  {item.name}
                </button>
              ) : (
                <p className="menu-bottom-link-disabled">{item.name}</p>
              )}
            </div>
          );
        }
        return null;
      }),
    [menuItem]
  );

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
              setIsOpen={setOpen}
              key={item.name}
            />
          )
      );

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

  const { dpr } = useContext(CanvasDprContext);

  return (
    <>
      <CloseButton isOpen={isOpen} setOpen={setOpen} />
      <div
        className={`menu-container ${isVisible ? "" : "invisible"}`}
        ref={menuRef}
        style={{ transform: `translate(${displayWidth}px, 0px)` }}
        data-allowscroll="true"
      >
        <div className="menu-canvas-container" ref={canvasRef}>
          <Canvas
            className="z-0"
            camera={{
              fov: 100,
              position: [0, isWide ? 0 : 1, isWide ? 17 : 13],
            }}
            dpr={dpr}
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
        <div
          className="menu-bottom-container"
          // style={{
          //   height: displayHeight * 0.4,
          // }}
        >
          {menu}
          <MenuFooter />
        </div>
      </div>
    </>
  );
};

// モデルとテクスチャのpreload
useGLTF.preload("/loading/key.glb");
menuItem.forEach((item) => {
  if (item.show) {
    useTexture.preload(item.keyImage);
  }
});

export default Menu;
