import { mockNftSrcList } from "@/libs/mocks/mockNftSrcList";
import NftImage from "./NftImage";
import { useHoldNfts } from "@/contexts/HoldNftsProvider";

type Props = {
  pageNum: number;
};

/**
 * 所有NFTの閲覧用ページのスマホ表示。
 * スクロールでNFTリストが表示される。
 * TODO: ゆくゆくは無限スクロールにしたい(react-infinite-scrollerなど)
 * @param param0
 * @returns
 */
const NftPageSp: React.FC<Props> = ({ pageNum }) => {
  const { otherNfts } = useHoldNfts();

  return (
    <div className="h-full px-2 grid grid-cols-3 gap-y-8 sm:gap-y-4 gap-x-2 content-start place-items-center">
      {process.env["NEXT_PUBLIC_DEBUG_MODE"] === "true"
        ? mockNftSrcList.map((v, i) => (
            <NftImage key={v.id} src={v.src} alt={"nft"} />
          ))
        : otherNfts.current.map((v, i) => (
            <NftImage key={i} src={v.thumbnail} alt={"nft"} />
          ))}
    </div>
  );
};

export default NftPageSp;
