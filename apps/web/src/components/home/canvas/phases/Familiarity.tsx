import { a, SpringValue, to, useSpring } from "@react-spring/three";
import { useMemo, useState } from "react";
import useHomePlaneSize from "@/hooks/useHomePlaneSize";
import getImgSrc from "@/methods/home/getImgSrc";
import { useWindowSize } from "hooks";
import ImageModel from "../imageModel/ImageModel";

type Props = {
  starts: {
    sv: SpringValue<number>;
  }[];
  ends: {
    ev: SpringValue<number>;
  }[];
};

type FamiData = {
  src: string;
  scale: number;
  x: number;
  y: number;
  z: number;
  destY: number;
};

type SrcDataType = {
  pc: FamiData[];
  sp: FamiData[];
};

const spDestYBase = 3600;

const sourceData: SrcDataType = {
  pc: [
    {
      src: "desert",
      // src: "resized/01-resized",
      z: 80,
      // z: 0,
      scale: 1,
      x: 5,
      y: 145,
      destY: 4200,
    },
    {
      src: "island",
      // src: "resized/02-resized",
      z: -150,
      // z: -10,
      scale: 0.97,
      x: 0,
      y: 180,
      destY: 4500,
    },
    {
      src: "cyber",
      // src: "resized/03-resized",
      z: -400,
      // z: -20,
      scale: 0.9,
      x: 7,
      y: 130,
      destY: 4500,
    },
    {
      src: "building",
      // src: "resized/04-resized",
      z: -700,
      // z: -30,
      scale: 0.9,
      x: 0,
      y: 120,
      destY: 3900,
    },
    {
      src: "castle",
      // src: "resized/05-resized",
      z: -1190,
      // z: -40,
      scale: 0.9,
      x: 0,
      y: 130,
      destY: 4500,
    },
    {
      src: "cloud-front",
      // src: "resized/07-resized",
      z: -200,
      // z: -50,
      scale: 0.5,
      x: 0,
      y: 0,
      destY: 5550,
    },
    {
      src: "cloud-back",
      // src: "resized/08-resized",
      z: -300,
      // z: -50,
      scale: 0.6,
      x: 200,
      y: 0,
      destY: 5550,
    },
    {
      src: "back",
      // src: "resized/06-resized",
      z: -1200,
      // z: -50,
      scale: 1,
      x: 0,
      y: 100,
      destY: 4500,
    },
  ],
  sp: [
    {
      src: "desert",
      z: 80,
      // z: 0,
      scale: 1.2,
      x: 0,
      y: -10,
      destY: spDestYBase + 0,
    },
    {
      src: "island",
      z: -150,
      // z: -10,
      scale: 1.2,
      x: 0,
      y: 50,
      destY: spDestYBase + 0,
    },
    {
      src: "cyber",
      z: -400,
      // z: -20,
      scale: 1.1,
      x: 0,
      y: 0,
      destY: spDestYBase + 0,
    },
    {
      src: "building",
      z: -700,
      // z: -30,
      scale: 1.1,
      x: 0,
      y: 0,
      destY: spDestYBase + -400,
    },
    {
      src: "castle",
      z: -1190,
      // z: -40,
      scale: 1.2,
      x: 0,
      y: 40,
      destY: spDestYBase + -300,
    },
    {
      src: "cloud-front",
      z: -200,
      // z: -50,
      scale: 0.5,
      x: 40,
      y: 50,
      destY: spDestYBase + -350,
    },
    {
      src: "cloud-back",
      z: -300,
      // z: -50,
      scale: 0.5,
      x: 80,
      y: 100,
      destY: spDestYBase + -350,
    },
    {
      src: "back",
      z: -1200,
      // z: -50,
      scale: 1.1,
      x: 0,
      y: 11,
      destY: spDestYBase + -400,
    },
  ],
};

const imageData = {
  pc: { x: 0, y: 0, scale: 1.7, imgW: 2048, imgH: 1024 },
  sp: { x: 0, y: 0, scale: 1.0, imgW: 2048, imgH: 1024 },
};

/**
 * top2「いつでも身近に」での背景表示
 */
const FamiliarityPhase = ({ starts, ends }: Props) => {
  const { planeWidth, planeHeight, isSet } = useHomePlaneSize();
  const { displayWidth, displayHeight, isWide } = useWindowSize();
  const AImageModel = useMemo(() => a(ImageModel), []);
  const device = isWide ? "pc" : "sp";
  const imgData = imageData[device];
  const w = (imgData.imgW / imgData.imgH) * planeHeight;
  const h = planeHeight;

  const [reverse21, setReverse21] = useState(false);
  const { t2_1 } = useSpring({
    from: { t2_1: 0 },
    to: { t2_1: 1 },
    // loop: true,
    // reset: true,
    reverse: reverse21,
    config: {
      friction: 80,
      mass: 800,
    },
    onResolve: () => {
      setReverse21(!reverse21);
    },
  });
  if (!isSet) {
    // スマホ読み込みさせない
    return <></>;
  }
  return (
    <>
      {ends.map(({ ev }, i) => {
        const srcData = sourceData[device][i];
        let x;
        if (srcData.src === "cloud-front") {
          x = to([ev, t2_1], (v1, v2) => v1 + imgData.x + srcData.x + v2 * 20);
        } else if (srcData.src === "cloud-back") {
          x = to([ev, t2_1], (v1, v2) => v1 + imgData.x + srcData.x - v2 * 20);
        } else {
          x = ev.to((v) => v + imgData.x + srcData.x);
        }

        // 上手く城門に入っていくための補正値
        // height, y, srcData.y, srcData.destY, srcData.scale, image.scaleから
        // 割り出している計算式
        // ちゃんと考えれば導ける気がするがとりあえずで
        // マジックナンバー4.5, 3.7で置いてしまっている
        const aidY = isWide ? 4500 - 4.5 * h : 3300 - 3.7 * h;

        const { sv } = srcData.src === "06-back-1" ? starts[i - 1] : starts[i];
        return (
          <AImageModel
            key={srcData.src}
            src={getImgSrc(2, `${srcData.src}`, true)} // 素材が変わらないので第三引数isPcはtrue
            width={to(
              [ev, sv.to([0, 1], [0.8, 1])],
              (v1, v2) =>
                w *
                (1 + v1 * v1 * 20) *
                imgData.scale *
                srcData.scale *
                (v2 * v2)
            )}
            height={to(
              [ev, sv.to([0, 1], [0.8, 1])],
              (v1, v2) =>
                h *
                (1 + v1 * v1 * 20) *
                imgData.scale *
                srcData.scale *
                (v2 * v2)
            )}
            x={x}
            y={
              ev.to(
                (v) =>
                  v * v * (srcData.destY - srcData.y) + srcData.y - aidY * v * v
              ) /** aidY:補正値 */
            }
            z={to(
              [ev, sv],
              (v1, v2) => -100 + srcData.z + v1 * v1 * 200 + (-100 + v2 * 100)
            )}
            opacity={to(
              [ev, sv.to([0, 0.5, 1], [0, 1, 1])],
              (v1, v2) => (1 - v1 * v1) * v2 * v2
            )}
            useBasicMaterial={
              srcData.src === "07-cloud-front" ||
              srcData.src === "08-cloud-back" ||
              srcData.src === "06-back-1"
            }
          />
        );
      })}
    </>
  );
};

export default FamiliarityPhase;
