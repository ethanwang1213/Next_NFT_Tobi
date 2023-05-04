import { NFTSrc } from "@/types/NFTSrc";
import styles from "./NFTPageSP.module.scss";
import NFTImage from "@/components/NFTImage/NFTImage";
import { useEffect, useState } from "react";
import { mockNFTSrcListSP } from "@/libs/mocks/mockNFTSrcList";

type Props = {
  pageNum: number;
};

const NFTPageSP: React.FC<Props> = ({ pageNum }) => {
  const [nftSrcList, setNFTSrcList] = useState<NFTSrc[]>([]);

  const loadNFTSrcList = () => {
    setNFTSrcList(mockNFTSrcListSP);
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

export default NFTPageSP;
