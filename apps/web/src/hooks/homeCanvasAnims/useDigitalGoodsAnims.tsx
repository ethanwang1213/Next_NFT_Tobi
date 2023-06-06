import useHomeStore from "@/stores/homeStore";
import { useSpringRef, useSpring, useChain, config } from "@react-spring/web";
import { Dispatch, SetStateAction } from "react";

/**
 * top1 DigitalGoodsのアニメーション用変数を管理する
 * useHomeCanvasAnimsからのみ呼ばれることを想定
 * @param activeT1Start
 * @param activeT1End
 * @param setActiveT2Start
 * @returns
 */
const useDigitalGoodsAnims = (
  activeT1Start: boolean,
  activeT1End: boolean,
  setActiveT2Start: Dispatch<SetStateAction<boolean>>
) => {
  const homePhase = useHomeStore((state) => state.homePhase);
  const isInit = useHomeStore((state) => state.isInit);
  const setCanProgress = useHomeStore((state) => state.setCanProgress);

  // top1 DIGI 入り chain 背景
  const api1_1 = useSpringRef();
  const [{ t1_1 }] = useSpring(
    () => ({
      ref: api1_1,
      t1_1: activeT1Start ? 1 : 0,
      config: {
        friction: 100,
      },
      immediate: !isInit,
    }),
    [activeT1Start, isInit]
  );

  // top1 DIGI 入り chain 穴
  const api1_2 = useSpringRef();
  const [{ t1_2 }] = useSpring(
    () => ({
      ref: api1_2,
      t1_2: activeT1Start ? 1 : 0,
      config: {
        friction: 80,
      },
      immediate: !isInit,
    }),
    [activeT1Start, isInit]
  );

  // top1 DIGI 入り chain areaRectLight
  const api1_3 = useSpringRef();
  const [{ t1_3 }] = useSpring(
    () => ({
      ref: api1_3,
      t1_3: activeT1Start ? 1 : 0,
      config: {
        friction: activeT1Start ? 70 : 50,
      },
      onResolve: (result) => {
        if (homePhase === "TITLE_TO_GOODS" && !result.noop) {
          // 前進 後退
          // DIGIフェーズへ前進
          setCanProgress(true);
        }
      },
      immediate: !isInit,
    }),
    [activeT1Start, isInit]
  );

  useChain(
    activeT1Start ? [api1_1, api1_2, api1_3] : [api1_3, api1_2, api1_1],
    activeT1Start ? [0, 0.5, 0.6] : [0, 0, 1.2]
  );

  // top1 DIGI 抜け chain アニメーション
  const api1_4 = useSpringRef();
  const [{ t1_4 }] = useSpring(
    () => ({
      ref: api1_4,
      t1_4: activeT1End ? 1 : 0,
      config: config.slow,
      onResolve: (result) => {
        if (homePhase === "GOODS_TO_FAMI" && !result.noop) {
          if (!activeT1End) {
            // 後退
            // TITLEフェーズへ後退
            setCanProgress(true);
          }
        }
      },
      immediate: !isInit,
    }),
    [activeT1End, isInit]
  );

  // top1 DIGI 抜け chain ambientLight
  const api1_5 = useSpringRef();
  const [{ t1_5 }] = useSpring(
    () => ({
      ref: api1_5,
      t1_5: activeT1End ? 1 : 0,
      config: config.default,
      onResolve: (result) => {
        if (
          (homePhase === "TITLE_TO_GOODS" || homePhase === "GOODS_TO_FAMI") &&
          !result.noop
        ) {
          if (activeT1End) {
            // 前進
            // FAMI入り開始
            setActiveT2Start(true);
            // FAMIフェーズへ前進
            setCanProgress(true);
          }
        }
      },
      immediate: !isInit,
    }),
    [activeT1End, isInit]
  );

  useChain(activeT1End ? [api1_4, api1_5] : [api1_5, api1_4], [0, 0.5]);

  return { t1_1, t1_2, t1_3, t1_4, t1_5 };
};

export default useDigitalGoodsAnims;
