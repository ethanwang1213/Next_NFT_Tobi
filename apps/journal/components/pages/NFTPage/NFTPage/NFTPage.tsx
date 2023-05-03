import { useEffect, useState } from "react";
import styles from "./NFTPage.module.scss";
import NFTImage from "@/components/NFTImage/NFTImage";
import { NFTSrc } from "@/types/NFTSrc";
import { mockNFTSrcListPC } from "@/libs/mocks/mockNFTSrcList";
import PageTitle from "@/components/PageTitle/PageTitle";

type Props = {
  pageNum: number;
};

/**
 * 所有NFTの閲覧用ページ
 * PC表示について、引数pageNumが偶数のとき左ページ、奇数のとき右ページとして表示する
 * スマホ表示について、NFTはスクロールで表示される。
 */
const NFTPage: React.FC<Props> = ({ pageNum }) => {
  const [nftSrcList, setNFTSrcList] = useState<NFTSrc[]>([]);

  // TODO: 画像の読み込みの仕方を要検討
  const loadNFTSrcList = () => {
    // 読込方法は要検討
    //   const NFT_NUM_PER_PAGE = 9;
    //   const firstId = NFT_NUM_PER_PAGE * pageNum;
    //   loadNekoSrc(firstId);
    setNFTSrcList(mockNFTSrcListPC);
  };

  useEffect(() => {}, []);

  return (
    <div className="page">
      <PageTitle isShown={pageNum % 2 === 0} title="NFTs" />
      <div className={styles.nftGrid}>
        {nftSrcList.map((v) => (
          <NFTImage key={v.id} src={v.src} />
        ))}
      </div>
    </div>
  );
};

export default NFTPage;
