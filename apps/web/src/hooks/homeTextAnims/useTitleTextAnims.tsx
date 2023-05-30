import useHomeStore from "@/stores/homeStore";
import { ScrollDownConfig } from "@/types/ScrollDownConfig";
import { useSpring } from "@react-spring/web";
import { useState } from "react";

/**
 * top0 TITLEセクションのUIのアニメーション用変数を管理する
 * useHomeTextAnimsからのみ呼ばれることを想定
 * @param activeTEnd
 * @returns
 */
const useTitleTextAnims = (scrollDownConfig: ScrollDownConfig) => {
  const homePhase = useHomeStore((state) => state.homePhase);
  const setCanProgress = useHomeStore((state) => state.setCanProgress);
  const isInit = useHomeStore((state) => state.isInit);
  const setCanInteract = useHomeStore((state) => state.setCanInteract);

  // top0 TITLE
  const [activeT0, setActiveT0] = useState(false);
  const [{ t0 }] = useSpring(
    () => ({
      t0: activeT0 ? 1 : 0,
      delay: 1000,
      onResolve: (result) => {
        if (homePhase === "TITLE" && activeT0 && !result.noop) {
          setCanProgress(true);
          setCanInteract(true);
          api0_1.start({
            t0_1: 1,
            ...scrollDownConfig.enter,
          });
        }
      },
      immediate: !isInit,
    }),
    [activeT0, isInit]
  );

  // scroll downアイコン用
  const [{ t0_1 }, api0_1] = useSpring(
    () => ({
      t0_1: 0,
    }),
    []
  );

  return { setActiveT0, t0, t0_1, api0_1 };
};

export default useTitleTextAnims;
