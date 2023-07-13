import { mockNekoSrcList } from "@/libs/mocks/mockNekoSrcList";
import NftPageTitle from "../../PageTitle/NftPageTitle";
import NekoGrid from "./sub/NekoGrid";
import NekoSwiper from "./sub/NekoSwiper/NekoSwiper";
import { useHoldNfts } from "@/contexts/HoldNftsProvider";

type Props = {
  pageNum: number;
};

/**
 * TOBIRA NEKOの閲覧用ページ
 * @param param0
 * @returns
 */
const NekoPage: React.FC<Props> = ({ pageNum }) => {
  const debugMode = process.env["NEXT_PUBLIC_DEBUG_MODE"] === "true";
  const { nekoNfts } = useHoldNfts();
  const nekoLength = debugMode
    ? mockNekoSrcList.length
    : nekoNfts.current.length;

  return (
    <>
      <div className={`hidden sm:block h-full sm:flex sm:flex-col`}>
        <NftPageTitle isShown={pageNum % 2 === 0} title={"TOBIRA NEKO"} />
        {nekoLength === 0 && pageNum === 0 ? (
          <div className="p-5 grow grid content-center">
            <p className="text-center text-4xl text-accent/50 font-bold">
              Nobody is here
            </p>
          </div>
        ) : (
          <div className="grow overflow-y-hidden">
            <NekoGrid pageNum={pageNum} nekoLength={4} />
          </div>
        )}
      </div>
      <div className={`block sm:hidden h-full`}>
        <NekoSwiper />
      </div>
    </>
  );
};

export default NekoPage;
