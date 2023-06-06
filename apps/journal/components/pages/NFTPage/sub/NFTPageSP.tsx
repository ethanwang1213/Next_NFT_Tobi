import NFTImage from "./NFTImage";
import { useHoldNFTs } from "@/contexts/HoldNFTsProvider";

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
const NFTPageSP: React.FC<Props> = ({ pageNum }) => {
  const { otherNFTs } = useHoldNFTs();

  return (
    <div className="h-full px-2 grid grid-cols-3 gap-y-8 sm:gap-y-4 gap-x-2 content-start place-items-center">
      {otherNFTs.current.map((v, i) => (
        <NFTImage key={i} src={v.thumbnail} alt={"nft"} />
      ))}
    </div>
  );
};

export default NFTPageSP;
