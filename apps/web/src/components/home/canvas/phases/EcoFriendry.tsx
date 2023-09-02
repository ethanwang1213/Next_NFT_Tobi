import { a, SpringValue, to, useSpring } from "@react-spring/three";
import { useMemo, useState } from "react";
import useHomePlaneSize from "@/hooks/useHomePlaneSize";
import getImgSrc from "@/methods/home/getImgSrc";
import { useWindowSize } from "ui";
import ImageModel from "../imageModel/ImageModel";

type Props = {
  starts: {
    sv: SpringValue<number>;
  }[];
  ends: {
    ev: SpringValue<number>;
  }[];
  // t5_2: SpringValue<number>;
};

const magni = 4;

type EcoData = {
  src: string;
  scale: number;
  z: number;
};

type SrcDataType = {
  pc: EcoData[];
  sp: EcoData[];
};

const sourceData: SrcDataType = {
  pc: [
    {
      src: "frame1",
      z: -99,
      scale: 0,
    },
    {
      src: "1",
      z: -100,
      scale: 0,
    },
    {
      src: "2",
      z: -300,
      scale: 1,
    },
    {
      src: "3",
      z: -310,
      scale: 1.2,
    },
    {
      src: "tree1",
      z: -500,
      scale: 1.3,
    },
    {
      src: "tree2",
      z: -600,
      scale: 1.44,
    },
    {
      src: "4",
      z: -700,
      scale: 1.4,
    },
    {
      src: "5",
      z: -720,
      scale: 1.4,
    },
    {
      src: "tree3",
      z: -850,
      scale: 1.48,
    },
    {
      src: "6",
      z: -900,
      scale: 1.7,
    },
  ],
  sp: [
    {
      src: "frame1",
      z: -100,
      scale: 0,
    },
    {
      src: "1",
      z: -100,
      scale: 0,
    },
    {
      src: "2",
      z: -300,
      scale: 1,
    },
    {
      src: "3",
      z: -310,
      scale: 1.2,
    },
    {
      src: "tree1",
      z: -500,
      scale: 4,
    },
    {
      src: "tree2",
      z: -600,
      scale: 5,
    },
    {
      src: "4",
      z: -700,
      scale: 4,
    },
    {
      src: "5",
      z: -700,
      scale: 4,
    },
    {
      src: "tree3",
      z: -850,
      scale: 4,
    },
    {
      src: "6",
      z: -900,
      scale: 4,
    },
  ],
};

/**
 * top5「環境への配慮」での背景表示
 */
const EcoPhase = ({ starts, ends }: Props) => {
  const { planeWidth, planeHeight, isSet } = useHomePlaneSize();
  const { displayWidth, displayHeight, isWide } = useWindowSize();

  const AImageModel = useMemo(() => a(ImageModel), []);
  const device = isWide ? "pc" : "sp";
  const magni = 4;
  const yOffset = 40;

  // 森林ざわざわ
  const [reverse51, setReverse51] = useState(false);
  const { t5_2 } = useSpring({
    from: { t5_2: 0 },
    to: { t5_2: 1 },
    reverse: reverse51,
    config: {
      friction: 80,
      mass: 800,
      decay: false,
      duration: 8000,
    },
    onResolve: () => {
      setReverse51(!reverse51);
    },
  });
  // console.log(t5_2)

  if (!isSet) {
    // スマホ読み込みさせない
    return <></>;
  }
  return (
    <>
      {ends.map(({ ev }, i) => {
        const { sv } = starts[i];
        const srcData = sourceData[device][i];

        const srcW = 2048;
        const srcH = 2048;
        const originalW = 1919;
        const originalH = 2090;
        const srcWRatio = srcW / originalW;
        const originalAspect = originalW / originalH;
        const innerAspect = displayWidth / innerHeight;
        let w =
          innerAspect < originalAspect
            ? innerHeight * originalAspect
            : displayWidth;
        w *= srcWRatio + 0.2;
        let h =
          innerAspect < originalAspect
            ? innerHeight
            : displayWidth / originalAspect;
        h *= 1 + 0.2;
        // const w = isWide ? planeWidth : (1920 * planeHeight) / 2092;
        // const h = isWide ? (2092 * planeWidth) / 1920 : planeHeight;
        if (i === 0) {
          w *= 1.98;
          h *= 1.98;
        }

        let rotZ;
        if (srcData.src === "1") {
          rotZ = t5_2
            .to([0, 0.2, 0.8, 1], [-0.4, 0, 0.3, 0.8])
            .to((v) => (0.04 / Math.PI) * v);
        } else if (srcData.src === "2") {
          rotZ = t5_2
            .to([0, 0.2, 0.8, 1], [0, 0, -0.5, -0.8])
            .to((v) => -(0.05 / Math.PI) * v);
        } else if (srcData.src === "3") {
          rotZ = t5_2
            .to([0, 0.2, 0.8, 1], [-0.2, 0, 0.4, -0.2])
            .to((v) => -(0.03 / Math.PI) * v);
        } else {
          rotZ = 0;
        }

        if (!isSet) {
          return <></>;
        }
        return (
          <AImageModel
            key={srcData.src}
            src={getImgSrc(5, `${srcData.src}`, true)} // 素材が変わらないので第三引数isPcはtrue
            width={to(
              [ev, sv.to([0, 1], [0.8, 1])],
              (v1, v2) =>
                w * (1 + (magni + srcData.scale) * v1 * v1 * 20) * v2 * v2
            )}
            height={to(
              [ev, sv.to([0, 1], [0.8, 1])],
              (v1, v2) =>
                h * (1 + (magni + srcData.scale) * v1 * v1 * 20) * v2 * v2
            )}
            x={isWide ? -2 : 20}
            y={ev.to((v) => (h * ((magni + srcData.scale) * v * v * 20)) / 20)}
            z={to(
              [ev, sv],
              (v1, v2) => -100 + srcData.z + v1 * v1 * i * 100 + (-60 + v2 * 60)
            )}
            rotZ={rotZ}
            opacity={sv.to([0, 0.1, 1], [0, 1, 1]).to((v) => v)}
            useLambertMaterial
          />
        );
      })}
    </>
  );
};

export default EcoPhase;
