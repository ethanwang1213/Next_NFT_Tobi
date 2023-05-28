import useHomeStore from "@/stores/homeStore";
import { ScrollDownConfig } from "@/types/ScrollDownConfig";
import { useSpring, config } from "@react-spring/web";
import { useState } from "react";

/**
 * top1 DigitalGoodsセクションのUIのアニメーション用変数を管理する
 * useHomeTextAnimsからのみ呼ばれることを想定
 * @param activeT1Start
 * @param activeT1End
 * @param setActiveT2Start
 * @returns
 */
const useDigitalGoodsTextAnims = (scrollDownConfig: ScrollDownConfig) => {
  const homePhase = useHomeStore((state) => state.homePhase);
  const isInit = useHomeStore((state) => state.isInit);
  const setCanProgress = useHomeStore((state) => state.setCanProgress);
  const setCanInteract = useHomeStore((state) => state.setCanInteract);

  // top1 DIGI
  const [activeT1, setActiveT1] = useState(false);
  const [{ t1 }] = useSpring(
    () => ({
      t1: activeT1 ? 1 : 0,
      config: config.gentle,
      onResolve: (result) => {
        if (homePhase === "DIGITAL_GOODS" && activeT1 && !result.noop) {
          setCanProgress(true);
          setCanInteract(true);
          api1_1.start({
            t1_1: 1,
            ...scrollDownConfig.enter,
          });
        }
      },
      immediate: !isInit,
    }),
    [activeT1, isInit]
  );

  // scroll downアイコン用
  const [{ t1_1 }, api1_1] = useSpring(
    () => ({
      t1_1: 0,
    }),
    []
  );

  return { setActiveT1, t1, t1_1, api1_1 };
};

export default useDigitalGoodsTextAnims;
