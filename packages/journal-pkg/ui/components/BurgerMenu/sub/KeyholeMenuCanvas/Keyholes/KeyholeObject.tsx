import { Html, useTexture } from "@react-three/drei";
import { gsap } from "gsap";
import { useMenuAnimation } from "journal-pkg/contexts/menu/MenuAnimation";
import { useShowBurger } from "journal-pkg/contexts/menu/ShowBurger";
import { useLocatingAcrossBasePath, useWindowSize } from "journal-pkg/hooks";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";

type Props = {
  keyholeNodes: any;
  item: {
    name: string;
    keyImage: string;
    loadImage: string;
    link: string;
  };
  index: number;
  length: number;
  rotate: number;
  setRotate: Dispatch<SetStateAction<number>>;
  initHomeStates?: () => void;
};

/**
 * メニューの鍵穴を生成するコンポーネント
 * @param param0
 * @returns
 */
export const KeyholeObject: React.FC<Props> = ({
  keyholeNodes,
  item,
  index,
  length,
  rotate,
  setRotate,
  initHomeStates,
}) => {
  const { setIsMenuOpen } = useShowBurger();

  const { name, keyImage, loadImage, link } = item;
  const texture = useTexture(`${keyImage}`);
  const [posZ, setPosZ] = useState<number>(0);
  const { setImageUrl, imageRef, setRequireFadeOut } = useMenuAnimation();
  const router = useRouter();
  const { pushLocation } = useLocatingAcrossBasePath();
  const [isClicking, setIsClicking] = useState<boolean>(false);
  const [isDraged, setIsDraged] = useState<boolean>(false);
  const { innerWidth, displayWidth, isWide, isVeryWide } = useWindowSize();

  const radian = ((360 / length) * index + rotate) * (Math.PI / 180) * 1.0;
  // const size = 9;
  const sizeX = isWide ? 9.0 : 6.0;
  const sizeZ = isWide ? 14.0 : 6.0;
  const posY = isWide ? 1.1 : 3.4;
  const scale = isWide ? 0.6 : 1.1;

  return (
    <>
      <mesh
        geometry={(keyholeNodes.Trace as any).geometry}
        rotation={[Math.PI / 2, 0, Math.PI]}
        position={[
          Math.sin(radian) * sizeX,
          isWide ? posY - posZ * 0.44 : posY - posZ * 0.5,
          Math.cos(radian) * sizeZ + posZ,
        ]}
        scale={scale}
        onPointerDown={() => {
          setIsClicking(true);
        }}
        onPointerMove={() => {
          if (isClicking) {
            setIsDraged(true);
          }
        }}
        onPointerUp={(e) => {
          setIsClicking(false);
          setIsDraged(false);
          if (!isDraged && isClicking) {
            if (Math.cos(radian) === 1) {
              e.stopPropagation();
              setImageUrl(loadImage);
              const value = { value: posZ };
              gsap
                .timeline()
                .set(imageRef.current, {
                  opacity: 0,
                  display: "block",
                  pointerEvents: "auto",
                })
                // 鍵穴のアニメーション
                .to(value, {
                  value: isWide ? 3 : 5,
                  duration: 0.6,
                  onUpdate() {
                    setPosZ(value.value);
                  },
                  ease: "power3.in",
                })
                // 全体に広がる画像のアニメーション
                .fromTo(
                  imageRef.current,
                  { scale: 0.7, opacity: 1 },
                  { scale: 1, duration: 0.3, ease: "power3.out" },
                  "-=0.05",
                )
                // 拡大終了後
                .add(() => {
                  setIsMenuOpen(false);

                  if (router.pathname === "/" && !!initHomeStates) {
                    initHomeStates();
                  }
                  setRequireFadeOut(name);
                  pushLocation(link);
                  setPosZ(0);
                });
              // .to(imageRef.current, { opacity: 0, duration: 0.5 }, "+=1")
              // .set(imageRef.current, { display: "none" });
            } else {
              e.stopPropagation();
              const displayX = e.clientX - (innerWidth - displayWidth) / 2;
              if (displayWidth / 2 > displayX) {
                setRotate(rotate + (360 / length) * 0.51);
              } else {
                setRotate(rotate - (360 / length) * 0.51);
              }
            }
          }
        }}
      >
        <meshBasicMaterial attach="material" map={texture} />
      </mesh>
      <Html
        occlude
        position={[
          Math.sin(radian) * sizeX,
          isWide ? -2.0 - posZ * 1.1 + posY : -0.2 - posZ * 0.8,
          Math.cos(radian) * sizeZ,
        ]}
        scale={isWide ? 0.4 : 0.8}
        transform={!isVeryWide}
        center
      >
        <div className="relative w-56 h-10">
          <p
            className="w-56 text-white text-[20px] sm:text-2xl font-['tachyon'] text-center select-none"
            style={{
              // Htmlのテキストはfogの影響を受けないので、別途薄くする
              opacity: isVeryWide
                ? (Math.cos(radian) - 0.9) * 8
                : isWide
                  ? (Math.cos(radian) - 0.7) * (0.7 / 0.3) // 三角関数で考えて決めたはずだがマジックナンバー化してしまった...toruto
                  : (Math.cos(radian) - 0.3) * (1 / 0.3),
            }}
          >
            {name}
          </p>
        </div>
      </Html>
    </>
  );
};
