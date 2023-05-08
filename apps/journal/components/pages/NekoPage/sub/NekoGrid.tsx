import { NFTSrc } from "@/types/NFTSrc";
import { useEffect, useState } from "react";
import { mockNekoSrcList } from "@/libs/mock/mockNekoSrcList";
import NFTImage from "../../../NFTImage";

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
    <div className="h-full grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 overflow-hidden gap-10 place-items-center">
      {nekoSrcList.map((v) => (
        <div className="hidden first:block sm:block w-full h-full grid content-center">
          <NFTImage key={v.id} src={v.src} alt={"neko"} />
        </div>
      ))}
    </div>
  );
};

export default NekoGrid;
