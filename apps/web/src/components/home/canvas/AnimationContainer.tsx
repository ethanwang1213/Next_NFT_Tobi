import { animated, to } from "@react-spring/three";
import { Suspense, useEffect, useMemo, useState } from "react";
import useHomeStore, { isAnimationPhase } from "@/stores/homeStore";
import getHomePlaneSize from "@/hooks/getHomePlaneSize";
import preloadTextures from "@/methods/home/preloadTextures";
import ARectAreaLight from "./animatedThrees/ARectAreaLight";
import AAmbientLight from "./animatedThrees/AAmbientLight";

import TitlePhase from "./phases/Title";
import GoodsPhase from "./phases/DigitalGoods";
import FamiliarityPhase from "./phases/Familiarity";
import EnjoymentPhase from "./phases/Enjoyment";
import EcoPhase from "./phases/EcoFriendry";
import FreedomPhase from "./phases/Freedom";
import EndPhase from "./phases/EndPhase";

import SkyBox from "./SkyBox";
import useHomeCanvasAnims from "@/hooks/useHomeCanvasAnims";
import useIsForward from "@/hooks/home/useIsForward";
import useWindowSize from "@/hooks/useWindowSize";
import isSpLandscape from "@/methods/home/isSpLandscape";

type Props = {
  planeWidth: number;
  planeHeight: number;
};

