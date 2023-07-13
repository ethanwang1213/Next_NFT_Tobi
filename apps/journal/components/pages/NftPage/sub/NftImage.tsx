import { useHoldNfts } from "@/contexts/HoldNftsProvider";
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
};

/**
 * NFT画像の表示用コンポーネント
 * TOBIRA NEKOの表示にも利用している
 * @param param0
 * @returns
 */
const NftImage: React.FC<Props> = ({ src, alt }) => {
  const { viewingSrc } = useHoldNfts();

  return (
    <div className="w-full aspect-square sm:h-full">
      <label
        htmlFor="nft-view-modal"
        className="relative block w-full h-full"
        onClick={() => viewingSrc.set(src)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          style={{ objectFit: "contain" }}
          className="drop-shadow-[-1px_0px_6px_rgba(0,0,0,0.4)] sm:drop-shadow-[-6px_0px_8px_rgba(0,0,0,0.4)]"
        />
      </label>
    </div>
  );
};

export default NftImage;
