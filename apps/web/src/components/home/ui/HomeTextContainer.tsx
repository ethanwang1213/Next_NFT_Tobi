import { a } from "@react-spring/web";
import useHomeStore from "@/stores/homeStore";
import { useWindowSize } from "hooks";
import ScrollDownGuide from "./ScrollDownGuide";
import useHomeTextAnims from "@/hooks/useHomeTextAnims";
import SectionContainer from "./SectionText/SectionContainer";
import GrassFrame from "./SectionText/GrassFrame";
import TextContainer from "./SectionText/TextContainer";
import isSpLandscape from "@/methods/home/isSpLandscape";
import { useState, useEffect } from "react";

const HomeTextContainer = () => {
  const homePhase = useHomeStore((state) => state.homePhase);

  const { isWide } = useWindowSize();

  // スマホでの横向き表示禁止
  const { displayWidth, displayHeight } = useWindowSize();
  const [isForbiddenDeviceRot, setIsForbiddenDeviceRot] = useState(false);

  useEffect(() => {
    setIsForbiddenDeviceRot(isSpLandscape(window, displayWidth, displayHeight));
  }, [displayWidth, displayHeight]);

  const {
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
  } = useHomeTextAnims();

  return (
    <>
      {!isForbiddenDeviceRot && (
        <>
          <div className="pointer-events-none">
            {(homePhase === "TITLE" || homePhase === "TITLE_TO_GOODS") && (
              <>
                <SectionContainer
                  style={{
                    opacity: t0,
                    letterSpacing: "4px",
                  }}
                >
                  <h1 className="text-center font-tachyon-300 select-none">
                    WELCOME
                    <br />
                    TO
                    <br />
                    TOBIRATORY
                  </h1>
                </SectionContainer>
                <ScrollDownGuide t={t0_1} />
              </>
            )}
            {(homePhase === "TITLE_TO_GOODS" ||
              homePhase === "DIGITAL_GOODS" ||
              homePhase === "GOODS_TO_FAMI") && (
                <>
                  <SectionContainer style={{ opacity: t1 }}>
                    <TextContainer
                      titleChildren={
                        isWide ? (
                          <h2>グッズをデジタルに</h2>
                        ) : (
                          <h2 className="mb-[-10px] text-center leading-[52px] pb-3">
                            グッズを
                            <br />
                            デジタルに
                          </h2>
                        )
                      }
                      textChildren={
                        <p className="pb-2 text-center leading-9 sm:leading-10">
                          デジタルグッズはなぜ少ないのだろう？
                          <br />
                          所有している証明ができないから？
                          <br />
                          いや、可能かもしれない。NFTなら。
                        </p>
                      }
                    />
                  </SectionContainer>
                  <ScrollDownGuide t={t1_1} />
                </>
              )}
            {(homePhase === "FAMI" || homePhase === "FAMI_TO_ENJOY") && (
              <>
                <SectionContainer style={{ opacity: t2 }}>
                  <GrassFrame
                    style={{
                      backgroundColor: `rgba(17, 25, 40, 0.5)`,
                    }}
                  >
                    <TextContainer
                      titleChildren={
                        isWide ? (
                          <h2>いつでも身近に</h2>
                        ) : (
                          <h2 className="text-center leading-[52px]">
                            いつでも
                            <br />
                            身近に
                          </h2>
                        )
                      }
                      textChildren={
                        <p className="text-center">
                          自分の「好き」を
                          <br />
                          集めて飾って楽しむ。
                          <br />
                          共有すれば楽しさ無限大。
                          <br />
                          さぁ、何を飾ろう。
                        </p>
                      }
                    />
                  </GrassFrame>
                </SectionContainer>
                <ScrollDownGuide t={t2_1} />
              </>
            )}
            {(homePhase === "ENJOYMENT" || homePhase === "ENJOY_TO_FREE") && (
              <>
                <SectionContainer style={{ opacity: t3 }}>
                  <GrassFrame
                    style={{
                      backgroundColor: `rgba(17, 25, 40, 0.2)`,
                    }}
                  >
                    <TextContainer
                      titleChildren={
                        isWide ? (
                          <h2>さらなる楽しみ</h2>
                        ) : (
                          <h2 className="text-center leading-[52px]">
                            さらなる
                            <br />
                            楽しみ
                          </h2>
                        )
                      }
                      textChildren={
                        <p className="text-center">
                          ARやAI技術を駆使して、
                          <br />
                          デジタルグッズにしかできない
                          <br />
                          楽しみを実現。
                        </p>
                      }
                    />
                  </GrassFrame>
                </SectionContainer>
                <ScrollDownGuide t={t3_1} />
              </>
            )}
            {(homePhase === "ENJOY_TO_FREE" ||
              homePhase === "FREEDOM" ||
              homePhase === "FREE_TO_ECO") && (
                <>
                  <SectionContainer style={{ opacity: t4 }}>
                    <GrassFrame>
                      <TextContainer
                        titleChildren={
                          isWide ? (
                            <h2>クリエイターのために</h2>
                          ) : (
                            <h2 className="text-center leading-[52px]">
                              クリエイターの
                              <br />
                              ために
                            </h2>
                          )
                        }
                        textChildren={
                          <p className="text-center">
                            気軽に作って販売を可能に。
                            <br />
                            デジタルグッズ販売による
                            <br />
                            在庫リスクや送料などからの解放。
                          </p>
                        }
                      />
                    </GrassFrame>
                  </SectionContainer>
                  <ScrollDownGuide t={t4_1} />
                </>
              )}
            {(homePhase === "FREE_TO_ECO" ||
              homePhase === "ECO_FRIENDRY" ||
              homePhase === "ECO_TO_END") && (
                <>
                  <SectionContainer style={{ opacity: t5 }}>
                    <GrassFrame
                      style={{
                        backgroundColor: `rgba(17, 25, 40, 0.3)`,
                      }}
                    >
                      <TextContainer
                        titleChildren={
                          <h2 className="text-center">環境への配慮</h2>
                        }
                        textChildren={
                          <>
                            <p className="text-center">
                              Flowブロックチェーンを使うことで
                              <br />
                              環境にも配慮しつつ
                              <br />
                              大量の取引に耐えることができる。
                              <br />
                              もちろんガス代もかかりません。
                            </p>
                          </>
                        }
                      />
                    </GrassFrame>
                  </SectionContainer>
                  <ScrollDownGuide t={t5_1} />
                </>
              )}
          </div>
          <div className="home-phasedot-outer">
            <div className="home-phasedot-inner">
              {phaseDots.map((dot, index) => (
                <a.div
                  key={index}
                  className={`home-phasedot
                ${dot ? " home-phasedot-active" : " home-phasedot-others"} 
                ${homePhase !== "ECO_TO_END" && homePhase !== "END"
                      ? " "
                      : " duration-[1000ms] opacity-0"
                    }
              `}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default HomeTextContainer;
