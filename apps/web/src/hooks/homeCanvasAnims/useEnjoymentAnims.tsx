import getTextureLength from "@/methods/home/getTextureLength";
import useHomeStore from "@/stores/homeStore";
import { easings, useSprings } from "@react-spring/web";
import { Dispatch, SetStateAction } from "react";
import { shallow } from "zustand/shallow";

/**
 * top3 Enjoymentのアニメーション用変数を管理する
 * useHomeCanvasAnimsからのみ呼ばれることを想定
 * @param setActiveT2End
 * @param activeT3Start
 * @param activeT3End
 * @param setActiveT4Start
 * @returns
 */
const useEnjoymentAnims = (
  setActiveT2End: Dispatch<SetStateAction<boolean>>,
  activeT3Start: boolean,
  activeT3End: boolean,
  setActiveT4Start: Dispatch<SetStateAction<boolean>>
) => {
  const homePhase = useHomeStore((state) => state.homePhase);
  const isInit = useHomeStore((state) => state.isInit);
  const setCanProgress = useHomeStore((state) => state.setCanProgress);

  // top3 ENJOY 入り
  const [t3Starts, apiT3Start] = useSprings(
    getTextureLength("top3"),
    (i) => ({
      // sv: 0,
      sv: activeT3Start ? 1 : 0,
      delay: activeT3Start ? i * 30 : (getTextureLength("top3") - 1 - i) * 80,
      config: activeT3Start
        ? { easing: easings.easeOutCirc, duration: 1000 }
        : { easing: easings.easeInCubic, duration: 800 },
      onChange: (result) => {
        if (!activeT3Start && i === 0 && result.value.sv < 0.2) {
          // 後退
          // FAMIへの戻り開始
          setActiveT2End(false);
        }
      },
      immediate: !isInit,
    }),
    [activeT3Start, isInit]
  );

  // top3 ENJOY 抜け
  const [t3Ends, apiT3End] = useSprings(
    getTextureLength("top3"),
    (i) => ({
      ev: activeT3End ? 1 : 0,
      delay: activeT3End ? i * 100 : (getTextureLength("top3") - 1 - i) * 100,
      config: activeT3End
        ? { easing: easings.easeInExpo, duration: 2000 }
        : { easing: easings.easeInOutExpo, duration: 1000 },
      onResolve: (result) => {
        if (!result.noop) {
          // ENJOY抜け終了時
          if (i === t3Ends.length - 3 && homePhase === "ENJOY_TO_FREE") {
            // -3はタイミング調整
            if (activeT3End) {
              // 前進
              // FREE入り開始
              setActiveT4Start(true);
            }
          } else if (
            i === t3Ends.length - 1 &&
            (homePhase === "FAMI_TO_ENJOY" || homePhase === "ENJOY_TO_FREE")
          ) {
            // 前進 後退
            // FREEフェーズへ前進
            setCanProgress(true);
          }
        }
      },
      immediate: !isInit,
    }),
    [activeT3End, isInit]
  );

  return { t3Starts, t3Ends };
};

export default useEnjoymentAnims;
