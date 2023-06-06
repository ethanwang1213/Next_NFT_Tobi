import useHomeStore from "@/stores/homeStore";
import { useEffect, useState } from "react";
import useDigitalGoodsAnims from "./homeCanvasAnims/useDigitalGoodsAnims";
import useEcoFriendlyAnims from "./homeCanvasAnims/useEcoFriendlyAnims";
import useEndAnims from "./homeCanvasAnims/useEndAnims";
import useEnjoymentAnims from "./homeCanvasAnims/useEnjoymentAnims";
import useFamiliarityAnims from "./homeCanvasAnims/useFamiliarityAnims";
import useFreedomAnims from "./homeCanvasAnims/useFreedomAnims";
import { shallow } from "zustand/shallow";
import useIsForward from "./home/useIsForward";

/**
 * 各フェーズでのWebGL上の表示に関するパラメータを管理するhook
 * @returns
 */
const useHomeCanvasAnims = () => {
  const homePhase = useHomeStore((state) => state.homePhase);
  const isInit = useHomeStore((state) => state.isInit);
  const setIsInit = useHomeStore((state) => state.setIsInit);
  const initPhase = useHomeStore((state) => state.initPhase);

  const { isForward } = useIsForward();

  const [activeT1Start, setActiveT1Start] = useState(false);
  const [activeT1End, setActiveT1End] = useState(false);
  const [activeT2Start, setActiveT2Start] = useState(false);
  const [activeT2End, setActiveT2End] = useState(false);
  const [activeT3Start, setActiveT3Start] = useState(false);
  const [activeT3End, setActiveT3End] = useState(false);
  const [activeT4Start, setActiveT4Start] = useState(false);
  const [activeT4End, setActiveT4End] = useState(false);
  const [activeT5Start, setActiveT5Start] = useState(false);
  const [activeT5End, setActiveT5End] = useState(false);
  const [activeTEnd, setActiveTEnd] = useState(false);

  const { t1_1, t1_2, t1_3, t1_4, t1_5 } = useDigitalGoodsAnims(
    activeT1Start,
    activeT1End,
    setActiveT2Start
  );
  const { t2Starts, t2Ends } = useFamiliarityAnims(
    setActiveT1End,
    activeT2Start,
    activeT2End,
    setActiveT3Start
  );
  const { t3Starts, t3Ends } = useEnjoymentAnims(
    setActiveT2End,
    activeT3Start,
    activeT3End,
    setActiveT4Start
  );
  const { t4Starts, t4Ends } = useFreedomAnims(
    setActiveT3End,
    activeT4Start,
    activeT4End,
    setActiveT5Start
  );
  const { t5Starts, t5Ends } = useEcoFriendlyAnims(
    setActiveT4End,
    activeT5Start,
    activeT5End,
    activeTEnd,
    setActiveTEnd
  );
  const { tEndStart, isVideoStarted } = useEndAnims(activeTEnd);

  ////////////////////////////////////////
  // location hashによるセクションの移動を検知
  useEffect(() => {
    if (window.location.hash !== "" && isInit) {
      // 処理の要求を通知
      setIsInit(false);
      return;
    }
  }, [window.location.hash]);

  // location hashによるセクションの移動処理
  useEffect(() => {
    if (isInit) return;

    setActiveT1Start(false);
    setActiveT1End(false);
    setActiveT2Start(false);
    setActiveT2End(false);
    setActiveT3Start(false);
    setActiveT3End(false);
    setActiveT4Start(false);
    setActiveT4End(false);
    setActiveT5Start(false);

    // セクション位置から手前を通じて完了済みの値に設定するため
    // caseごとにbreakをしていない
    switch (window.location.hash) {
      case "#top5":
        setActiveT4End(true);
        setActiveT5Start(true);
      case "#top4":
        setActiveT3End(true);
        setActiveT4Start(true);
      case "#top3":
        setActiveT2End(true);
        setActiveT3Start(true);
      case "#top2":
        setActiveT1End(true);
        setActiveT2Start(true);
      case "#top1":
        setActiveT1Start(true);
      default:
    }

    switch (window.location.hash) {
      case "#top1":
        initPhase("DIGITAL_GOODS");
        break;
      case "#top2":
        initPhase("FAMI");
        break;
      case "#top3":
        initPhase("ENJOYMENT");
        break;
      case "#top4":
        initPhase("FREEDOM");
        break;
      case "#top5":
        initPhase("ECO_FRIENDRY");
        break;
      default:
        initPhase("TITLE");
    }
    // setIsInit(true);
  }, [isInit]);

  ////////////////////////////////////////
  // homePhaseが更新されたとき、フェーズのアニメーションを再生
  // 前進と後退がそれぞれ、booleanのtrueとfalseに対応
  useEffect(() => {
    switch (homePhase) {
      case "TITLE_TO_GOODS":
        setActiveT1Start(isForward);
        break;
      case "GOODS_TO_FAMI":
        if (isForward) {
          setActiveT1End(true);
        } else {
          setActiveT2Start(false);
        }
        break;
      case "FAMI_TO_ENJOY":
        if (isForward) {
          setActiveT2End(true);
        } else {
          setActiveT3Start(false);
        }
        break;
      case "ENJOY_TO_FREE":
        if (isForward) {
          setActiveT3End(true);
        } else {
          setActiveT4Start(false);
        }
        break;
      case "FREE_TO_ECO":
        if (isForward) {
          setActiveT4End(true);
        } else {
          setActiveT5Start(false);
        }
        break;
      case "ECO_TO_END":
        if (isForward) {
          setActiveT5End(true);
        }
        break;
    }
  }, [homePhase]);

  return {
    activeT1Start,
    t1_1,
    t1_2,
    t1_3,
    activeT1End,
    t1_4,
    t1_5,
    t2Starts,
    t2Ends,
    t3Starts,
    t3Ends,
    t4Starts,
    t4Ends,
    t5Starts,
    t5Ends,
    isVideoStarted,
    tEndStart,
  };
};

export default useHomeCanvasAnims;
