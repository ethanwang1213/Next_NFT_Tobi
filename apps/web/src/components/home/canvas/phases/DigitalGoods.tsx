import { a, SpringValue, to } from "@react-spring/three";
import { useMemo } from "react";
import useHomePlaneSize from "@/hooks/useHomePlaneSize";
import getImgSrc from "@/methods/home/getImgSrc";
import { useWindowSize } from "ui";
import ImageModel from "../imageModel/ImageModel";

type Props = {
  activeT1Start: boolean;
  t1_1: SpringValue<number>;
  t1_2: SpringValue<number>;
  t1_4: SpringValue<number>;
};

/**
 * top1「グッズをデジタルに」での背景表示
 */
const GoodsPhase = ({ activeT1Start, t1_1, t1_2, t1_4 }: Props) => {
  const { planeWidth, planeHeight, isSet } = useHomePlaneSize();
  const { displayWidth, displayHeight, isWide } = useWindowSize();
  const AImageModel = useMemo(() => a(ImageModel), []);

  // 素材と画面のアスペクト比の比較で条件分岐、
  // 画面がより横長の場合、画面幅に、
  // 画面がより縦長の場合、画面高さにそろえる
  const srcW = 2048;
  const srcH = 2048;
  const originalW = isWide ? 1920 : 1024;
  const originalH = isWide ? 1080 : 2048;
  const srcHRatio = srcH / originalH;
  const originalAspect = originalW / originalH;
  const innerAspect = displayWidth / displayHeight;
  const w = isWide
    ? innerAspect < originalAspect
      ? displayHeight * originalAspect
      : displayWidth
    : displayWidth;
  let h = isWide
    ? innerAspect < originalAspect
      ? displayHeight
      : displayWidth / originalAspect
    : displayWidth / originalAspect;
  h *= srcHRatio; // 縦に余白があるので調整

  if (!isSet) {
    return <></>;
  }
  return (
    <>
      <AImageModel
        src={getImgSrc(1, "1", isWide)}
        // .to(
        //   activeT1Start ? [0, 1] : [0, 0.1, 1],
        //   activeT1Start ? [0, 1] : [0, 1, 1]
        // )
        // .to((v) => planeWidth * v)}
        width={to(
          [
            t1_2.to(
              activeT1Start ? [0, 0.8, 1] : [0, 0.1, 1.0],
              activeT1Start ? [0, 0.1, 1.1] : [0, 1.0, 1.1]
            ),
            t1_4.to([0, 1], [0, 0.3]),
          ],
          (v, p) => (w * v + w * p) * 1.3
        )}
        height={to(
          [
            t1_2.to(
              activeT1Start ? [0, 0.8, 1] : [0, 0.1, 1],
              activeT1Start ? [0, 0.1, 1.1] : [0, 1, 1.1]
            ),
            t1_4.to([0, 1], [0, 0.3]),
          ],
          (v, p) => (h * v + h * p) * 1.3
        )}
        x={0}
        y={0}
        z={to([t1_2, t1_4], (v, p) => -1000 + 900 * v + 50 * p)}
        opacity={to(
          [
            t1_2.to(
              activeT1Start ? [0, 0.9, 1] : [0, 0.5, 1],
              activeT1Start ? [0, 0, 1] : [0, 0.5, 1]
            ),
            t1_4.to([0, 1], [1, 0]),
          ],
          (v2, v4) => v2 * v2 * v4
        )}
        color="#cdf"
      />
      <AImageModel
        src={getImgSrc(1, "2", isWide)}
        //   width={t1.to([0, 0.7, 1], [0, 0, 1]).to((v) => planeWidth * v)}
        //   height={t1.to((v) => planeHeight * v)}
        width={to(
          [
            t1_2.to(
              activeT1Start ? [0, 0.8, 1] : [0, 0.1, 1],
              activeT1Start ? [0, 0.1, 1.1] : [0, 1, 1.1]
            ),
            t1_4.to([0, 1], [0, 0.3]),
          ],
          (v, p) => (w * v + w * p) * 1.2
        )}
        height={to(
          [
            t1_2.to(
              activeT1Start ? [0, 0.8, 1] : [0, 0.1, 1],
              activeT1Start ? [0, 0.1, 1.1] : [0, 1, 1.1]
            ),
            t1_4.to([0, 1], [0, 0.3]),
          ],
          (v, p) => (h * v + h * p) * 1.2
        )}
        x={0}
        y={0}
        z={to([t1_2, t1_4], (v, p) => -1000 + 700 * v + 50 * p)}
        opacity={to(
          [
            t1_2.to(
              activeT1Start ? [0, 0.9, 1] : [0, 0.9, 1],
              activeT1Start ? [0, 0, 1] : [0, 0.5, 1]
            ),
            t1_4.to([0, 1], [1, 0]),
          ],
          (v2, v4) => v2 * v2 * v4
        )}
        color="#acf"
      />
      <AImageModel
        src={getImgSrc(1, "3", isWide)}
        //   width={t1.to([0, 0.7, 1], [0, 0, 1]).to((v) => planeWidth * v)}
        //   height={t1.to((v) => planeHeight * v)}
        width={to(
          [
            t1_2.to(
              activeT1Start ? [0, 0.8, 1] : [0, 0.1, 1],
              activeT1Start ? [0, 0.1, 1.1] : [0, 1, 1.1]
            ),
            t1_4.to([0, 1], [0, 0.3]),
          ],
          (v, p) => (w * v + w * p) * 1.2
        )}
        height={to(
          [
            t1_2.to(
              activeT1Start ? [0, 0.8, 1] : [0, 0.1, 1],
              activeT1Start ? [0, 0.1, 1.1] : [0, 1, 1.1]
            ),
            t1_4.to([0, 1], [0, 0.3]),
          ],
          (v, p) => (h * v + h * p) * 1.2
        )}
        x={0}
        y={0}
        z={to([t1_2, t1_4], (v, p) => -1000 + 500 * v + 50 * p)}
        opacity={to(
          [
            t1_2.to(
              activeT1Start ? [0, 0.9, 1] : [0, 0.9, 1],
              activeT1Start ? [0, 0, 1] : [0, 0.5, 1]
            ),
            t1_4.to([0, 1], [1, 0]),
          ],
          (v2, v4) => v2 * v2 * v4
        )}
        color="#acf"
      />
      <AImageModel
        src={getImgSrc(1, "4", isWide)}
        //   width={t1.to((v) => planeWidth * v)}
        //   height={t1.to((v) => planeHeight * v)}
        width={to(
          [
            t1_2.to(
              activeT1Start ? [0, 0.8, 1] : [0, 0.1, 1],
              activeT1Start ? [0, 0.1, 1.1] : [0, 1, 1.1]
            ),
            t1_4.to([0, 1], [0, 0.3]),
          ],
          (v, p) => w * v + w * p - 10 // -10は縁が白くなるのの回避（webpの修正がめんどくさかった）
        )}
        height={to(
          [
            t1_2.to(
              activeT1Start ? [0, 0.8, 1] : [0, 0.1, 1],
              activeT1Start ? [0, 0.1, 1.1] : [0, 1, 1.1]
            ),
            t1_4.to([0, 1], [0, 0.3]),
          ],
          (v, p) => h * v + h * p - 10 // -10は縁が白くなるのの回避（webpの修正がめんどくさかった）
        )}
        x={0}
        y={0}
        z={to([t1_2, t1_4], (v, p) => -1000 + 300 * v + 50 * p)}
        opacity={to(
          [
            t1_2.to(
              activeT1Start ? [0, 0.9, 1] : [0, 0.9, 1],
              activeT1Start ? [0, 0, 1] : [0, 0.5, 1]
            ),
            t1_4.to([0, 1], [1, 0]),
          ],
          (v2, v4) => v2 * v2 * v4
        )}
        color="#acf"
      />
      <AImageModel
        src={getImgSrc(1, "5", isWide)}
        //   width={t1.to((v) => planeWidth * v)}
        //   height={t1.to((v) => planeHeight * v)}
        width={planeWidth}
        height={planeHeight}
        x={0}
        y={0}
        z={-1000}
        opacity={to([t1_1, t1_4.to([0, 1], [1, 0])], (v1, v4) => v1 * v1 * v4)}
      />
    </>
  );
};

export default GoodsPhase;
