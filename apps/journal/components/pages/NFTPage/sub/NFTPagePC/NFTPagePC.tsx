import { NFTSrc } from "@/types/NFTSrc";
import { useEffect, useState } from "react";
import NFTImage from "@/components/NFTImage/NFTImage";
import { mockNFTSrcList } from "@/libs/mocks/mockNFTSrcList";

type Props = {
  pageNum: number;
};

/**
 * 所有NFTの閲覧用ページのPC表示。
 * 引数pageNumが偶数のとき左ページ、奇数のとき右ページとして表示する。
 * @param param0
 * @returns
 */
const NFTPagePC: React.FC<Props> = ({ pageNum }) => {
  const [nftSrcList, setNFTSrcList] = useState<NFTSrc[]>([]);

  // TODO:読込の実装
  const loadNFTSrcList = () => {
    setNFTSrcList(mockNFTSrcList.slice(pageNum * 9, (pageNum + 1) * 9));
  };

  useEffect(() => {
    loadNFTSrcList();
  }, [pageNum]);

  return (
    <div className="h-full grid grid-cols-3 grid-rows-3 gap-6 content-start place-items-center">
      {nftSrcList.map((v) => (
        <NFTImage key={v.id} src={v.src} alt={"nft"} />
      ))}
    </div>
  );
};

export default NFTPagePC;
