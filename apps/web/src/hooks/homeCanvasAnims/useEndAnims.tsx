import { useSpringRef, useSpring, useChain } from "@react-spring/three";
import { useState } from "react";

/**
 * topEnd Endのアニメーション用変数を管理する
 * useHomeCanvasAnimsからのみ呼ばれることを想定
 * @param activeTEnd
 * @returns
 */
const useEndAnims = (activeTEnd: boolean) => {
  const [isVideoStarted, setIsVideoStarted] = useState(false);
  const apiTEndStart = useSpringRef();
  const { tEndStart } = useSpring({
    ref: apiTEndStart,
    tEndStart: activeTEnd ? 1 : 0,
    config: { duration: 500 },
    onResolve: (result) => {
      if (activeTEnd && !result.noop) {
        // 前進
        // 動画の再生
        setTimeout(() => {
          setIsVideoStarted(true);
        }, 500);
      }
    },
  });
  useChain([apiTEndStart], [0]);

  return { tEndStart, isVideoStarted };
};

export default useEndAnims;
