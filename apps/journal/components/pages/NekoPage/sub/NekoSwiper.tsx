import { Swiper, SwiperSlide } from "swiper/react";
import { mockNekoSrcList } from "../../../../libs/mocks/mockNekoSrcList";
import NFTImage from "../../../NFTImage";
import { EffectCards } from "swiper";
import "swiper/css";
import "swiper/css/effect-cards";
import { useWindowSize } from "react-use";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import PageTitle from "../../../PageTitle";

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
      <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards]}
        className="mySwiper"
      >
        {mockNekoSrcList.map((v) => (
          <SwiperSlide key={v.id}>
            <div
              className="flex flex-col p-[40px]"
              style={{
                width: cardPos.width,
                height: cardPos.height,
              }}
            >
              <Image
                src="/images/book/openpage_single.png"
                fill
                alt="cart"
                className="object-contain absolute z-[-1]"
                ref={cardImgRef}
                onLoad={setAspect}
              />
              <PageTitle isShown={true} title="TOBIRA NEKO" />
              <div className="w-full grow p-16 ">
                <div className="relative w-full h-full ">
                  <Image
                    src={v.src}
                    alt={"neko"}
                    fill
                    style={{ objectFit: "cover" }}
                    className="overflow-visible"
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default NekoSwiper;
