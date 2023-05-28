import useHomeStore from "@/stores/homeStore";
import { ScrollDownConfig } from "@/types/ScrollDownConfig";
import { useSpring } from "@react-spring/web";
import { useState } from "react";
import { shallow } from "zustand/shallow";

/**
 * top4 FREEDOMセクションのUIのアニメーション用変数を管理する
 * useHomeTextAnimsからのみ呼ばれることを想定
 * @param activeTEnd
 * @returns
 */
const useFreedomTextAnims = (scrollDownConfig: ScrollDownConfig) => {
  const homePhase = useHomeStore((state) => state.homePhase);
  const setCanProgress = useHomeStore((state) => state.setCanProgress);
  const isInit = useHomeStore((state) => state.isInit);

  // top4 FREE
  const [activeT4, setActiveT4] = useState(false);
  const [{ t4 }] = useSpring(
    () => ({
      t4: activeT4 ? 1 : 0,
      delay: activeT4 ? 1000 : 0,
      onResolve: (result) => {
        if (homePhase === "FREEDOM" && activeT4 && !result.noop) {
          setCanProgress(true);
          api4_1.start({
            t4_1: 1,
            ...scrollDownConfig.enter,
          });
        }
      },
      immediate: !isInit,
    }),
    [activeT4, isInit]
  );

  // scroll downアイコン用
  const [{ t4_1 }, api4_1] = useSpring(
    () => ({
      t4_1: 0,
    }),
    []
  );

  return { setActiveT4, t4, t4_1, api4_1 };
};

export default useFreedomTextAnims;
