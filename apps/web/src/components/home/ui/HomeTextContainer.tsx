import { a } from "@react-spring/web";
import useHomeStore from "@/stores/homeStore";
import useWindowSize from "@/hooks/useWindowSize";
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
                  <div className="text-center font-tachyon-300 ">
                    WELCOME
                    <br />
                    TO
                    <br />
                    TOBIRATORY
                  </div>
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
                        <div>グッズをデジタルに</div>
                      ) : (
                        <>
                          <div className="mb-[-10px]">グッズを</div>
                          <div>デジタルに</div>
                        </>
                      )
                    }
                    textChildren={
                      <>
                        <div className="pb-2">
                          デジタルグッズはなぜ少ないのだろう？
                        </div>
                        <div className="pb-2">
                          所有している証明ができないから？
                        </div>
                        <div className="pb-2">
                          いや、可能かもしれない。NFTなら。
                        </div>
                      </>
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
                          <div>いつでも身近に</div>
                        ) : (
                          <>
                            <div className="mb-[-10px]">いつでも</div>
                            <div>身近に</div>
                          </>
                        )
                      }
                      textChildren={
                        <>
                          <div>自分の「好き」を</div>
                          <div>集めて飾って楽しむ。</div>
                          <div>共有すれば楽しさ無限大。</div>
                          <div>さぁ、何を飾ろう。</div>
                        </>
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
                          <div>さらなる楽しみ</div>
                        ) : (
                          <>
                            <div className="mb-[-10px]">さらなる</div>
                            <div>楽しみ</div>
                          </>
                        )
                      }
                      textChildren={
                        <>
                          <div>ARやAI技術を駆使して、</div>
                          <div>デジタルグッズにしかできない</div>
                          <div>楽しみを実現。</div>
                        </>
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
                          <div>クリエイターのために</div>
                        ) : (
                          <>
                            <div className="mb-[-10px]">クリエイターの</div>
                            <div>ために</div>
                          </>
                        )
                      }
                      textChildren={
                        <>
                          <div>気軽に作って販売を可能に。</div>
                          <div>デジタルグッズ販売による</div>
                          <div>在庫リスクや送料などからの解放。</div>
                        </>
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
                      titleChildren={<div>環境への配慮</div>}
                      textChildren={
                        <>
                          <div>Flowブロックチェーンを使うことで</div>
                          <div>環境にも配慮しつつ</div>
                          <div>大量の取引に耐えることができる。</div>
                          <div>もちろんガス代もかかりません。</div>
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
                ${
                  homePhase !== "ECO_TO_END" && homePhase !== "END"
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
