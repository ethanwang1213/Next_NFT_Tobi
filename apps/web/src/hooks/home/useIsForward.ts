import useHomeStore from "@/stores/homeStore";
import { useMemo } from "react";

const useIsForward = () => {
  const homePhase = useHomeStore((state) => state.homePhase);
  const pPhase = useHomeStore((state) => state.pPhase);
  const getPhaseArr = useHomeStore((state) => state.getPhaseArr);

  // フェーズの前進か後退を判定する
  const isForward: boolean = useMemo(() => {
    let result = true;

    const phaseArr = getPhaseArr();
    const currentIndex = phaseArr.indexOf(homePhase);
    const pIndex = phaseArr.indexOf(pPhase);
    if (currentIndex === 0) {
      // TITLE
      if (currentIndex === pIndex) {
        result = true; // 前進
      } else if (currentIndex === pIndex - 1) {
        result = false; // 後退
      } else {
        console.log("invalidate phase index");
      }
    } else if (currentIndex === phaseArr.length - 1) {
      // END
      if (currentIndex === pIndex + 1) {
        result = true; // 前進
      } else if (currentIndex === pIndex) {
        result = false; // 後退
      } else {
        console.log("invalidate phase index");
      }
    } else {
      // その他中間のフェーズ
      if (currentIndex === pIndex + 1) {
        result = true; // 前進
      } else if (currentIndex === pIndex - 1) {
        result = false; // 後退
      } else {
        console.log("invalidate phase index");
      }
    }
    return result;
  }, [homePhase, pPhase]);

  return { isForward };
};

export default useIsForward;
