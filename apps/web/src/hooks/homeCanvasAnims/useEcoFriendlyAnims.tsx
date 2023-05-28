import getTextureLength from "@/methods/home/getTextureLength";
import useHomeStore from "@/stores/homeStore";
import { easings, useSprings } from "@react-spring/web";
import { Dispatch, SetStateAction } from "react";
import { shallow } from "zustand/shallow";

/**
 * top5 EcoFriendryのアニメーション用変数を管理する
 * useHomeCanvasAnimsからのみ呼ばれることを想定
 * @param setActiveT4End
 * @param activeT5Start
 * @param activeT5End
 * @param activeTEnd
 * @param setActiveTEnd
 * @returns
 */
const useEcoFriendlyAnims = (
  setActiveT4End: Dispatch<SetStateAction<boolean>>,
  activeT5Start: boolean,
  activeT5End: boolean,
  activeTEnd: boolean,
  setActiveTEnd: Dispatch<SetStateAction<boolean>>
) => {
  const isInit = useHomeStore((state) => state.isInit);
  const setCanProgress = useHomeStore((state) => state.setCanProgress);
  const homePhase = useHomeStore((state) => state.homePhase);

  // top5 ECO 入り
  const [t5Starts, apiT5Start] = useSprings(
    getTextureLength("top5"),
    (i) => ({
      sv: activeT5Start ? 1 : 0,
      delay: activeT5Start
        ? (i === 1 ? 0 : i) * 20 // iの0,1は一緒に動かす
        : (getTextureLength("top5") - 1 - (i === 1 ? 0 : i)) * 100,
      config: activeT5Start
        ? { easing: easings.easeOutCirc, duration: 1000 }
        : { easing: easings.easeInCirc, duration: 1000 },
      onChange: (result) => {
        if (
          !activeT5Start &&
          i === t5Starts.length - 1 &&
          result.value.sv < 0.3
        ) {
          // 後退
          // FREEへの戻り開始
          setActiveT4End(false);
        }
      },
      immediate: !isInit,
    }),
    [activeT5Start, isInit]
  );

  // top5 ECO 抜け
  const t5EndData = [
    { delay: 300 },
    { delay: 300 },
    { delay: 300 + 80 },
    { delay: 300 + 80 + 80 },
    { delay: 300 + 80 + 80 + 60 },
    { delay: 300 + 80 + 80 + 60 + 30 },
    { delay: 300 + 80 + 80 + 60 + 30 + 30 },
    { delay: 300 + 80 + 80 + 60 + 30 + 30 + 20 },
    { delay: 300 + 80 + 80 + 60 + 30 + 30 + 20 + 20 },
    { delay: 300 + 80 + 80 + 60 + 30 + 30 + 20 + 20 + 10 },
  ];
  const [t5Ends, apiT5End] = useSprings(
    getTextureLength("top5"),
    (i) => ({
      ev: activeT5End ? 1 : 0,
      delay: t5EndData[i].delay,
      config: { easing: easings.easeInOutCirc, duration: 1800 },
      onResolve: (result) => {
        // const value = result.value as unknown as number;
        if (!result.noop) {
          if (i === t5Ends.length - 1 && homePhase === "FREE_TO_ECO") {
            if (activeT5End) {
              // 前進
              // ENDフェーズへ前進
              setCanProgress(true);
            }
          }
        }
      },
      onChange: (result) => {
        if (activeTEnd) return;
        if (i === t5Ends.length - 3) {
          // -3 はタイミング調整
          const v = result.value as any;
          if (v.ev > 0.5) {
            // 前進
            // END入り開始
            setActiveTEnd(true);
          }
        }
      },
      immediate: !isInit,
    }),
    [activeT5End, isInit]
  );

  return { t5Starts, t5Ends };
};

export default useEcoFriendlyAnims;
