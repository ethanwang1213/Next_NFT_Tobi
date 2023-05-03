import Image from "next/image";
import styles from "./NFTImage.module.scss";

type Props = {
  src: string;
};

/**
 * NFT画像の表示用コンポーネント
 * TOBIRA NEKOの表示にも利用している
 * @param param0
 * @returns
 */
const NFTImage: React.FC<Props> = ({ src }) => {
  return (
    <div className={styles.image}>
      <Image src={src} alt="neko" fill />
    </div>
  );
};

export default NFTImage;
