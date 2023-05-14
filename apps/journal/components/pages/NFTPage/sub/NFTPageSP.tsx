import { useEffect, useState } from "react";
import { mockNFTSrcList } from "../../../../libs/mocks/mockNFTSrcList";
import { NFTSrc } from "../../../../types/NFTSrc";
import NFTImage from "./NFTImage";

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
    <div className="h-full pl-3 grid grid-cols-3 gap-y-8 sm:gap-y-4 gap-x-2 content-start place-items-center">
      {nftSrcList.map((v) => (
        <NFTImage key={v.id} src={v.src} alt={"nft"} />
      ))}
    </div>
  );
};

export default NFTPageSP;
