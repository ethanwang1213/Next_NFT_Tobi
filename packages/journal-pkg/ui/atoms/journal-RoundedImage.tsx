import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  loading: boolean;
};

/**
 * 円形の画像を表示するコンポーネント
 * @param param0
 * @returns {ReactElement} The `RoundedImage` component
 */
export const RoundedImage: React.FC<Props> = ({
  src,
  alt,
  width,
  height,
  loading = false,
}) => {
  return (
    <div
      className="h-full aspect-square relative rounded-full 
         text-xs sm:text-base"
    >
      <Image src={src} alt={alt} width={width} height={height} />
      {loading && (
        <div className="absolute w-full h-full left-0 top-0 flex justify-center grid content-center">
          <FontAwesomeIcon className="" fontSize={32} icon={faSpinner} spin />
        </div>
      )}
    </div>
  );
};
