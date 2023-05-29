import useHomeStore from "@/stores/homeStore";
import { ScrollDownConfig } from "@/types/ScrollDownConfig";
import { config, useSpring } from "@react-spring/web";
import { useState } from "react";

/**
 * top2 FAMILIARITYセクションのUIのアニメーション用変数を管理する
 * useHomeTextAnimsからのみ呼ばれることを想定
 * @param activeTEnd
 * @returns
 */
const useFamiliarityTextAnims = (scrollDownConfig: ScrollDownConfig) => {
  const homePhase = useHomeStore((state) => state.homePhase);
  const setCanProgress = useHomeStore((state) => state.setCanProgress);
  const isInit = useHomeStore((state) => state.isInit);
  const setCanInteract = useHomeStore((state) => state.setCanInteract);

  // top2 FAMI
  const [activeT2, setActiveT2] = useState(false);
  const [{ t2 }] = useSpring(
    () => ({
      t2: activeT2 ? 1 : 0,
      config: config.gentle,
      delay: activeT2 ? 2000 : 0,
      onResolve: (result) => {
        if (homePhase === "FAMI" && activeT2 && !result.noop) {
          setCanProgress(true);
          setCanInteract(true);
          api2_1.start({
            t2_1: 1,
            ...scrollDownConfig.enter,
          });
        }
      },
      immediate: !isInit,
    }),
    [activeT2, isInit]
  );

  // scroll downアイコン用
  const [{ t2_1 }, api2_1] = useSpring(
    () => ({
      t2_1: 0,
    }),
    []
  );

  return { setActiveT2, t2, t2_1, api2_1 };
};

export default useFamiliarityTextAnims;
