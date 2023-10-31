import { useWindowSize } from "react-use";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper";
import NekoSwiperContent from "./NekoSwiperContent";
import { mockNekoSrcList } from "../../../../../libs/mocks/mockNekoSrcList";
import { useHoldNfts } from "@/contexts/journal-HoldNftsProvider";

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
  const { nekoNfts } = useHoldNfts();

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

  // 全てが表示されてから再レンダリングしないと、表示が暗く、スワイプできない
  const [initNum, setInitNum] = useState<number>(0);
  const [isInit, setIsInit] = useState<boolean>(false);
  const [isInit2, setIsInit2] = useState<boolean>(false);

  // 画像の読み込みが完了したらinitNumを増やす
  const addInitNum = () => {
    setInitNum((prev) => prev + 1);
  };

  // 全ての画像が表示されたらisInitをtrueにする
  useEffect(() => {
    if (isInit) return;

    if (process.env["NEXT_PUBLIC_DEBUG_MODE"] === "true") {
      if (initNum === mockNekoSrcList.length) {
        setIsInit(true);
      }
    } else {
      if (nekoNfts.current.length === 0) {
        if (initNum === 1) {
          setIsInit(true);
        }
      } else {
        if (initNum === nekoNfts.current.length) {
          setIsInit(true);
        }
      }
    }
  }, [initNum]);

  // レンダリングの瞬間の表示がキモくなったので、
  // 50ms後にinvisibleを解くようにする
  useEffect(() => {
    if (isInit) {
      setTimeout(() => {
        setIsInit2(true);
      }, 50);
    }
  }, [isInit]);

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

  const createSwiperSlide = useCallback(
    (src: string = null, id: number) => (
      <SwiperSlide key={id}>
        <NekoSwiperContent
          width={cardPos.width}
          height={cardPos.height}
          cardImgRef={cardImgRef}
          onCardImgLoad={() => {
            setAspect();
            addInitNum();
          }}
          imgSrc={src}
        />
      </SwiperSlide>
    ),
    [cardPos.width, cardPos.height, cardImgRef, cardAspect, setAspect]
  );

  return (
    <div
      className={`fixed ${isInit2 ? "" : "invisible"}`}
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
        key={isInit ? "init" : "not-init"} // 再レンダリングのため。しなければ表示が暗く、スワイプができない。
      >
        {process.env["NEXT_PUBLIC_DEBUG_MODE"] === "true" ? (
          <>{mockNekoSrcList.map((v) => createSwiperSlide(v.src, v.id))}</>
        ) : (
          <>
            {nekoNfts.current.length === 0
              ? createSwiperSlide(null, 0)
              : [...nekoNfts.current].map((v, i) =>
                  createSwiperSlide(v.thumbnail, i)
                )}
          </>
        )}
      </Swiper>
    </div>
  );
};

export default NekoSwiper;
