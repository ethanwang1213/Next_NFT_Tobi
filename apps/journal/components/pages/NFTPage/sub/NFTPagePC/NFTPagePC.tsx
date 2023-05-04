import { NFTSrc } from "@/../../apps/journal/types/NFTSrc";
import { useEffect, useState } from "react";
import styles from "./NFTPagePC.module.scss";
import NFTImage from "@/components/NFTImage/NFTImage";
import { mockNFTSrcListPC } from "@/libs/mocks/mockNFTSrcList";

type Props = {
  pageNum: number;
};

const NFTPagePC: React.FC<Props> = ({ pageNum }) => {
  const [nftSrcList, setNFTSrcList] = useState<NFTSrc[]>([]);

  const loadNFTSrcList = () => {
    setNFTSrcList(mockNFTSrcListPC);
  };

  useEffect(() => {
    loadNFTSrcList();
  }, []);

  return (
    <div className={styles.nftGrid}>
      {nftSrcList.map((v) => (
        <NFTImage key={v.id} src={v.src} />
      ))}
    </div>
  );
};

export default NFTPagePC;
