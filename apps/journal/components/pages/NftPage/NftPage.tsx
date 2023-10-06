import NftPageTitle from "../../PageTitle/NftPageTitle";
import NftPagePc from "./sub/NftPagePc";
import NftPageSp from "./sub/NftPageSp";
import { mockNftSrcList } from "@/libs/mocks/mockNftSrcList";
import { useHoldNfts } from "@/contexts/HoldNftsProvider";
import { StampRallyRewardForm } from "ui";

type Props = {
  pageNum: number;
};

/**
 * 所有NFTの閲覧用ページ
 */
const NftPage: React.FC<Props> = ({ pageNum }) => {
  const debugMode = process.env["NEXT_PUBLIC_DEBUG_MODE"] === "true";
  const { otherNfts } = useHoldNfts();
  const Nftlength = debugMode
    ? mockNftSrcList.length
    : otherNfts.current.length;

  return (
    <>
      <NftPageTitle
        isShown={pageNum % 2 === 0}
        title={
          <>
            COLLECTION
            <br />
            LIBRARY
          </>
        }
      />
      {Nftlength === 0 && pageNum === 0 ? (
        <div className="p-5 grow grid content-center">
          <p className="text-center text-lg sm:text-4xl text-accent/50 font-bold">
            No content
          </p>
        </div>
      ) : (
        <>
          <div className="hidden sm:block grow overflow-y-hidden">
            <NftPagePc pageNum={pageNum} />
          </div>
          <div className="block sm:hidden grow overflow-y-auto pt-4 mb-[4%]">
            <NftPageSp pageNum={pageNum} />
          </div>
        </>
      )}
      <div className="absolute bottom-4 sm:bottom-0 right-0">
        <div className="hidden sm:block">
          {pageNum % 2 === 0 &&
            <StampRallyRewardForm />
          }
        </div>
        <div className="block sm:hidden">
          <StampRallyRewardForm />
        </div>
      </div>
    </>
  );
};

export default NftPage;
