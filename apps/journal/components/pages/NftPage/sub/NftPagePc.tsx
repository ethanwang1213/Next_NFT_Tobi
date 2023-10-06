import { mockNftSrcList } from "@/libs/mocks/mockNftSrcList";
import NftImage from "./NftImage";
import { useHoldNfts } from "@/contexts/HoldNftsProvider";

type Props = {
  pageNum: number;
};

/**
 * 所有NFTの閲覧用ページのPC表示。
 * 引数pageNumが偶数のとき左ページ、奇数のとき右ページとして表示する。
 * TODO: 奇数ページの時余分なページが生成されてしまうのを修正する
 * @param param0
 * @returns
 */
const NftPagePc: React.FC<Props> = ({ pageNum }) => {
  const { otherNfts } = useHoldNfts();

  return (
    <div className="h-full pt-10 px-4 grid grid-cols-3 grid-rows-3 gap-6 content-start place-items-center">
      {process.env["NEXT_PUBLIC_DEBUG_MODE"] === "true"
        ? mockNftSrcList
          .slice(pageNum * 9, (pageNum + 1) * 9)
          .map((v, i) => <NftImage key={v.id} src={v.src} alt={"nft"} />)
        : otherNfts.current
          .slice(pageNum * 9, (pageNum + 1) * 9)
          .map((v, i) => <NftImage key={i} src={v.thumbnail} alt={"nft"} />)}
    </div>
  );
};

export default NftPagePc;
