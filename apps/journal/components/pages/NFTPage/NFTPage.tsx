import NFTPageTitle from "../../PageTitle/NFTPageTitle";
import NFTPagePC from "./sub/NFTPagePC";
import NFTPageSP from "./sub/NFTPageSP";
import { mockNFTSrcList } from "@/libs/mocks/mockNFTSrcList";
import { useHoldNFTs } from "@/contexts/HoldNFTsProvider";

type Props = {
  pageNum: number;
};

/**
 * 所有NFTの閲覧用ページ
 */
const NFTPage: React.FC<Props> = ({ pageNum }) => {
  const debugMode = process.env["NEXT_PUBLIC_DEBUG_MODE"] === "true";
  const { otherNFTs } = useHoldNFTs();
  const NFTlength = debugMode
    ? mockNFTSrcList.length
    : otherNFTs.current.length;

  return (
    <>
      <NFTPageTitle
        isShown={pageNum % 2 === 0}
        title={
          <>
            COLLECTION
            <br />
            LIBRARY
          </>
        }
      />
      {NFTlength === 0 && pageNum === 0 ? (
        <div className="p-5 grow grid content-center">
          <p className="text-center text-lg sm:text-4xl text-accent/50 font-bold">
            No content
          </p>
        </div>
      ) : (
        <>
          <div className="hidden sm:block grow overflow-y-hidden">
            <NFTPagePC pageNum={pageNum} />
          </div>
          <div className="block sm:hidden grow overflow-y-auto pt-4 mb-[4%]">
            <NFTPageSP pageNum={pageNum} />
          </div>
        </>
      )}
    </>
  );
};

export default NFTPage;
