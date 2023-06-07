import { mockNekoSrcList } from "@/libs/mocks/mockNekoSrcList";
import NFTImage from "../../NFTPage/sub/NFTImage";
import { useHoldNFTs } from "@/contexts/HoldNFTsProvider";

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

  return (
    <div className="h-full grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 overflow-hidden gap-y-20 gap-x-4 place-items-center">
      {process.env["NEXT_PUBLIC_DEBUG_MODE"] === "true"
        ? mockNekoSrcList
            .slice(pageNum * nekoLength, (pageNum + 1) * nekoLength)
            .map((v) => (
              <div
                key={v.id}
                className="hidden first:block sm:block w-full h-full grid content-center"
              >
                <NFTImage src={v.src} alt={"neko"} />
              </div>
            ))
        : nekoNFTs.current
            .slice(pageNum * nekoLength, (pageNum + 1) * nekoLength)
            .map((v, i) => (
              <div
                key={i}
                className="hidden first:block sm:block w-full h-full grid content-center"
              >
                <NFTImage src={v.thumbnail} alt={"neko"} />
              </div>
            ))}
    </div>
  );
};

export default NekoGrid;
