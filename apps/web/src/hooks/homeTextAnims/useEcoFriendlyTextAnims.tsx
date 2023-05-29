import useHomeStore from "@/stores/homeStore";
import { ScrollDownConfig } from "@/types/ScrollDownConfig";
import { useSpring } from "@react-spring/web";
import { useState } from "react";

/**
 * top5 ECO_FRIENDLYセクションのUIのアニメーション用変数を管理する
 * useHomeTextAnimsからのみ呼ばれることを想定
 * @param activeTEnd
 * @returns
 */
const useEcoFriendlyTextAnims = (scrollDownConfig: ScrollDownConfig) => {
  const homePhase = useHomeStore((state) => state.homePhase);
  const setCanProgress = useHomeStore((state) => state.setCanProgress);
  const isInit = useHomeStore((state) => state.isInit);
  const setCanInteract = useHomeStore((state) => state.setCanInteract);

  // top5 ECO
  const [activeT5, setActiveT5] = useState(false);
  const [{ t5 }] = useSpring(
    () => ({
      t5: activeT5 ? 1 : 0,
      delay: activeT5 ? 1000 : 0,
      onResolve: (result) => {
        if (homePhase === "ECO_FRIENDRY" && activeT5 && !result.noop) {
          setCanProgress(true);
          setCanInteract(true);
          api5_1.start({
            t5_1: 1,
            ...scrollDownConfig.enter,
          });
        }
      },
      immediate: !isInit,
    }),
    [activeT5, isInit]
  );

  // scroll downアイコン用
  const [{ t5_1 }, api5_1] = useSpring(
    () => ({
      t5_1: 0,
    }),
    []
  );

  return { setActiveT5, t5, t5_1, api5_1 };
};

export default useEcoFriendlyTextAnims;
