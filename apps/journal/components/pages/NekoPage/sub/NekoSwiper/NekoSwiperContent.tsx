import Image from "next/image";
import NFTPageTitle from "../../../../PageTitle/NFTPageTitle";

type Props = {
  width: number;
  height: number;
  cardImgRef: React.RefObject<HTMLImageElement>;
  onCardImgLoad: () => void;
  imgSrc?: string;
};

/**
 * TOBIRA NEKOページ スマホ表示での、
 * swiperのカード一枚のコンテンツを表示するコンポーネント
 * @param param0
 * @returns
 */
const NekoSwiperContent: React.FC<Props> = ({
  width,
  height,
  cardImgRef,
  onCardImgLoad,
  imgSrc = null,
}) => {
  return (
    <div
      className="flex flex-col p-[40px]"
      style={{
        width: width,
        height: height,
      }}
    >
      <Image
        src="/images/book/openpage_single.png"
        fill
        alt="cart"
        className="object-contain absolute z-[-1]"
        ref={cardImgRef}
        onLoad={onCardImgLoad}
      />
      <NFTPageTitle isShown={true} title="TOBIRA NEKO" />
      <div className="w-full h-full grow pt-10 pb-[30%] ">
        {!!imgSrc && (
          <div className="relative w-full h-full ">
            <Image
              src={imgSrc}
              alt={"neko"}
              fill
              style={{ objectFit: "contain" }}
              className="overflow-visible drop-shadow-[-8px_0px_8px_rgba(0,0,0,0.2)]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NekoSwiperContent;
