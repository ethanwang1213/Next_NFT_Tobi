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
    <div className="relative w-full aspect-square sm:h-full">
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: "contain" }}
        className="drop-shadow-[-1px_0px_6px_rgba(0,0,0,0.4)] sm:drop-shadow-[-6px_0px_8px_rgba(0,0,0,0.4)]"
      />
    </div>
  );
};

export default NFTImage;
