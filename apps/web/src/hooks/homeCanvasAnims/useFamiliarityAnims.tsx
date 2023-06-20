import getTextureLength from "@/methods/home/getTextureLength";
import useHomeStore from "@/stores/homeStore";
import { easings, useSprings } from "@react-spring/three";
import { Dispatch, SetStateAction, useMemo } from "react";
import { shallow } from "zustand/shallow";

/**
 * top2 Familiarityのアニメーション用変数を管理する
 * useHomeCanvasAnimsからのみ呼ばれることを想定
 * @param setActiveT1End
 * @param activeT2Start
 * @param activeT2End
 * @param setActiveT3Start
 * @returns
 */
const useFamiliarityAnims = (
  setActiveT1End: Dispatch<SetStateAction<boolean>>,
  activeT2Start: boolean,
  activeT2End: boolean,
  setActiveT3Start: Dispatch<SetStateAction<boolean>>
) => {
  const homePhase = useHomeStore((state) => state.homePhase);
  const isInit = useHomeStore((state) => state.isInit);
  const setCanProgress = useHomeStore((state) => state.setCanProgress);

  const [t2Starts, apiT2Start] = useSprings(
    getTextureLength("top2"),
    (i) => ({
      sv: activeT2Start ? 1 : 0,
      delay: activeT2Start ? i * 80 : (getTextureLength("top2") - 1 - i) * 60,
      config: activeT2Start
        ? { easing: easings.easeOutCirc, duration: 1000 }
        : { easing: easings.easeInCubic, duration: 1000 },
      onResolve: (result) => {
        ["white", "black", "black"];
        if (homePhase === "GOODS_TO_FAMI" && !result.noop) {
          if (!activeT2Start) {
            // 後退
            // DIGI抜け開始
            setActiveT1End(false);
          }
        }
      },
      immediate: !isInit,
    }),
    [activeT2Start, isInit]
  );

  // top2
  const t2EndData = [
    { delay: 0 },
    { delay: 100 },
    { delay: 200 },
    { delay: 300 },
    { delay: 400 },
    { delay: 405 },
    { delay: 407 },
    { delay: 407 },
  ];
  const [t2Ends, apiT2End] = useSprings(
    getTextureLength("top2"),
    (i) => ({
      ev: activeT2End ? 1 : 0,
      delay: activeT2End ? t2EndData[i].delay : 407 - t2EndData[i].delay,
      config: activeT2End
        ? { easing: easings.easeInExpo, duration: 1500 }
        : { easing: easings.easeOutExpo, duration: 1500 },
      onResolve: (result) => {
        if (!result.noop) {
          // FAMI抜け終了時
          if (i === t2Ends.length - 3) {
            // -3はタイミング調整
            if (activeT2End && homePhase === "FAMI_TO_ENJOY") {
              // 前進
              // ENJOY入り開始
              setActiveT3Start(true);
            }
          } else if (
            i === t2Ends.length - 1 &&
            (homePhase === "GOODS_TO_FAMI" || homePhase === "FAMI_TO_ENJOY")
          ) {
            // 前進 後退
            // FAMIフェーズへ前進
            setCanProgress(true);
          }
        }
      },
      immediate: !isInit,
    }),
    [activeT2End, isInit]
  );

  return { t2Starts, t2Ends };
};

export default useFamiliarityAnims;
