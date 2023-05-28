import { a, SpringValue, to } from "@react-spring/web";
import { useFrame } from "@react-three/fiber";
import { useMemo, useState } from "react";
import getHomePlaneSize from "@/hooks/getHomePlaneSize";
import getImgSrc from "@/methods/home/getImgSrc";
import useHomeStore from "@/stores/homeStore";
import ImageModel from "../imageModel/ImageModel";

type Props = {
  starts: {
    sv: SpringValue<number>;
  }[];
  // t4_1s: {
  //   t4_1: SpringValue<number>;
  // }[];
  ends: {
    ev: SpringValue<number>;
  }[];
};

type InkData = {
  src: string;
  scale: number;
  x: number;
  rotZ: number;
};

type SrcDataType = {
  pc: InkData[];
  sp: InkData[];
};

const sourceData: SrcDataType = {
  pc: [
    {
      src: "white1",
      scale: 2,
      x: 0,
      rotZ: 0.5,
    },
    {
      src: "white2",
      scale: 1.7,
      x: 0,
      rotZ: -0.5,
    },
    {
      src: "blue",
      scale: 1.2,
      x: 50,
      rotZ: 0.6,
    },
    {
      src: "green",

      scale: 1.1,
      x: 0,
      rotZ: -0.7,
    },
    {
      src: "yellow",
      scale: 1.2,
      x: 0,
      rotZ: 0.9,
    },
    {
      src: "purple",
      scale: 1,
      x: 0,
      rotZ: -1.1,
    },
    {
      src: "orange",
      scale: 1,
      x: 0,
      rotZ: 1.3,
    },
    {
      src: "red",
      scale: 1,
      x: 0,
      rotZ: -1.4,
    },
    {
      src: "mix",
      scale: 1,
      x: 0,
      rotZ: 1.5,
    },
    {
      src: "white3",
      scale: 1.4,
      x: 0,
      rotZ: 1.5,
    },
  ],
  sp: [
    {
      src: "white1",
      scale: 2,
      x: 0,
      rotZ: 0.5,
    },
    {
      src: "white2",
      scale: 1.7,
      x: 0,
      rotZ: -0.5,
    },
    {
      src: "blue",
      scale: 1.2,
      x: 50,
      rotZ: 0.6,
    },
    {
      src: "green",

      scale: 1.1,
      x: 0,
      rotZ: -0.7,
    },
    {
      src: "yellow",
      scale: 1.2,
      x: 0,
      rotZ: 0.9,
    },
    {
      src: "purple",
      scale: 1,
      x: 0,
      rotZ: -1.1,
    },
    {
      src: "orange",
      scale: 1,
      x: 0,
      rotZ: 1.3,
    },
    {
      src: "red",
      scale: 1,
      x: 0,
      rotZ: -1.4,
    },
    {
      src: "mix",
      scale: 1,
      x: 0,
      rotZ: 1.5,
    },
    {
      src: "white3",
      scale: 1.4,
      x: 0,
      rotZ: 1.5,
    },
  ],
};

// const imageData = {
//   pc: { x: 70, y: -80, scale: 1.1 },
//   sp: { x: 40, y: 0, scale: 1.0 }
// }

/**
 * top4「クリエイターのために」での背景表示
 */
const FreedomPhase = ({ starts, ends }: Props) => {
  const homePhase = useHomeStore((state) => state.homePhase);
  const { planeWidth, planeHeight, isWideMode, isSet } = getHomePlaneSize();
  const AImageModel = useMemo(() => a(ImageModel), []);
  const device = isWideMode ? "pc" : "sp";
  // const imgData = imageData[device()]
  const w = isWideMode ? planeWidth : planeHeight;
  const h = isWideMode ? planeWidth : planeHeight;

  // インクの回転
  const [rotZ, setRotZ] = useState(0);
  useFrame(({ clock }) => {
    if (
      homePhase === "ENJOY_TO_FREE" ||
      homePhase === "FREEDOM" ||
      homePhase === "FREE_TO_ECO"
    ) {
      const newValue = clock.getElapsedTime() / 18;
      setRotZ(newValue);
    }
  });

  if (!isSet) {
    // スマホ読み込みさせない
    return <></>;
  }
  return (
    <>
      {ends.map(({ ev }, i) => {
        const { sv } = starts[i];
        const srcData = sourceData[device][i];
        return (
          <AImageModel
            key={srcData.src}
            src={getImgSrc(4, `${srcData.src}`, true)} // 素材が変わらないので第三引数isPCはtrue
            width={to(
              [ev, sv.to([0, 1], [0.8, 1])],
              (v1, v2) =>
                planeHeight * (1 + v1 * v1 * 40) * srcData.scale * (v2 * v2)
            )}
            height={to(
              [ev, sv.to([0, 1], [0.8, 1])],
              (v1, v2) =>
                planeHeight * (1 + v1 * v1 * 40) * srcData.scale * (v2 * v2)
            )}
            x={srcData.x}
            y={0}
            z={to(
              [ev, sv],
              (v1, v2) =>
                -500 + i * -100 + v1 * v1 * i * 500 + (-100 + v2 * v2 * 100)
            )}
            rotZ={rotZ * srcData.rotZ}
            opacity={sv.to((v) => v)}
            useLambertMaterial
          />
        );
      })}
    </>
  );
};

export default FreedomPhase;
