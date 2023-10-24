import { a } from "@react-spring/three";
import { useMemo } from "react";
import useHomePlaneSize from "@/hooks/useHomePlaneSize";
import getImgSrc from "@/methods/home/getImgSrc";
import { useWindowSize } from "hooks";
import ImageModel from "../imageModel/ImageModel";

/**
 * top0「Welcome to Tobiratory」での背景表示
 */
const TitlePhase = () => {
  const { isSet } = useHomePlaneSize();
  const { displayWidth, displayHeight, isWide } = useWindowSize();

  const AImageModel = useMemo(() => a(ImageModel), []);
  if (!isSet) {
    return <></>;
  }

  // 素材と画面のアスペクト比の比較で条件分岐、
  // 画面がより横長の場合、画面幅に、
  // 画面がより縦長の場合、画面高さにそろえる
  const srcH = 2048;
  const originalW = 1920;
  const originalH = 1080;
  const srcHRatio = srcH / originalH;
  const innerAspect = displayWidth / displayHeight;
  const originalAspect = originalW / originalH;
  const w =
    innerAspect < originalAspect
      ? displayHeight * originalAspect
      : displayWidth;
  let h =
    innerAspect < originalAspect
      ? displayHeight
      : displayWidth / originalAspect;
  h *= srcHRatio;

  return (
    <AImageModel
      src={getImgSrc(0, "1", isWide)}
      width={w}
      height={h}
      x={0}
      y={0}
      z={-1001}
      // opacity={t1_1.to([0, 0.9, 1], [0, 0, 1]).to((v) => 1 - v)}
      opacity={1}
    // color={'#888'}
    />
  );
};

export default TitlePhase;
