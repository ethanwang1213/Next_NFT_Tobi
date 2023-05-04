import { NFTSrc } from "@/types/NFTSrc";
import styles from "./NFTPageSP.module.scss";
import NFTImage from "@/components/NFTImage/NFTImage";
import { useEffect, useState } from "react";
import { mockNFTSrcList } from "@/libs/mocks/mockNFTSrcList";

type Props = {
  pageNum: number;
};

/**
 * 所有NFTの閲覧用ページのスマホ表示。
 * スクロールでNFTリストが表示される。
 * @param param0
 * @returns
 */
const NFTPageSP: React.FC<Props> = ({ pageNum }) => {
  const [nftSrcList, setNFTSrcList] = useState<NFTSrc[]>([]);

  // TODO:読込の実装
  // ゆくゆくは無限スクロールにしたい(react-infinite-scrollerなど)
  const loadNFTSrcList = () => {
    setNFTSrcList(mockNFTSrcList);
  };

  useEffect(() => {
    loadNFTSrcList();
  }, [pageNum]);

  return (
    <div className={styles.nftGrid}>
      {nftSrcList.map((v) => (
        <NFTImage key={v.id} src={v.src} />
      ))}
    </div>
  );
};

export default NFTPageSP;
