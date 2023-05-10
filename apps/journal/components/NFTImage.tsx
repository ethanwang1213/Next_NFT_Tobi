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
const NFTImage: React.FC<Props> = ({ src, alt }) => {
  return (
    <div className="relative w-full h-full">
      <Image src={src} alt={alt} fill style={{ objectFit: "contain" }} />
    </div>
  );
};

export default NFTImage;
