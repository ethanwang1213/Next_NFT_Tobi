import { NFTSrc } from "@/types/NFTSrc";
import { useEffect, useState } from "react";
import styles from "./NekoGrid.module.scss";
import NFTImage from "@/components/NFTImage/NFTImage";
import { mockNekoSrcList } from "@/libs/mock/mockNekoSrcList";

type Props = {
  pageNum: number;
  nekoLength: number; // 1ページに表示するTOBIRA NEKOの数
};

/**
 * TOBIRA NEKOのグリッド表示。
 * 引数pageNumが偶数のとき左ページ、奇数のとき右ページとして表示する。
 * @param param0
 * @returns
 */
const NekoGrid: React.FC<Props> = ({ pageNum, nekoLength }) => {
  const [nekoSrcList, setNekoSrcList] = useState<NFTSrc[]>([]);

  // TODO:読込の実装
  const loadNFTSrcList = () => {
    setNekoSrcList(
      mockNekoSrcList.slice(pageNum * nekoLength, (pageNum + 1) * nekoLength)
    );
  };

  useEffect(() => {
    loadNFTSrcList();
  }, [pageNum]);

  return (
    <div className={styles.nekoGrid}>
      {nekoSrcList.map((v) => (
        <NFTImage key={v.id} src={v.src} alt={"neko"} />
      ))}
    </div>
  );
};

export default NekoGrid;
