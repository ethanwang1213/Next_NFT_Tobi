import useHomeStore from "@/stores/homeStore";
import { ScrollDownConfig } from "@/types/ScrollDownConfig";
import { config, useSpring } from "@react-spring/web";
import { useState } from "react";
import { shallow } from "zustand/shallow";

/**
 * top3 ENJOYIMENTセクションのUIのアニメーション用変数を管理する
 * useHomeTextAnimsからのみ呼ばれることを想定
 * @param activeTEnd
 * @returns
 */
const useEnjoymentTextAnims = (scrollDownConfig: ScrollDownConfig) => {
  const homePhase = useHomeStore((state) => state.homePhase);
  const setCanProgress = useHomeStore((state) => state.setCanProgress);
  const isInit = useHomeStore((state) => state.isInit);

  // top3 ENJOY
  const [activeT3, setActiveT3] = useState(false);
  const [{ t3 }] = useSpring(
    () => ({
      t3: activeT3 ? 1 : 0,
      config: config.gentle,
      delay: activeT3 ? 1000 : 0,
      onResolve: (result) => {
        if (homePhase === "ENJOYMENT" && activeT3 && !result.noop) {
          setCanProgress(true);
          api3_1.start({
            t3_1: 1,
            ...scrollDownConfig.enter,
          });
        }
      },
      immediate: !isInit,
    }),
    [activeT3, isInit]
  );

  // scroll downアイコン用
  const [{ t3_1 }, api3_1] = useSpring(
    () => ({
      t3_1: 0,
    }),
    []
  );

  return { setActiveT3, t3, t3_1, api3_1 };
};

export default useEnjoymentTextAnims;