const AnimationContainer = ({ planeWidth, planeHeight }: Props) => {
  const homePhase = useHomeStore((state) => state.homePhase);
  const progressPhase = useHomeStore((state) => state.progressPhase);
  const backPhase = useHomeStore((state) => state.backPhase);
  const canProgress = useHomeStore((state) => state.canProgress);

  const { isForward } = useIsForward();

  const { isWideMode, isSet } = getHomePlaneSize();

  // スマホでの横向き表示禁止
  const { displayWidth, displayHeight } = useWindowSize();
  const [isForbiddenDeviceRot, setIsForbiddenDeviceRot] = useState(false);

  useEffect(() => {
    setIsForbiddenDeviceRot(isSpLandscape(window, displayWidth, displayHeight));
  }, [displayWidth, displayHeight]);

  // テクスチャのプリロード
  const [isPreloaded, setIsPreloaded] = useState(false);
  useEffect(() => {
    if (!isSet || isPreloaded) return;
    preloadTextures(isWideMode);
    setIsPreloaded(true);
  }, [isWideMode, isSet]);

  // アニメーション用変数の取得
  const {
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
  } = useHomeCanvasAnims();

  // セクションの間のフェーズ終了時、
  // 自動的に次のセクションフェーズへ移行する
  useEffect(() => {
    if (!isAnimationPhase(homePhase)) return;
    if (isForward) {
      progressPhase();
    } else {
      backPhase();
    }
  }, [canProgress]);

  const ASkyBox = useMemo(() => animated(SkyBox), []);

  return (
    <>
      {(homePhase === "TITLE" ||
        homePhase === "TITLE_TO_GOODS" ||
        homePhase === "DIGITAL_GOODS") && (
        <>
          <AAmbientLight
            intensity={to([t1_3, t1_5], (sv, ev: any) => 4 - 3 * ev)}
          />
          <ARectAreaLight
            intensity={t1_3.to([0, 0.8, 1], [0, 0, 1]).to((v) => 10 * v * v)}
            // position={[0, 0, 200]}
            width={planeWidth * (8 / 10)}
            height={planeHeight * (8 / 10)}
            z={1}
          />
        </>
      )}

      {(homePhase === "GOODS_TO_FAMI" ||
        homePhase === "FAMI" ||
        homePhase === "FAMI_TO_ENJOY") && (
        <>
          {(() => {
            const { ev } = t2Ends[t2Ends.length - 1];
            const { sv } = t2Starts[0];
            // sv.to((v) => console.log("start0: ", v));
            return (
              <>
                <ASkyBox
                  color={
                    sv
                      .to(
                        [0, 0.3, 1],
                        activeT1End
                          ? ["white", "black", "black"]
                          : ["black", "white", "white"]
                      )
                      .to((v) => v) as any
                  }
                />
                <AAmbientLight
                  intensity={
                    isForward
                      ? to(
                          [ev, sv],
                          (v1: any, v2: any) =>
                            v1 * v1 * (isWideMode ? 1 : 2) +
                            0.02 * (1 - v2) +
                            0.3
                        )
                      : 0.25
                  }
                />
                <ARectAreaLight
                  width={planeWidth}
                  height={planeHeight}
                  z={10}
                />
              </>
            );
          })()}
        </>
      )}

      {homePhase === "ENJOYMENT" && <ASkyBox color={"black"} />}

      {homePhase === "ENJOYMENT" && <AAmbientLight intensity={0.01} />}
      {homePhase === "ENJOY_TO_FREE" && (
        <AAmbientLight intensity={isForward ? 0.01 : 1} />
      )}

      {(homePhase === "ENJOYMENT" || homePhase === "ENJOY_TO_FREE") && (
        <>
          <ARectAreaLight
            intensity={1.2}
            // position={[0, 0, 200]}
            width={planeWidth}
            height={planeHeight}
            z={10}
          />
        </>
      )}

      {homePhase === "FREEDOM" && (
        <ASkyBox
          color={
            t3Ends[t3Ends.length - 1].ev
              .to([0, 1], ["black", "white"])
              .to((v) => v) as any
          }
        />
      )}
      {(homePhase === "FREEDOM" || homePhase === "FREE_TO_ECO") && (
        <>
          <AAmbientLight intensity={0.4} />
          <spotLight
            intensity={3}
            decay={3}
            distance={2000}
            angle={1 * Math.PI}
            position={[0, 0, 0]}
          />
        </>
      )}

      {(homePhase === "FREE_TO_ECO" ||
        homePhase === "ECO_FRIENDRY" ||
        homePhase === "ECO_TO_END") && (
        <ASkyBox
          color={
            t4Ends[t4Ends.length - 1].ev
              .to([0, 0.6, 1], ["white", "#65BF5E", "#65BF5E"])
              .to((v) => v) as any
          }
        />
      )}

      {homePhase === "END" && (
        <ASkyBox
          color={
            tEndStart
              .to([0, 0.8, 1], ["#65BF5E", "black", "black"])
              .to((v) => v) as any
          }
        />
      )}

      {(homePhase === "ECO_FRIENDRY" ||
        homePhase === "ECO_TO_END" ||
        homePhase === "END") && (
        <AAmbientLight intensity={tEndStart.to((v) => 0.8 - v)} />
      )}

      {/* <ARectAreaLight width={planeWidth} height={planeHeight} /> */}
      {!isForbiddenDeviceRot && (
        <>
          {(homePhase === "TITLE" || homePhase === "TITLE_TO_GOODS") && (
            <Suspense fallback={null}>
              <TitlePhase />
            </Suspense>
          )}
          {(homePhase === "TITLE" ||
            homePhase === "TITLE_TO_GOODS" ||
            homePhase === "DIGITAL_GOODS" ||
            homePhase === "GOODS_TO_FAMI") && (
            <Suspense fallback={null}>
              <GoodsPhase
                activeT1Start={activeT1Start}
                t1_1={t1_1 as any}
                t1_2={t1_2 as any}
                t1_4={t1_4 as any}
              />
            </Suspense>
          )}
          {(homePhase === "DIGITAL_GOODS" ||
            homePhase === "GOODS_TO_FAMI" ||
            homePhase === "FAMI" ||
            homePhase === "FAMI_TO_ENJOY") && (
            <Suspense fallback={null}>
              <FamiliarityPhase starts={t2Starts as any} ends={t2Ends as any} />
            </Suspense>
          )}
          {(homePhase === "FAMI" ||
            homePhase === "FAMI_TO_ENJOY" ||
            homePhase === "ENJOYMENT" ||
            homePhase === "ENJOY_TO_FREE") && (
            <Suspense fallback={null}>
              <EnjoymentPhase starts={t3Starts} ends={t3Ends} />
            </Suspense>
          )}
          {(homePhase === "ENJOYMENT" ||
            homePhase === "ENJOY_TO_FREE" ||
            homePhase === "FREEDOM" ||
            homePhase === "FREE_TO_ECO") && (
            <Suspense fallback={null}>
              <FreedomPhase starts={t4Starts} ends={t4Ends} />
            </Suspense>
          )}
          {(homePhase === "FREEDOM" ||
            homePhase === "FREE_TO_ECO" ||
            homePhase === "ECO_FRIENDRY" ||
            homePhase === "ECO_TO_END") && (
            <Suspense fallback={null}>
              <EcoPhase
                starts={t5Starts as any}
                ends={t5Ends as any}
                // t5_2={t5_2}
              />
            </Suspense>
          )}
          {(homePhase === "ECO_FRIENDRY" ||
            homePhase === "ECO_TO_END" ||
            homePhase === "END") && (
            <Suspense fallback={null}>
              <EndPhase isVideoStarted={isVideoStarted} start={tEndStart} />
            </Suspense>
          )}
        </>
      )}
    </>
  );
};

export default AnimationContainer;
