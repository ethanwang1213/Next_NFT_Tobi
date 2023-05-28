import getTextureLength from "@/methods/home/getTextureLength";
import useHomeStore from "@/stores/homeStore";
import { easings, useSprings } from "@react-spring/web";
import { Dispatch, SetStateAction } from "react";
import { shallow } from "zustand/shallow";

/**
 * top4 Freedomのアニメーション用変数を管理する
 * useHomeCanvasAnimsからのみ呼ばれることを想定
 * @param setActiveT3End
 * @param activeT4Start
 * @param activeT4End
 * @param setActiveT5Start
 * @returns
 */
const useFreedomAnims = (
  setActiveT3End: Dispatch<SetStateAction<boolean>>,
  activeT4Start: boolean,
  activeT4End: boolean,
  setActiveT5Start: Dispatch<SetStateAction<boolean>>
) => {
  const homePhase = useHomeStore((state) => state.homePhase);
  const isInit = useHomeStore((state) => state.isInit);
  const setCanProgress = useHomeStore((state) => state.setCanProgress);

  // top4 FREE 入り
  const [t4Starts, apiT4Start] = useSprings(
    getTextureLength("top4"),
    (i) => ({
      sv: activeT4Start ? 1 : 0,
      delay: activeT4Start ? i * 80 : (getTextureLength("top4") - 1 - i) * 80,
      config: activeT4Start
        ? { easing: easings.easeOutCirc, duration: 1000 }
        : { easing: easings.easeInCirc, duration: 1000 },
      onChange: (result) => {
        if (
          !activeT4Start &&
          i === t4Starts.length - 1 &&
          result.value.sv < 0.2
        ) {
          // 後退
          // ENJOYへの戻り開始
          setActiveT3End(false);
        }
      },
      immediate: !isInit,
    }),
    [activeT4Start, isInit]
  );

  // top4 FREE 抜け
  const t4EndData = [
    0,
    0 + 250,
    0 + 250 + 200,
    0 + 250 + 200 + 130,
    0 + 250 + 200 + 130 + 100,
    0 + 250 + 200 + 130 + 100 + 75,
    0 + 250 + 200 + 130 + 100 + 75 + 50,
    0 + 250 + 200 + 130 + 100 + 75 + 50 + 25,
    0 + 250 + 200 + 130 + 100 + 75 + 50 + 25 + 20,
    0 + 250 + 200 + 130 + 100 + 75 + 50 + 25 + 20 + 10,
  ];
  const [t4Ends, apiT4End] = useSprings(
    getTextureLength("top4"),
    (i) => ({
      ev: activeT4End ? 1 : 0,
      delay: activeT4End ? t4EndData[i] : 860 - t4EndData[i],
      config: { easing: easings.easeInOutCirc, duration: 1500 },
      onResolve: (result) => {
        // const value = result.value as unknown as number;
        if (!result.noop) {
          if (i === 1) {
            // -3 はタイミング調整
            if (activeT4End && homePhase === "FREE_TO_ECO") {
              // 前進
              setActiveT5Start(true);
            }
          } else if (
            i === t4Ends.length - 1 &&
            (homePhase === "ENJOY_TO_FREE" || homePhase === "FREE_TO_ECO")
          ) {
            // 前進 後退
            // 抜けきったら操作可能に
            setCanProgress(true);
          }
        }
      },
      immediate: !isInit,
    }),
    [activeT4End, isInit]
  );

  return { t4Starts, t4Ends };
};

export default useFreedomAnims;
