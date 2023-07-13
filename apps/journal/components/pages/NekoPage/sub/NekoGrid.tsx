import { mockNekoSrcList } from "@/libs/mocks/mockNekoSrcList";
import NftImage from "../../NftPage/sub/NftImage";
import { useHoldNfts } from "@/contexts/HoldNftsProvider";
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
  const { nekoNfts: nekoNfts } = useHoldNfts();

  const createImageContent = useCallback(
    (src: string, id: number) => (
      <div
        key={id}
        className="hidden first:block sm:block w-full h-full grid content-center"
      >
        <NftImage src={src} alt={"neko"} />
      </div>
    ),
    []
  );

  return (
    <div className="h-full grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 overflow-hidden gap-y-20 gap-x-4 place-items-center">
      {process.env["NEXT_PUBLIC_DEBUG_MODE"] === "true"
        ? mockNekoSrcList
            .slice(pageNum * nekoLength, (pageNum + 1) * nekoLength)
            .map((v) => createImageContent(v.src, v.id))
        : nekoNfts.current
            .slice(pageNum * nekoLength, (pageNum + 1) * nekoLength)
            .map((v, i) => createImageContent(v.thumbnail, i))}
    </div>
  );
};

export default NekoGrid;
