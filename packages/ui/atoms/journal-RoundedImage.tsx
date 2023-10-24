import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * 円形の画像を表示するコンポーネント
 * @param param0
 * @returns {ReactElement} The `RoundedImage` component
 */
export const RoundedImage: React.FC<Props> = ({ src, alt, width, height }) => {
  return (
    <div
      className="h-full aspect-square relative rounded-full 
         text-xs sm:text-base"
    >
      <Image src={src} alt={alt} width={width} height={height} />
    </div>
  );
};
