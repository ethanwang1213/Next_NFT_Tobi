import Image from "next/image";
import NFTPageTitle from "../../../../PageTitle/NFTPageTitle";
import { useHoldNFTs } from "@/contexts/HoldNFTsProvider";

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
  const { viewingSrc: viewingNFT } = useHoldNFTs();

  return (
    <div
      className="flex flex-col p-[40px]"
      style={{
        width: width,
        height: height,
      }}
    >
      <Image
        src="/journal/images/book/openpage_single.png"
        fill
        alt="cart"
        className="object-contain absolute z-[-1]"
        ref={cardImgRef}
        onLoad={onCardImgLoad}
      />
      <NFTPageTitle isShown={true} title="TOBIRA NEKO" />
      <div className="w-full h-full grow pt-10 pb-[30%] ">
        {!!imgSrc && (
          <div className="relative w-full h-full">
            <label
              htmlFor="nft-view-modal"
              className="relative block w-full h-full"
              onClick={() => viewingNFT.set(imgSrc)}
            >
              <Image
                src={imgSrc}
                alt={"neko"}
                fill
                style={{ objectFit: "contain" }}
                className="overflow-visible drop-shadow-[-8px_0px_8px_rgba(0,0,0,0.2)]"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default NekoSwiperContent;
