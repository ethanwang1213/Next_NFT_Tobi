import useHomeStore from "@/stores/homeStore";
import { easings } from "@react-spring/web";
import { useEffect, useMemo, useState } from "react";
import useIsForward from "./home/useIsForward";
import useDigitalGoodsTextAnims from "./homeTextAnims/useDigitalGoodsTextAnims";
import useEcoFriendlyTextAnims from "./homeTextAnims/useEcoFriendlyTextAnims";
import useEnjoymentTextAnims from "./homeTextAnims/useEnjoymentTextAnims";
import useFamiliarityTextAnims from "./homeTextAnims/useFamiliarityTextAnims";
import useFreedomTextAnims from "./homeTextAnims/useFreedomTextAnims";
import useTitleTextAnims from "./homeTextAnims/useTitleTextAnims";

/**
 * 各フェーズでのテキストやUIの表示に関するパラメータを管理するhook
 * @returns
 */
const useHomeTextAnims = () => {
  const homePhase = useHomeStore((state) => state.homePhase);
  const isInit = useHomeStore((state) => state.isInit);
  const setIsInit = useHomeStore((state) => state.setIsInit);

  const { isForward } = useIsForward();

  // scroll downアイコンの設定
  const scrollDownConfig = useMemo(
    () => ({
      enter: {
        delay: 700,
        config: {
          duration: 1000,
          easing: easings.easeOutCirc,
        },
        immediate: !isInit,
      },
      leave: {
        config: {
          duration: 1000,
        },
        immediate: !isInit,
      },
    }),
    [isInit]
  );

  const { setActiveT0, t0, t0_1, api0_1 } = useTitleTextAnims(scrollDownConfig);
  const { setActiveT1, t1, t1_1, api1_1 } =
    useDigitalGoodsTextAnims(scrollDownConfig);
  const { setActiveT2, t2, t2_1, api2_1 } =
    useFamiliarityTextAnims(scrollDownConfig);
  const { setActiveT3, t3, t3_1, api3_1 } =
    useEnjoymentTextAnims(scrollDownConfig);
  const { setActiveT4, t4, t4_1, api4_1 } =
    useFreedomTextAnims(scrollDownConfig);
  const { setActiveT5, t5, t5_1, api5_1 } =
    useEcoFriendlyTextAnims(scrollDownConfig);

  // 右端のフェーズを示すドット
  const [phaseDots, setPhaseDots] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const setPhaseDot = (index: number) => {
    const newPhaseDots = [...phaseDots];
    newPhaseDots.fill(false);
    newPhaseDots[index] = true;
    setPhaseDots(newPhaseDots);
  };

  // location hashによるセクションの移動処理
  useEffect(() => {
    if (isInit) return;

    const hash = window.location.hash;

    const isTop0 = !hash.match(/#top[1-5]/);
    setActiveT0(isTop0);
    api0_1.start({
      t0_1: isTop0 ? 1 : 0,
      ...scrollDownConfig.leave,
    });

    const isTop1 = hash === "#top1";
    setActiveT1(isTop1);
    api1_1.start({
      t1_1: isTop1 ? 1 : 0,
      ...scrollDownConfig.leave,
    });

    const isTop2 = hash === "#top2";
    setActiveT2(isTop2);
    api2_1.start({
      t2_1: isTop2 ? 1 : 0,
      ...scrollDownConfig.leave,
    });

    const isTop3 = hash === "#top3";
    setActiveT3(isTop3);
    api3_1.start({
      t3_1: isTop3 ? 1 : 0,
      ...scrollDownConfig.leave,
    });

    const isTop4 = hash === "#top4";
    setActiveT4(isTop4);
    api4_1.start({
      t4_1: isTop4 ? 1 : 0,
      ...scrollDownConfig.leave,
    });

    const isTop5 = hash === "#top5";
    setActiveT5(isTop5);
    api5_1.start({
      t5_1: isTop5 ? 1 : 0,
      ...scrollDownConfig.leave,
    });

    setIsInit(true);
  }, [isInit]);

  // homePhaseが更新されたとき、フェーズのアニメーションを再生
  // 前進と後退がそれぞれ、booleanのtrueとfalseに対応
  useEffect(() => {
    if (homePhase === "TITLE") {
      // TITLE表示
      setActiveT0(true);
      setPhaseDot(0);
    } else if (homePhase === "TITLE_TO_GOODS") {
      if (isForward) {
        // 前進 TITLE非表示
        setActiveT0(false);
        setPhaseDot(1);
        api0_1.start({ t0_1: 0, ...scrollDownConfig.leave });
      } else {
        // 後退 DIGI非表示
        setActiveT1(false);
        setPhaseDot(0);
        api1_1.start({ t1_1: 0, ...scrollDownConfig.leave });
      }
    } else if (homePhase === "DIGITAL_GOODS") {
      // DIGI表示
      setActiveT1(true);
      setPhaseDot(1);
    } else if (homePhase === "GOODS_TO_FAMI") {
      if (isForward) {
        // 前進 DIGI非表示
        setActiveT1(false);
        setPhaseDot(2);
        api1_1.start({ t1_1: 0, ...scrollDownConfig.leave });
      } else {
        // 後退 FAMI非表示
        setActiveT2(false);
        setPhaseDot(1);
        api2_1.start({ t2_1: 0, ...scrollDownConfig.leave });
      }
    } else if (homePhase === "FAMI") {
      // FAMI表示
      setActiveT2(true);
      setPhaseDot(2);
    } else if (homePhase === "FAMI_TO_ENJOY") {
      if (isForward) {
        // 前進 FAMI非表示
        setActiveT2(false);
        setPhaseDot(3);
        api2_1.start({ t2_1: 0, ...scrollDownConfig.leave });
      } else {
        // 後退 ENJOY非表示
        setActiveT3(false);
        setPhaseDot(2);
        api3_1.start({ t3_1: 0, ...scrollDownConfig.leave });
      }
    } else if (homePhase === "ENJOYMENT") {
      // ENJOY表示
      setActiveT3(true);
      setPhaseDot(3);
    } else if (homePhase === "ENJOY_TO_FREE") {
      if (isForward) {
        // 前進 ENJOY非表示
        setActiveT3(false);
        setPhaseDot(4);
        api3_1.start({ t3_1: 0, ...scrollDownConfig.leave });
      } else {
        // 後退 FREE非表示
        setActiveT4(false);
        setPhaseDot(3);
        api4_1.start({ t4_1: 0, ...scrollDownConfig.leave });
      }
    } else if (homePhase === "FREEDOM") {
      // FREE表示
      setActiveT4(true);
      // setActiveT4_op(true);
      setPhaseDot(4);
    } else if (homePhase === "FREE_TO_ECO") {
      if (isForward) {
        // 前進 FREE非表示
        setActiveT4(false);
        setPhaseDot(5);
        api4_1.start({ t4_1: 0, ...scrollDownConfig.leave });
      } else {
        // 後退 ECO非表示
        setActiveT5(false);
        setPhaseDot(4);
        api5_1.start({ t5_1: 0, ...scrollDownConfig.leave });
      }
    } else if (homePhase === "ECO_FRIENDRY") {
      // ECO表示
      setActiveT5(true);
      setPhaseDot(5);
    } else if (homePhase === "ECO_TO_END") {
      // 前進 ECO非表示
      setActiveT5(false);
      api5_1.start({ t5_1: 0, ...scrollDownConfig.leave });
    }
  }, [homePhase]);

  return {
    t0,
    t0_1,
    t1,
    t1_1,
    t2,
    t2_1,
    t3,
    t3_1,
    t4,
    t4_1,
    t5,
    t5_1,
    phaseDots,
  };
};

export default useHomeTextAnims;
