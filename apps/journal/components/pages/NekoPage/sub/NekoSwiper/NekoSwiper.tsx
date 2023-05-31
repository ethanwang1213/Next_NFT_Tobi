import { useWindowSize } from "react-use";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper";
import "swiper/css";
import "swiper/css/effect-cards";
import NekoSwiperContent from "./NekoSwiperContent";
import { mockNekoSrcList } from "../../../../../libs/mocks/mockNekoSrcList";
import { useHoldNFTs } from "@/contexts/HoldNFTsProvider";

type CardPos = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/**
 * TOBIRA NEKOをカードのように重ねて表示するコンポーネント
 * 左右スワイプでTOBIRA NEKOをめくることができる
 * @returns
 */
const NekoSwiper: React.FC = () => {
  const { nekoNFTs } = useHoldNFTs();

  const { width: innerWidth, height: innerHeight } = useWindowSize();
  const cardImgRef = useRef<HTMLImageElement>(null);
  const [cardAspect, setCardAspect] = useState<number>(0);
  const [cardPos, setCardPos] = useState<CardPos>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  // 本の画像のアスペクト比を設定
  const setAspect = () => {
    setCardAspect(
      cardImgRef.current.naturalWidth / cardImgRef.current.naturalHeight
    );
  };

  useEffect(() => {
    if (!cardImgRef.current) return;
    if (innerHeight === 0 || cardAspect === 0) return;

    let cardWidth: number;
    let cardHeight: number;
    if (innerWidth / innerHeight < cardAspect) {
      // innerHeightを基準にcardPosを設定
      const height = innerHeight + 20;
      cardWidth = height * cardAspect;
      cardHeight = height;
    } else {
      // innerWidthを基準にcardPosを設定
      const width = innerWidth + 20;
      cardWidth = width;
      cardHeight = width / cardAspect;
    }

    setCardPos({
      left: (innerWidth - cardWidth) / 2,
      top: (innerHeight - cardHeight) / 2,
      width: cardWidth,
      height: cardHeight,
    });
  }, [innerWidth, innerHeight, cardAspect]);
  return (
    <div
      className="fixed"
      style={{
        width: cardPos.width,
        height: cardPos.height,
        left: cardPos.left,
        top: cardPos.top,
      }}
    >
      {/* TOBIRA NEKOを持っていない場合、空白のカードを一枚表示する */}
      {nekoNFTs.current.length === 0 ? (
        <Swiper
          effect={"cards"}
          grabCursor={false}
          modules={[]}
          className="mySwiper"
        >
          <SwiperSlide key={0}>
            <NekoSwiperContent
              width={cardPos.width}
              height={cardPos.height}
              cardImgRef={cardImgRef}
              onCardImgLoad={setAspect}
            />
          </SwiperSlide>
        </Swiper>
      ) : (
        <Swiper
          effect={"cards"}
          grabCursor={true}
          modules={[EffectCards]}
          className="mySwiper"
        >
          {[...nekoNFTs.current].reverse().map((v, i) => (
            <SwiperSlide key={i}>
              <NekoSwiperContent
                width={cardPos.width}
                height={cardPos.height}
                cardImgRef={cardImgRef}
                onCardImgLoad={setAspect}
                imgSrc={v.thumbnail}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default NekoSwiper;
