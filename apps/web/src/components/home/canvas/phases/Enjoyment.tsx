import { a, SpringValue, to } from "@react-spring/three";
import { useMemo } from "react";
import useHomePlaneSize from "@/hooks/useHomePlaneSize";
import getImgSrc from "@/methods/home/getImgSrc";
import ImageModel from "../imageModel/ImageModel";

type Props = {
  starts: {
    sv: SpringValue<number>;
  }[];
  ends: {
    ev: SpringValue<number>;
  }[];
};

type EnjoyData = {
  src: string;
  x: number;
  y: number;
  z: number;
};

type SrcDataType = {
  pc: EnjoyData[];
  sp: EnjoyData[];
};

const sourceData: SrcDataType = {
  pc: [
    { src: "1", z: -100, x: 70, y: -80 },
    { src: "mesh1", z: -200, x: 0, y: 0 },
    { src: "mesh2", z: -400, x: 0, y: 0 },
    { src: "mesh3", z: -400, x: 0, y: 0 },
    { src: "2", z: -500, x: 70, y: -80 },
    { src: "3", z: -1350, x: 70, y: -80 },
    { src: "4", z: -1400, x: 70, y: -80 },
  ],
  sp: [
    { src: "1", z: -100, x: 40, y: 0 },
    { src: "mesh1", z: -450, x: 0, y: 0 },
    { src: "mesh2", z: -300, x: 0, y: 0 },
    { src: "mesh3", z: -200, x: 0, y: 0 },
    { src: "2", z: -500, x: 40, y: 0 },
    { src: "3", z: -1000, x: 40, y: 0 },
    { src: "4", z: -1300, x: 40, y: 0 },
  ],
};

const imageData = {
  pc: { scale: 1.1 },
  sp: { scale: 1.0 },
};

/**
 * top3「さらなる楽しみ」での背景表示
 */
const EnjoymentPhase = ({ starts, ends }: Props) => {
  const { planeWidth, planeHeight, isWideMode, isSet } = useHomePlaneSize();
  const AImageModel = useMemo(() => a(ImageModel), []);
  const device = isWideMode ? "pc" : "sp";
  const imgData = imageData[device];

  if (!isSet) {
    // スマホ読み込みさせない
    return <></>;
  }
  return (
    <>
      {ends.map(({ ev }, i) => {
        const { sv } = starts[i];
        const srcData = sourceData[device][i];

        const w = isWideMode ? planeWidth : planeHeight;
        const h = isWideMode ? planeWidth : planeHeight;
        // if (srcData.src === 'mesh1' || srcData.src === 'mesh2' || srcData.src === 'mesh3') {
        //   w = 2 * (isWideMode ? 220 * planeWidth / 1920 : 220 * planeHeight / 1080)
        //   h = 2 * (isWideMode ? 110 * planeWidth / 1920 : 110 * planeHeight / 1080)
        // }
        // if (i > 3) return;
        return (
          <AImageModel
            key={srcData.src}
            src={getImgSrc(3, `${srcData.src}`, true)} // 素材が変わらないので第三引数isPCはtrue
            width={
              to(
                [ev, sv.to([0, 1], [0.8, 1])],
                (v1, v2) => w * (1 + v1 * v1 * 20) * imgData.scale * (v2 * v2)
              )
            }
            height={
              to(
                [ev, sv.to([0, 1], [0.8, 1])],
                (v1, v2) => h * (1 + v1 * v1 * 20) * imgData.scale * (v2 * v2)
              )
            }
            x={ev.to((v) => 20 * srcData.x * v * v + srcData.x)}
            y={ev.to((v) => v + srcData.y)}
            z={
              to(
                [ev, sv],
                (v1, v2) => -100 + srcData.z + v1 * i * 500 + (-100 + v2 * 100)
              )
            }
            opacity={
              to(
                [sv.to([0, 0.3, 1], [0, 1, 1]), ev],
                (v1, v2) => v1 * v1 * (1 - v2) * (1 - v2)
              )
            }
          />
        );
      })}
    </>
  );
};

export default EnjoymentPhase;
