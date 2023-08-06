import { mockNekoSrcList } from "@/libs/mocks/mockNekoSrcList";
import NFTImage from "../../NFTPage/sub/NFTImage";
import { useHoldNFTs } from "@/contexts/HoldNFTsProvider";
import { useCallback } from "react";

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
  const { nekoNFTs } = useHoldNFTs();

  const createImageContent = useCallback(
    (src: string, id: number) => (
      <div
        key={id}
        className="hidden first:block sm:block w-full h-full grid content-center"
      >
        <NFTImage src={src} alt={"TOBIRA NEKO"} />
      </div>
    ),
    []
  );

  return (
    <div className="h-full grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 overflow-hidden gap-y-20 gap-x-4 place-items-center">
      {/* pageNumで指定されたページのTOBIRA NEKO画像をリストから抽出して表示 */}
      {process.env["NEXT_PUBLIC_DEBUG_MODE"] === "true"
        ? mockNekoSrcList
            .slice(pageNum * nekoLength, (pageNum + 1) * nekoLength)
            .map((v) => createImageContent(v.src, v.id))
        : nekoNFTs.current
            .slice(pageNum * nekoLength, (pageNum + 1) * nekoLength)
            .map((v, i) => createImageContent(v.thumbnail, i))}
    </div>
  );
};

export default NekoGrid;
